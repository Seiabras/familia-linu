#!/usr/bin/env bash
# Prepara a VM para receber o Família Linu pelo GitHub Actions. Rodar uma vez, como administrador:
#   sudo bash instalar-uma-vez.sh "<chave pública do GitHub Actions>"
# Cria o usuário familialinu (sem sudo), dono de /opt/familia-linu, e prende a chave ao receber.sh.
# Pode rodar de novo sem estragar nada.
set -euo pipefail
CHAVE="${1:?passe a chave pública}"
BASE=/opt/familia-linu
AQUI="$(cd "$(dirname "$0")" && pwd)"

id familialinu >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash familialinu
mkdir -p "$BASE/app"
install -m 755 -o root -g root "$AQUI/receber.sh" "$BASE/receber.sh"
chown familialinu: "$BASE" && chown -R familialinu: "$BASE/app"
chmod 755 "$BASE"

install -d -m 700 -o familialinu -g familialinu /home/familialinu/.ssh
echo "restrict,command=\"$BASE/receber.sh\" $CHAVE" > /home/familialinu/.ssh/authorized_keys
chown familialinu: /home/familialinu/.ssh/authorized_keys && chmod 600 /home/familialinu/.ssh/authorized_keys
echo "Pronto: familialinu recebe versões novas em $BASE/app."
