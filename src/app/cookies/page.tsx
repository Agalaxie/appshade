import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Politique de Cookies | AppShade",
  description: "Politique d'utilisation des cookies sur la plateforme AppShade",
};

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Politique de Cookies</h1>
        <p className="text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Qu'est-ce qu'un cookie ?</h2>
          <div className="space-y-2">
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite sur notre site web. Il nous permet de stocker des informations relatives à votre navigation et de vous reconnaître lors de vos visites ultérieures.
            </p>
            <p>
              Les cookies sont largement utilisés pour faire fonctionner les sites web ou pour les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. Types de cookies que nous utilisons</h2>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">2.1 Cookies essentiels</h3>
            <p>
              Ces cookies sont nécessaires au fonctionnement de notre site web et ne peuvent pas être désactivés dans nos systèmes. Ils sont généralement établis en réponse à des actions que vous avez effectuées et qui constituent une demande de services, telles que la définition de vos préférences de confidentialité, la connexion ou le remplissage de formulaires.
            </p>
            <p>
              Vous pouvez configurer votre navigateur pour qu'il bloque ou vous avertisse de l'existence de ces cookies, mais certaines parties du site ne fonctionneront pas correctement si vous le faites.
            </p>
            <p>
              Exemples de cookies essentiels que nous utilisons :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cookies de session pour maintenir l'état de votre session</li>
              <li>Cookies d'authentification pour vous permettre de rester connecté</li>
              <li>Cookies de sécurité pour prévenir les attaques CSRF</li>
            </ul>

            <h3 className="text-xl font-medium mt-6">2.2 Cookies d'analyse</h3>
            <p>
              Ces cookies nous permettent de compter les visites et les sources de trafic afin de mesurer et d'améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont les plus et les moins populaires et à voir comment les visiteurs se déplacent sur le site.
            </p>
            <p>
              Toutes les informations recueillies par ces cookies sont agrégées et donc anonymisées. Si vous n'autorisez pas ces cookies, nous ne saurons pas quand vous avez visité notre site.
            </p>
            <p>
              Exemples de cookies d'analyse que nous utilisons :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google Analytics pour analyser l'utilisation du site</li>
              <li>Vercel Analytics pour mesurer les performances</li>
            </ul>

            <h3 className="text-xl font-medium mt-6">2.3 Cookies de marketing</h3>
            <p>
              Ces cookies peuvent être mis en place par nos partenaires publicitaires via notre site. Ils peuvent être utilisés par ces entreprises pour établir un profil de vos intérêts et vous proposer des publicités pertinentes sur d'autres sites.
            </p>
            <p>
              Ils ne stockent pas directement des données personnelles, mais sont basés sur l'identification unique de votre navigateur et de votre appareil internet. Si vous n'autorisez pas ces cookies, vous aurez une publicité moins ciblée.
            </p>

            <h3 className="text-xl font-medium mt-6">2.4 Cookies de préférences</h3>
            <p>
              Ces cookies permettent à notre site web de se souvenir des choix que vous faites (comme votre nom d'utilisateur, votre langue ou la région dans laquelle vous vous trouvez) et de fournir des fonctionnalités améliorées et plus personnelles.
            </p>
            <p>
              Ces cookies peuvent également être utilisés pour mémoriser les changements que vous avez apportés à la taille du texte, aux polices et à d'autres parties des pages web que vous pouvez personnaliser.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Durée de conservation des cookies</h2>
          <div className="space-y-2">
            <p>
              Les cookies de session sont temporaires et sont supprimés de votre appareil lorsque vous fermez votre navigateur.
            </p>
            <p>
              Les cookies persistants restent sur votre appareil jusqu'à leur expiration ou jusqu'à ce que vous les supprimiez manuellement. La durée de conservation des cookies persistants sur votre appareil varie d'un cookie à l'autre.
            </p>
            <p>
              Nous utilisons des cookies persistants et des cookies de session pour différentes raisons, notamment pour :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Améliorer votre expérience sur notre site</li>
              <li>Vous permettre de naviguer entre les pages de manière efficace</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser comment notre site est utilisé afin que nous puissions l'améliorer</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">4. Comment gérer vos cookies</h2>
          <div className="space-y-2">
            <p>
              Vous pouvez gérer vos préférences en matière de cookies de plusieurs façons :
            </p>
            <h3 className="text-xl font-medium">4.1 Via notre outil de gestion des cookies</h3>
            <p>
              Vous pouvez modifier vos préférences à tout moment en utilisant notre outil de gestion des cookies accessible via le lien "Paramètres des cookies" en bas de chaque page de notre site.
            </p>

            <h3 className="text-xl font-medium mt-6">4.2 Via les paramètres de votre navigateur</h3>
            <p>
              La plupart des navigateurs web permettent de contrôler la plupart des cookies via leurs paramètres. Pour en savoir plus sur la façon de gérer les cookies avec votre navigateur, veuillez consulter les liens suivants :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary underline">Microsoft Edge</a></li>
            </ul>
            <p>
              Veuillez noter que la restriction des cookies peut vous empêcher d'utiliser certaines fonctionnalités de notre site.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">5. Cookies tiers</h2>
          <div className="space-y-2">
            <p>
              Certains cookies sont placés par des services tiers qui apparaissent sur nos pages. Nous n'avons pas le contrôle direct sur ces cookies. Vous pouvez les bloquer en utilisant les paramètres de votre navigateur ou les outils fournis par ces tiers.
            </p>
            <p>
              Nous utilisons les services tiers suivants qui peuvent placer des cookies sur votre appareil :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google Analytics (analyse web)</li>
              <li>Vercel Analytics (analyse des performances)</li>
              <li>Clerk (authentification)</li>
            </ul>
            <p>
              Pour plus d'informations sur la façon dont ces tiers utilisent les cookies, veuillez consulter leurs politiques de confidentialité respectives.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">6. Modifications de notre politique de cookies</h2>
          <div className="space-y-2">
            <p>
              Nous pouvons mettre à jour notre politique de cookies de temps à autre pour refléter, par exemple, les changements apportés aux cookies que nous utilisons ou pour d'autres raisons opérationnelles, légales ou réglementaires.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette politique pour rester informé de notre utilisation des cookies et des technologies connexes.
            </p>
            <p>
              La date en haut de cette politique indique quand elle a été mise à jour pour la dernière fois.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">7. Contact</h2>
          <div className="space-y-2">
            <p>
              Si vous avez des questions concernant notre utilisation des cookies, veuillez nous contacter à l'adresse suivante :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email : privacy@appshade.fr</li>
              <li>Adresse postale : AppShade SAS, 123 Avenue de la Tech, 75001 Paris, France</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 