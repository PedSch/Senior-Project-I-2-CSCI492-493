# Running in Dev Container / Codespaces

This project uses Electron which requires system libraries. In a dev container environment:

## Install System Dependencies

```bash
chmod +x install-electron-deps.sh
./install-electron-deps.sh
```

Or manually:
```bash
sudo apt-get update
sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
  libdbus-1-3 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
  libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 libatspi2.0-0 \
  libxshmfence1 libnss3 libnspr4 libx11-xcb1 libxcb-dri3-0 libgtk-3-0
```

## Alternative: Run Without Display (Testing Only)

For headless testing:
```bash
# Run tests without GUI
npm test
npm run lint

# Or use Xvfb (virtual framebuffer)
xvfb-run npm start
```

## Development Container Config

Add to `.devcontainer/devcontainer.json`:
```json
{
  "name": "Campus Scheduler",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  },
  "postCreateCommand": "npm install && ./install-electron-deps.sh",
  "forwardPorts": []
}
```

## Known Limitation

Electron GUI apps don't work well in browser-based dev environments (Codespaces, Gitpod). 

**Recommended:** Clone locally and run on your machine for GUI features, or use the test suite for validation.
