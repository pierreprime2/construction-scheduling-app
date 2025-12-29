"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Home, Users, Settings, Bell, Plus, ChevronDown, Map, History } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
  onCreateIntervention?: () => void
  onCreateTechnician?: () => void
}

export function AppLayout({ children, onCreateIntervention, onCreateTechnician }: AppLayoutProps) {
  const pathname = usePathname()
  const [isInterventionsExpanded, setIsInterventionsExpanded] = useState(true)
  const [isTechniciansExpanded, setIsTechniciansExpanded] = useState(true)

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col border-r bg-card">
        {/* Logo */}
        <Link href="/" className="flex h-16 items-center gap-2 border-b px-6 hover:bg-secondary transition-colors">
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src="/logo.png" alt="COGIT Logo" width={40} height={40} className="rounded-lg" />
          </div>
          <span className="text-xl font-semibold text-foreground">COGIT</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
            }`}
          >
            <Home className="h-5 w-5" />
            Tableau de bord
          </Link>

          <Link
            href="/carte"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/carte" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
            }`}
          >
            <Map className="h-5 w-5" />
            Carte
          </Link>

          <div>
            <button
              onClick={() => setIsInterventionsExpanded(!isInterventionsExpanded)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-foreground hover:bg-secondary"
            >
              <Calendar className="h-5 w-5" />
              Interventions
              <ChevronDown
                className={`ml-auto h-4 w-4 transition-transform ${isInterventionsExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {isInterventionsExpanded && (
              <div className="mt-1 space-y-1 pl-9">
                <Link
                  href="/calendar"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    pathname === "/calendar"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Voir le calendrier
                </Link>
                <Link
                  href="/clients"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    pathname === "/clients"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <History className="h-4 w-4" />
                  Historique
                </Link>
                <button
                  onClick={onCreateIntervention}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle intervention
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsTechniciansExpanded(!isTechniciansExpanded)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-foreground hover:bg-secondary"
            >
              <Users className="h-5 w-5" />
              Techniciens
              <ChevronDown
                className={`ml-auto h-4 w-4 transition-transform ${isTechniciansExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {isTechniciansExpanded && (
              <div className="mt-1 space-y-1 pl-9">
                <Link
                  href="/technicians"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    pathname === "/technicians"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Voir les techniciens
                </Link>
                <button
                  onClick={onCreateTechnician}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Nouveau technicien
                </button>
              </div>
            )}
          </div>

          <Link
            href="/notifications"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative ${
              pathname === "/notifications"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Bell className="h-5 w-5" />
            Notifications
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
              5
            </span>
          </Link>
        </nav>

        {/* User Menu at Bottom */}
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-foreground">Jean Dupont</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Jean Dupont</span>
                  <span className="text-xs text-muted-foreground">jean.dupont@idf-construction.fr</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer">Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-background">{children}</main>

        <footer className="border-t bg-card px-6 py-3">
          <p className="text-center text-sm text-muted-foreground">
            Réalisé par{" "}
            <a
              href="https://github.com/pierreprime2"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Pierre Vermeil
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
