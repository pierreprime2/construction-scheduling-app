# COG-001: Docker & CI/CD Deployment

**Status:** Implemented
**Created:** 2026-01-17 15:00
**Last Updated:** 2026-01-21
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

- `/api/auth/*` → Frontend Next.js (route handlers auth)
- `/api/backend/*` → Frontend Next.js (proxy vers Symfony)
- `/api/*` → Backend Symfony PHP-FPM (port 9000)
- `/db/*` → sqlite-web (basic auth) - voir COG-002
- `/grafana/*` → Grafana (basic auth) - voir COG-003
- `/*` → Frontend Next.js (port 3000)

Note: L'ordre est important - nginx utilise la correspondance la plus spécifique.

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
| `docker-compose.yml` | Orchestration des 3 services avec build local |
| `docker-compose.prod.yml` | Orchestration avec images GHCR pré-construites |
| `nginx.conf` | Configuration reverse proxy HTTPS (prod) |
| `nginx.ci.conf` | Configuration reverse proxy HTTP (CI/local) |
| `Dockerfile` | Image frontend Next.js (multi-stage, standalone) |
| `api/Dockerfile` | Image backend PHP-FPM 8.2 |
| `api/docker-entrypoint.sh` | Script init: JWT keys, migrations, fixtures |
| `.github/workflows/deploy.yml` | Pipeline CI/CD 3 stages |
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

- [x] `docker compose build` réussit localement
- [x] `docker compose up` lance les 3 services
- [x] Frontend accessible sur http://localhost
- [x] API accessible sur http://localhost/api
- [x] Pipeline GitHub Actions passe (test → build → deploy)
- [x] Application accessible sur le VPS après deploy (testé avant suspension OVH)
- [x] Authentification fonctionne (login/register)
- [x] Dashboard charge les données via /api/backend/*

## Changes Log

- 2026-01-17 15:00: Création initiale - Configuration Docker et CI/CD
- 2026-01-19: Ajout HTTPS avec certificat auto-signé
- 2026-01-19: Séparation nginx.conf (prod HTTPS) et nginx.ci.conf (CI HTTP)
- 2026-01-19: Fix routage /api/auth/* et /api/backend/* vers Next.js
- 2026-01-20: Fix variable API_URL dans backend proxy route handler
- 2026-01-20: Note: VPS OVH suspendu suite à compromission (attaque UDP sortante via CVE-2025-55182)
- 2026-01-20: Ajout route /db/* pour sqlite-web (COG-002)
- 2026-01-20: Ajout route /grafana/* pour Grafana (COG-003)
- 2026-01-21: **SECURITY** Upgrade Next.js 16.0.3 → 16.1.4 (fix CVE-2025-55182 "React2Shell" RCE)

## Git History

Commits liés à COG-001:
- `1c952b6` feat(COG-001): add Docker and CI/CD configuration
- `394aaa1` fix(nginx): allow internal HTTP API calls from frontend container
- `8888cfa` fix(nginx): route /api/auth/* to Next.js, not Symfony
- `9712f9f` fix(nginx): route /api/backend/* to Next.js
- `a863e6a` fix(nginx): add /api/auth and /api/backend routes to CI config
