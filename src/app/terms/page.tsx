import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | AppShade",
  description: "Conditions générales d'utilisation de la plateforme AppShade",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Conditions Générales d'Utilisation</h1>
        <p className="text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Préambule</h2>
          <div className="space-y-2">
            <p>
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités et conditions d'utilisation des services proposés sur le site AppShade (ci-après "le Service"), ainsi que de définir les droits et obligations des parties dans ce cadre.
            </p>
            <p>
              Elles sont accessibles et imprimables à tout moment par un lien direct en bas de page du site.
            </p>
            <p>
              Elles peuvent être complétées, le cas échéant, par des conditions d'utilisation particulières à certains services. En cas de contradiction, les conditions particulières prévalent sur ces conditions générales.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. Exploitant des services</h2>
          <div className="space-y-2">
            <p>
              Le site AppShade est exploité par la société AppShade SAS, société par actions simplifiée au capital de 10 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789, dont le siège social est situé au 123 Avenue de la Tech, 75001 Paris, France (ci-après "AppShade").
            </p>
            <p>
              AppShade peut être contactée aux coordonnées suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Adresse postale : 123 Avenue de la Tech, 75001 Paris, France</li>
              <li>Adresse électronique : contact@appshade.fr</li>
              <li>Téléphone : +33 1 23 45 67 89</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Accès au site et aux services</h2>
          <div className="space-y-2">
            <p>
              Le Service est accessible, sous réserve des restrictions prévues sur le site :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>à toute personne physique disposant de la pleine capacité juridique pour s'engager au titre des présentes conditions générales. La personne physique qui ne dispose pas de la pleine capacité juridique ne peut accéder au Site et aux Services qu'avec l'accord de son représentant légal ;</li>
              <li>à toute personne morale agissant par l'intermédiaire d'une personne physique disposant de la capacité juridique pour contracter au nom et pour le compte de la personne morale.</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">4. Inscription sur le site</h2>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">4.1 Modalités d'inscription</h3>
            <p>
              L'utilisation des Services nécessite que l'Utilisateur s'inscrive sur le site, en remplissant le formulaire prévu à cet effet. L'Utilisateur doit fournir l'ensemble des informations marquées comme obligatoires. Toute inscription incomplète ne sera pas validée.
            </p>
            <p>
              L'inscription entraîne automatiquement l'ouverture d'un compte au nom de l'Utilisateur (ci-après : le "Compte"), lui donnant accès à un espace personnel (ci-après : l'"Espace Personnel") qui lui permet de gérer son utilisation des Services.
            </p>
            <p>
              L'Utilisateur garantit que toutes les informations qu'il donne dans le formulaire d'inscription sont exactes, à jour et sincères et ne sont entachées d'aucun caractère trompeur.
            </p>
            <p>
              Il s'engage à mettre à jour ces informations dans son Espace Personnel en cas de modifications, afin qu'elles correspondent toujours aux critères susvisés.
            </p>
            <p>
              L'Utilisateur est informé et accepte que les informations saisies aux fins de création ou de mise à jour de son Compte vaillent preuve de son identité. Les informations saisies par l'Utilisateur l'engagent dès leur validation.
            </p>

            <h3 className="text-xl font-medium mt-6">4.2 Identifiants de connexion</h3>
            <p>
              L'Utilisateur est seul responsable de l'utilisation de ses identifiants de connexion, et s'engage à mettre tout en œuvre pour les garder secrets et à ne pas les divulguer, à qui que ce soit, sous quelque forme que ce soit.
            </p>
            <p>
              Si l'Utilisateur constate que son Compte a été utilisé à son insu, il devra alerter AppShade dans les plus brefs délais à l'adresse security@appshade.fr.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">5. Description des services</h2>
          <div className="space-y-2">
            <p>
              L'Utilisateur a accès aux Services décrits sur le site, sous une forme et selon les fonctionnalités et moyens techniques qu'AppShade juge les plus appropriés.
            </p>
            <p>
              Les Services disponibles sur le site comprennent notamment :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>La création et la gestion de tickets de support</li>
              <li>La communication avec l'équipe de support via une messagerie intégrée</li>
              <li>Le suivi de l'état des tickets et des demandes</li>
              <li>L'accès à une base de connaissances et à des ressources d'aide</li>
              <li>La gestion des paiements et des abonnements</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">6. Services payants</h2>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">6.1 Prix</h3>
            <p>
              Les prix des Services sont indiqués sur le site. Sauf mention contraire, ils sont exprimés en euros et toutes taxes françaises comprises.
            </p>
            <p>
              AppShade se réserve le droit, à sa libre discrétion et selon des modalités dont elle sera seule juge, de proposer des offres promotionnelles ou réductions de prix.
            </p>

            <h3 className="text-xl font-medium mt-6">6.2 Révision des prix</h3>
            <p>
              Les prix des Services peuvent faire l'objet d'une révision par AppShade à tout moment, à sa libre discrétion.
            </p>
            <p>
              L'Utilisateur sera informé de ces modifications par AppShade par tout moyen écrit utile (et notamment par email) au moins 1 mois avant l'entrée en vigueur des nouveaux tarifs.
            </p>
            <p>
              L'Utilisateur qui n'accepte pas les nouveaux prix doit mettre fin à son utilisation des Services selon les modalités prévues à l'article 11. À défaut, il sera réputé avoir accepté les nouveaux tarifs.
            </p>

            <h3 className="text-xl font-medium mt-6">6.3 Facturation</h3>
            <p>
              Les Services font l'objet de factures qui sont communiquées à l'Utilisateur par tout moyen utile.
            </p>

            <h3 className="text-xl font-medium mt-6">6.4 Modalités de paiement</h3>
            <p>
              Les modalités de paiement du prix des Services sont décrites sur le site. Le paiement s'effectue par prélèvement automatique à partir du numéro de carte bancaire de l'Utilisateur ou via PayPal.
            </p>
            <p>
              Le prélèvement est mis en œuvre par le prestataire de paiement désigné sur le site, qui seul conserve les coordonnées bancaires de l'Utilisateur à cette fin. AppShade ne conserve aucune coordonnée bancaire.
            </p>
            <p>
              L'Utilisateur garantit à AppShade qu'il dispose des autorisations nécessaires pour utiliser le mode de paiement choisi. Il s'engage à prendre les mesures nécessaires afin que le prélèvement automatique du prix des Services puisse être effectué.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">7. Données</h2>
          <div className="space-y-2">
            <p>
              L'Utilisateur assure à AppShade qu'il dispose de tous les droits et autorisations nécessaires à la publication des contenus de toute nature (rédactionnels, graphiques, audios, audiovisuels ou autres, en ce compris la dénomination et/ou l'image éventuellement choisies par l'Utilisateur pour l'identifier sur le site) qu'il diffuse dans le cadre des Services (ci-après désignés : les "Contenus").
            </p>
            <p>
              Il s'engage à ce que lesdits Contenus soient licites, ne portent pas atteinte à l'ordre public, aux bonnes mœurs ou aux droits de tiers, n'enfreignent aucune disposition législative ou règlementaire et plus généralement, ne soient aucunement susceptibles de mettre en jeu la responsabilité civile ou pénale d'AppShade.
            </p>
            <p>
              L'Utilisateur s'interdit ainsi de diffuser, notamment et sans que cette liste soit exhaustive :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>des Contenus pornographiques, obscènes, indécents, choquants ou inadaptés à un public familial, diffamatoires, injurieux, violents, racistes, xénophobes ou révisionnistes,</li>
              <li>des Contenus contrefaisants,</li>
              <li>des Contenus attentatoires à l'image d'un tiers,</li>
              <li>des Contenus mensongers, trompeurs ou proposant ou promouvant des activités illicites, frauduleuses ou trompeuses,</li>
              <li>des Contenus nuisibles aux systèmes informatiques de tiers (tels que virus, vers, chevaux de Troie, etc.),</li>
              <li>et plus généralement des Contenus susceptibles de porter atteinte aux droits de tiers ou d'être préjudiciables à des tiers, de quelque manière et sous quelque forme que ce soit.</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">8. Garanties de l'Utilisateur</h2>
          <div className="space-y-2">
            <p>
              L'Utilisateur garantit AppShade contre toutes plaintes, réclamations, actions et/ou revendications quelconques qu'AppShade pourrait subir du fait de la violation, par l'Utilisateur de l'une quelconque de ses obligations ou garanties aux termes des présentes conditions générales.
            </p>
            <p>
              Il s'engage à indemniser AppShade de tout préjudice qu'elle subirait et à lui payer tous les frais, charges et/ou condamnations qu'elle pourrait avoir à supporter de ce fait.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">9. Comportements prohibés</h2>
          <div className="space-y-2">
            <p>
              Il est strictement interdit d'utiliser les Services aux fins suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>l'exercice d'activités illégales, frauduleuses ou portant atteinte aux droits ou à la sécurité des tiers,</li>
              <li>l'atteinte à l'ordre public ou la violation des lois et règlements en vigueur,</li>
              <li>l'intrusion dans le système informatique d'un tiers ou toute activité de nature à nuire, contrôler, interférer, ou intercepter tout ou partie du système informatique d'un tiers, en violer l'intégrité ou la sécurité,</li>
              <li>l'envoi d'emails non sollicités et/ou de prospection ou sollicitation commerciale,</li>
              <li>les manipulations destinées à améliorer le référencement d'un site tiers,</li>
              <li>l'aide ou l'incitation, sous quelque forme et de quelque manière que ce soit, à un ou plusieurs des actes et activités décrits ci-dessus,</li>
              <li>et plus généralement toute pratique détournant les Services à des fins autres que celles pour lesquelles ils ont été conçus.</li>
            </ul>
            <p>
              Il est strictement interdit aux Utilisateurs de copier et/ou de détourner à leurs fins ou à celles de tiers le concept, les technologies ou tout autre élément du site d'AppShade.
            </p>
            <p>
              Sont également strictement interdits : (i) tous comportements de nature à interrompre, suspendre, ralentir ou empêcher la continuité des Services, (ii) toutes intrusions ou tentatives d'intrusions dans les systèmes d'AppShade, (iii) tous détournements des ressources système du site, (iv) toutes actions de nature à imposer une charge disproportionnée sur les infrastructures de ce dernier, (v) toutes atteintes aux mesures de sécurité et d'authentification, (vi) tous actes de nature à porter atteinte aux droits et intérêts financiers, commerciaux ou moraux d'AppShade ou des usagers de son site, et enfin plus généralement (vii) tout manquement aux présentes conditions générales.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">10. Sanctions des manquements</h2>
          <div className="space-y-2">
            <p>
              En cas de manquement à l'une quelconque des dispositions des présentes conditions générales ou plus généralement, d'infraction aux lois et règlements en vigueur par un Utilisateur, AppShade se réserve le droit de prendre toute mesure appropriée et notamment de :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>suspendre ou résilier l'accès aux Services de l'Utilisateur, auteur du manquement ou de l'infraction, ou y ayant participé,</li>
              <li>supprimer tout contenu mis en ligne sur le site,</li>
              <li>publier sur le site tout message d'information que AppShade jugera utile,</li>
              <li>avertir toute autorité concernée,</li>
              <li>engager toute action judiciaire.</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">11. Durée des services, désinscription</h2>
          <div className="space-y-2">
            <p>
              Les Services sont souscrits pour une durée indéterminée.
            </p>
            <p>
              L'Utilisateur peut se désinscrire des Services à tout moment, en adressant une demande à cet effet à AppShade par email, aux coordonnées mentionnées à l'article 2.
            </p>
            <p>
              La désinscription est effective immédiatement. Elle entraîne la suppression automatique du Compte de l'Utilisateur.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">12. Modifications</h2>
          <div className="space-y-2">
            <p>
              AppShade se réserve la faculté de modifier à tout moment les présentes conditions générales.
            </p>
            <p>
              L'Utilisateur sera informé de ces modifications par tout moyen utile.
            </p>
            <p>
              L'Utilisateur qui n'accepte pas les conditions générales modifiées doit se désinscrire des Services selon les modalités prévues à l'article 11.
            </p>
            <p>
              Tout Utilisateur qui a recours aux Services postérieurement à l'entrée en vigueur des conditions générales modifiées est réputé avoir accepté ces modifications.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">13. Loi applicable et juridiction</h2>
          <div className="space-y-2">
            <p>
              Les présentes conditions générales sont régies par la loi française.
            </p>
            <p>
              En cas de contestation sur la validité, l'interprétation et/ou l'exécution des présentes conditions générales, les parties conviennent que les tribunaux de Paris seront exclusivement compétents pour en juger, sauf règles de procédure impératives contraires.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">14. Entrée en vigueur</h2>
          <div className="space-y-2">
            <p>
              Les présentes conditions générales sont entrées en vigueur le 1er mars 2025.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 