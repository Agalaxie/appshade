import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Mentions Légales | AppShade",
  description: "Mentions légales et conditions d'utilisation d'AppShade",
};

export default function LegalPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Mentions Légales</h1>
        <p className="text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Informations légales</h2>
          <div className="space-y-2">
            <p>
              Le site AppShade est édité par la société AppShade SAS, société par actions simplifiée au capital de 10 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789, dont le siège social est situé au 123 Avenue de la Tech, 75001 Paris, France.
            </p>
            <p>
              Numéro de TVA intracommunautaire : FR 12 345 678 901
            </p>
            <p>
              Directeur de la publication : Jean Dupont, Président
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. Hébergement</h2>
          <div className="space-y-2">
            <p>
              Le site AppShade est hébergé par la société Vercel Inc., dont le siège social est situé au 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            </p>
            <p>
              Téléphone : +1 (123) 456-7890
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Propriété intellectuelle</h2>
          <div className="space-y-2">
            <p>
              L'ensemble du contenu du site AppShade (structure, textes, logos, images, vidéos, sons, etc.) est la propriété exclusive d'AppShade SAS ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable d'AppShade SAS.
            </p>
            <p>
              Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">4. Protection des données personnelles</h2>
          <div className="space-y-2">
            <p>
              AppShade SAS s'engage à respecter la confidentialité des données personnelles communiquées par les utilisateurs du site et à les traiter dans le respect de la loi Informatique et Libertés du 6 janvier 1978 modifiée et du Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p>
              Les informations recueillies sur ce site sont enregistrées dans un fichier informatisé par AppShade SAS pour la gestion de la relation client et le traitement des demandes de support. Elles sont conservées pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées et sont destinées aux services commerciaux et techniques d'AppShade SAS.
            </p>
            <p>
              Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité des données et d'opposition au traitement de vos données. Vous pouvez exercer ces droits en nous contactant à l'adresse email suivante : privacy@appshade.fr ou par courrier postal à l'adresse du siège social indiquée ci-dessus.
            </p>
            <p>
              Pour plus d'informations sur la façon dont nous traitons vos données, veuillez consulter notre <a href="/privacy" className="text-primary underline">Politique de confidentialité</a>.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">5. Cookies</h2>
          <div className="space-y-2">
            <p>
              Le site AppShade utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. Les cookies sont de petits fichiers texte stockés sur votre ordinateur qui nous permettent de vous fournir une expérience personnalisée sur notre site.
            </p>
            <p>
              Vous pouvez configurer votre navigateur pour qu'il vous avertisse lorsque vous recevez un cookie ou pour qu'il refuse automatiquement tous les cookies. Cependant, si vous désactivez les cookies, certaines fonctionnalités du site pourraient ne pas être disponibles.
            </p>
            <p>
              Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre <a href="/cookies" className="text-primary underline">Politique de cookies</a>.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">6. Limitation de responsabilité</h2>
          <div className="space-y-2">
            <p>
              AppShade SAS s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur son site. Toutefois, AppShade SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le site.
            </p>
            <p>
              En conséquence, AppShade SAS décline toute responsabilité :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site ;</li>
              <li>pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site ;</li>
              <li>et plus généralement, pour tous dommages, directs ou indirects, qu'elles qu'en soient les causes, origines, natures ou conséquences, provoqués à raison de l'accès de quiconque au site ou de l'impossibilité d'y accéder, de même que l'utilisation du site et/ou du crédit accordé à une quelconque information provenant directement ou indirectement de ce dernier.</li>
            </ul>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">7. Liens hypertextes</h2>
          <div className="space-y-2">
            <p>
              Le site AppShade peut contenir des liens hypertextes vers d'autres sites internet. AppShade SAS n'exerce aucun contrôle sur ces sites et ne peut être tenu responsable de leur contenu ou de leurs pratiques en matière de protection des données personnelles.
            </p>
            <p>
              La présence de liens vers d'autres sites web ne constitue pas une approbation du contenu de ces sites ou des pratiques de leurs propriétaires.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">8. Droit applicable et juridiction compétente</h2>
          <div className="space-y-2">
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse email suivante : legal@appshade.fr.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">9. Médiation de la consommation</h2>
          <div className="space-y-2">
            <p>
              Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, AppShade SAS adhère au Service du Médiateur du e-commerce de la FEVAD (Fédération du e-commerce et de la vente à distance) dont les coordonnées sont les suivantes : 60 rue La Boétie – 75008 Paris – http://www.mediateurfevad.fr.
            </p>
            <p>
              Après démarche préalable écrite des consommateurs vis-à-vis d'AppShade SAS, le Service du Médiateur peut être saisi pour tout litige de consommation dont le règlement n'aurait pas abouti. Pour connaître les modalités de saisine du Médiateur, cliquer <a href="http://www.mediateurfevad.fr" className="text-primary underline" target="_blank" rel="noopener noreferrer">ici</a>.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">10. Accessibilité</h2>
          <div className="space-y-2">
            <p>
              AppShade SAS s'efforce de rendre son site accessible à tous, y compris aux personnes en situation de handicap. Si vous rencontrez des difficultés pour accéder à certaines parties du site, n'hésitez pas à nous contacter à l'adresse email suivante : accessibility@appshade.fr.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 