#!/bin/bash

# Generate self-signed certificate for local development
echo "🔐 Generating self-signed SSL certificate for local development..."

# Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "✅ SSL certificate generated successfully!"
echo "🔒 You can now access the app via HTTPS for mobile camera access"
echo "📱 Use: https://YOUR_IP:8443 on your mobile device"
