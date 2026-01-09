# API Functional Tests

**Status:** Implemented
**Created:** 2025-01-08 19:30
**Last Updated:** 2025-01-08 19:30
**Author:** Pierre

## Context
Valider que tous les endpoints de l'API Symfony/API Platform fonctionnent correctement avant l'intégration avec le frontend Next.js. Les tests fonctionnels permettent de s'assurer que les opérations CRUD et les endpoints personnalisés répondent aux spécifications.

## Requirements
- [x] Collection Postman couvrant tous les endpoints API
- [x] Tests pour les 5 entités : Client, Technician, Intervention, Notification, User
- [x] Tests des opérations CRUD standard (GET, POST, PUT, DELETE)
- [x] Tests des endpoints personnalisés (reschedule, mark_read, mark_all_read, dashboard, weather)
- [x] Fichier d'environnement Postman avec variables dynamiques
- [x] Scripts de capture d'IDs pour chaînage des requêtes
- [x] 100% des tests passent (38/38)

## Technical Approach

### Outils
- **Postman** : Client API et runner de tests
- **Newman** (optionnel) : CLI pour CI/CD

### Structure de la collection
1. **Clients** - CRUD complet
2. **Technicians** - CRUD complet
3. **Users** - CRUD complet
4. **Interventions** - CRUD + reschedule
5. **Notifications** - CRUD + mark_read + mark_all_read
6. **Dashboard** - Statistiques agrégées
7. **Cleanup** - Suppression des données de test

### Configuration
- Headers : `Content-Type: application/ld+json`, `Accept: application/ld+json`
- Variables d'environnement : `baseUrl`, `clientId`, `technicianId`, `interventionId`, `notificationId`, `userId`
- Scripts post-response pour capturer les IDs créés

## Implementation Notes

### Fichiers créés
- `COGITConstruction-Runnable.postman_collection.json` - Collection de 38 tests
- `COGITConstruction.postman_environment.json` - Variables d'environnement

### Corrections backend requises
1. **415/406 errors** : Ajout des headers `application/ld+json` dans la collection
2. **404 /api/users** : Ajout des opérations CRUD à l'entité User
3. **405 POST /api/notifications** : Ajout de l'opération Post à Notification
4. **422 validation** : Correction des valeurs de status avec accents (`Planifiée`, `Confirmée`)
5. **500 custom controllers** : Migration vers State Processors (API Platform 4)
   - `RescheduleInterventionProcessor` remplace `RescheduleInterventionController`
   - `MarkNotificationReadProcessor` remplace `MarkNotificationReadController`
6. **406 reschedule** : Ajout de `inputFormats` et `outputFormats` sur l'opération

### State Processors créés
- `api/src/State/RescheduleInterventionProcessor.php`
- `api/src/State/MarkNotificationReadProcessor.php`

## Validation Criteria
- [x] 38/38 tests Postman passent
- [x] Tous les endpoints CRUD fonctionnent
- [x] Les endpoints personnalisés (reschedule, mark_read, mark_all_read) fonctionnent
- [x] Le chaînage des requêtes via variables d'environnement fonctionne

## Changes Log
- 2025-01-08 19:30: Création initiale - 38/38 tests passent
