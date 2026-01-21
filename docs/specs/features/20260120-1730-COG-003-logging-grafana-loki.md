# COG-003: Logging with Grafana & Loki

**Status:** Implemented
**Created:** 2026-01-20 17:30
**Last Updated:** 2026-01-20 17:30
**Author:** Pierre

## Context

Pour faciliter le debugging et le monitoring en développement et production, on a besoin d'un système de logs centralisé et explorable. La stack Grafana + Loki est le standard pour les environnements Docker, offrant une interface similaire à Prometheus mais pour les logs.

## Requirements

- [x] Collecter les logs de tous les containers Docker
- [x] Interface web pour explorer les logs
- [x] Filtrage par service/container
- [x] Protection par mot de passe
- [x] Fonctionne en local (dev) et en production

## Technical Approach

### Stack choisie

| Composant | Rôle |
|-----------|------|
| **Loki** | Base de données de logs (like Prometheus for logs) |
| **Promtail** | Agent qui collecte les logs Docker et les envoie à Loki |
| **Grafana** | Interface web pour visualiser et explorer les logs |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
│  ┌─────────┐  ┌──────────┐  ┌───────┐  ┌───────────┐   │
│  │  nginx  │  │ frontend │  │  api  │  │ sqliteweb │   │
│  └────┬────┘  └────┬─────┘  └───┬───┘  └─────┬─────┘   │
│       │            │            │            │          │
│       └────────────┴────────────┴────────────┘          │
│                         │                               │
│                    Docker logs                          │
│                         │                               │
│                   ┌─────▼─────┐                         │
│                   │ Promtail  │ (scrapes Docker socket) │
│                   └─────┬─────┘                         │
│                         │                               │
│                   ┌─────▼─────┐                         │
│                   │   Loki    │ (stores logs)           │
│                   └─────┬─────┘                         │
│                         │                               │
│                   ┌─────▼─────┐                         │
│                   │  Grafana  │ (visualize/query)       │
│                   └───────────┘                         │
└─────────────────────────────────────────────────────────┘
```

### Accès

| Environnement | URL | Auth |
|---------------|-----|------|
| Local | http://localhost/grafana/ | nginx basic auth + Grafana auth |
| Production | https://domain/grafana/ | nginx basic auth + Grafana auth |

## Implementation Notes

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `grafana/provisioning/datasources/loki.yaml` | Auto-configure Loki comme datasource |
| `promtail/config.yaml` | Configuration de collecte des logs Docker |

### Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `docker-compose.yml` | Services loki, promtail, grafana (profile dev) |
| `docker-compose.prod.yml` | Services loki, promtail, grafana (toujours actifs) |
| `nginx.ci.conf` | Route /grafana/ avec basic auth |
| `nginx.conf` | Route /grafana/ avec basic auth |

### Configuration Promtail

Promtail utilise Docker service discovery pour automatiquement détecter les containers et collecter leurs logs :

```yaml
scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
    relabel_configs:
      # Filter to only our project
      - source_labels: ['__meta_docker_container_label_com_docker_compose_project']
        regex: construction-scheduling-app
        action: keep
      # Add service label
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: service
```

### Configuration Grafana

- Sub-path: `/grafana/` via `GF_SERVER_ROOT_URL` et `GF_SERVER_SERVE_FROM_SUB_PATH`
- Auth: Grafana built-in auth (admin/admin par défaut) + nginx basic auth
- Datasource Loki auto-provisionné au démarrage

### Volumes Docker

- `loki_data`: Stockage des logs indexés
- `grafana_data`: Configuration et dashboards Grafana

## Validation Criteria

- [x] Grafana accessible sur http://localhost/grafana/
- [x] Loki datasource pré-configuré dans Grafana
- [x] Logs visibles dans Grafana Explore
- [x] Filtrage par service fonctionne
- [x] Configuration production prête

## Usage

### Démarrage local (avec logs)

```bash
docker compose --profile dev up -d
```

### Accès Grafana

1. Aller sur http://localhost/grafana/
2. Entrer credentials nginx basic auth (admin/admin)
3. Entrer credentials Grafana (admin/admin)
4. Aller dans Explore → sélectionner Loki
5. Query exemple: `{service="api"}` ou `{service="nginx"}`

### Queries Loki utiles

| Query | Description |
|-------|-------------|
| `{service="api"}` | Logs du backend Symfony |
| `{service="nginx"}` | Logs nginx (access + error) |
| `{service="frontend"}` | Logs Next.js |
| `{service=~"api\|nginx"}` | Logs API et nginx |
| `{service="api"} \|= "error"` | Logs API contenant "error" |

## Changes Log

- 2026-01-20 17:30: Création initiale - Stack Grafana + Loki + Promtail
