# =============================================================================
# COGIT Construction - Makefile
# =============================================================================
#
# DEVELOPMENT (local machine)
# ---------------------------
# 1. First time setup (creates htpasswd file):
#      make dev-setup
#
# 2. Start the app:
#      make dev
#    Access at http://localhost
#
# 3. Start with SQLite Web UI:
#      make dev-db
#    App at http://localhost, DB UI at http://localhost/db/ (user: admin)
#
# 4. View logs:
#      make logs
#
# 5. Stop everything:
#      make down
#
#
# PRODUCTION (VPS)
# ----------------
# Prerequisites:
#   - Run scripts/vps-init.sh as root first (creates deploy user, firewall, etc.)
#   - Clone repo to ~/cogit as deploy user
#
# 1. Initial setup (generates SSL cert + DB admin password):
#      cd ~/cogit
#      make prod-setup
#
# 2. Configure GitHub Secrets:
#      VPS_HOST: <your-vps-ip>
#      VPS_USER: deploy
#      VPS_SSH_KEY: <private-key>
#
# 3. Push to main branch - CI/CD deploys automatically
#    Or manually:
#      make prod-up
#
# 4. Access:
#      App: https://your-domain/
#      DB Admin: https://your-domain/db/ (user: admin, password from step 1)
#
# =============================================================================

.PHONY: help dev dev-setup dev-db prod-setup prod-up prod-down logs down

help:
	@echo "Development:"
	@echo "  make dev-setup  - First time: create htpasswd for DB admin"
	@echo "  make dev        - Start app (nginx, frontend, api)"
	@echo "  make dev-db     - Start app + SQLite web UI (http://localhost/db/)"
	@echo "  make down       - Stop all containers"
	@echo "  make logs       - Follow container logs"
	@echo ""
	@echo "Production (run on VPS):"
	@echo "  make prod-setup - Generate SSL cert + htpasswd for DB admin"
	@echo "  make prod-up    - Start production stack"
	@echo "  make prod-down  - Stop production stack"

# =============================================================================
# DEVELOPMENT
# =============================================================================

dev-setup:
	@echo "Creating htpasswd for SQLite Web UI..."
	@echo "Enter password for 'admin' user:"
	@if command -v htpasswd >/dev/null 2>&1; then \
		htpasswd -c htpasswd admin; \
	else \
		echo "htpasswd not found. Using Docker to generate..."; \
		read -s -p "Password: " pw && echo && \
		docker run --rm httpd:alpine htpasswd -nb admin "$$pw" > htpasswd; \
	fi
	@echo ""
	@echo "Done! Access DB at http://localhost/db/ (user: admin)"

dev:
	docker compose -f docker-compose.yml up -d

dev-db:
	@if [ ! -f htpasswd ]; then \
		echo "Error: htpasswd file not found. Run 'make dev-setup' first."; \
		exit 1; \
	fi
	docker compose -f docker-compose.yml --profile dev up -d

down:
	docker compose -f docker-compose.yml --profile dev down

logs:
	docker compose logs -f

# =============================================================================
# PRODUCTION (run these on the VPS as deploy user)
# =============================================================================

prod-setup:
	@echo "=== Production Setup ==="
	@echo ""
	@echo "1. Creating SSL directory..."
	mkdir -p ssl
	@echo ""
	@echo "2. Generating self-signed SSL certificate..."
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/nginx.key -out ssl/nginx.crt \
		-subj '/CN=localhost'
	@echo ""
	@echo "3. Creating htpasswd for SQLite Web UI (/db)..."
	@echo "   Enter a strong password for the 'admin' user:"
	htpasswd -c htpasswd admin
	@echo ""
	@echo "=== Setup complete ==="
	@echo "SSL cert: ssl/nginx.crt, ssl/nginx.key"
	@echo "DB Admin: https://your-domain/db/ (user: admin)"

prod-up:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down
