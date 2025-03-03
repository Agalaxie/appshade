import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@prisma/client";
import { Mail, Phone, Building, MapPin, Briefcase, User as UserIcon } from "lucide-react";

interface ClientInfoCardProps {
  user: Partial<User> | null;
  className?: string;
}

export function ClientInfoCard({ user, className }: ClientInfoCardProps) {
  if (!user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Informations client</CardTitle>
          <CardDescription>Aucune information client disponible</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isProfileComplete = user.profileCompleted;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Informations client</CardTitle>
            <CardDescription>Détails du contact</CardDescription>
          </div>
          {isProfileComplete ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Profil complet
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Profil incomplet
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {user.firstName || "Non renseigné"} {user.lastName || ""}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email || "Email non renseigné"}</span>
          </div>
          
          {user.phoneNumber && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phoneNumber}</span>
            </div>
          )}
        </div>

        {(user.address || user.city || user.postalCode || user.country) && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">Adresse</h4>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                {user.address && <p>{user.address}</p>}
                {(user.city || user.postalCode) && (
                  <p>
                    {user.postalCode} {user.city}
                  </p>
                )}
                {user.country && <p>{user.country}</p>}
              </div>
            </div>
          </div>
        )}

        {(user.company || user.position) && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">Entreprise</h4>
            {user.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{user.company}</span>
              </div>
            )}
            {user.position && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{user.position}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 