#!/bin/bash
set -e

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed"
    exit 1
fi

# Check for PM2
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed"
    exit 1
fi

echo "===================================="
echo "Deployment started, pulling codes..."
echo "===================================="

# Copy the current deployment script to a temporary location
cp scripts/deploy.sh /tmp/deploy.sh

# Fetch the latest code from the master branch and reset the working directory
git fetch origin master && git reset --hard origin/master
git submodule update --recursive --remote

# Check if the temporary deployment script exists
if [ -f /tmp/deploy.sh ]; then
    # Compare the current deployment script with the temporary deployment script to detect any new changes
    if ! cmp -s /tmp/deploy.sh scripts/deploy.sh; then
        echo "===================================="
        echo "New deployment script detected, restarting..."
        echo "===================================="
        exec /bin/bash ./scripts/deploy.sh

        exit 0
    fi
fi

echo "===================================="
echo "Installing dependencies..."
echo "===================================="
npm install

echo "===================================="
echo "Building the project..."
echo "===================================="
npm run build

echo "===================================="
echo "Restarting PM2 process..."
echo "===================================="
pm2 restart "godong mpay admin"

echo "===================================="
echo "Deployment finished"
echo "===================================="