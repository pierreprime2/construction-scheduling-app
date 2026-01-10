# Route Protection with Next.js Middleware

**Status:** Implemented
**Created:** 2025-01-10 12:00
**Author:** Pierre

## Context

L'authentification JWT est implémentée (voir `20250108-2000-jwt-authentication.md`), mais les routes frontend ne sont pas protégées. Un utilisateur non authentifié peut accéder à toutes les pages de l'application.

## Decision: Middleware vs Wrapper

### Options considérées

| Critère | Middleware Next.js | Wrapper React |
|---------|-------------------|---------------|
| Exécution | Serveur (edge) | Client (navigateur) |
| Performance | Bloque avant rendu | Flash possible (page visible puis redirect) |
| Sécurité | Token en cookie httpOnly (non accessible JS) | Token en localStorage (vulnérable XSS) |
| Complexité | Migration cookies requise | Simple avec useAuth() |
| SEO | Contenu protégé non exposé | Contenu peut être crawlé |

### Choix: Middleware

**Raisons :**
1. **Sécurité renforcée** : Cookie httpOnly protège le token contre les attaques XSS
2. **Meilleure UX** : Pas de flash de contenu avant redirection
3. **Protection SEO** : Les pages protégées ne sont pas indexables par les crawlers
4. **Standard industrie** : Approche recommandée pour les applications production

**Trade-off accepté :**
- Migration du stockage localStorage → cookies
- Légère complexité supplémentaire

## Requirements

- [x] Migrer le token JWT de localStorage vers un cookie httpOnly
- [x] Créer le middleware Next.js (`middleware.ts`)
- [x] Définir les routes publiques vs protégées
- [x] Gérer l'expiration du token côté middleware
- [x] Mettre à jour AuthContext pour utiliser les cookies
- [x] Mettre à jour les tests Jest (26 tests passants)
- [x] Créer la page /login
- [x] Créer la page /register

## Technical Approach

### Cookie Configuration

```typescript
// Cookie settings
{
  name: 'cogit_token',
  httpOnly: true,        // Non accessible via JavaScript
  secure: true,          // HTTPS only (dev: false)
  sameSite: 'lax',       // Protection CSRF
  path: '/',
  maxAge: 3600           // 1 heure (sync avec JWT TTL)
}
```

### Routes Configuration

```typescript
// Routes publiques (pas de redirection)
const PUBLIC_ROUTES = [
  '/login',
  '/register',
]

// Routes protégées (redirection vers /login si non authentifié)
// Toutes les autres routes par défaut
```

### Middleware Flow

```
Request → Middleware
  ↓
  Est-ce une route publique ?
    → Oui : Continuer
    → Non : Vérifier cookie token
      ↓
      Token présent et valide ?
        → Oui : Continuer
        → Non : Redirect vers /login
```

### Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `middleware.ts` | Créer (nouveau) |
| `lib/auth-token.ts` | Modifier (cookies au lieu de localStorage) |
| `lib/auth-cookies.ts` | Créer (utilitaires cookies server-side) |
| `contexts/auth-context.tsx` | Modifier (utiliser cookies) |
| `app/login/page.tsx` | Créer |
| `app/register/page.tsx` | Créer |
| `__tests__/lib/auth-token.test.ts` | Modifier |

## Validation Criteria

- [ ] Accès à `/` sans token → redirect vers `/login`
- [ ] Accès à `/login` sans token → affiche la page
- [ ] Login réussi → cookie httpOnly créé + redirect vers `/`
- [ ] Accès à `/` avec token valide → affiche la page
- [ ] Token expiré → redirect vers `/login`
- [ ] Logout → cookie supprimé + redirect vers `/login`
- [ ] Cookie non accessible via `document.cookie` (httpOnly)
- [ ] Tests Jest passants

## Implementation Notes

### Fichiers créés
- `middleware.ts` - Middleware Next.js pour protection des routes
- `lib/auth-cookies.ts` - Utilitaires cookies server-side
- `app/api/auth/login/route.ts` - Route API pour login (set cookies)
- `app/api/auth/register/route.ts` - Route API pour register (set cookies)
- `app/api/auth/logout/route.ts` - Route API pour logout (clear cookies)
- `app/login/page.tsx` - Page de connexion
- `app/register/page.tsx` - Page d'inscription

### Fichiers modifiés
- `lib/auth-token.ts` - Migré de localStorage vers cookies
- `lib/api-client.ts` - Utilise credentials: 'include' pour envoyer cookies
- `contexts/auth-context.tsx` - Utilise les nouvelles routes API
- `components/app-layout.tsx` - Logout async
- `__tests__/lib/auth-token.test.ts` - Tests adaptés pour cookies
- `__tests__/lib/api-client.test.ts` - Tests adaptés pour cookies

## Changes Log

- 2025-01-10 12:00: Création initiale, choix architecture middleware
- 2025-01-10: Implémentation middleware + migration cookies (26 tests passants)
- 2025-01-10: Création pages /login et /register - Implémentation complète
