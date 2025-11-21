#!/bin/bash
# Quick verification script for Campus Room Scheduler v2.0.0

echo "🔍 Campus Room Scheduler - Installation Verification"
echo "=================================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node --version 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ Node.js: $NODE_VERSION"
    # Extract major version
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo "⚠️  WARNING: Node.js 18+ required, you have v$MAJOR_VERSION"
        echo "   Please upgrade: https://nodejs.org/"
    fi
else
    echo "❌ Node.js not found!"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi
echo ""

# Check npm version
echo "📦 Checking npm version..."
NPM_VERSION=$(npm --version 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ npm: v$NPM_VERSION"
else
    echo "❌ npm not found!"
    exit 1
fi
echo ""

# Check if node_modules exists
echo "📂 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"
    
    # Check for key packages
    if [ -d "node_modules/electron" ]; then
        ELECTRON_VERSION=$(cat node_modules/electron/package.json | grep '"version"' | head -1 | cut -d'"' -f4)
        echo "✅ Electron installed: v$ELECTRON_VERSION"
    else
        echo "⚠️  Electron not found in node_modules"
    fi
else
    echo "⚠️  node_modules not found - run 'npm install'"
fi
echo ""

# Check package.json
echo "📄 Checking package.json..."
if [ -f "package.json" ]; then
    APP_VERSION=$(cat package.json | grep '"version"' | head -1 | cut -d'"' -f4)
    APP_NAME=$(cat package.json | grep '"name"' | head -1 | cut -d'"' -f4)
    echo "✅ $APP_NAME v$APP_VERSION"
else
    echo "❌ package.json not found!"
    exit 1
fi
echo ""

# Check main files
echo "📂 Checking core files..."
REQUIRED_FILES=("main.js" "mainWindow.html" "Schedule.html" "README.md")
ALL_FOUND=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file NOT FOUND"
        ALL_FOUND=false
    fi
done
echo ""

# Check new config files
echo "⚙️  Checking configuration files..."
CONFIG_FILES=(".eslintrc.json" ".prettierrc.json" ".gitignore")

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "⚠️  $file not found (optional)"
    fi
done
echo ""

# Final summary
echo "=================================================="
if [ "$ALL_FOUND" = true ] && [ "$MAJOR_VERSION" -ge 18 ]; then
    echo "✅ All checks passed!"
    echo ""
    echo "Next steps:"
    echo "  1. npm install    (if not done yet)"
    echo "  2. npm start      (to run the app)"
    echo "  3. npm run build  (to create distributable)"
else
    echo "⚠️  Some issues found - see warnings above"
fi
echo "=================================================="
