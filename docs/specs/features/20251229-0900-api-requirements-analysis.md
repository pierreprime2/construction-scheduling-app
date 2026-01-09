# API Requirements Analysis

**Status:** Implemented
**Created:** 2025-12-29 09:00
**Last Updated:** 2025-12-29 09:00
**Author:** Pierre

## Context

L'application construction-scheduling-app dispose d'un frontend Next.js complet avec des données mockées. Pour rendre le site fonctionnel, il faut identifier tous les endpoints API nécessaires pour alimenter les pages existantes.

## Requirements

- [x] Analyser toutes les pages Next.js du dossier /app
- [x] Identifier les composants nécessitant des données
- [x] Lister les formulaires soumettant des données
- [x] Documenter chaque endpoint avec méthode HTTP, path, et données

## Technical Approach

Analyse statique du code frontend pour extraire les besoins en données de chaque page et composant.

## API Endpoints Identifiés

### 1. Interventions

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| GET | `/api/interventions` | Liste des interventions | Dashboard, Calendar |
| GET | `/api/interventions/{id}` | Détails intervention | Page intervention |
| POST | `/api/interventions` | Créer intervention | Modal Calendar |
| PUT | `/api/interventions/{id}` | Modifier intervention | Page intervention |
| DELETE | `/api/interventions/{id}` | Supprimer intervention | Page intervention |
| PUT | `/api/interventions/{id}/reschedule` | Reporter intervention | Page intervention |

**Données intervention:**
- id, title, client, date, time, duration, location, technician, type, description, status, rainProbability

**Types d'intervention:** Toiture, Façade, Étanchéité, Peinture extérieure, Inspection

---

### 2. Techniciens

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| GET | `/api/technicians` | Liste des techniciens | Page technicians, Calendar |
| GET | `/api/technicians/{id}` | Détails technicien | Page technicians |
| POST | `/api/technicians` | Créer technicien | Modal technicians |
| PUT | `/api/technicians/{id}` | Modifier technicien | Page technicians |
| DELETE | `/api/technicians/{id}` | Supprimer technicien | Page technicians |

**Données technicien:**
- id, name, role, phone, email, location, status, currentInterventions, nextIntervention, specialties[]

**Statuts:** Actif, En congé

---

### 3. Clients

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| GET | `/api/clients` | Liste des clients | Page clients, Calendar |
| GET | `/api/clients/{id}` | Détails client | Page clients |
| POST | `/api/clients` | Créer client | Modal clients |
| PUT | `/api/clients/{id}` | Modifier client | Page clients |
| DELETE | `/api/clients/{id}` | Supprimer client | Page clients |

**Données client:**
- id, name, type, phone, email, address, interventionsCount, lastIntervention, nextIntervention, status

**Types:** Syndic, Particulier, Copropriété, Entreprise, Collectivité

---

### 4. Météo

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| GET | `/api/weather/forecast/{interventionId}` | Prévisions pour intervention | Page intervention, Calendar |
| GET | `/api/weather/alerts` | Alertes météo (>50% pluie) | Dashboard |
| GET | `/api/weather/location/{lat},{lng}` | Météo par coordonnées | Page carte |

**Données météo:**
- day, temperature, rainProbability (%), condition

---

### 5. Notifications

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| GET | `/api/notifications` | Liste notifications | Page notifications |
| PUT | `/api/notifications/{id}/read` | Marquer comme lue | Page notifications |
| PUT | `/api/notifications/read-all` | Tout marquer comme lu | Page notifications |
| DELETE | `/api/notifications/{id}` | Supprimer notification | Page notifications |

**Données notification:**
- id, type (alert, calendar, info, success), title, message, time, read

---

### 6. Dashboard

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| GET | `/api/dashboard/stats` | Statistiques dashboard | Dashboard |

**Données stats:**
- interventionsThisWeek, weatherRiskInterventions, confirmedInterventions, activeTechnicians

---

### 7. Utilisateur & Paramètres

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| GET | `/api/user/profile` | Profil utilisateur | Settings, AppLayout |
| PUT | `/api/user/profile` | Modifier profil | Settings |
| PUT | `/api/user/preferences/weather` | Préférences météo | Settings |
| PUT | `/api/user/preferences/notifications` | Préférences notifications | Settings |
| POST | `/api/user/change-password` | Changer mot de passe | Settings |
| POST | `/api/user/2fa/enable` | Activer 2FA | Settings |
| DELETE | `/api/user/2fa/disable` | Désactiver 2FA | Settings |

---

### 8. Authentification

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| POST | `/api/auth/login` | Connexion | (implicite) |
| POST | `/api/auth/logout` | Déconnexion | AppLayout |

---

## Résumé

| Ressource | Endpoints | CRUD complet |
|-----------|-----------|--------------|
| Interventions | 6 | Oui + reschedule |
| Techniciens | 5 | Oui |
| Clients | 5 | Oui |
| Météo | 3 | Lecture seule |
| Notifications | 4 | Lecture + actions |
| Dashboard | 1 | Lecture seule |
| Utilisateur | 7 | Profil + préférences |
| Auth | 2 | Login/Logout |

**Total: 33 endpoints**

## Observations

1. Le dossier `app/api/` est actuellement vide - tous les endpoints sont à créer
2. Les librairies `react-hook-form` et `zod` sont installées mais pas encore utilisées
3. Toutes les données affichées sont actuellement mockées dans les composants

## Validation Criteria

- [x] Toutes les pages Next.js analysées
- [x] Tous les endpoints documentés avec méthode, path, données
- [x] Tableau récapitulatif créé

## Changes Log

- 2025-12-29 09:00: Création initiale - Analyse complète des 8 pages frontend
