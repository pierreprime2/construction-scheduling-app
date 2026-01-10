# Fixtures et Migration Database

**Status:** Implemented
**Created:** 2025-01-10 14:00
**Author:** Pierre

## Context

L'API backend était fonctionnelle mais les données étaient créées manuellement via Postman. Pour un développement efficace et des tests reproductibles, nous avons besoin de fixtures automatisées avec des données réalistes en français.

## Requirements

- [x] Créer la migration initiale Doctrine
- [x] Installer doctrine/doctrine-fixtures-bundle
- [x] Créer les fixtures avec données FR réalistes
- [x] Reset de la base de données
- [x] Charger les fixtures

## Données créées

### Users (3)
| Email | Password | Role |
|-------|----------|------|
| admin@cogit.fr | admin | ROLE_ADMIN |
| marie@cogit.fr | user | ROLE_USER |
| jean@cogit.fr | tech | ROLE_TECHNICIAN |

### Clients (10)
- Syndics (2): Syndic Belleville, Foncia Paris Est
- Copropriétés (3): Les Lilas, Résidence du Parc, Faidherbe
- Entreprises (2): SCI Haussmann, SARL Immobilière Nation
- Particuliers (2): M. et Mme Dubois, M. Laurent
- Collectivités (1): Mairie de Montreuil

### Technicians (8)
- Chefs d'équipe (3): Jean Dupont, Thomas Moreau, Philippe Martin
- Techniciens/Techniciennes (5): Marc Lefebvre, Sophie Bernard, Nathalie Petit, François Garcia, Isabelle Roux
- Spécialités: Toiture, Façade, Étanchéité, Peinture extérieure, Inspection
- Localisations: Paris (2e, 9e, 11e, 20e), Montreuil, Vincennes, Boulogne, Les Lilas

### Interventions (12)
- Terminées (2): interventions passées
- En cours (1): intervention du jour
- À venir (7): interventions planifiées sur 7 jours
- À risque météo (2): interventions avec probabilité pluie > 70%

### Notifications (6)
- Alertes météo (2)
- Notifications calendrier (2)
- Succès/Info (2)

## Technical Implementation

### Migration initiale
- `migrations/Version20260110112637.php` - Crée les 5 tables (user, client, technician, intervention, notification)

### Fichier fixtures
- `src/DataFixtures/AppFixtures.php`

### Commandes disponibles

```bash
# Réinitialiser la DB complètement et recharger
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:fixtures:load --no-interaction

# Ou simplement recharger les fixtures (purge les données)
php bin/console doctrine:fixtures:load --no-interaction
```

## Validation

- [x] 3 users créés avec passwords hashés
- [x] 10 clients avec types variés
- [x] 8 technicians avec spécialités
- [x] 12 interventions liées aux clients/technicians
- [x] 6 notifications liées aux users
- [x] Données en français
- [x] Relations cohérentes (FK)

## Milestones atteints

### Backend API (Symfony)
- [x] JWT Authentication (`20250108-2000-jwt-authentication.md`)
- [x] CRUD complet (Clients, Technicians, Interventions, Notifications, Users)
- [x] Endpoints custom (dashboard/stats, weather, reschedule)
- [x] Fixtures avec données FR réalistes

### Frontend (Next.js)
- [x] Route Protection Middleware (`20250110-1200-route-protection.md`)
- [x] Cookie-based authentication (httpOnly)
- [x] Pages /login et /register
- [x] 26 tests Jest passants
- [ ] **TODO**: Connecter les pages à l'API (actuellement hardcodé)

## Next Steps

1. Connecter le Dashboard à l'API (`/api/dashboard/stats`, `/api/interventions`)
2. Connecter la page Clients à l'API (`/api/clients`)
3. Connecter la page Technicians à l'API (`/api/technicians`)
4. Connecter les autres pages (Calendar, Notifications, Intervention detail)

## Changes Log

- 2025-01-10 14:00: Création fixtures avec données FR (3 users, 10 clients, 8 technicians, 12 interventions, 6 notifications)
- 2025-01-10 14:30: Ajout migration initiale Version20260110112637
