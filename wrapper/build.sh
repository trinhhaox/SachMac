#!/bin/bash
# SachMac App Builder Script
set -euo pipefail

PROJECT_DIR="/Users/trinhhao/Antigravity/SachMac"
APP_PATH="/Applications/SachMac.app"

echo "Building Swift wrapper..."
# Biên dịch Swift binary
swiftc -O "$PROJECT_DIR/wrapper/main.swift" -o "$PROJECT_DIR/wrapper/SachMac"

echo "Creating App Bundle structure..."
# Tạo cấu trúc thư mục bundle
rm -rf "$APP_PATH"
mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources/backend"
mkdir -p "$APP_PATH/Contents/Resources/frontend/dist"

# Copy các thành phần chính
cp "$PROJECT_DIR/wrapper/SachMac" "$APP_PATH/Contents/MacOS/SachMac"
cp "$PROJECT_DIR/wrapper/Info.plist" "$APP_PATH/Contents/Info.plist"

echo "Copying Backend code..."
cp -R "$PROJECT_DIR/backend/" "$APP_PATH/Contents/Resources/backend/"

echo "Copying Frontend static build..."
cp -R "$PROJECT_DIR/frontend/dist/" "$APP_PATH/Contents/Resources/frontend/dist/"

# Copy icon
if [[ -f "/Applications/Mole.app/Contents/Resources/applet.icns" ]]; then
    echo "Copying custom app icon..."
    cp "/Applications/Mole.app/Contents/Resources/applet.icns" "$APP_PATH/Contents/Resources/applet.icns"
fi

# Refresh Finder icon cache
touch "$APP_PATH"

echo "SachMac.app built successfully and installed in /Applications!"
