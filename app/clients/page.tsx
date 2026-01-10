"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface Client {
  id: number
  name: string
  type: string
  phone: string
  email: string
  address: string
  status: string
}

export default function ClientsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const clientsPerPage = 10

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/backend/clients')

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des clients')
        }

        const data = await response.json()

        // API Platform returns hydra format with member array
        const clientsList = data['hydra:member'] || data.member || data
        setClients(Array.isArray(clientsList) ? clientsList : [])
      } catch (err) {
        console.error('Clients fetch error:', err)
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const totalPages = Math.ceil(clients.length / clientsPerPage)
  const startIndex = (currentPage - 1) * clientsPerPage
  const endIndex = startIndex + clientsPerPage
  const currentClients = clients.slice(startIndex, endIndex)

  const activeClientsCount = clients.filter(c => c.status === 'Actif').length

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement des clients...</p>
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
    <AppLayout>
      <div className="mx-auto max-w-5xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Clients</h1>
            <p className="text-sm text-muted-foreground">Liste des clients et informations de contact</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total clients</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">{clients.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Clients actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">{activeClientsCount}</span>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Liste des clients</CardTitle>
            <CardDescription className="text-xs">Clients actifs et informations</CardDescription>
          </CardHeader>
          <CardContent>
            {currentClients.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun client trouvé
              </p>
            ) : (
              <div className="space-y-3">
                {currentClients.map((client) => (
                  <div key={client.id} className="rounded-lg border bg-card p-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <Building2 className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground mb-1 truncate">{client.name}</div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {client.type}
                            </Badge>
                            {client.status === "Actif" ? (
                              <Badge variant="secondary" className="text-xs">
                                Actif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Inactif
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                        Détails
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs pt-1 border-t">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                      <span className="text-muted-foreground line-clamp-1">{client.address}</span>
                    </div>
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
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
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
                          variant={page === currentPage ? "default" : "outline"}
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
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    </AppLayout>
  )
}
