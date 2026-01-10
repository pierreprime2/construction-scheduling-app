'use client'

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CloudRain, AlertTriangle, Calendar, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect } from "react"

interface ApiIntervention {
  id: number
  title: string
  date: string
  time: string
  location: string
  type: string
  status: string
  rainProbability: number | null
  client: string // IRI like "/api/clients/1"
  technician: string // IRI like "/api/technicians/1"
}

interface Client {
  id: number
  name: string
}

interface Technician {
  id: number
  name: string
}

interface DashboardStats {
  interventionsThisWeek: number
  weatherRiskInterventions: number
  confirmedInterventions: number
  activeTechnicians: number
}

// Extract ID from API Platform IRI (e.g., "/api/clients/1" -> 1)
function extractIdFromIri(iri: string): number | null {
  if (!iri) return null
  const match = iri.match(/\/(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

// Format time from ISO string (e.g., "1970-01-01T09:00:00+00:00" -> "09:00")
function formatTime(timeString: string): string {
  if (!timeString) return '-'
  try {
    const date = new Date(timeString)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return timeString
  }
}

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [interventions, setInterventions] = useState<ApiIntervention[]>([])
  const [clients, setClients] = useState<Map<number, Client>>(new Map())
  const [technicians, setTechnicians] = useState<Map<number, Technician>>(new Map())
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 5

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [statsRes, interventionsRes, clientsRes, techniciansRes] = await Promise.all([
          fetch('/api/backend/dashboard/stats'),
          fetch('/api/backend/interventions'),
          fetch('/api/backend/clients'),
          fetch('/api/backend/technicians')
        ])

        if (!interventionsRes.ok) {
          throw new Error('Erreur lors du chargement des interventions')
        }

        // Stats endpoint might not exist yet, so we handle it gracefully
        let statsData = null
        if (statsRes.ok) {
          statsData = await statsRes.json()
        }

        const interventionsData = await interventionsRes.json()
        const clientsData = await clientsRes.json()
        const techniciansData = await techniciansRes.json()

        setStats(statsData)

        // API Platform returns hydra format with member array
        const interventionsList = interventionsData['hydra:member'] || interventionsData.member || interventionsData
        setInterventions(Array.isArray(interventionsList) ? interventionsList : [])

        // Build lookup maps for clients
        const clientsList = clientsData['hydra:member'] || clientsData.member || clientsData
        const clientsMap = new Map<number, Client>()
        if (Array.isArray(clientsList)) {
          clientsList.forEach((c: Client) => clientsMap.set(c.id, c))
        }
        setClients(clientsMap)

        // Build lookup maps for technicians
        const techniciansList = techniciansData['hydra:member'] || techniciansData.member || techniciansData
        const techniciansMap = new Map<number, Technician>()
        if (Array.isArray(techniciansList)) {
          techniciansList.forEach((t: Technician) => techniciansMap.set(t.id, t))
        }
        setTechnicians(techniciansMap)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Get client name from IRI
  function getClientName(iri: string): string {
    const id = extractIdFromIri(iri)
    if (!id) return '-'
    return clients.get(id)?.name || '-'
  }

  // Get technician name from IRI
  function getTechnicianName(iri: string): string {
    const id = extractIdFromIri(iri)
    if (!id) return '-'
    return technicians.get(id)?.name || '-'
  }

  // Filter upcoming interventions (status not 'Terminée')
  const upcomingInterventions = interventions.filter(
    i => i.status !== 'Terminée'
  )

  const totalPages = Math.ceil(upcomingInterventions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInterventions = upcomingInterventions.slice(startIndex, endIndex)

  // Count at-risk interventions
  const atRiskCount = upcomingInterventions.filter(
    i => (i.rainProbability || 0) > 50
  ).length

  const statsDisplay = stats ? [
    { label: "Interventions cette semaine", value: String(stats.interventionsThisWeek), icon: Calendar },
    { label: "À risque météo", value: String(stats.weatherRiskInterventions), icon: AlertTriangle },
    { label: "Confirmées", value: String(stats.confirmedInterventions), icon: CheckCircle },
    { label: "Techniciens actifs", value: String(stats.activeTechnicians), icon: CheckCircle },
  ] : [
    { label: "Interventions à venir", value: String(upcomingInterventions.length), icon: Calendar },
    { label: "À risque météo", value: String(atRiskCount), icon: AlertTriangle },
    { label: "Confirmées", value: String(upcomingInterventions.filter(i => i.status === 'Confirmée').length), icon: CheckCircle },
    { label: "Techniciens", value: String(technicians.size), icon: CheckCircle },
  ]

  function getInterventionStatus(intervention: ApiIntervention): string {
    const rainProb = intervention.rainProbability || 0
    if (rainProb > 50) return "À risque"
    if (rainProb > 30) return "À surveiller"
    return "Confirmé"
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-7xl p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement du tableau de bord...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-7xl p-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Erreur</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

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
          {statsDisplay.map((stat, index) => (
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
        {atRiskCount > 0 && (
          <Card className="border-warning bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-foreground" />
                <CardTitle className="text-warning-foreground">Alertes météo</CardTitle>
              </div>
              <CardDescription>
                {atRiskCount} intervention{atRiskCount > 1 ? 's' : ''} nécessite{atRiskCount > 1 ? 'nt' : ''} une attention particulière en raison de risques de pluie
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Upcoming Interventions */}
        <Card>
          <CardHeader>
            <CardTitle>Interventions à venir</CardTitle>
            <CardDescription>Prochaines interventions avec indicateurs météo</CardDescription>
          </CardHeader>
          <CardContent>
            {currentInterventions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucune intervention à venir
              </p>
            ) : (
              <div className="space-y-3">
                {currentInterventions.map((intervention) => {
                  const rainProb = intervention.rainProbability || 0
                  const displayStatus = getInterventionStatus(intervention)

                  return (
                    <Link
                      key={intervention.id}
                      href={`/interventions/${intervention.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-secondary/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{intervention.title}</h3>
                            {rainProb > 50 ? (
                              <Badge variant="destructive" className="gap-1">
                                <CloudRain className="h-3 w-3" />
                                {rainProb}% pluie
                              </Badge>
                            ) : rainProb > 30 ? (
                              <Badge variant="outline" className="gap-1 border-warning text-warning-foreground">
                                <CloudRain className="h-3 w-3" />
                                {rainProb}% pluie
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                {rainProb}% pluie
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Client:</span> {getClientName(intervention.client)}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {new Date(intervention.date).toLocaleDateString('fr-FR')} à {formatTime(intervention.time)}
                            </div>
                            <div>
                              <span className="font-medium">Lieu:</span> {intervention.location}
                            </div>
                            <div>
                              <span className="font-medium">Technicien:</span> {getTechnicianName(intervention.technician)}
                            </div>
                          </div>
                        </div>
                        <div>
                          {displayStatus === "À risque" ? (
                            <Badge variant="destructive">{displayStatus}</Badge>
                          ) : displayStatus === "À surveiller" ? (
                            <Badge variant="outline" className="border-warning text-warning-foreground">
                              {displayStatus}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">{displayStatus}</Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

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
