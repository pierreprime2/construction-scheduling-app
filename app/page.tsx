'use client'

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CloudRain, AlertTriangle, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const upcomingInterventions = [
    {
      id: 1,
      title: "Rénovation façade - Immeuble Haussmann",
      client: "Syndic Paris 8ème",
      date: "2025-01-20",
      time: "09:00",
      location: "75008 Paris",
      technician: "Marc Dubois",
      rainProbability: 75,
      status: "À risque",
    },
    {
      id: 2,
      title: "Installation toiture - Villa",
      client: "M. Laurent",
      date: "2025-01-21",
      time: "08:30",
      location: "92100 Boulogne-Billancourt",
      technician: "Sophie Martin",
      rainProbability: 20,
      status: "Confirmé",
    },
    {
      id: 3,
      title: "Étanchéité terrasse",
      client: "Résidence Les Pins",
      date: "2025-01-22",
      time: "10:00",
      location: "94200 Ivry-sur-Seine",
      technician: "Ahmed Benali",
      rainProbability: 5,
      status: "Confirmé",
    },
    {
      id: 4,
      title: "Peinture extérieure - Bureaux",
      client: "ABC Entreprises",
      date: "2025-01-23",
      time: "07:00",
      location: "78000 Versailles",
      technician: "Julie Petit",
      rainProbability: 45,
      status: "À surveiller",
    },
    {
      id: 5,
      title: "Réparation gouttières",
      client: "Copropriété Montmartre",
      date: "2025-01-24",
      time: "09:30",
      location: "75018 Paris",
      technician: "Marc Dubois",
      rainProbability: 60,
      status: "À risque",
    },
    {
      id: 6,
      title: "Isolation toiture",
      client: "Mme Rousseau",
      date: "2025-01-25",
      time: "08:00",
      location: "91000 Évry",
      technician: "Thomas Bernard",
      rainProbability: 15,
      status: "Confirmé",
    },
    {
      id: 7,
      title: "Ravalement façade",
      client: "SCI Les Lilas",
      date: "2025-01-26",
      time: "07:30",
      location: "93260 Les Lilas",
      technician: "Sophie Martin",
      rainProbability: 35,
      status: "À surveiller",
    },
    {
      id: 8,
      title: "Pose de velux",
      client: "M. Dupont",
      date: "2025-01-27",
      time: "10:00",
      location: "92200 Neuilly-sur-Seine",
      technician: "Ahmed Benali",
      rainProbability: 10,
      status: "Confirmé",
    },
    {
      id: 9,
      title: "Nettoyage façade",
      client: "Mairie d'Antony",
      date: "2025-01-28",
      time: "08:30",
      location: "92160 Antony",
      technician: "Julie Petit",
      rainProbability: 80,
      status: "À risque",
    },
    {
      id: 10,
      title: "Installation charpente",
      client: "Construction Delta",
      date: "2025-01-29",
      time: "07:00",
      location: "77000 Melun",
      technician: "Pierre Moreau",
      rainProbability: 25,
      status: "Confirmé",
    },
    {
      id: 11,
      title: "Réfection toiture",
      client: "Syndic Versailles",
      date: "2025-01-30",
      time: "09:00",
      location: "78000 Versailles",
      technician: "Marc Dubois",
      rainProbability: 40,
      status: "À surveiller",
    },
    {
      id: 12,
      title: "Peinture extérieure",
      client: "M. Lefebvre",
      date: "2025-01-31",
      time: "08:00",
      location: "95000 Cergy",
      technician: "Thomas Bernard",
      rainProbability: 5,
      status: "Confirmé",
    },
  ]

  const totalPages = Math.ceil(upcomingInterventions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInterventions = upcomingInterventions.slice(startIndex, endIndex)

  const stats = [
    { label: "Interventions cette semaine", value: "12", icon: Calendar },
    { label: "À risque météo", value: "3", icon: AlertTriangle },
    { label: "Confirmées", value: "9", icon: CheckCircle },
    { label: "Techniciens actifs", value: "8", icon: CheckCircle },
  ]

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de vos interventions et alertes météo
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-semibold text-foreground">{stat.value}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weather Risk Alert */}
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-foreground" />
              <CardTitle className="text-warning-foreground">Alertes météo</CardTitle>
            </div>
            <CardDescription>
              3 interventions nécessitent une attention particulière en raison de risques de pluie
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Upcoming Interventions */}
        <Card>
          <CardHeader>
            <CardTitle>Interventions à venir</CardTitle>
            <CardDescription>Prochaines interventions avec indicateurs météo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentInterventions.map((intervention) => (
                <Link
                  key={intervention.id}
                  href={`/interventions/${intervention.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-secondary/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{intervention.title}</h3>
                        {intervention.rainProbability > 50 ? (
                          <Badge variant="destructive" className="gap-1">
                            <CloudRain className="h-3 w-3" />
                            {intervention.rainProbability}% pluie
                          </Badge>
                        ) : intervention.rainProbability > 30 ? (
                          <Badge variant="outline" className="gap-1 border-warning text-warning-foreground">
                            <CloudRain className="h-3 w-3" />
                            {intervention.rainProbability}% pluie
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            {intervention.rainProbability}% pluie
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Client:</span> {intervention.client}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(intervention.date).toLocaleDateString('fr-FR')} à {intervention.time}
                        </div>
                        <div>
                          <span className="font-medium">Lieu:</span> {intervention.location}
                        </div>
                        <div>
                          <span className="font-medium">Technicien:</span> {intervention.technician}
                        </div>
                      </div>
                    </div>
                    <div>
                      {intervention.status === "À risque" ? (
                        <Badge variant="destructive">{intervention.status}</Badge>
                      ) : intervention.status === "À surveiller" ? (
                        <Badge variant="outline" className="border-warning text-warning-foreground">
                          {intervention.status}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{intervention.status}</Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[2rem]"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
