'use client'

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, MapPin, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TechniciansPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showCreateModal, setShowCreateModal] = useState(false)

  const technicians = [
    {
      id: 1,
      name: "Marc Dubois",
      initials: "MD",
      role: "Chef d'équipe",
      phone: "+33 6 12 34 56 78",
      email: "marc.dubois@idf-construction.fr",
      location: "Paris",
      status: "Actif",
      currentInterventions: 3,
      nextIntervention: "20/01/2025 - Rénovation façade",
      specialties: ["Façades", "Toitures", "Échafaudage"]
    },
    {
      id: 2,
      name: "Sophie Martin",
      initials: "SM",
      role: "Technicienne senior",
      phone: "+33 6 23 45 67 89",
      email: "sophie.martin@idf-construction.fr",
      location: "Hauts-de-Seine",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "21/01/2025 - Installation toiture",
      specialties: ["Toitures", "Étanchéité", "Zinguerie"]
    },
    {
      id: 3,
      name: "Ahmed Benali",
      initials: "AB",
      role: "Technicien",
      phone: "+33 6 34 56 78 90",
      email: "ahmed.benali@idf-construction.fr",
      location: "Val-de-Marne",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "22/01/2025 - Étanchéité terrasse",
      specialties: ["Étanchéité", "Terrasses", "Isolation"]
    },
    {
      id: 4,
      name: "Julie Petit",
      initials: "JP",
      role: "Technicienne",
      phone: "+33 6 45 67 89 01",
      email: "julie.petit@idf-construction.fr",
      location: "Yvelines",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "23/01/2025 - Peinture extérieure",
      specialties: ["Peinture", "Ravalement", "Finitions"]
    },
    {
      id: 5,
      name: "Thomas Leroux",
      initials: "TL",
      role: "Technicien",
      phone: "+33 6 56 78 90 12",
      email: "thomas.leroux@idf-construction.fr",
      location: "Seine-Saint-Denis",
      status: "En congé",
      currentInterventions: 0,
      nextIntervention: "Retour le 27/01/2025",
      specialties: ["Maçonnerie", "Béton", "Structure"]
    },
    {
      id: 6,
      name: "Emma Rousseau",
      initials: "ER",
      role: "Apprentie",
      phone: "+33 6 67 89 01 23",
      email: "emma.rousseau@idf-construction.fr",
      location: "Essonne",
      status: "Actif",
      currentInterventions: 1,
      nextIntervention: "24/01/2025 - Assistance ravalement",
      specialties: ["Formation générale", "Assistance"]
    },
    {
      id: 7,
      name: "Pierre Leroy",
      initials: "PL",
      role: "Technicien senior",
      phone: "+33 6 78 90 12 34",
      email: "pierre.leroy@idf-construction.fr",
      location: "Val-d'Oise",
      status: "Actif",
      currentInterventions: 3,
      nextIntervention: "21/01/2025 - Réfection toiture",
      specialties: ["Charpente", "Couverture", "Zinguerie"]
    },
    {
      id: 8,
      name: "Nadia Hamidi",
      initials: "NH",
      role: "Technicienne",
      phone: "+33 6 89 01 23 45",
      email: "nadia.hamidi@idf-construction.fr",
      location: "Paris",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "22/01/2025 - Isolation combles",
      specialties: ["Isolation", "Plâtrerie", "Cloisons"]
    },
    {
      id: 9,
      name: "Laurent Moreau",
      initials: "LM",
      role: "Chef d'équipe",
      phone: "+33 6 90 12 34 56",
      email: "laurent.moreau@idf-construction.fr",
      location: "Seine-et-Marne",
      status: "Actif",
      currentInterventions: 3,
      nextIntervention: "20/01/2025 - Extension bâtiment",
      specialties: ["Gros œuvre", "Maçonnerie", "Fondations"]
    },
    {
      id: 10,
      name: "Céline Garnier",
      initials: "CG",
      role: "Technicienne",
      phone: "+33 6 01 23 45 67",
      email: "celine.garnier@idf-construction.fr",
      location: "Hauts-de-Seine",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "23/01/2025 - Bardage façade",
      specialties: ["Bardage", "Menuiserie ext.", "Finitions"]
    },
    {
      id: 11,
      name: "Karim Adjani",
      initials: "KA",
      role: "Technicien",
      phone: "+33 6 12 34 56 89",
      email: "karim.adjani@idf-construction.fr",
      location: "Val-de-Marne",
      status: "Actif",
      currentInterventions: 1,
      nextIntervention: "24/01/2025 - Réparation gouttières",
      specialties: ["Zinguerie", "Évacuation", "Plomberie ext."]
    },
    {
      id: 12,
      name: "Isabelle Roux",
      initials: "IR",
      role: "Technicienne senior",
      phone: "+33 6 23 45 67 90",
      email: "isabelle.roux@idf-construction.fr",
      location: "Yvelines",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "21/01/2025 - Inspection chantier",
      specialties: ["Contrôle qualité", "Coordination", "Sécurité"]
    },
    {
      id: 13,
      name: "Youssef Mansouri",
      initials: "YM",
      role: "Technicien",
      phone: "+33 6 34 56 78 01",
      email: "youssef.mansouri@idf-construction.fr",
      location: "Seine-Saint-Denis",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "22/01/2025 - Installation échafaudage",
      specialties: ["Échafaudage", "Levage", "Sécurité"]
    },
    {
      id: 14,
      name: "Valérie Blanc",
      initials: "VB",
      role: "Apprentie",
      phone: "+33 6 45 67 89 12",
      email: "valerie.blanc@idf-construction.fr",
      location: "Essonne",
      status: "Actif",
      currentInterventions: 1,
      nextIntervention: "23/01/2025 - Formation chantier",
      specialties: ["Formation", "Assistance polyvalente"]
    },
    {
      id: 15,
      name: "Olivier Fontaine",
      initials: "OF",
      role: "Technicien",
      phone: "+33 6 56 78 90 23",
      email: "olivier.fontaine@idf-construction.fr",
      location: "Val-d'Oise",
      status: "En congé",
      currentInterventions: 0,
      nextIntervention: "Retour le 30/01/2025",
      specialties: ["Électricité", "Domotique", "Éclairage"]
    },
    {
      id: 16,
      name: "Fatima Zahra",
      initials: "FZ",
      role: "Technicienne",
      phone: "+33 6 67 89 01 34",
      email: "fatima.zahra@idf-construction.fr",
      location: "Paris",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "24/01/2025 - Traitement humidité",
      specialties: ["Traitement humidité", "Ventilation", "Diagnostic"]
    },
    {
      id: 17,
      name: "Jean-Luc Bernard",
      initials: "JB",
      role: "Chef d'équipe",
      phone: "+33 6 78 90 12 45",
      email: "jeanluc.bernard@idf-construction.fr",
      location: "Seine-et-Marne",
      status: "Actif",
      currentInterventions: 4,
      nextIntervention: "20/01/2025 - Démolition partielle",
      specialties: ["Démolition", "Terrassement", "Gros œuvre"]
    },
    {
      id: 18,
      name: "Amina Diallo",
      initials: "AD",
      role: "Technicienne",
      phone: "+33 6 89 01 23 56",
      email: "amina.diallo@idf-construction.fr",
      location: "Hauts-de-Seine",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "21/01/2025 - Nettoyage façade",
      specialties: ["Nettoyage", "Démoussage", "Traitement"]
    },
    {
      id: 19,
      name: "Nicolas Durand",
      initials: "ND",
      role: "Technicien senior",
      phone: "+33 6 90 12 34 67",
      email: "nicolas.durand@idf-construction.fr",
      location: "Val-de-Marne",
      status: "Actif",
      currentInterventions: 3,
      nextIntervention: "22/01/2025 - Pose fenêtres",
      specialties: ["Menuiserie", "Fenêtres", "Portes"]
    },
    {
      id: 20,
      name: "Sandrine Legrand",
      initials: "SL",
      role: "Technicienne",
      phone: "+33 6 01 23 45 78",
      email: "sandrine.legrand@idf-construction.fr",
      location: "Yvelines",
      status: "Actif",
      currentInterventions: 1,
      nextIntervention: "23/01/2025 - Carrelage terrasse",
      specialties: ["Carrelage", "Dallage", "Revêtements"]
    },
    {
      id: 21,
      name: "Rachid Bouazza",
      initials: "RB",
      role: "Technicien",
      phone: "+33 6 12 34 56 90",
      email: "rachid.bouazza@idf-construction.fr",
      location: "Seine-Saint-Denis",
      status: "Actif",
      currentInterventions: 2,
      nextIntervention: "24/01/2025 - Plomberie sanitaire",
      specialties: ["Plomberie", "Sanitaires", "Chauffage"]
    },
    {
      id: 22,
      name: "Marie Dupont",
      initials: "MD",
      role: "Apprentie",
      phone: "+33 6 23 45 67 01",
      email: "marie.dupont@idf-construction.fr",
      location: "Essonne",
      status: "Actif",
      currentInterventions: 1,
      nextIntervention: "25/01/2025 - Assistance peinture",
      specialties: ["Formation", "Peinture", "Assistance"]
    },
  ]

  const totalPages = Math.ceil(technicians.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTechnicians = technicians.slice(startIndex, endIndex)

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
                En intervention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">18</span>
            </CardContent>
          </Card>
        </div>

        {/* Technicians List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Liste des techniciens</CardTitle>
            <CardDescription className="text-xs">Vue d'ensemble de l'équipe et activités</CardDescription>
          </CardHeader>
          <CardContent>
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
                          {tech.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground mb-1 truncate">{tech.name}</div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">{tech.role}</span>
                          {tech.status === "Actif" ? (
                            <Badge variant="secondary" className="text-xs">Actif</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">En congé</Badge>
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
                      <div className="text-muted-foreground">
                        <span className="font-medium">{tech.currentInterventions}</span> intervention(s)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5 text-xs pt-1 border-t">
                    <Calendar className="h-3 w-3 shrink-0 mt-0.5 text-primary" />
                    <span className="text-foreground font-medium line-clamp-1">{tech.nextIntervention}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 pt-1">
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
                <Input id="email" type="email" placeholder="prenom.nom@idf-construction.fr" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                <Input id="specialties" placeholder="Ex: Façades, Toitures, Échafaudage" />
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
