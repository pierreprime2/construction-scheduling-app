#!/bin/bash
#
# VPS Initialization Script - Security Hardening
# Compatible: Debian 12/13, Ubuntu 22.04/24.04
#
# USAGE:
#   1. SSH en root sur le nouveau VPS
#   2. curl -O https://raw.githubusercontent.com/pierreprime2/construction-scheduling-app/main/scripts/vps-init.sh
#   3. chmod +x vps-init.sh
#   4. ./vps-init.sh
#
# Ce script:
#   - Crée un utilisateur 'deploy' avec sudo
#   - Configure SSH (clé uniquement, pas de root login)
#   - Installe et configure UFW (ports 22, 80, 443)
#   - Installe et configure fail2ban
#   - Installe Docker et Docker Compose
#
# IMPORTANT: Exécuter en tant que ROOT sur un système frais
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== VPS Initialization Script ===${NC}"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}ERREUR: Ce script doit être exécuté en tant que root${NC}"
  echo "Usage: sudo ./vps-init.sh"
  exit 1
fi

if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS=$ID
  CODENAME=$VERSION_CODENAME
  echo -e "Système détecté: ${GREEN}$PRETTY_NAME${NC}"
else
  echo -e "${RED}ERREUR: Impossible de détecter le système d'exploitation${NC}"
  exit 1
fi

if [[ "$OS" != "debian" && "$OS" != "ubuntu" ]]; then
  echo -e "${RED}ERREUR: Ce script supporte uniquement Debian et Ubuntu${NC}"
  exit 1
fi

echo -e "${GREEN}[1/6] Mise à jour du système...${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}[2/6] Création de l'utilisateur 'deploy'...${NC}"
if id "deploy" &>/dev/null; then
  echo "L'utilisateur 'deploy' existe déjà"
else
  useradd -m -s /bin/bash -G sudo deploy
  echo -e "${YELLOW}Définissez un mot de passe pour 'deploy':${NC}"
  passwd deploy
fi

mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

echo ""
read -p "Voulez-vous ajouter une clé SSH maintenant? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Collez votre clé SSH publique (puis Entrée):"
  read -r SSH_KEY
  echo "$SSH_KEY" >> /home/deploy/.ssh/authorized_keys
  echo -e "${GREEN}Clé SSH ajoutée${NC}"
fi

echo -e "${GREEN}[3/6] Configuration SSH sécurisée...${NC}"
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

cat > /etc/ssh/sshd_config.d/hardening.conf << 'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
KbdInteractiveAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
EOF

echo -e "${YELLOW}ATTENTION: Testez la connexion SSH avant de fermer cette session!${NC}"

echo -e "${GREEN}[4/6] Installation et configuration UFW...${NC}"
apt install -y ufw
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
ufw status verbose

echo -e "${GREEN}[5/6] Installation et configuration fail2ban...${NC}"
apt install -y fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
maxretry = 5
findtime = 600

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl enable fail2ban
systemctl restart fail2ban
fail2ban-client status

echo -e "${GREEN}[6/6] Installation de Docker...${NC}"
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings

if [[ "$OS" == "debian" ]]; then
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $CODENAME stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
elif [[ "$OS" == "ubuntu" ]]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $CODENAME stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
fi

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker deploy

echo -e "${GREEN}Docker installé:${NC}"
docker --version
docker compose version

echo ""
echo -e "${GREEN}=== Installation terminée ===${NC}"
echo ""
echo -e "${YELLOW}PROCHAINES ÉTAPES:${NC}"
echo ""
echo "1. TESTEZ la connexion SSH (nouveau terminal):"
echo "   ssh deploy@$(hostname -I | awk '{print $1}')"
echo ""
echo "2. Si OK, redémarrez SSH:"
echo "   systemctl restart sshd"
echo ""
echo "3. En tant que deploy, préparez l'app:"
echo "   su - deploy"
echo "   mkdir -p ~/cogit/ssl"
echo "   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\"
echo "     -keyout ~/cogit/ssl/nginx.key -out ~/cogit/ssl/nginx.crt \\"
echo "     -subj '/CN=localhost'"
echo ""
echo "4. Configurez GitHub Secrets:"
echo "   VPS_HOST: $(hostname -I | awk '{print $1}')"
echo "   VPS_USER: deploy"
echo "   VPS_SSH_KEY: <votre clé privée>"
echo ""
echo -e "${RED}NE FERMEZ PAS cette session avant d'avoir testé SSH!${NC}"
