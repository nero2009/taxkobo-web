# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TaxKobo** is a tax compliance SaaS for Nigerian freelancers earning foreign income. The platform helps freelancers track multi-currency income, calculate Personal Income Tax (PIT), manage VAT thresholds, store WHT certificates, and generate filing-ready documents for Nigerian tax portals (LIRS e-Tax and FIRS TaxPro-Max).

## Business Context & Tax Rules

### Target User
- Nigerian freelancers (developers, designers, content creators) paid in foreign currency
- Operating as CAC Business Name/Enterprise (sole proprietor)
- Exporting services to clients outside Nigeria
- Typical income: €1,000/month (~₦1.7M at current rates)

### Key Nigerian Tax Rules (as of 2025)
- **PIT (Personal Income Tax)**: Filed via LIRS e-Tax, deadline **31 March**
  - Progressive bands: 7% → 24% on chargeable income
  - CRA (Consolidated Relief Allowance): max(₦200k, 1% of gross) + 20% of gross
  - Expenses: Only business-use portion is deductible (tracked via percentage slider)
- **VAT**: Required only if turnover ≥ ₦25M threshold (₦50M in upcoming reforms)
  - Exported services are **0% VAT** (zero-rated)
  - Monthly filing by **21st** on FIRS TaxPro-Max
- **WHT (Withholding Tax)**: 5% on professional services from Nigerian payers
  - Credits offset against PIT; requires certificate storage
- **Multi-currency**: Each receipt must store both FX amount and NGN conversion rate at transaction date

### Tax Calculation Example (per spec)
- Gross receipts: €12,000/year × ₦1,710/€ = ₦20,520,000
- Deductible expenses (50% business-use): ₦2,140,000
- CRA: ₦3,876,000
- Chargeable income: ₦14,504,000
- PIT due: **₦3,272,960** (~16% effective rate)

## Core Architecture (from MVP Spec)

### Data Model
The system tracks tax-relevant transactions with multi-currency support and audit trails:

- **users**: `(id, name, state, tin)` — User profile with Tax Identification Number
- **entities**: `(id, type, display_name, vat_registered, vat_threshold_rule, effective_from_date)` — Business entities (e.g., CAC Business Name)
- **receipts**: `(id, entity_id, date, currency, amt_fx, ngn_rate, amt_ngn, counterparty_country, export, wht_withheld_ngn, wht_cert_id)` — Income tracking with per-transaction FX rate
- **expenses**: `(id, entity_id, name, period, amt_ngn, business_use_pct, receipt_url)` — Deductible expenses with business-use percentage
- **pit_runs**: `(id, tax_year, gross_ngn, allow_ngn, cra_ngn, chargeable_ngn, pit_due_ngn, bands_version)` — PIT calculation snapshots with versioned tax bands
- **vat_runs**: `(id, month, sales_ngn, purchases_ngn, output_vat_ngn, input_vat_ngn, status)` — VAT period calculations
- **wht_certs**: `(id, payer_name, period, amount_ngn, rate_pct, certificate_url)` — WHT credit vault

### Critical Features
1. **Multi-currency ledger**: Store both FX amount and NGN rate per receipt (exchange rates vary per transaction date)
2. **PIT calculator**: Implement progressive bands + CRA with **versioned rules** (2025 reforms increase top rate to 25%)
3. **VAT threshold monitoring**: Alert at ₦25M (current) or ₦50M (upcoming reform)
4. **Export tagging**: Flag export receipts for 0% VAT treatment; require proof of foreign consumption
5. **WHT credit offsetting**: Auto-apply WHT certificates against PIT liability
6. **Deadline coach**: Hard deadlines are **31 March (PIT)** and **21st monthly (VAT/WHT)**

### Filing Outputs
Generate portal-ready documents:
- **PIT working papers**: Gross income, expenses, CRA breakdown, band-by-band calculation
- **TaxPro-Max CSVs**: VAT sales/purchases schedules, WHT reconciliation
- **Audit trail**: Business-use % justifications, receipt URLs, counterparty country proof

## Development Guidelines

### Tax Calculation Rules
- **Always version tax rules**: Use `effective_from_date` and `bands_version` fields. Tax rates changed in 2025 and may change again.
- **Never round mid-calculation**: Only round final NGN amounts (to nearest Naira). Preserve precision through intermediate steps.
- **Business-use percentage**: Must be stored per expense for audit trail. Common pattern: 50% for home office costs (rent, utilities).
- **CRA formula**: `max(200000, gross_income * 0.01) + (gross_income * 0.20)` where gross_income = receipts - deductible expenses.

### Multi-Currency Handling
- Store **three values** for every receipt: `amt_fx`, `currency`, `ngn_rate`
- The `ngn_rate` should be the actual rate on the transaction date (not a period average)
- Display FX amounts in original currency; calculate taxes in NGN only
- Tag receipts with `counterparty_country` for export validation

### Portal Integration
- **LIRS e-Tax**: PIT filing portal (Lagos State). URLs may change; store deep links separately.
- **FIRS TaxPro-Max**: Federal VAT/WHT portal. Accept uploaded CSVs; provide templates.
- Do **not** scrape or automate logins. Generate downloadable files for manual upload.

### Pricing Tiers (from spec)
- **Free**: Tracking + PIT estimate + deadline reminders
- **Pro (₦3k-₦5k/mo)**: Bank sync, receipt OCR, WHT vault, VAT exports
- **File-for-me (flat fee)**: Human-assisted filing (partner network)

## UX Flow (from spec)
1. **Onboarding**: Capture state (Lagos/etc), CAC type, currencies, export share, staff count
2. **Money-in**: Amount, currency, NGN rate, counterparty country, export flag
3. **Expenses**: Category + business-use % slider (stored as audit trail)
4. **Dashboard**: YTD PIT accrual, WHT credits, VAT status, upcoming deadlines
5. **One-click return pack**: Generate PIT summary, VAT schedules, WHT reconciliation

## Testing Considerations
- Test PIT calculations against the worked example in the spec (€12k income → ₦3,272,960 tax)
- Verify CRA formula with edge cases (low income where 1% < ₦200k)
- Test VAT threshold warnings at ₦25M and ₦50M boundaries
- Validate business-use percentage constraints (0-100%)
- Test multi-currency with EUR, USD, GBP (common freelancer currencies)

## Roadmap Phases (from spec)
- **0-90 days**: Calculator + ledger + export tagging + deadline coach + CSV exports
- **3-6 months**: Bank feeds, receipt OCR, rule versioning, what-if simulations, partner network
- **6-12 months**: Team plans (PAYE/Pension), incorporation path, multi-state support

## External Resources
- LIRS e-Tax portal: https://etax.lirs.net
- FIRS TaxPro-Max: Search "TaxPro-Max login" (URLs change frequently)
- Nigerian tax law references: PITA (Personal Income Tax Act), VAT Act
- Global comps for inspiration: Taxfix (UK/DE), Keeper (US), ClearTax (India), TaxTim (South Africa)
