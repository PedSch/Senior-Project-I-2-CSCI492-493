#!/bin/bash

# Install Electron dependencies for Ubuntu/Debian dev containers

echo "Installing Electron system dependencies..."

sudo apt-get update

sudo apt-get install -y \
  libatk1.0-0t64 \
  libatk-bridge2.0-0t64 \
  libcups2t64 \
  libdrm2 \
  libdbus-1-3 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libcairo2 \
  libasound2t64 \
  libatspi2.0-0t64 \
  libxshmfence1 \
  libnss3 \
  libnspr4 \
  libx11-xcb1 \
  libxcb-dri3-0 \
  libgtk-3-0t64 \
  xvfb \
  x11-utils

echo ""
echo "Dependencies installed successfully!"
echo ""
echo "Run with virtual display:"
echo "  xvfb-run --auto-servernum npm start"
echo ""
echo "Or just run tests:"
echo "  npm test"
