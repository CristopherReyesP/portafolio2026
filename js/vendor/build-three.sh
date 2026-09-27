#!/usr/bin/env bash
# Builds js/vendor/three.globe.min.js: a tree-shaken Three.js ES module that only
# contains the classes js/components/globe.js uses (one lazy request, no CDN).
# Run after changing the export list below; needs Node/npm (downloads to a temp dir).
set -euo pipefail

THREE_VERSION=0.186.1
ESBUILD_VERSION=0.28.1

cd "$(dirname "$0")"
out="$PWD/three.globe.min.js"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cat > "$tmp/entry.js" <<'JS'
export {
  BufferAttribute, BufferGeometry, Color, Group, LineSegments, PerspectiveCamera,
  Points, Scene, ShaderMaterial, WebGLRenderer
} from 'three';
JS

(cd "$tmp" && npm init -y >/dev/null && npm install --silent --no-audit --no-fund \
  "three@$THREE_VERSION" "esbuild@$ESBUILD_VERSION")
"$tmp/node_modules/.bin/esbuild" "$tmp/entry.js" --bundle --minify --format=esm \
  --legal-comments=eof --log-level=warning --outfile="$out"
echo "Built $out (three@$THREE_VERSION)"
