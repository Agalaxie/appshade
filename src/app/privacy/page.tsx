import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | AppShade",
  description: "Politique de confidentialité et de protection des données personnelles d'AppShade",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Politique de Confidentialité</h1>
        <p className="text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Introduction</h2>
          <div className="space-y-2">
            <p>
              AppShade SAS (ci-après "AppShade", "nous", "notre" ou "nos") s'engage à protéger la vie privée des utilisateurs de son site internet et de ses services (ci-après le "Service"). La présente politique de confidentialité a pour objet d'informer les utilisateurs sur la manière dont leurs informations personnelles sont collectées, utilisées et partagées.
            </p>
            <p>
              Cette politique de confidentialité s'applique à tous les services proposés par AppShade et est conforme au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            </p>
            <p>
              En utilisant notre Service, vous acceptez les pratiques décrites dans la présente politique de confidentialité. Si vous n'acceptez pas cette politique, veuillez ne pas utiliser notre Service.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. Collecte des données personnelles</h2>
          <div className="space-y-2">
            <p>
              Nous collectons les informations personnelles que vous nous fournissez directement, telles que :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Informations d'identification : nom, prénom, adresse email, numéro de téléphone</li>
              <li>Informations de compte : nom d'utilisateur, mot de passe</li>
              <li>Informations de facturation : adresse postale, informations de paiement</li>
              <li>Contenu généré par l'utilisateur : messages, tickets de support, pièces jointes</li>
              <li>Informations professionnelles : nom de l'entreprise, poste, secteur d'activité</li>
            </ul>
            <p>
              Nous collectons également automatiquement certaines informations lorsque vous utilisez notre Service, telles que :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Données de connexion : adresse IP, type et version du navigateur, système d'exploitation</li>
              <li>Données d'utilisation : pages visitées, temps passé sur le site, actions effectuées</li>
              <li>Cookies et technologies similaires : voir notre politique de cookies pour plus d'informations</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Utilisation des données personnelles</h2>
          <div className="space-y-2">
            <p>
              Nous utilisons vos données personnelles pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fournir, maintenir et améliorer notre Service</li>
              <li>Traiter vos transactions et gérer votre compte</li>
              <li>Répondre à vos demandes et vous fournir une assistance client</li>
              <li>Vous envoyer des informations techniques, des mises à jour et des alertes de sécurité</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
              <li>Détecter, prévenir et résoudre les problèmes techniques et de sécurité</li>
              <li>Respecter nos obligations légales et réglementaires</li>
            </ul>
            <p>
              La base juridique de ces traitements peut être :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>L'exécution d'un contrat : pour vous fournir notre Service</li>
              <li>Votre consentement : pour les communications marketing</li>
              <li>Nos intérêts légitimes : pour améliorer notre Service et assurer sa sécurité</li>
              <li>Le respect de nos obligations légales</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">4. Partage des données personnelles</h2>
          <div className="space-y-2">
            <p>
              Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager vos informations dans les circonstances suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Avec des prestataires de services qui nous aident à fournir notre Service (hébergement, paiement, support client)</li>
              <li>Avec des partenaires commerciaux, avec votre consentement</li>
              <li>En cas de fusion, acquisition ou vente d'actifs, vos données peuvent être transférées à la nouvelle entité</li>
              <li>Si nous sommes légalement tenus de le faire (par exemple, en réponse à une procédure judiciaire)</li>
              <li>Pour protéger nos droits, notre propriété ou notre sécurité, ou ceux de nos utilisateurs</li>
            </ul>
            <p>
              Tous nos prestataires de services sont tenus de respecter la confidentialité et la sécurité de vos données personnelles.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">5. Transferts internationaux de données</h2>
          <div className="space-y-2">
            <p>
              Vos données personnelles peuvent être transférées et traitées dans des pays autres que celui où vous résidez. Ces pays peuvent avoir des lois différentes en matière de protection des données.
            </p>
            <p>
              Lorsque nous transférons vos données personnelles en dehors de l'Espace Économique Européen (EEE), nous nous assurons qu'un niveau de protection adéquat est garanti, notamment par :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Le transfert vers des pays reconnus par la Commission européenne comme assurant un niveau de protection adéquat</li>
              <li>L'utilisation de clauses contractuelles types approuvées par la Commission européenne</li>
              <li>Le transfert vers des organisations participant au Privacy Shield (pour les transferts vers les États-Unis)</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">6. Conservation des données</h2>
          <div className="space-y-2">
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les finalités décrites dans cette politique de confidentialité, sauf si une période de conservation plus longue est requise ou permise par la loi.
            </p>
            <p>
              Les critères utilisés pour déterminer nos périodes de conservation comprennent :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>La durée pendant laquelle vous utilisez notre Service</li>
              <li>Nos obligations légales et réglementaires</li>
              <li>Les délais de prescription applicables</li>
              <li>Les litiges potentiels ou en cours</li>
            </ul>
            <p>
              Lorsque nous n'avons plus besoin de vos données personnelles, nous les supprimons ou les anonymisons.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">7. Sécurité des données</h2>
          <div className="space-y-2">
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération ou la destruction.
            </p>
            <p>
              Ces mesures comprennent notamment :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Le chiffrement des données sensibles</li>
              <li>La mise en place de pare-feu et de systèmes de détection d'intrusion</li>
              <li>Des procédures d'accès strictes pour nos employés</li>
              <li>Des audits de sécurité réguliers</li>
              <li>Des plans de continuité d'activité et de reprise après sinistre</li>
            </ul>
            <p>
              Cependant, aucun système de sécurité n'est infaillible. Nous ne pouvons garantir la sécurité absolue de vos données personnelles.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">8. Vos droits</h2>
          <div className="space-y-2">
            <p>
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Droit d'accès : vous pouvez demander une copie de vos données personnelles</li>
              <li>Droit de rectification : vous pouvez demander la correction de données inexactes ou incomplètes</li>
              <li>Droit à l'effacement : vous pouvez demander la suppression de vos données personnelles dans certaines circonstances</li>
              <li>Droit à la limitation du traitement : vous pouvez demander la limitation du traitement de vos données dans certaines circonstances</li>
              <li>Droit à la portabilité des données : vous pouvez demander le transfert de vos données à un autre responsable du traitement</li>
              <li>Droit d'opposition : vous pouvez vous opposer au traitement de vos données dans certaines circonstances</li>
              <li>Droit de retirer votre consentement : vous pouvez retirer votre consentement à tout moment</li>
              <li>Droit de déposer une plainte auprès d'une autorité de contrôle</li>
            </ul>
            <p>
              Pour exercer ces droits, veuillez nous contacter à l'adresse privacy@appshade.fr. Nous répondrons à votre demande dans un délai d'un mois, sauf circonstances exceptionnelles.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">9. Cookies et technologies similaires</h2>
          <div className="space-y-2">
            <p>
              Nous utilisons des cookies et des technologies similaires pour collecter des informations sur votre utilisation de notre Service et pour améliorer votre expérience.
            </p>
            <p>
              Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
            </p>
            <p>
              Nous utilisons les types de cookies suivants :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cookies essentiels : nécessaires au fonctionnement du site</li>
              <li>Cookies de performance : pour analyser l'utilisation du site et améliorer ses performances</li>
              <li>Cookies de fonctionnalité : pour mémoriser vos préférences</li>
              <li>Cookies de ciblage : pour vous proposer des publicités pertinentes</li>
            </ul>
            <p>
              Vous pouvez contrôler et gérer les cookies de plusieurs façons. La plupart des navigateurs vous permettent de supprimer les cookies, de bloquer l'acceptation des cookies ou de vous avertir avant qu'un cookie ne soit stocké. Veuillez noter que la désactivation des cookies peut affecter la fonctionnalité de notre Service.
            </p>
            <p>
              Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre <a href="/cookies" className="text-primary underline">Politique de cookies</a>.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">10. Protection des données des enfants</h2>
          <div className="space-y-2">
            <p>
              Notre Service ne s'adresse pas aux personnes de moins de 16 ans et nous ne collectons pas sciemment des données personnelles concernant des enfants de moins de 16 ans. Si nous apprenons que nous avons collecté des données personnelles d'un enfant de moins de 16 ans sans vérification du consentement parental, nous prendrons des mesures pour supprimer ces informations de nos serveurs.
            </p>
            <p>
              Si vous êtes un parent ou un tuteur et que vous pensez que votre enfant nous a fourni des données personnelles, veuillez nous contacter à privacy@appshade.fr.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">11. Liens vers d'autres sites</h2>
          <div className="space-y-2">
            <p>
              Notre Service peut contenir des liens vers d'autres sites qui ne sont pas exploités par nous. Si vous cliquez sur un lien tiers, vous serez dirigé vers le site de ce tiers. Nous vous recommandons vivement de consulter la politique de confidentialité de chaque site que vous visitez.
            </p>
            <p>
              Nous n'avons aucun contrôle sur le contenu, les politiques de confidentialité ou les pratiques des sites ou services tiers et n'assumons aucune responsabilité à cet égard.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">12. Modifications de la politique de confidentialité</h2>
          <div className="space-y-2">
            <p>
              Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur cette page et en mettant à jour la date de "dernière mise à jour" en haut de cette politique.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette politique pour prendre connaissance de toute modification. Les modifications de cette politique de confidentialité sont effectives lorsqu'elles sont publiées sur cette page.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">13. Contact</h2>
          <div className="space-y-2">
            <p>
              Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Par email : privacy@appshade.fr</li>
              <li>Par courrier : AppShade SAS, 123 Avenue de la Tech, 75001 Paris, France</li>
            </ul>
            <p>
              Vous pouvez également contacter notre Délégué à la Protection des Données (DPO) à l'adresse dpo@appshade.fr.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 