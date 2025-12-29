import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CloudRain, MapPin, Calendar, Clock, User, Briefcase, FileText, AlertTriangle } from 'lucide-react'
import Link from "next/link"

export default function InterventionDetailsPage() {
  const intervention = {
    id: 1,
    title: "Rénovation façade - Immeuble Haussmann",
    client: "Syndic Paris 8ème",
    date: "2025-01-20",
    time: "09:00",
    duration: "4 heures",
    location: "45 Avenue des Champs-Élysées, 75008 Paris",
    technician: "Marc Dubois",
    technicianPhone: "+33 6 12 34 56 78",
    rainProbability: 75,
    status: "À risque",
    description: "Rénovation complète de la façade d'un immeuble haussmannien nécessitant des travaux d'échafaudage et de peinture extérieure. Travaux sensibles aux conditions météorologiques.",
    materials: [
      "Échafaudage complet",
      "Peinture extérieure (100L)",
      "Équipement de sécurité",
      "Bâches de protection"
    ],
    notes: "Client souhaite terminer avant fin janvier. Possibilité de reporter au 27/01 en cas de mauvais temps."
  }

  const weatherForecast = [
    { day: "Lun 20", temp: "8°C", rain: 75, condition: "Pluie modérée" },
    { day: "Mar 21", temp: "10°C", rain: 20, condition: "Nuageux" },
    { day: "Mer 22", temp: "12°C", rain: 5, condition: "Ensoleillé" },
    { day: "Jeu 23", temp: "9°C", rain: 45, condition: "Averses" },
    { day: "Ven 24", temp: "11°C", rain: 15, condition: "Nuageux" },
  ]

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">{intervention.title}</h1>
            <p className="text-muted-foreground">Détails de l'intervention et recommandations météo</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Reporter</Button>
            <Button>Confirmer</Button>
          </div>
        </div>

        {/* Weather Alert */}
        {intervention.rainProbability > 50 && (
          <Card className="border-destructive bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Alerte météo - Risque élevé</CardTitle>
              </div>
              <CardDescription>
                Probabilité de pluie de {intervention.rainProbability}% prévue pour cette intervention. 
                Il est recommandé de reporter cette intervention à une date plus favorable.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Date et heure</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(intervention.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à {intervention.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Durée estimée</div>
                    <div className="text-sm text-muted-foreground">{intervention.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Lieu</div>
                    <div className="text-sm text-muted-foreground">{intervention.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Technicien assigné</div>
                    <div className="text-sm text-muted-foreground">
                      {intervention.technician} - {intervention.technicianPhone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Client</div>
                    <div className="text-sm text-muted-foreground">{intervention.client}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{intervention.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matériel requis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {intervention.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {material}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{intervention.notes}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="destructive" className="w-full justify-center py-2">
                  {intervention.status}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Météo prévue</CardTitle>
                <CardDescription>Prévisions sur 5 jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherForecast.map((day, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${
                        index === 0 && day.rain > 50 ? 'border-destructive bg-destructive/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{day.day}</span>
                        <span className="text-sm text-muted-foreground">{day.temp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudRain className={`h-4 w-4 ${
                          day.rain > 50 ? 'text-destructive' : 
                          day.rain > 30 ? 'text-warning-foreground' : 
                          'text-muted-foreground'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{day.condition}</span>
                            <span className={`font-medium ${
                              day.rain > 50 ? 'text-destructive' : 
                              day.rain > 30 ? 'text-warning-foreground' : 
                              'text-muted-foreground'
                            }`}>
                              {day.rain}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternatives suggérées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg border bg-card p-3">
                    <div className="font-medium text-foreground mb-1">Mercredi 22/01</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CloudRain className="h-3 w-3" />
                      <span>5% pluie - Conditions idéales</span>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <div className="font-medium text-foreground mb-1">Vendredi 24/01</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CloudRain className="h-3 w-3" />
                      <span>15% pluie - Bonnes conditions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
