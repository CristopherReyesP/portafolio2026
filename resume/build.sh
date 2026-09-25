#!/usr/bin/env bash
# Rebuilds the CV PDFs from resume/src (requires pandoc and LibreOffice).
set -euo pipefail

cd "$(dirname "$0")"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

build() {
  local src="$1" out="$2"
  pandoc "src/$src" --reference-doc=src/ref.docx -o "$tmp/$out.docx"
  soffice --headless --convert-to pdf --outdir "$tmp" "$tmp/$out.docx" >/dev/null
  mv "$tmp/$out.pdf" "$out.pdf"
}

build cv.es.md CV_Cristopher_Reyes
build cv.en.md CV_Cristopher_Reyes_EN
