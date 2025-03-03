"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Copy, Check, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AccessInfo {
  ftpHost?: string
  ftpPort?: string
  ftpUsername?: string
  ftpPassword?: string
  cmsType?: string
  cmsUrl?: string
  cmsUsername?: string
  cmsPassword?: string
  hostingProvider?: string
}

interface AccessInfoCardProps {
  accessInfo: AccessInfo
}

export function AccessInfoCard({ accessInfo }: AccessInfoCardProps) {
  const [showFtpPassword, setShowFtpPassword] = useState(false)
  const [showCmsPassword, setShowCmsPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  console.log("AccessInfoCard - Données reçues:", accessInfo);
  
  // Vérifier si les propriétés existent et ne sont pas vides
  const hasFtpInfo = !!(
    accessInfo?.ftpHost || 
    accessInfo?.ftpUsername || 
    accessInfo?.ftpPassword || 
    accessInfo?.ftpPort
  );
  
  const hasCmsInfo = !!(
    accessInfo?.cmsType || 
    accessInfo?.cmsUrl || 
    accessInfo?.cmsUsername || 
    accessInfo?.cmsPassword
  );
  
  const hasHostingInfo = !!(accessInfo?.hostingProvider);

  console.log("AccessInfoCard - Détection:", { hasFtpInfo, hasCmsInfo, hasHostingInfo });

  if (!accessInfo || (!hasFtpInfo && !hasCmsInfo && !hasHostingInfo)) {
    return (
      <div className="text-sm text-muted-foreground italic p-4 bg-muted/20 rounded-md">
        Aucune information d'accès fournie par le client.
      </div>
    );
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(fieldName);
        toast({
          title: "Copié !",
          description: `${fieldName} a été copié dans le presse-papier.`,
          duration: 2000,
        });
        
        // Réinitialiser l'icône après 2 secondes
        setTimeout(() => {
          setCopiedField(null);
        }, 2000);
      })
      .catch(err => {
        console.error("Erreur lors de la copie:", err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le texte.",
          variant: "destructive",
        });
      });
  };

  const renderCopyButton = (text: string | undefined, fieldName: string) => {
    if (!text) return null;
    
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 ml-1 text-muted-foreground hover:text-primary"
        onClick={() => copyToClipboard(text, fieldName)}
      >
        {copiedField === fieldName ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        <span className="sr-only">Copier {fieldName}</span>
      </Button>
    );
  };

  const maskPassword = (password: string | undefined) => {
    if (!password) return "";
    return "•".repeat(Math.min(password.length, 8));
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle>Informations d'accès</CardTitle>
        <CardDescription>
          Informations de connexion fournies par le client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasFtpInfo && (
          <div className="space-y-2">
            <h3 className="font-medium">Accès FTP</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {accessInfo.ftpHost && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Hôte:</span>{" "}
                  <span className="ml-1">{accessInfo.ftpHost}</span>
                  {renderCopyButton(accessInfo.ftpHost, "Hôte FTP")}
                </div>
              )}
              {accessInfo.ftpPort && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Port:</span>{" "}
                  <span className="ml-1">{accessInfo.ftpPort}</span>
                  {renderCopyButton(accessInfo.ftpPort, "Port FTP")}
                </div>
              )}
              {accessInfo.ftpUsername && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Utilisateur:</span>{" "}
                  <span className="ml-1">{accessInfo.ftpUsername}</span>
                  {renderCopyButton(accessInfo.ftpUsername, "Utilisateur FTP")}
                </div>
              )}
              {accessInfo.ftpPassword && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Mot de passe:</span>{" "}
                  <span className="ml-1">
                    {showFtpPassword ? accessInfo.ftpPassword : maskPassword(accessInfo.ftpPassword)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 text-muted-foreground hover:text-primary"
                    onClick={() => setShowFtpPassword(!showFtpPassword)}
                  >
                    {showFtpPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">
                      {showFtpPassword ? "Masquer" : "Afficher"} le mot de passe
                    </span>
                  </Button>
                  {renderCopyButton(accessInfo.ftpPassword, "Mot de passe FTP")}
                </div>
              )}
            </div>
          </div>
        )}

        {hasFtpInfo && (hasCmsInfo || hasHostingInfo) && <Separator />}

        {hasCmsInfo && (
          <div className="space-y-2">
            <h3 className="font-medium">Accès CMS</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {accessInfo.cmsType && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span className="ml-1">{accessInfo.cmsType}</span>
                  {renderCopyButton(accessInfo.cmsType, "Type CMS")}
                </div>
              )}
              {accessInfo.cmsUrl && (
                <div className="flex items-center col-span-2">
                  <span className="text-muted-foreground">URL:</span>{" "}
                  <a 
                    href={accessInfo.cmsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 text-primary hover:underline"
                  >
                    {accessInfo.cmsUrl}
                  </a>
                  {renderCopyButton(accessInfo.cmsUrl, "URL CMS")}
                </div>
              )}
              {accessInfo.cmsUsername && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Utilisateur:</span>{" "}
                  <span className="ml-1">{accessInfo.cmsUsername}</span>
                  {renderCopyButton(accessInfo.cmsUsername, "Utilisateur CMS")}
                </div>
              )}
              {accessInfo.cmsPassword && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Mot de passe:</span>{" "}
                  <span className="ml-1">
                    {showCmsPassword ? accessInfo.cmsPassword : maskPassword(accessInfo.cmsPassword)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 text-muted-foreground hover:text-primary"
                    onClick={() => setShowCmsPassword(!showCmsPassword)}
                  >
                    {showCmsPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">
                      {showCmsPassword ? "Masquer" : "Afficher"} le mot de passe
                    </span>
                  </Button>
                  {renderCopyButton(accessInfo.cmsPassword, "Mot de passe CMS")}
                </div>
              )}
            </div>
          </div>
        )}

        {hasCmsInfo && hasHostingInfo && <Separator />}

        {hasHostingInfo && (
          <div className="space-y-2">
            <h3 className="font-medium">Hébergement</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {accessInfo.hostingProvider && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">Fournisseur:</span>{" "}
                  <span className="ml-1">{accessInfo.hostingProvider}</span>
                  {renderCopyButton(accessInfo.hostingProvider, "Fournisseur d'hébergement")}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 