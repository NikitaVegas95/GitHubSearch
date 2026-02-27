#!/usr/bin/env sh

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "[hooks] Git repository not found. Skipping hooks check."
  exit 0
fi

hooks_path=$(git config --get core.hooksPath || true)

if [ "$hooks_path" != ".husky" ] && [ "$hooks_path" != ".husky/_" ]; then
  echo "[hooks] ERROR: Git hooks are not active (core.hooksPath='$hooks_path')."
  echo "[hooks] Run: npm run prepare"
  echo "[hooks] Then verify: git config --get core.hooksPath"
  exit 1
fi

echo "[hooks] OK: core.hooksPath=$hooks_path"
