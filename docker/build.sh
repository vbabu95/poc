#!/usr/bin/env bash

[ -s "$NVM_DIR/nvm.sh" ] && . $NVM_DIR/nvm.sh || echo "Installing NodeJS" && \
nvm install && \
nvm use && \
npm prune && \
npm install && \
npm test -s && \
npm run docs && \
npm run build && \
#keeps the size of context down to speed up build of prod image
npm prune --production