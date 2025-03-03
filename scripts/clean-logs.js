/**
 * Script pour analyser et nettoyer les logs dans tous les fichiers du projet
 * 
 * Usage: node scripts/clean-logs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const IGNORE_DIRS = [
  'node_modules',
  '.next',
  'public',
  'scripts',
  '.git',
];
const IGNORE_FILES = [
  'logger.ts',
];

// Statistiques
let stats = {
  filesScanned: 0,
  filesModified: 0,
  logsFound: 0,
  logsReplaced: 0,
};

// Motifs de recherche pour les logs
const LOG_PATTERNS = [
  /console\.log\s*\(/g,
  /console\.debug\s*\(/g,
  /console\.info\s*\(/g,
  /console\.warn\s*\(/g,
  /console\.error\s*\(/g,
];

// Fonction pour vérifier si un chemin doit être ignoré
function shouldIgnore(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  // Ignorer les répertoires spécifiés
  if (IGNORE_DIRS.some(dir => relativePath.startsWith(dir))) {
    return true;
  }
  
  // Ignorer les fichiers spécifiés
  if (IGNORE_FILES.some(file => relativePath.endsWith(file))) {
    return true;
  }
  
  // Ignorer les fichiers qui ne sont pas des fichiers source
  if (!relativePath.match(/\.(js|jsx|ts|tsx)$/)) {
    return true;
  }
  
  return false;
}

// Fonction pour analyser un fichier et trouver les logs
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    stats.filesScanned++;
    
    let logsFound = 0;
    LOG_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        logsFound += matches.length;
      }
    });
    
    if (logsFound > 0) {
      stats.logsFound += logsFound;
      console.log(`${filePath}: ${logsFound} logs trouvés`);
    }
    
    return { filePath, content, logsFound };
  } catch (error) {
    console.error(`Erreur lors de l'analyse de ${filePath}:`, error.message);
    return { filePath, content: '', logsFound: 0 };
  }
}

// Fonction pour remplacer les logs dans un fichier
function replaceLogsInFile(filePath, content) {
  if (!content) return false;
  
  let modified = false;
  let newContent = content;
  
  // Remplacer les logs par notre logger
  newContent = newContent.replace(/console\.log\s*\(\s*(['"`])(.*?)\1\s*(?:,\s*(.*?))?\s*\)/g, (match, quote, message, args) => {
    modified = true;
    stats.logsReplaced++;
    return `logger.debug(${quote}${message}${quote}${args ? `, ${args}` : ''})`;
  });
  
  newContent = newContent.replace(/console\.debug\s*\(\s*(['"`])(.*?)\1\s*(?:,\s*(.*?))?\s*\)/g, (match, quote, message, args) => {
    modified = true;
    stats.logsReplaced++;
    return `logger.debug(${quote}${message}${quote}${args ? `, ${args}` : ''})`;
  });
  
  newContent = newContent.replace(/console\.info\s*\(\s*(['"`])(.*?)\1\s*(?:,\s*(.*?))?\s*\)/g, (match, quote, message, args) => {
    modified = true;
    stats.logsReplaced++;
    return `logger.info(${quote}${message}${quote}${args ? `, ${args}` : ''})`;
  });
  
  newContent = newContent.replace(/console\.warn\s*\(\s*(['"`])(.*?)\1\s*(?:,\s*(.*?))?\s*\)/g, (match, quote, message, args) => {
    modified = true;
    stats.logsReplaced++;
    return `logger.warn(${quote}${message}${quote}${args ? `, ${args}` : ''})`;
  });
  
  newContent = newContent.replace(/console\.error\s*\(\s*(['"`])(.*?)\1\s*(?:,\s*(.*?))?\s*\)/g, (match, quote, message, args) => {
    modified = true;
    stats.logsReplaced++;
    return `logger.error(${quote}${message}${quote}${args ? `, ${args}` : ''})`;
  });
  
  // Si le fichier a été modifié, ajouter l'import du logger s'il n'existe pas déjà
  if (modified && !newContent.includes('import logger')) {
    // Trouver la dernière ligne d'import
    const importLines = newContent.match(/^import .+$/gm);
    if (importLines && importLines.length > 0) {
      const lastImportLine = importLines[importLines.length - 1];
      const lastImportIndex = newContent.indexOf(lastImportLine) + lastImportLine.length;
      
      // Insérer l'import du logger après la dernière ligne d'import
      newContent = 
        newContent.substring(0, lastImportIndex) + 
        '\nimport logger from "@/lib/logger";' + 
        newContent.substring(lastImportIndex);
    } else {
      // Pas d'imports existants, ajouter au début du fichier
      newContent = 'import logger from "@/lib/logger";\n\n' + newContent;
    }
    
    // Écrire le fichier modifié
    fs.writeFileSync(filePath, newContent, 'utf8');
    stats.filesModified++;
    console.log(`${filePath}: ${stats.logsReplaced} logs remplacés`);
  }
  
  return modified;
}

// Fonction pour parcourir récursivement un répertoire
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !shouldIgnore(filePath)) {
      walkDir(filePath);
    } else if (stat.isFile() && !shouldIgnore(filePath)) {
      const { content, logsFound } = analyzeFile(filePath);
      if (logsFound > 0) {
        replaceLogsInFile(filePath, content);
      }
    }
  });
}

// Fonction principale
function main() {
  console.log('Analyse des logs dans le projet...');
  
  // Vérifier si le répertoire scripts existe
  if (!fs.existsSync(path.join(ROOT_DIR, 'scripts'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'scripts'));
  }
  
  // Parcourir le répertoire src
  walkDir(SRC_DIR);
  
  // Afficher les statistiques
  console.log('\nStatistiques:');
  console.log(`- Fichiers analysés: ${stats.filesScanned}`);
  console.log(`- Fichiers modifiés: ${stats.filesModified}`);
  console.log(`- Logs trouvés: ${stats.logsFound}`);
  console.log(`- Logs remplacés: ${stats.logsReplaced}`);
  
  console.log('\nTerminé!');
}

// Exécuter le script
main(); 