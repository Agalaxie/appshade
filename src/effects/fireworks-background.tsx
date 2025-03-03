"use client";

import { useEffect, useRef } from "react";

export function FireworksBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let w = 0;
    let h = 0;
    let animationFrame: number | null = null;
    let isTouchDevice = false;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: false, alpha: true });
    if (!context) return;

    // Configuration des feux d'artifice
    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    const maxFireworks = 8; // Augmenté pour plus d'effets simultanés
    const fireworkChance = 0.05; // Augmenté pour plus de fréquence
    
    // Particules d'ambiance (fond)
    const backgroundParticles: BackgroundParticle[] = [];
    const backgroundParticleCount = 500; // Nombre de particules d'ambiance
    
    // Couleurs des feux d'artifice (blanc et jaune du thème)
    const colors = [
      { r: 255, g: 255, b: 255 }, // Blanc
      { r: 255, g: 215, b: 0 }    // Jaune du thème
    ];

    // Classe pour les particules d'ambiance
    class BackgroundParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: { r: number, g: number, b: number };
      alpha: number;
      
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = 0.5 + Math.random() * 1.5;
        this.speed = 0.1 + Math.random() * 0.3;
        this.color = Math.random() < 0.2 ? colors[1] : colors[0]; // 20% de jaune
        this.alpha = 0.1 + Math.random() * 0.3; // Opacité faible pour effet subtil
      }
      
      update() {
        this.y -= this.speed;
        
        // Si la particule sort de l'écran, la replacer en bas
        if (this.y < -10) {
          this.y = h + 10;
          this.x = Math.random() * w;
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();
      }
    }

    // Classe pour représenter un feu d'artifice (la fusée montante)
    class Firework {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      color: { r: number, g: number, b: number };
      particleCount: number;
      trail: { x: number, y: number, alpha: number }[];
      
      constructor() {
        this.x = Math.random() * w;
        this.y = h;
        this.targetY = h * 0.2 + Math.random() * (h * 0.5); // Hauteur d'explosion entre 20% et 70% de l'écran
        this.speed = 2 + Math.random() * 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.particleCount = 150 + Math.floor(Math.random() * 150); // Augmenté à 150-300 particules
        this.trail = [];
      }
      
      update() {
        // Ajouter la position actuelle à la traînée
        this.trail.push({
          x: this.x,
          y: this.y,
          alpha: 1
        });
        
        // Limiter la taille de la traînée
        if (this.trail.length > 20) {
          this.trail.shift();
        }
        
        // Réduire l'opacité de la traînée
        this.trail.forEach(point => {
          point.alpha *= 0.9;
        });
        
        // Déplacer le feu d'artifice vers le haut
        this.y -= this.speed;
        
        // Vérifier si le feu d'artifice a atteint sa cible
        return this.y <= this.targetY;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        // Dessiner la traînée
        this.trail.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${point.alpha})`;
          ctx.fill();
        });
        
        // Dessiner le feu d'artifice
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fill();
      }
      
      explode() {
        // Créer des particules dans toutes les directions
        for (let i = 0; i < this.particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 4; // Vitesse augmentée pour plus de dispersion
          
          particles.push(new Particle(
            this.x,
            this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            this.color,
            0.5 + Math.random() * 1.0 // Durée de vie augmentée
          ));
        }
        
        // Ajouter un effet de "double explosion" pour certains feux d'artifice
        if (Math.random() < 0.3) { // 30% de chance
          setTimeout(() => {
            const secondaryCount = this.particleCount / 2;
            for (let i = 0; i < secondaryCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 0.3 + Math.random() * 2;
              
              particles.push(new Particle(
                this.x,
                this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                this.color,
                0.3 + Math.random() * 0.5
              ));
            }
          }, 100); // Délai de 100ms pour l'effet de double explosion
        }
      }
    }
    
    // Classe pour représenter une particule d'explosion
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: { r: number, g: number, b: number };
      alpha: number;
      decay: number;
      gravity: number;
      trail: { x: number, y: number, alpha: number }[];
      size: number;
      
      constructor(x: number, y: number, vx: number, vy: number, color: { r: number, g: number, b: number }, lifespan: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.alpha = 1;
        this.decay = 0.008 / lifespan; // Réduit pour une durée de vie plus longue
        this.gravity = 0.03; // Réduit pour moins d'effet de gravité
        this.trail = [];
        this.size = 0.8 + Math.random() * 1.2; // Taille variable
      }
      
      update() {
        // Ajouter la position actuelle à la traînée
        this.trail.push({
          x: this.x,
          y: this.y,
          alpha: this.alpha
        });
        
        // Limiter la taille de la traînée
        if (this.trail.length > 5) {
          this.trail.shift();
        }
        
        // Appliquer la gravité
        this.vy += this.gravity;
        
        // Déplacer la particule
        this.x += this.vx;
        this.y += this.vy;
        
        // Réduire l'opacité
        this.alpha -= this.decay;
        
        // Vérifier si la particule est encore visible
        return this.alpha > 0;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        // Dessiner la traînée
        this.trail.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${point.alpha * 0.5})`;
          ctx.fill();
        });
        
        // Dessiner la particule
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();
      }
    }

    function init() {
      isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Initialiser les particules d'ambiance
      for (let i = 0; i < backgroundParticleCount; i++) {
        backgroundParticles.push(new BackgroundParticle());
      }
      
      restart();
    }

    function onResize() {
      restart();
    }

    function restart() {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;

      w = innerWidth;
      h = innerHeight;

      canvas.width = w;
      canvas.height = h;

      // Vider les tableaux de feux d'artifice et de particules
      fireworks.length = 0;
      particles.length = 0;
      
      // Réinitialiser les particules d'ambiance
      backgroundParticles.length = 0;
      for (let i = 0; i < backgroundParticleCount; i++) {
        backgroundParticles.push(new BackgroundParticle());
      }

      if (animationFrame != null) {
        cancelAnimFrame(animationFrame);
      }
      
      render();
    }

    function update() {
      // Mettre à jour les particules d'ambiance
      backgroundParticles.forEach(particle => {
        particle.update();
      });
      
      // Créer de nouveaux feux d'artifice aléatoirement
      if (fireworks.length < maxFireworks && Math.random() < fireworkChance) {
        fireworks.push(new Firework());
      }
      
      // Mettre à jour les feux d'artifice
      for (let i = fireworks.length - 1; i >= 0; i--) {
        if (fireworks[i].update()) {
          // Si le feu d'artifice a atteint sa cible, le faire exploser
          fireworks[i].explode();
          fireworks.splice(i, 1);
        }
      }
      
      // Mettre à jour les particules
      for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
          // Supprimer les particules invisibles
          particles.splice(i, 1);
        }
      }
    }

    function draw() {
      // TypeScript sait que context n'est pas null ici car nous avons un return précoce
      // au début de useEffect si context est null, mais nous devons quand même
      // faire une assertion de type pour éviter les erreurs de linter
      const ctx = context as CanvasRenderingContext2D;
      
      // Effacer le canvas avec un fond transparent
      ctx.clearRect(0, 0, w, h);
      
      // Dessiner les particules d'ambiance
      backgroundParticles.forEach(particle => {
        particle.draw(ctx);
      });
      
      // Dessiner les feux d'artifice
      fireworks.forEach(firework => {
        firework.draw(ctx);
      });
      
      // Dessiner les particules
      particles.forEach(particle => {
        particle.draw(ctx);
      });
    }

    function render() {
      update();
      draw();
      animationFrame = requestAnimFrame(render);
    }

    const requestAnimFrame = window.requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame;

    const cancelAnimFrame = window.cancelAnimationFrame ||
      (window as any).mozCancelAnimationFrame;

    init();
    window.addEventListener('resize', onResize, false);

    return () => {
      if (animationFrame) {
        cancelAnimFrame(animationFrame);
      }
      
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
} 