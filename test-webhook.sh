#!/bin/bash

# Configuration
URL="https://disposemail.xyz/api/webhook/email"
# URL="http://localhost:3000/api/webhook/email" # Uncomment to test locally
TARGET_EMAIL="test@disposemail.xyz"

# Optional Secret (if you set it in .env)
# API_KEY="your_secret_key" 

echo "Testing Webhook at: $URL"
echo "Sending email to: $TARGET_EMAIL"

# Simulate a raw email payload
curl -X POST "$URL" \
     -H "Content-Type: text/plain" \
     --data "From: sender@example.com
To: $TARGET_EMAIL
Subject: Test Email via Curl $(date)
Date: $(date -R)

This is a test email sent directly to the webhook endpoint.
If you see this in your Inbox, the Next.js API is working correctly.
The issue is likely in Cloudflare routing."

echo -e "\n\nRequest sent. Check your Inbox on the website (refresh if needed)."
