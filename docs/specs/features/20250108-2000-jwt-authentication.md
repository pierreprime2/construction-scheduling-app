# JWT Authentication

**Status:** Implemented
**Created:** 2025-01-08 20:00
**Last Updated:** 2025-01-09 11:30
**Author:** Pierre

## Context
L'API est actuellement ouverte sans authentification. Pour un système multi-utilisateurs, il faut sécuriser les endpoints et associer les données à l'utilisateur connecté.

## Requirements

### Backend (Symfony)
- [x] Installation et configuration de lexik/jwt-authentication-bundle
- [x] Endpoint POST /api/login pour obtenir un token
- [x] Endpoint POST /api/register pour créer un compte
- [x] Endpoint GET /api/me pour récupérer l'utilisateur courant
- [x] Protection de tous les endpoints API (sauf login/register/docs)
- [ ] Refresh token pour prolonger la session (reporté - incompatibilité Symfony 7)
- [x] Rôles utilisateur : ROLE_USER, ROLE_TECHNICIAN, ROLE_ADMIN

### Frontend (Next.js)
- [x] Utilitaire de stockage JWT (lib/auth-token.ts)
- [x] AuthContext et hook useAuth (contexts/auth-context.tsx)
- [x] Client API avec injection automatique du token (lib/api-client.ts)
- [x] AuthProvider intégré au layout racine
- [x] Menu utilisateur dynamique avec données auth
- [x] Tests unitaires Jest (34 tests passants)

## Technical Approach

### Bundle
- `lexik/jwt-authentication-bundle` v3.2 - standard Symfony pour JWT

### Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | Non | Créer un compte |
| POST | /api/login | Non | Obtenir access token |
| GET | /api/me | Oui | Profil utilisateur courant |

### Token Configuration
- Access token : 1 heure (3600s)
- Algorithme : RS256 (clés asymétriques)
- Clés : `config/jwt/private.pem`, `config/jwt/public.pem`

### Security Flow
```
1. POST /api/register {email, password, firstName, lastName}
   → {message: "User registered successfully", user: {...}}

2. POST /api/login {username: "email", password: "..."}
   → {token: "eyJ..."}

3. GET /api/clients
   Header: Authorization: Bearer eyJ...
   → 200 OK [clients data]

4. Sans token → 401 {"code":401,"message":"JWT Token not found"}
```

## Implementation Notes

### Fichiers Backend (api/)
- `config/packages/security.yaml` - Firewalls et access_control
- `config/packages/lexik_jwt_authentication.yaml` - Config JWT
- `config/jwt/private.pem` - Clé privée RSA 4096
- `config/jwt/public.pem` - Clé publique
- `src/Controller/RegisterController.php` - Inscription
- `src/Controller/MeController.php` - Profil utilisateur

### Fichiers Frontend
- `lib/auth-token.ts` - Stockage JWT (localStorage), parsing token, vérification expiration
- `lib/api-client.ts` - Client fetch avec injection Authorization header, gestion erreurs 401/403/404
- `contexts/auth-context.tsx` - AuthProvider, useAuth hook (login, register, logout, refreshUser)
- `app/layout.tsx` - Wrapping avec AuthProvider
- `components/app-layout.tsx` - Menu utilisateur dynamique

### Tests (Jest)
- `__tests__/lib/auth-token.test.ts` - 16 tests (token management, user management, parseToken, expiration)
- `__tests__/lib/api-client.test.ts` - 18 tests (requests, auth header, error handling, convenience methods)

### Décisions techniques
- **Pas de refresh token** : Le bundle `gesdinet/jwt-refresh-token-bundle` n'est pas compatible avec Symfony 7.4 (utilise Guard component supprimé). À implémenter manuellement si nécessaire.
- **Token TTL 1h** : Suffisant pour une session de travail, le frontend devra redemander un login après expiration.

## Validation Criteria

### Backend
- [x] POST /api/register crée un utilisateur avec password hashé
- [x] POST /api/login retourne un JWT valide
- [x] Endpoints protégés retournent 401 sans token
- [x] Endpoints protégés fonctionnent avec token valide
- [x] GET /api/me retourne les infos de l'utilisateur connecté
- [x] Postman collection : 33 requests, 46 assertions passants

### Frontend
- [x] Token stocké/récupéré correctement dans localStorage
- [x] Token automatiquement injecté dans les requêtes API
- [x] Expiration token détectée avant requête
- [x] Redirection vers /login sur 401
- [x] AuthContext expose user, isAuthenticated, isLoading
- [x] Jest : 34 tests passants (npm test)

## Changes Log
- 2025-01-08 20:00: Création initiale
- 2025-01-09 11:30: Implémentation backend complète (sans refresh token)
- 2025-01-10 : Implémentation frontend (stockage JWT, AuthContext, API client, tests Jest)
