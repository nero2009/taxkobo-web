# Nigerian PIT Calculator 2025

A standalone Personal Income Tax calculator for Nigerian freelancers earning foreign income.

## Overview

This calculator helps Nigerian freelancers calculate their 2025 PIT liability in 30 seconds with multi-currency support (EUR, USD, GBP, NGN).

## Files

- `index.html` - Main calculator interface
- `calculator.js` - PIT calculation logic with 2025 PITA tax bands
- `test-calculator.js` - Test suite for calculator functions

## Features

- Multi-currency income conversion (EUR, USD, GBP → NGN)
- 2025 PITA tax band calculations (7% → 24%)
- CRA (Consolidated Relief Allowance) computation
- VAT threshold monitoring (₦25M)
- Real-time calculation breakdown
- Mobile-responsive design

## Local Development

### Run locally
```bash
# Open index.html in any modern browser
open index.html
```

### Run tests
```bash
node test-calculator.js
```

## Deployment Options

### Option 1: Static Hosting (Recommended)
Deploy to any static hosting service:

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from this directory
vercel
```

**Netlify:**
```bash
# Drag and drop this folder to netlify.com/drop
# Or use CLI:
netlify deploy --dir=.
```

**GitHub Pages:**
```bash
# Push this folder to a GitHub repo
# Enable GitHub Pages in repo settings
# Set source to main branch / root
```

### Option 2: CDN Deployment
Upload all files to any CDN or cloud storage:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage

### Option 3: Self-hosted
Copy files to any web server:
```bash
# Example with nginx
cp -r . /var/www/html/tax-calculator/
```

## Requirements

- No build process required
- No server-side dependencies
- Works with any modern browser (Chrome, Firefox, Safari, Edge)
- Uses Tailwind CSS from CDN (no npm install needed)

## Tax Calculation Rules

Based on **PITA 2025 (Fifth Schedule)**:
- Progressive tax bands: 7% → 11% → 15% → 19% → 21% → 24%
- CRA formula: `max(₦200k, 1% of gross) + 20% of gross`
- Filing deadline: March 31, 2026
- VAT threshold: ₦25M (₦50M in upcoming reforms)

## License

Part of the Nerozz tax compliance platform for Nigerian freelancers.
