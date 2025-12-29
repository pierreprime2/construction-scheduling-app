import { AppLayout } from "@/components/app-layout"
import { Bell, AlertTriangle, Calendar, CheckCircle2, Info, X } from 'lucide-react'

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Alerte météo",
      message: "Forte probabilité de pluie (75%) prévue pour l'intervention #1024 demain",
      time: "Il y a 15 minutes",
      read: false,
    },
    {
      id: 2,
      type: "calendar",
      title: "Intervention reportée",
      message: "L'intervention #1019 a été reportée au 28 janvier 2025",
      time: "Il y a 2 heures",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Nouveau client",
      message: "Le client 'Résidence Voltaire' a été ajouté au système",
      time: "Il y a 4 heures",
      read: false,
    },
    {
      id: 4,
      type: "success",
      title: "Intervention terminée",
      message: "L'intervention #1015 a été marquée comme terminée par Marc Lefebvre",
      time: "Hier à 16:30",
      read: true,
    },
    {
      id: 5,
      type: "alert",
      title: "Conditions météo défavorables",
      message: "3 interventions cette semaine nécessitent une surveillance météo accrue",
      time: "Hier à 09:00",
      read: false,
    },
    {
      id: 6,
      type: "info",
      title: "Mise à jour du système",
      message: "Nouvelles fonctionnalités d'analyse météo disponibles",
      time: "Il y a 2 jours",
      read: true,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "calendar":
        return <Calendar className="h-5 w-5 text-primary" />
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-foreground" />
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          </div>
          <button className="rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-secondary transition-colors">
            Tout marquer comme lu
          </button>
        </div>

        {/* Notifications count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Vous avez <span className="font-semibold text-foreground">5 notifications non lues</span>
          </p>
        </div>

        {/* Notifications list */}
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-secondary/50 ${
                !notification.read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="mt-0.5">{getIcon(notification.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notification.title}
                  </h3>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className={`text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              {!notification.read && (
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary"></div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state (hidden when notifications exist) */}
        <div className="hidden rounded-lg border bg-card p-12 text-center">
          <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">Aucune notification</h3>
          <p className="text-sm text-muted-foreground">Vous n'avez aucune notification pour le moment</p>
        </div>
      </div>
    </AppLayout>
  )
}
