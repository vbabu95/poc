#!/usr/bin/env bash

. $NVM_DIR/nvm.sh || echo "Installing NodeJS" && \
nvm install && \
nvm use && \
npm prune && \
npm install && \
npm start