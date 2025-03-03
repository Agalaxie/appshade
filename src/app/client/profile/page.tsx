"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApi } from "@/hooks/use-api";
import { User } from "@/types";
import { ClientSidebar } from '@/components/client-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import { MapPin, Search, CheckCircle, Copy, Bitcoin, CreditCard, BanknoteIcon, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PayPalCheckoutButton } from '@/components/paypal-button';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  company: z.string().optional(),
  position: z.string().optional(),
  phoneNumber: z.string().optional()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Veuillez entrer un numéro de téléphone valide",
    }),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional()
    .refine((val) => !val || /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/.test(val), {
      message: "Veuillez entrer un code postal français valide (5 chiffres)",
    }),
  country: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressData, setAddressData] = useState<Array<any>>([]);
  
  // Récupérer les informations du profil
  const { data: profile, loading, error, refetch } = useApi<User>('/api/user/profile');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      position: "",
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });
  
  // Mettre à jour les valeurs du formulaire lorsque les données du profil sont chargées
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        company: profile.company || "",
        position: profile.position || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        city: profile.city || "",
        postalCode: profile.postalCode || "",
        country: profile.country || "",
      });
    }
  }, [profile, form]);

  // Fonction pour récupérer des suggestions d'adresses réelles via l'API Adresse
  const handleAddressChange = async (value: string) => {
    form.setValue('address', value);
    
    if (value.length > 3) {
      try {
        // Appel à l'API Adresse du gouvernement français
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          // Extraire les adresses des résultats
          const suggestions = data.features.map((feature: any) => feature.properties.label);
          setAddressSuggestions(suggestions);
          // Stocker les données complètes pour un usage ultérieur
          setAddressData(data.features);
          setShowSuggestions(true);
        } else {
          setAddressSuggestions([]);
          setAddressData([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des suggestions d'adresses:", error);
        // En cas d'erreur, revenir aux suggestions fictives
        const fakeSuggestions = [
          value + ", Rue de Paris",
          value + ", Avenue des Champs-Élysées",
          value + ", Boulevard Haussmann",
        ];
        setAddressSuggestions(fakeSuggestions);
        setAddressData([]);
        setShowSuggestions(true);
      }
    } else {
      setAddressSuggestions([]);
      setAddressData([]);
      setShowSuggestions(false);
    }
  };

  const selectAddress = (address: string, index: number) => {
    form.setValue('address', address);
    setShowSuggestions(false);
    
    // Si nous avons des données d'adresse complètes, remplir les autres champs
    if (addressData.length > 0 && addressData[index]) {
      const selectedAddress = addressData[index].properties;
      
      if (selectedAddress.postcode) {
        form.setValue('postalCode', selectedAddress.postcode);
      }
      
      if (selectedAddress.city) {
        form.setValue('city', selectedAddress.city);
      }
      
      toast({
        title: "Adresse sélectionnée",
        description: "Les informations d'adresse ont été automatiquement renseignées.",
        variant: "default",
      });
    }
  };

  // Fonction pour récupérer la ville correspondant à un code postal via l'API
  const handlePostalCodeChange = async (value: string) => {
    form.setValue('postalCode', value);
    
    // Vérifier si le code postal est valide (format français)
    if (/^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/.test(value)) {
      try {
        // Appel à l'API Adresse pour récupérer les informations sur le code postal
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}&type=municipality&limit=1`);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const cityName = data.features[0].properties.city;
          form.setValue('city', cityName);
          toast({
            title: "Ville détectée",
            description: `La ville ${cityName} a été automatiquement renseignée.`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la ville:", error);
        // En cas d'erreur, on ne fait rien et on laisse l'utilisateur remplir le champ
      }
    }
  };

  // Fonction pour copier dans le presse-papier
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copié !",
        description: description,
        variant: "default",
      });
    }).catch(err => {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    });
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      // Rafraîchir les données du profil
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-lg border border-gray-300 dark:border-gray-700">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold">Informations personnelles</CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              Complétez votre profil pour nous permettre de mieux vous connaître et vous aider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de votre entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poste</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre poste dans l'entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <PhoneInput
                            international
                            defaultCountry="FR"
                            placeholder="Entrez votre numéro de téléphone"
                            value={field.value}
                            onChange={field.onChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </FormControl>
                        <FormDescription>
                          Inclure l'indicatif international (ex: +33 pour la France)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Adresse</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Votre adresse" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleAddressChange(e.target.value);
                              }}
                              className="pl-10"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <MapPin size={16} />
                            </div>
                            {showSuggestions && addressSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg dark:border-gray-700">
                                <div className="px-4 py-2 text-sm text-muted-foreground border-b dark:border-gray-700">
                                  <Search size={14} className="inline mr-2" />
                                  Suggestions d'adresses
                                </div>
                                {addressSuggestions.map((suggestion, index) => (
                                  <div 
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-accent flex items-center"
                                    onClick={() => selectAddress(suggestion, index)}
                                  >
                                    <MapPin size={16} className="mr-2 text-muted-foreground flex-shrink-0" />
                                    <span className="flex-grow">{suggestion}</span>
                                    <CheckCircle size={16} className="ml-2 text-primary opacity-0 group-hover:opacity-100 flex-shrink-0" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Commencez à taper pour voir des suggestions d'adresses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Code postal" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handlePostalCodeChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Ville" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <Input placeholder="Pays" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Nouveau bloc de paiement */}
        <Card className="shadow-md rounded-lg border border-gray-300 dark:border-gray-700">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold">Informations de paiement</CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              Gérez vos options de paiement et effectuez des versements pour vos services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bitcoin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bitcoin" className="flex items-center gap-2">
                  <Bitcoin size={16} />
                  <span>Bitcoin</span>
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>PayPal</span>
                </TabsTrigger>
                <TabsTrigger value="virement" className="flex items-center gap-2">
                  <BanknoteIcon size={16} />
                  <span>Virement</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="bitcoin" className="mt-4 space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Adresse Bitcoin</h3>
                  <div className="flex items-center gap-2 p-3 bg-background rounded border">
                    <code className="text-sm flex-1 overflow-x-auto">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyToClipboard("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "Adresse Bitcoin copiée dans le presse-papier")}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Envoyez vos paiements à cette adresse Bitcoin. Le paiement sera automatiquement crédité sur votre compte.
                  </p>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Vérifiez toujours l'adresse avant d'envoyer des fonds. Les transactions Bitcoin sont irréversibles.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Historique des transactions</h4>
                  <div className="text-sm text-muted-foreground italic">
                    Aucune transaction récente
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="paypal" className="mt-4 space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Paiement PayPal</h3>
                  <p className="text-sm mb-4">
                    Effectuez un paiement sécurisé via PayPal en utilisant le bouton ci-dessous.
                  </p>
                  
                  <div className="my-4">
                    <PayPalCheckoutButton 
                      amount="99.99" 
                      description="Paiement AppShade"
                      onSuccess={(details: any) => {
                        toast({
                          title: "Paiement réussi!",
                          description: "Votre paiement a été traité avec succès."
                        });
                        console.log("Paiement réussi:", details);
                      }}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous serez redirigé vers le site sécurisé de PayPal pour finaliser votre paiement.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Email PayPal</h4>
                  <div className="flex items-center gap-2 p-3 bg-background rounded border">
                    <code className="text-sm flex-1">neuromz@hotmail.com</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("neuromz@hotmail.com", "Email PayPal copié dans le presse-papier")}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez également envoyer directement un paiement à cette adresse email via votre compte PayPal.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="virement" className="mt-4 space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <h3 className="text-lg font-medium">Coordonnées bancaires</h3>
                  
                  <div>
                    <h4 className="text-sm font-medium">Titulaire du compte</h4>
                    <div className="flex items-center gap-2 p-2 bg-background rounded border mt-1">
                      <span className="text-sm">AppShade SAS</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-auto"
                        onClick={() => copyToClipboard("AppShade SAS", "Nom du titulaire copié dans le presse-papier")}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">IBAN</h4>
                    <div className="flex items-center gap-2 p-2 bg-background rounded border mt-1">
                      <code className="text-sm flex-1">FR76 3000 1007 1600 0000 0000 000</code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => copyToClipboard("FR76 3000 1007 1600 0000 0000 000", "IBAN copié dans le presse-papier")}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">BIC/SWIFT</h4>
                    <div className="flex items-center gap-2 p-2 bg-background rounded border mt-1">
                      <code className="text-sm">BDFEFRPPXXX</code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-auto"
                        onClick={() => copyToClipboard("BDFEFRPPXXX", "BIC/SWIFT copié dans le presse-papier")}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Banque</h4>
                    <div className="flex items-center gap-2 p-2 bg-background rounded border mt-1">
                      <span className="text-sm">Banque de France</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-auto"
                        onClick={() => copyToClipboard("Banque de France", "Nom de la banque copié dans le presse-papier")}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    Veuillez indiquer votre numéro de client ou numéro de facture en référence du virement.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <SidebarProvider defaultCollapsed={false} collapsible="expanded">
      <ClientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Mon profil</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pl-6 items-start">
          <div className="w-full max-w-7xl">
            {renderContent()}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 