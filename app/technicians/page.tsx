'use client'

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, MapPin, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Technician {
  id: number
  name: string
  role: string
  phone: string
  email: string
  location: string
  status: string
  specialties: string[]
}

// Generate initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export default function TechniciansPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchTechnicians() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/backend/technicians')

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des techniciens')
        }

        const data = await response.json()

        // API Platform returns hydra format with member array
        const techniciansList = data['hydra:member'] || data.member || data
        setTechnicians(Array.isArray(techniciansList) ? techniciansList : [])
      } catch (err) {
        console.error('Technicians fetch error:', err)
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  const totalPages = Math.ceil(technicians.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTechnicians = technicians.slice(startIndex, endIndex)

  const activeTechniciansCount = technicians.filter(t => t.status === 'Disponible').length

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement des techniciens...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl p-4">
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
    <AppLayout onCreateTechnician={() => setShowCreateModal(true)}>
      <div className="mx-auto max-w-5xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Techniciens</h1>
            <p className="text-sm text-muted-foreground">
              Gestion de l'équipe et disponibilités
            </p>
          </div>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>Ajouter</Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total techniciens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">{technicians.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">{activeTechniciansCount}</span>
            </CardContent>
          </Card>
        </div>

        {/* Technicians List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Liste des techniciens</CardTitle>
            <CardDescription className="text-xs">Vue d'ensemble de l'équipe et spécialités</CardDescription>
          </CardHeader>
          <CardContent>
            {currentTechnicians.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun technicien trouvé
              </p>
            ) : (
              <div className="space-y-3">
                {currentTechnicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="rounded-lg border bg-card p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                            {getInitials(tech.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground mb-1 truncate">{tech.name}</div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">{tech.role}</span>
                            {tech.status === "Disponible" ? (
                              <Badge variant="secondary" className="text-xs">Disponible</Badge>
                            ) : tech.status === "En intervention" ? (
                              <Badge variant="default" className="text-xs">En intervention</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">{tech.status}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">Détails</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{tech.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{tech.email}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{tech.location}</span>
                        </div>
                      </div>
                    </div>

                    {tech.specialties && tech.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1 border-t">
                        {tech.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {tech.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tech.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-xs text-muted-foreground">
                  Page {currentPage}/{totalPages}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page
                      if (totalPages <= 5) {
                        page = i + 1
                      } else if (currentPage <= 3) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i
                      } else {
                        page = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold text-foreground">Nouveau technicien</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Ex: Jean Dupont" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input id="role" placeholder="Ex: Technicien, Chef d'équipe" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input id="location" placeholder="Ex: Paris" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="prenom.nom@cogit.fr" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                <Input id="specialties" placeholder="Ex: Toiture, Façade, Étanchéité" />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  Créer le technicien
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
