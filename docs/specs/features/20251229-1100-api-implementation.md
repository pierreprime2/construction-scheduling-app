# API Implementation

**Status:** Implemented
**Created:** 2025-12-29 11:00
**Last Updated:** 2025-12-29 11:45
**Author:** Pierre

## Context

Implémenter les 33 endpoints identifiés dans l'analyse des besoins API en utilisant API Platform sur Symfony. L'API doit être documentée via OpenAPI et testable depuis l'interface Swagger UI.

## Requirements

- [x] Installer API Platform
- [x] Créer les entités Doctrine pour chaque ressource
- [x] Exposer les endpoints CRUD via API Platform
- [x] Configurer les endpoints custom (reschedule, stats, etc.)
- [x] Documenter l'API via OpenAPI (accessible sur /api/docs)

## Technical Approach

- API Platform 4.x avec Symfony 7.4
- Doctrine ORM pour la persistence
- Attributs PHP 8 pour la configuration API Platform
- OpenAPI 3.0 auto-généré

## Entities

### Intervention
- id (int, auto)
- title (string)
- client (relation ManyToOne → Client)
- technician (relation ManyToOne → Technician)
- date (date)
- time (time)
- duration (int, heures)
- location (string)
- type (string: Toiture, Façade, Étanchéité, Peinture extérieure, Inspection)
- description (text, nullable)
- status (string: Planifiée, Confirmée, En cours, Terminée, Annulée)
- rainProbability (int, nullable)

### Technician
- id (int, auto)
- name (string)
- role (string)
- phone (string)
- email (string)
- location (string)
- status (string: Actif, En congé)
- specialties (json array)

### Client
- id (int, auto)
- name (string)
- type (string: Syndic, Particulier, Copropriété, Entreprise, Collectivité)
- phone (string)
- email (string)
- address (string)
- status (string: Actif, Inactif)

### Notification
- id (int, auto)
- type (string: alert, calendar, info, success)
- title (string)
- message (text)
- createdAt (datetime)
- read (boolean)
- user (relation ManyToOne → User)

### User
- id (int, auto)
- email (string, unique)
- password (string, hashed)
- firstName (string)
- lastName (string)
- phone (string, nullable)
- roles (json array)
- weatherPreferences (json)
- notificationPreferences (json)

## Custom Endpoints

| Endpoint | Description |
|----------|-------------|
| PUT /interventions/{id}/reschedule | Reporter une intervention |
| GET /weather/forecast/{interventionId} | Prévisions météo pour intervention |
| GET /weather/alerts | Interventions à risque météo |
| GET /weather/location/{lat},{lng} | Météo par coordonnées |
| PUT /notifications/read-all | Marquer toutes les notifications lues |
| GET /dashboard/stats | Statistiques dashboard |
| PUT /user/preferences/weather | Préférences météo utilisateur |
| PUT /user/preferences/notifications | Préférences notifications |
| POST /user/change-password | Changer mot de passe |

## Validation Criteria

- [x] API Platform installé et fonctionnel
- [x] Toutes les entités créées avec relations
- [x] Endpoints CRUD exposés pour chaque ressource
- [x] Endpoints custom implémentés
- [x] Documentation OpenAPI accessible sur /api/docs
- [ ] Requêtes de test fonctionnelles via Swagger UI

## Changes Log

- 2025-12-29 11:00: Création initiale
- 2025-12-29 11:45: API Platform 4.2.11 installé, 5 entités créées, 40+ routes configurées, base SQLite configurée
