#!/usr/bin/env bash
# install_hooks.sh — KMS
# Installe le git hook post-commit depuis .githooks/

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOK_SRC="$REPO_ROOT/.githooks/post-commit"
HOOK_DST="$REPO_ROOT/.git/hooks/post-commit"

if [ ! -f "$HOOK_SRC" ]; then
  echo "Erreur : $HOOK_SRC introuvable."
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DST"
chmod +x "$HOOK_DST"

echo "Hook post-commit installé dans .git/hooks/post-commit"
echo "À chaque commit : backlinks recalculés + _graph.json régénéré."
