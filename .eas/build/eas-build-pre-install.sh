#!/usr/bin/env bash

set -euo pipefail

echo "Adding AndroidX properties to gradle.properties..."

cat >> android/gradle.properties << 'EOF'

# AndroidX and Jetifier
android.useAndroidX=true
android.enableJetifier=true
EOF

echo "gradle.properties updated successfully"
