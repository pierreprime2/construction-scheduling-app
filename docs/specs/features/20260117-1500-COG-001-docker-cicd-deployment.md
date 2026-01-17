# COG-001: Docker & CI/CD Deployment

**Status:** Implemented
**Created:** 2026-01-17 15:00
**Last Updated:** 2026-01-17 15:00
**Author:** Pierre

## Context

L'application COGIT Construction nécessite une infrastructure de déploiement pour être mise en production sur un VPS OVH. On choisit une approche full Docker pour la portabilité et la reproductibilité, avec un pipeline CI/CD GitHub Actions pour l'automatisation.

## Requirements

- [x] Containeriser le frontend Next.js
- [x] Containeriser le backend Symfony/PHP
- [x] Configurer un reverse proxy Nginx
- [x] Créer un pipeline CI/CD GitHub Actions
- [x] Déployer automatiquement sur push vers main
- [x] Persister les données (SQLite, clés JWT) via volumes Docker

## Technical Approach

### Architecture Docker

```
┌─────────────────────────────────────────────────┐
│                    VPS OVH                       │
│  ┌─────────────────────────────────────────────┐│
│  │              Docker Compose                 ││
│  │  ┌─────────┐  ┌──────────┐  ┌───────────┐  ││
│  │  │  Nginx  │  │ Frontend │  │    API    │  ││
│  │  │  :80    │→ │  :3000   │  │   :9000   │  ││
│  │  │         │→ │ (Next.js)│  │ (PHP-FPM) │  ││
│  │  └─────────┘  └──────────┘  └───────────┘  ││
│  │       ↓                           ↓        ││
│  │  ┌─────────────────────────────────────┐   ││
│  │  │           Volumes Docker            │   ││
│  │  │   api_data (SQLite) │ api_jwt (keys)│   ││
│  │  └─────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

### Routage Nginx

- `/*` → Frontend Next.js (port 3000)
- `/api/*` → Backend Symfony PHP-FPM (port 9000)

### Pipeline CI/CD

1. **Test** : Lint + tests frontend et backend (en parallèle)
2. **Build** : Construction des images Docker, push vers GitHub Container Registry
3. **Deploy** : SSH vers VPS, pull des images, redémarrage des services

### Sécurité

- Users non-root dans les containers (`nextjs`, `symfony`)
- Clés SSH dédiées pour GitHub Actions
- Secrets stockés dans GitHub Secrets (pas dans le repo)

## Implementation Notes

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `docker-compose.yml` | Orchestration des 3 services (nginx, frontend, api) |
| `nginx.conf` | Configuration reverse proxy |
| `Dockerfile` | Image frontend Next.js (multi-stage, standalone) |
| `api/Dockerfile` | Image backend PHP-FPM 8.2 |
| `.github/workflows/deploy.yml` | Pipeline CI/CD |
| `.env.example` | Template des variables d'environnement |

### Configuration Next.js

Ajout de `output: 'standalone'` dans `next.config.mjs` pour générer un bundle autonome optimisé pour Docker (~100MB vs ~1GB).

### Volumes Docker

- `api_data` : Persiste `/var/www/html/var` (base SQLite, cache, logs)
- `api_jwt` : Persiste `/var/www/html/config/jwt` (clés JWT)

### GitHub Secrets requis

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | IP ou domaine du VPS |
| `VPS_USER` | Utilisateur SSH (`deploy`) |
| `VPS_SSH_KEY` | Clé privée SSH (ed25519) |

## Validation Criteria

- [ ] `docker compose build` réussit localement
- [ ] `docker compose up` lance les 3 services
- [ ] Frontend accessible sur http://localhost
- [ ] API accessible sur http://localhost/api
- [ ] Pipeline GitHub Actions passe (test → build → deploy)
- [ ] Application accessible sur le VPS après deploy

## Changes Log

- 2026-01-17 15:00: Création initiale - Configuration Docker et CI/CD

## Git History

_Section à compléter après commit avec l'ID de ticket COG-001_
