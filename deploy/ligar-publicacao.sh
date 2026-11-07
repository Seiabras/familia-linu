#!/usr/bin/env bash
# Liga a publicação automática do Família Linu. Rodar uma vez, no computador, de dentro do repositório:
#   bash deploy/ligar-publicacao.sh
# 1. cria uma chave só para o GitHub Actions;
# 2. na VM, cria o usuário familialinu (sem sudo) preso ao receber.sh, com essa chave;
# 3. guarda a chave e a identidade da VM nos segredos do repositório e apaga a chave do computador;
# 4. dispara a primeira publicação.
set -euo pipefail
cd "$(dirname "$0")/.."
VM=ubuntu@168.138.155.95
ADM=~/.ssh/id_ed25519_linulingo
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

ssh-keygen -q -t ed25519 -N "" -C "github-actions familia-linu" -f "$TMP/chave"
scp -q -i "$ADM" deploy/receber.sh deploy/instalar-uma-vez.sh "$VM:/tmp/"
ssh -i "$ADM" "$VM" "sudo bash /tmp/instalar-uma-vez.sh '$(cat "$TMP/chave.pub")' && rm /tmp/receber.sh /tmp/instalar-uma-vez.sh"
ssh -i "$ADM" "$VM" 'echo "168.138.155.95 $(cut -d" " -f1,2 /etc/ssh/ssh_host_ed25519_key.pub)"' > "$TMP/vm"

gh secret set ORACLE_SSH_KEY -R Seiabras/familia-linu < "$TMP/chave"
gh secret set ORACLE_HOST_KEY -R Seiabras/familia-linu < "$TMP/vm"
gh workflow run oracle.yml -R Seiabras/familia-linu
echo "Pronto: a primeira publicação foi disparada."
