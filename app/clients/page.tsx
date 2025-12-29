"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Phone, Mail, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ClientsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const clientsPerPage = 10

  const allClients = [
    {
      id: 1,
      name: "Syndic Paris 8ème",
      type: "Syndic",
      phone: "+33 1 42 56 78 90",
      email: "contact@syndicparis8.fr",
      address: "45 Avenue des Champs-Élysées, 75008 Paris",
      interventions: 12,
      lastIntervention: "15/01/2025",
      nextIntervention: "20/01/2025 - Rénovation façade",
      status: "Actif",
    },
    {
      id: 2,
      name: "M. Laurent",
      type: "Particulier",
      phone: "+33 6 78 90 12 34",
      email: "laurent.philippe@email.fr",
      address: "78 Rue de la Paix, 92100 Boulogne-Billancourt",
      interventions: 3,
      lastIntervention: "10/12/2024",
      nextIntervention: "21/01/2025 - Installation toiture",
      status: "Actif",
    },
    {
      id: 3,
      name: "Résidence Les Pins",
      type: "Copropriété",
      phone: "+33 1 49 60 12 34",
      email: "residence.lespins@copro.fr",
      address: "12 Avenue des Pins, 94200 Ivry-sur-Seine",
      interventions: 8,
      lastIntervention: "20/12/2024",
      nextIntervention: "22/01/2025 - Étanchéité terrasse",
      status: "Actif",
    },
    {
      id: 4,
      name: "ABC Entreprises",
      type: "Entreprise",
      phone: "+33 1 39 50 12 34",
      email: "maintenance@abc-entreprises.fr",
      address: "5 Boulevard de la Reine, 78000 Versailles",
      interventions: 15,
      lastIntervention: "18/01/2025",
      nextIntervention: "23/01/2025 - Peinture extérieure",
      status: "Actif",
    },
    {
      id: 5,
      name: "Mairie de Montreuil",
      type: "Collectivité",
      phone: "+33 1 48 70 60 00",
      email: "services.techniques@montreuil.fr",
      address: "Place Jean Jaurès, 93100 Montreuil",
      interventions: 24,
      lastIntervention: "12/01/2025",
      nextIntervention: "27/01/2025 - Ravalement bâtiment municipal",
      status: "Actif",
    },
    {
      id: 6,
      name: "Mme Dubois",
      type: "Particulier",
      phone: "+33 6 12 34 56 78",
      email: "marie.dubois@email.fr",
      address: "34 Rue de la Mairie, 91000 Évry",
      interventions: 1,
      lastIntervention: "05/11/2024",
      nextIntervention: "-",
      status: "Inactif",
    },
    {
      id: 7,
      name: "Copropriété Saint-Germain",
      type: "Copropriété",
      phone: "+33 1 45 67 89 01",
      email: "copro.stgermain@gmail.com",
      address: "89 Rue Saint-Germain, 75006 Paris",
      interventions: 6,
      lastIntervention: "08/01/2025",
      nextIntervention: "25/01/2025 - Nettoyage façade",
      status: "Actif",
    },
    {
      id: 8,
      name: "M. Bernard",
      type: "Particulier",
      phone: "+33 6 45 67 89 12",
      email: "jbernard@email.fr",
      address: "23 Avenue Foch, 94100 Saint-Maur-des-Fossés",
      interventions: 2,
      lastIntervention: "30/12/2024",
      nextIntervention: "28/01/2025 - Réparation gouttières",
      status: "Actif",
    },
    {
      id: 9,
      name: "SCI Les Jardins",
      type: "Entreprise",
      phone: "+33 1 60 12 34 56",
      email: "contact@sci-jardins.fr",
      address: "15 Rue des Lilas, 77100 Meaux",
      interventions: 10,
      lastIntervention: "17/01/2025",
      nextIntervention: "02/02/2025 - Isolation toiture",
      status: "Actif",
    },
    {
      id: 10,
      name: "Lycée Jean Moulin",
      type: "Collectivité",
      phone: "+33 1 69 34 56 78",
      email: "intendance@lycee-moulin.fr",
      address: "45 Boulevard Jean Moulin, 91400 Orsay",
      interventions: 18,
      lastIntervention: "14/01/2025",
      nextIntervention: "05/02/2025 - Peinture préau",
      status: "Actif",
    },
    {
      id: 11,
      name: "Mme Martin",
      type: "Particulier",
      phone: "+33 6 78 12 34 56",
      email: "sophie.martin@email.fr",
      address: "67 Rue de la République, 92300 Levallois-Perret",
      interventions: 4,
      lastIntervention: "22/12/2024",
      nextIntervention: "30/01/2025 - Ravalement balcon",
      status: "Actif",
    },
    {
      id: 12,
      name: "Résidence du Parc",
      type: "Copropriété",
      phone: "+33 1 47 89 01 23",
      email: "residence.parc@copro.fr",
      address: "8 Avenue du Parc, 94300 Vincennes",
      interventions: 14,
      lastIntervention: "19/01/2025",
      nextIntervention: "08/02/2025 - Réfection étanchéité",
      status: "Actif",
    },
    {
      id: 13,
      name: "SARL Bâtiment Pro",
      type: "Entreprise",
      phone: "+33 1 34 56 78 90",
      email: "contact@batiment-pro.fr",
      address: "12 Rue de l'Industrie, 95100 Argenteuil",
      interventions: 7,
      lastIntervention: "11/01/2025",
      nextIntervention: "-",
      status: "Inactif",
    },
    {
      id: 14,
      name: "M. Petit",
      type: "Particulier",
      phone: "+33 6 23 45 67 89",
      email: "michel.petit@email.fr",
      address: "56 Rue Victor Hugo, 93200 Saint-Denis",
      interventions: 5,
      lastIntervention: "16/01/2025",
      nextIntervention: "01/02/2025 - Installation velux",
      status: "Actif",
    },
    {
      id: 15,
      name: "Mairie de Créteil",
      type: "Collectivité",
      phone: "+33 1 49 80 92 00",
      email: "urbanisme@creteil.fr",
      address: "Place Salvador Allende, 94000 Créteil",
      interventions: 22,
      lastIntervention: "20/01/2025",
      nextIntervention: "10/02/2025 - Entretien bâtiments",
      status: "Actif",
    },
    {
      id: 16,
      name: "Syndic Haussman",
      type: "Syndic",
      phone: "+33 1 53 67 89 01",
      email: "syndic.haussman@immo.fr",
      address: "112 Boulevard Haussmann, 75008 Paris",
      interventions: 16,
      lastIntervention: "13/01/2025",
      nextIntervention: "06/02/2025 - Nettoyage toiture",
      status: "Actif",
    },
    {
      id: 17,
      name: "Mme Rousseau",
      type: "Particulier",
      phone: "+33 6 89 01 23 45",
      email: "claire.rousseau@email.fr",
      address: "34 Allée des Cerisiers, 77200 Torcy",
      interventions: 2,
      lastIntervention: "28/11/2024",
      nextIntervention: "-",
      status: "Inactif",
    },
    {
      id: 18,
      name: "Copropriété Belle Vue",
      type: "Copropriété",
      phone: "+33 1 48 56 78 90",
      email: "copro.bellevue@free.fr",
      address: "25 Avenue de la Belle Vue, 92200 Neuilly-sur-Seine",
      interventions: 11,
      lastIntervention: "21/01/2025",
      nextIntervention: "12/02/2025 - Peinture hall",
      status: "Actif",
    },
    {
      id: 19,
      name: "Entreprise Dupont & Fils",
      type: "Entreprise",
      phone: "+33 1 39 45 67 89",
      email: "contact@dupont-fils.fr",
      address: "78 Rue de la Gare, 78100 Saint-Germain-en-Laye",
      interventions: 9,
      lastIntervention: "15/01/2025",
      nextIntervention: "03/02/2025 - Rénovation bureaux",
      status: "Actif",
    },
    {
      id: 20,
      name: "M. Lefèvre",
      type: "Particulier",
      phone: "+33 6 34 56 78 90",
      email: "p.lefevre@email.fr",
      address: "91 Rue de Paris, 94220 Charenton-le-Pont",
      interventions: 6,
      lastIntervention: "09/01/2025",
      nextIntervention: "29/01/2025 - Réparation cheminée",
      status: "Actif",
    },
    {
      id: 21,
      name: "Collège Pasteur",
      type: "Collectivité",
      phone: "+33 1 64 78 90 12",
      email: "gestion@college-pasteur.fr",
      address: "5 Rue Louis Pasteur, 91120 Palaiseau",
      interventions: 13,
      lastIntervention: "18/01/2025",
      nextIntervention: "15/02/2025 - Isolation combles",
      status: "Actif",
    },
    {
      id: 22,
      name: "Mme Garcia",
      type: "Particulier",
      phone: "+33 6 12 89 01 23",
      email: "ana.garcia@email.fr",
      address: "43 Avenue Mozart, 75016 Paris",
      interventions: 3,
      lastIntervention: "05/01/2025",
      nextIntervention: "26/01/2025 - Entretien toiture",
      status: "Actif",
    },
    {
      id: 23,
      name: "Résidence Les Oliviers",
      type: "Copropriété",
      phone: "+33 1 69 12 34 56",
      email: "oliviers@copro-gestion.fr",
      address: "18 Rue des Oliviers, 91000 Évry-Courcouronnes",
      interventions: 8,
      lastIntervention: "12/01/2025",
      nextIntervention: "07/02/2025 - Nettoyage façades",
      status: "Actif",
    },
    {
      id: 24,
      name: "SARL Immobilière de l'Ouest",
      type: "Entreprise",
      phone: "+33 1 30 67 89 01",
      email: "gestion@immo-ouest.fr",
      address: "56 Avenue de la Défense, 92400 Courbevoie",
      interventions: 19,
      lastIntervention: "20/01/2025",
      nextIntervention: "18/02/2025 - Entretien annuel",
      status: "Actif",
    },
    {
      id: 25,
      name: "M. Moreau",
      type: "Particulier",
      phone: "+33 6 56 78 90 12",
      email: "david.moreau@email.fr",
      address: "29 Rue de la Liberté, 93100 Montreuil",
      interventions: 1,
      lastIntervention: "03/12/2024",
      nextIntervention: "-",
      status: "Inactif",
    },
  ]

  const totalPages = Math.ceil(allClients.length / clientsPerPage)
  const startIndex = (currentPage - 1) * clientsPerPage
  const endIndex = startIndex + clientsPerPage
  const clients = allClients.slice(startIndex, endIndex)

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Historique des interventions</h1>
            <p className="text-sm text-muted-foreground">Historique complet des interventions par client</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total clients</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">48</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Clients actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">42</span>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Liste des clients</CardTitle>
            <CardDescription className="text-xs">Clients actifs et historique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.map((client) => (
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

                    <div className="space-y-1">
                      <div className="text-muted-foreground">
                        <span className="font-medium">{client.interventions}</span> intervention(s)
                      </div>
                      <div className="text-muted-foreground truncate">Dernière: {client.lastIntervention}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs pt-1 border-t">
                    <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                    <span className="text-muted-foreground line-clamp-1">{client.address}</span>
                  </div>

                  {client.nextIntervention !== "-" && (
                    <div className="flex items-start gap-1.5 text-xs">
                      <Calendar className="h-3 w-3 shrink-0 mt-0.5 text-primary" />
                      <span className="text-foreground font-medium line-clamp-1">{client.nextIntervention}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

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
