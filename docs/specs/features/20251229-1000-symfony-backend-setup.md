# Symfony Backend Setup

**Status:** Implemented
**Created:** 2025-12-29 10:00
**Last Updated:** 2025-12-29 10:30
**Author:** Pierre

## Context

Le frontend Next.js nécessite un backend API. On installe Symfony (dernière version LTS) dans un sous-dossier `/api` pour garder une séparation claire tout en restant dans le même repo.

## Requirements

- [x] Installer Symfony 7.4 LTS dans `/api`
- [x] Configurer le proxy Next.js pour router `/api/*` vers Symfony en dev
- [x] Mettre à jour `.gitignore` pour les fichiers Symfony

## Technical Approach

- Symfony 7.4 LTS (compatible PHP 8.2+)
- PHP 8.4.7 (installé)
- Installation via Composer dans `/api`
- Proxy Next.js via `next.config.mjs` rewrites

## Environment

- PHP: 8.4.7
- Symfony: 7.4 LTS
- Structure: `/api` subfolder

## Implementation Notes

### Pourquoi `/api` subfolder ?

- Évite les conflits (`public/`, `.env`)
- Séparation claire frontend/backend
- Facilite le déploiement (reverse proxy en prod)
- Possibilité de séparer en repos distincts plus tard

### Proxy Next.js

En développement, Next.js proxyfie les requêtes `/api/*` vers le serveur Symfony local (port 8000), évitant les problèmes CORS.

## Validation Criteria

- [x] `composer install` fonctionne dans `/api`
- [ ] Symfony démarre avec `symfony server:start` ou `php -S`
- [ ] Le proxy Next.js route correctement vers Symfony

## Changes Log

- 2025-12-29 10:00: Création initiale
- 2025-12-29 10:30: Installation Symfony 7.4.2 LTS, proxy Next.js configuré, .gitignore mis à jour
