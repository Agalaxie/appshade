"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation } from "@/hooks/use-api"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    required_error: "Veuillez sélectionner une priorité",
  }),
  // FTP Info
  ftpHost: z.string().optional(),
  ftpPort: z.string().optional(),
  ftpUsername: z.string().optional(),
  ftpPassword: z.string().optional(),
  // CMS Info
  cmsType: z.string().optional(),
  cmsUrl: z.string().url().optional().or(z.literal("")),
  cmsUsername: z.string().optional(),
  cmsPassword: z.string().optional(),
  // Hébergeur Info
  hostingProvider: z.string().optional(),
  hostingPlan: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NewTicketPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate, loading } = useMutation("/api/tickets")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      ftpHost: "",
      ftpPort: "21",
      ftpUsername: "",
      ftpPassword: "",
      cmsType: "",
      cmsUrl: "",
      cmsUsername: "",
      cmsPassword: "",
      hostingProvider: "",
      hostingPlan: "",
    },
  })

  async function onSubmit(data: FormValues) {
    console.log("Données du formulaire envoyées:", data);
    try {
      await mutate(data)
      toast({
        title: "Succès !",
        description: "Votre ticket a été créé avec succès.",
      })
      router.push("/client/tickets")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du ticket.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Créer un nouveau ticket</CardTitle>
          <CardDescription>
            Décrivez votre problème et fournissez les informations d'accès nécessaires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre du ticket" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre problème en détail"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choisissez la priorité de votre ticket en fonction de l'urgence de votre problème.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Informations FTP</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ftpHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hôte FTP</FormLabel>
                        <FormControl>
                          <Input placeholder="ftp.votresite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ftpPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port FTP</FormLabel>
                        <FormControl>
                          <Input placeholder="21" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ftpUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom d'utilisateur FTP</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom d'utilisateur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ftpPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe FTP</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Mot de passe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-medium">Informations CMS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cmsType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de CMS</FormLabel>
                        <FormControl>
                          <Input placeholder="WordPress, Drupal, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cmsUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL d'administration</FormLabel>
                        <FormControl>
                          <Input placeholder="https://votresite.com/admin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cmsUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom d'utilisateur CMS</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom d'utilisateur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cmsPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe CMS</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Mot de passe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-medium">Informations Hébergeur</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hostingProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'hébergeur</FormLabel>
                        <FormControl>
                          <Input placeholder="OVH, AWS, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hostingPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan d'hébergement</FormLabel>
                        <FormControl>
                          <Input placeholder="Basic, Pro, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Création..." : "Créer le ticket"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 