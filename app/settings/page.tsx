import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, User, Lock, Globe, Cloud, Mail } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez votre compte et les préférences de l'application
          </p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Profil utilisateur</CardTitle>
            </div>
            <CardDescription>Informations personnelles et paramètres du compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-2xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-foreground text-lg mb-1">Jean Dupont</div>
                <div className="text-sm text-muted-foreground mb-2">
                  jean.dupont@idf-construction.fr
                </div>
                <Button variant="outline" size="sm">Modifier la photo</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Prénom</label>
                <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                  Jean
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nom</label>
                <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                  Dupont
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                  jean.dupont@idf-construction.fr
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Téléphone</label>
                <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                  +33 6 12 34 56 78
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Enregistrer les modifications</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Sécurité</CardTitle>
            </div>
            <CardDescription>Mot de passe et authentification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium text-foreground mb-1">Mot de passe</div>
                <div className="text-sm text-muted-foreground">
                  Dernière modification il y a 3 mois
                </div>
              </div>
              <Button variant="outline">Modifier</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium text-foreground mb-1">
                  Authentification à deux facteurs
                </div>
                <div className="text-sm text-muted-foreground">
                  Ajouter une couche de sécurité supplémentaire
                </div>
              </div>
              <Button variant="outline">Activer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Gérez vos préférences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium text-foreground mb-1">Alertes météo</div>
                <div className="text-sm text-muted-foreground">
                  Recevoir des alertes en cas de risque élevé de pluie
                </div>
              </div>
              <div className="h-6 w-11 rounded-full bg-primary relative">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium text-foreground mb-1">
                  Rappels d'intervention
                </div>
                <div className="text-sm text-muted-foreground">
                  Notifications 24h avant chaque intervention
                </div>
              </div>
              <div className="h-6 w-11 rounded-full bg-primary relative">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium text-foreground mb-1">Notifications email</div>
                <div className="text-sm text-muted-foreground">
                  Résumé quotidien des interventions par email
                </div>
              </div>
              <div className="h-6 w-11 rounded-full bg-border relative">
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Paramètres météo</CardTitle>
            </div>
            <CardDescription>Configuration des alertes météorologiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Seuil d'alerte pluie (%)
              </label>
              <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                50%
              </div>
              <p className="text-xs text-muted-foreground">
                Alertes déclenchées si probabilité de pluie supérieure à ce seuil
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Zone géographique
              </label>
              <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                Île-de-France
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Langue et région</CardTitle>
            </div>
            <CardDescription>Préférences de localisation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Langue</label>
                <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                  Français
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fuseau horaire</label>
                <div className="rounded-md border bg-background px-3 py-2 text-foreground">
                  Europe/Paris (GMT+1)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
