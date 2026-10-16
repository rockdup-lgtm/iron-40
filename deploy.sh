#!/bin/sh
# Deploy Iron 40 to Cloudflare Pages.
# Copies only the app into _site/ (never the launch-video folders), then uploads it.
# First time: run `npx wrangler login` once.
set -e
cd "$(dirname "$0")"
rm -rf _site
mkdir -p _site
cp index.html exercises.js i18n.js i18n-ui.js i18n-data.js sw.js manifest.json _site/
cp -R img functions _site/
cd _site
npx wrangler@4 pages deploy . --project-name iron-40 --branch main --commit-dirty=true
