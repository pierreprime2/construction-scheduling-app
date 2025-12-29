"use client"

import type React from "react"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function CalendarPage() {
  const [hoveredIntervention, setHoveredIntervention] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [showDayDetailsModal, setShowDayDetailsModal] = useState(false)
  const [selectedDayInterventions, setSelectedDayInterventions] = useState<any[]>([])
  const [selectedDayDate, setSelectedDayDate] = useState<number | null>(null)
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all")

  const currentMonth = "Janvier 2025"
  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  const calendarDays = [
    // Week 1
    { date: 30, isCurrentMonth: false },
    { date: 31, isCurrentMonth: false },
    { date: 1, isCurrentMonth: true },
    { date: 2, isCurrentMonth: true },
    { date: 3, isCurrentMonth: true },
    { date: 4, isCurrentMonth: true },
    { date: 5, isCurrentMonth: true },
    // Week 2
    { date: 6, isCurrentMonth: true },
    { date: 7, isCurrentMonth: true },
    { date: 8, isCurrentMonth: true },
    { date: 9, isCurrentMonth: true },
    { date: 10, isCurrentMonth: true },
    { date: 11, isCurrentMonth: true },
    { date: 12, isCurrentMonth: true },
    // Week 3
    { date: 13, isCurrentMonth: true },
    { date: 14, isCurrentMonth: true },
    { date: 15, isCurrentMonth: true },
    { date: 16, isCurrentMonth: true },
    { date: 17, isCurrentMonth: true },
    { date: 18, isCurrentMonth: true },
    { date: 19, isCurrentMonth: true },
    // Week 4
    {
      date: 20,
      isCurrentMonth: true,
      hasIntervention: true,
      interventions: [
        {
          id: 1,
          title: "Rénovation façade",
          rainProbability: 75,
          client: "Résidence Le Marais",
          technician: "Pierre Dubois",
        },
      ],
    },
    {
      date: 21,
      isCurrentMonth: true,
      hasIntervention: true,
      interventions: [
        {
          id: 2,
          title: "Installation toiture",
          rainProbability: 20,
          client: "Mairie de Versailles",
          technician: "Marie Laurent",
        },
        {
          id: 5,
          title: "Inspection",
          rainProbability: 10,
          client: "Copropriété Saint-Germain",
          technician: "Jean Martin",
        },
      ],
    },
    {
      date: 22,
      isCurrentMonth: true,
      hasIntervention: true,
      interventions: [
        {
          id: 3,
          title: "Étanchéité terrasse",
          rainProbability: 5,
          client: "Société BTP Plus",
          technician: "Sophie Bernard",
        },
      ],
    },
    {
      date: 23,
      isCurrentMonth: true,
      hasIntervention: true,
      interventions: [
        {
          id: 4,
          title: "Peinture extérieure",
          rainProbability: 45,
          client: "Résidence Le Marais",
          technician: "Pierre Dubois",
        },
      ],
    },
    { date: 24, isCurrentMonth: true },
    { date: 25, isCurrentMonth: true },
    { date: 26, isCurrentMonth: true },
    // Week 5
    { date: 27, isCurrentMonth: true },
    {
      date: 28,
      isCurrentMonth: true,
      hasIntervention: true,
      interventions: [
        {
          id: 6,
          title: "Ravalement",
          rainProbability: 60,
          client: "Mairie de Versailles",
          technician: "Marie Laurent",
        },
      ],
    },
    { date: 29, isCurrentMonth: true },
    { date: 30, isCurrentMonth: true },
    { date: 31, isCurrentMonth: true },
    { date: 1, isCurrentMonth: false },
    { date: 2, isCurrentMonth: false },
  ]

  const handleInterventionCountClick = (interventions: any[], date: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDayInterventions(interventions)
    setSelectedDayDate(date)
    setShowDayDetailsModal(true)
  }

  const handleDayClick = (date: number, isCurrentMonth: boolean, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".intervention-count")) {
      return
    }
    if (isCurrentMonth) {
      setSelectedDate(date)
      setShowCreateModal(true)
    }
  }

  const handleCreateFromMenu = () => {
    setSelectedDate(null)
    setShowCreateModal(true)
  }

  return (
    <AppLayout onCreateIntervention={handleCreateFromMenu}>
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Calendrier</h1>
          <p className="text-muted-foreground">Planification mensuelle avec indicateurs météo</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{currentMonth}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Aujourd'hui
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <label className="text-sm font-medium text-muted-foreground">Filtrer par technicien:</label>
              <select
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="all">Tous les techniciens</option>
                <option value="Pierre Dubois">Pierre Dubois</option>
                <option value="Marie Laurent">Marie Laurent</option>
                <option value="Jean Martin">Jean Martin</option>
                <option value="Sophie Bernard">Sophie Bernard</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={(e) => handleDayClick(day.date, day.isCurrentMonth, e)}
                  className={`min-h-[120px] rounded-md border p-2 ${
                    day.isCurrentMonth ? "bg-card cursor-pointer hover:bg-accent/50" : "bg-muted/30"
                  } ${day.hasIntervention ? "border-primary" : ""} transition-colors`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {day.date}
                  </div>
                  {day.hasIntervention && day.interventions && (
                    <div
                      className="intervention-count flex items-center justify-center h-16 cursor-pointer group"
                      onClick={(e) => handleInterventionCountClick(day.interventions, day.date, e)}
                    >
                      <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <span className="text-2xl font-bold text-primary">{day.interventions.length}</span>
                        <span className="text-xs text-muted-foreground">
                          {day.interventions.length === 1 ? "intervention" : "interventions"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Légende</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">&gt; 50% risque élevé</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-warning-foreground" />
                <span className="text-sm text-muted-foreground">30-50% risque modéré</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">&lt; 30% risque faible</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showDayDetailsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowDayDetailsModal(false)}
        >
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Interventions du {selectedDayDate} {currentMonth}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDayDetailsModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {selectedDayInterventions.length} intervention{selectedDayInterventions.length > 1 ? "s" : ""} planifiée
                {selectedDayInterventions.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDayInterventions.map((intervention) => (
                <Link
                  key={intervention.id}
                  href={`/interventions/${intervention.id}`}
                  className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-2">{intervention.title}</h3>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div>Client: {intervention.client}</div>
                        <div>Technicien: {intervention.technician}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {intervention.rainProbability > 50 ? (
                        <CloudRain className="h-4 w-4 text-destructive" />
                      ) : intervention.rainProbability > 30 ? (
                        <CloudRain className="h-4 w-4 text-warning-foreground" />
                      ) : (
                        <CloudRain className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs font-medium">{intervention.rainProbability}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedDate ? `Nouvelle intervention - ${selectedDate} ${currentMonth}` : `Nouvelle intervention`}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Créer une nouvelle intervention {selectedDate ? "pour cette date" : ""}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de l'intervention</label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Titre de l'intervention</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Ex: Rénovation façade"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de début</label>
                  <input
                    type="time"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="08:00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée (heures)</label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Sélectionner un client</option>
                  <option>Résidence Le Marais</option>
                  <option>Mairie de Versailles</option>
                  <option>Société BTP Plus</option>
                  <option>Copropriété Saint-Germain</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Technicien assigné</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Sélectionner un technicien</option>
                  <option>Pierre Dubois</option>
                  <option>Marie Laurent</option>
                  <option>Jean Martin</option>
                  <option>Sophie Bernard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'intervention</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Sélectionner un type</option>
                  <option>Toiture</option>
                  <option>Façade</option>
                  <option>Étanchéité</option>
                  <option>Peinture extérieure</option>
                  <option>Inspection</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                  placeholder="Détails de l'intervention..."
                />
              </div>

              <div className="bg-muted/50 rounded-md p-4 border border-border">
                <div className="flex items-start gap-3">
                  <CloudRain className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">Prévision météo</div>
                    <div className="text-sm text-muted-foreground">
                      Les prévisions météo seront disponibles une fois l'intervention créée.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Créer l'intervention
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  )
}
