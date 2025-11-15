# PIT Calculator MVP Specification

## Overview
A simplified Personal Income Tax calculator for Nigerian freelancers earning foreign income. Designed as a lead magnet and conversion funnel for the TaxKobo SaaS platform.

## Target User
Nigerian freelancer who:
- Earns foreign currency (EUR/USD/GBP) from clients abroad
- Operates as sole proprietor/CAC Business Name
- Needs to estimate annual PIT liability for LIRS filing

## Design Principles
1. **Simplicity first**: Minimal inputs, instant results
2. **Currency-aware**: Multi-currency is the differentiator vs generic calculators
3. **Trust through transparency**: Show calculation breakdown, cite tax law
4. **Conversion-optimized**: Clear path from calculation → sign up for full ledger

---

## Input Fields

### Primary Inputs (Required)

**1. Annual Gross Income**
- **Field type**: Number input
- **Label**: "What was your total income last year?"
- **Helper text**: "Enter your gross receipts before any deductions"
- **Validation**: Must be > 0, max 999,999,999

**2. Income Currency**
- **Field type**: Dropdown/segmented control
- **Options**: EUR | USD | GBP | NGN
- **Default**: EUR (most common for Nigerian freelancers)
- **Label**: "Currency"

**3. Exchange Rate to NGN** (conditional - only shows if currency ≠ NGN)
- **Field type**: Number input
- **Label**: "Average exchange rate (1 {CURRENCY} = ? NGN)"
- **Placeholder**: e.g., "1710" for EUR
- **Helper text**: "Use the average rate from your transaction dates. [Get rates →](https://www.cbn.gov.ng/rates/)"
- **Validation**: Must be > 0, max 10,000
- **Note**: Link to CBN official rates for credibility

**That's it!** Just 2-3 fields (currency-dependent) to keep it ultra-simple.

---

## Calculation Logic

### Step 1: Convert to NGN
```
IF currency ≠ NGN:
  gross_ngn = gross_income × exchange_rate
ELSE:
  gross_ngn = gross_income
```

### Step 2: Calculate CRA (Consolidated Relief Allowance)
```
cra_minimum = max(200000, gross_ngn × 0.01)
cra_additional = gross_ngn × 0.20
cra_total = cra_minimum + cra_additional
```
**Source**: Section 33(1) of Personal Income Tax Act (PITA) as amended

**Note on CRA formula**: We use gross income (not adjusted gross) per FIRS guidance. The simplified calculator assumes no deductible expenses.

### Step 3: Calculate Chargeable Income
```
chargeable_income = max(0, gross_ngn - cra_total)
```

### Step 4: Apply Progressive Tax Bands (2025 rates)
```
Bands:
  First ₦300,000       @ 7%   = ₦21,000
  Next ₦300,000        @ 11%  = ₦33,000
  Next ₦500,000        @ 15%  = ₦75,000
  Next ₦500,000        @ 19%  = ₦95,000
  Next ₦1,600,000      @ 21%  = ₦336,000
  Above ₦3,200,000     @ 24%

Total tax = sum of tax per band up to chargeable_income
```
**Source**: Section 40 of PITA, Fifth Schedule

### Step 5: Final PIT Due
```
pit_due = total_tax
```
**Note**: The simplified calculator doesn't account for WHT credits or expenses. Users will see the full PIT liability before any offsets.

### Rounding Rules
- Round ALL NGN amounts to nearest Naira (no kobo)
- Only round at final display, preserve precision in intermediate calculations

---

## Output Display

### Primary Result Card (Hero Section)

```
┌─────────────────────────────────────────┐
│  YOUR ESTIMATED PIT FOR 2025            │
│                                         │
│  ₦3,272,960                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Due by: March 31, 2026                 │
│                                         │
│  [Save This Calculation →]              │
│  (Conversion CTA - see below)           │
└─────────────────────────────────────────┘
```

### Calculation Breakdown (Expandable)

Show transparent calculation steps to build trust:

```
Calculation Breakdown:

1. Gross Income
   €12,000 × ₦1,710 = ₦20,520,000

2. Less: Consolidated Relief Allowance (CRA)
   • Minimum relief: ₦205,200 (max of ₦200k or 1% of gross)
   • Additional relief: ₦4,104,000 (20% of gross)
   • Total CRA: ₦4,309,200

3. Chargeable Income = ₦16,210,800

4. Tax Calculation (Progressive Bands):
   • First ₦300,000 @ 7%    = ₦21,000
   • Next ₦300,000 @ 11%    = ₦33,000
   • Next ₦500,000 @ 15%    = ₦75,000
   • Next ₦500,000 @ 19%    = ₦95,000
   • Next ₦1,600,000 @ 21%  = ₦336,000
   • Balance ₦13,010,800 @ 24% = ₦3,122,592

5. TOTAL PIT DUE = ₦3,682,592
```

### Key Metrics Summary

Display in a grid below the breakdown:

```
┌───────────────────┬───────────────────┬───────────────────┐
│ Effective Rate    │ CRA Benefit       │ Filing Deadline   │
│ 17.9%             │ ₦4,309,200        │ March 31, 2026    │
└───────────────────┴───────────────────┴───────────────────┘
```

**Effective Rate** = (Total Tax ÷ Gross Income) × 100

---

## Trust Signals & Legal Disclaimers

### Trust Elements (Display on page)

1. **Worked Example Card** (above calculator)
   ```
   Example: Sarah's 2025 PIT
   Income: €12,000/year (~₦1.7M/month at ₦1,710)
   PIT due: ₦3,682,592
   Effective rate: 17.9%
   [Try Sarah's calculation →] (pre-fills form)
   ```

2. **Legal Citations**
   - Show "Calculations based on PITA 2025 (Fifth Schedule)" as footnote
   - Link to official FIRS tax rates page

3. **Credibility Badge** (when available)
   - "Reviewed by licensed tax professionals"
   - "Used by 1,000+ Nigerian freelancers" (social proof - add when true)

### Disclaimer (Footer)

```
⚠️ Disclaimer: This calculator provides estimates for informational
purposes only. Actual tax liability may vary based on your specific
circumstances. Consult a licensed tax professional or use our full
platform for accurate filing documents. Not a substitute for
professional tax advice.
```

---

## Conversion Flow (Anonymous → Sign Up)

### Primary CTA (After Calculation)

**Placement**: Immediately below main result card

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Track Your Income & Automate This Calculation           │
│                                                             │
│  Instead of manual calculations, let TaxKobo:                │
│  ✓ Auto-track multi-currency receipts year-round            │
│  ✓ Calculate PIT in real-time as you earn                   │
│  ✓ Store WHT certificates & expense receipts                │
│  ✓ Generate LIRS filing documents in one click              │
│                                                             │
│  [Get Started Free →]                                       │
│  No credit card required                                    │
└─────────────────────────────────────────────────────────────┘
```

### Secondary CTA (Sidebar/Sticky)

**Placement**: Right sidebar or sticky bottom banner

```
💡 Tired of manual tracking?
   Save this calculation + get:
   • Real-time PIT dashboard
   • Deadline reminders
   • Export-ready tax docs

   [Sign Up Free]
```

### Email Gate (Optional - Phase 2)

For users who click "Save This Calculation":
- Capture email only (no password yet)
- Send calculation PDF via email
- Include sign-up link in email
- Adds to nurture sequence (reminders as deadline approaches)

---

## UX Flow (Step-by-Step)

### Landing State
1. Hero headline: "Calculate Your 2025 PIT in 30 Seconds"
2. Subhead: "Free calculator for Nigerian freelancers earning foreign income"
3. Worked example card (Sarah's ₦3.68M tax)
4. Calculator form (3 simple fields maximum)
5. Trust signals (PITA citations, badge if available)

### Interaction Flow
1. User enters gross income → Currency selector appears
2. User selects EUR/USD/GBP → Exchange rate field appears (with CBN link)
3. User enters rate → NGN equivalent shows in real-time below input (e.g., "= ₦20,520,000")
4. User clicks "Calculate PIT" → Results appear with smooth scroll/animation

### Results State
1. Hero result card (₦X,XXX,XXX due by March 31)
2. Calculation breakdown (expandable accordion, collapsed by default)
3. Key metrics grid (effective rate, CRA benefit, deadline)
4. Primary conversion CTA (track income year-round)
5. Social share buttons (optional - "I calculated my PIT with TaxKobo")

---

## Technical Specifications

### Input Validation

| Field | Min | Max | Decimals | Required |
|-------|-----|-----|----------|----------|
| Gross Income | 1 | 999,999,999 | 2 | Yes |
| Exchange Rate | 0.01 | 10,000 | 2 | Conditional* |

*Required only if currency ≠ NGN

### Error States

- **Empty gross income**: "Please enter your gross income"
- **Missing currency**: "Please select your income currency"
- **Missing exchange rate**: "Exchange rate is required for foreign currency"
- **Invalid exchange rate**: "Exchange rate must be greater than 0"

### Calculation Edge Cases

1. **Very low income** (< ₦200k):
   - CRA minimum is still ₦200k
   - Chargeable income may be 0 → Tax due = ₦0
   - Display message: "Good news! Your income is below the taxable threshold. PIT = ₦0"

2. **Zero or negative chargeable income**:
   - After CRA deduction, if result ≤ 0 → Tax due = ₦0
   - Show message: "Your CRA allowances exceed your income. PIT = ₦0"

3. **Very high income** (> ₦100M):
   - Calculator should still work (no upper limit on tax calculation)
   - Consider adding message: "For high earners, consider consulting a tax professional for deduction optimization"

### Performance Requirements

- Calculation must complete in < 100ms (client-side JS)
- Results must appear without page reload (single-page app or HTMX)
- Mobile-responsive (50%+ traffic will be mobile)

### Analytics Tracking

Track these events:
- `calculator_loaded` (page view)
- `currency_selected` (which currency chosen - EUR/USD/GBP/NGN)
- `exchange_rate_entered` (indicates form completion progress)
- `calculate_clicked` (form submission)
- `result_displayed` (successful calculation with income bracket)
- `cta_clicked` (which CTA: primary/secondary/save)
- `breakdown_expanded` (trust signal - user wants details)
- `worked_example_clicked` (user pre-filled Sarah's example)

---

## Content Strategy (Copy Guidelines)

### Tone
- **Authoritative but approachable**: Tax is serious, but avoid intimidating jargon
- **Action-oriented**: "Calculate", "Track", "File" (not "Learn about...")
- **Localized**: Use Nigerian context (LIRS, FIRS, e-Tax, TaxPro-Max)

### Headlines/Microcopy
- Hero: "Calculate Your 2025 PIT in 30 Seconds"
- Subhead: "The only calculator built for Nigerian freelancers earning foreign income"
- CTA button: "Calculate My PIT" (not "Submit" or "Calculate")
- Trust badge: "Trusted by 500+ Nigerian freelancers" (update number as grows)

### SEO Keywords (For Landing Page)
- Primary: "Nigerian PIT calculator", "personal income tax Nigeria freelancer"
- Secondary: "tax calculator USD income Nigeria", "LIRS PIT calculator", "foreign income tax Nigeria"
- Long-tail: "how much tax do I owe LIRS", "calculate tax on dollar income Nigeria"

---

## Design Mockup Considerations

### Visual Hierarchy
1. Headline + worked example (trust signal)
2. Calculator form (primary action)
3. Results + breakdown (instant gratification)
4. Conversion CTA (business goal)
5. Footer disclaimer + links

### Color Palette Suggestions
- **Primary CTA**: Green (₦ naira color, growth, "go")
- **Results card**: Dark green or teal (professional, financial)
- **Trust signals**: Gold/yellow badges (credibility)
- **Alerts/deadlines**: Orange (urgency without alarm)

### Responsive Breakpoints
- **Mobile** (< 640px): Single column, full-width inputs, sticky CTA
- **Tablet** (640-1024px): Single column, wider inputs
- **Desktop** (> 1024px): Two-column (form left, worked example right)

---

## Phase 2 Enhancements (Post-MVP)

Once MVP proves conversion, consider:
1. **Live exchange rates**: Auto-fetch CBN rates via API (eliminate manual entry)
2. **Multi-year comparison**: "In 2024 you would have owed ₦X vs ₦Y in 2025" (show tax rule changes)
3. **What-if scenarios**: Slider to adjust income, see tax change in real-time (interactive visualization)
4. **Add expenses & WHT**: Unlock "Advanced mode" with deductions and credits (upsell to full platform)
5. **PDF export**: Download calculation as PDF (email gate for lead capture)
6. **Estimate vs actual**: For returning users, show "You estimated ₦X, you actually owe ₦Y"
7. **VAT threshold alert**: "You're ₦5M away from VAT registration requirement" (cross-sell VAT tracking)

---

## Success Metrics

### Traffic Goals (Q1 2026)
- 1,000 unique visitors (Jan-Mar tax season)
- 500 calculations completed (50% conversion from visitor → calculator)

### Conversion Goals
- 10% calculator → sign-up (50 users)
- 50% of sign-ups activate (add first receipt)

### Validation Metrics
- Bounce rate < 60% (users engage with calculator)
- Time on page > 2 minutes (read + calculate)
- Breakdown expansion rate > 30% (trust signal working)

---

## Launch Checklist

### Pre-Launch
- [ ] Validate PIT calculation against worked example (€12k → ₦3.68M)
- [ ] Test all currency conversion edge cases
- [ ] Test on mobile (iOS Safari, Chrome Android)
- [ ] Add meta tags for SEO (title, description, OG image)
- [ ] Set up analytics tracking (events listed above)
- [ ] Write disclaimer copy (reviewed by legal if possible)
- [ ] Prepare social share copy + graphics

### Launch (Mid-January 2026)
- [ ] Deploy to production domain (e.g., taxkobo.com/pit-calculator)
- [ ] Submit to Google Search Console
- [ ] Post on Nigerian freelancer communities (Twitter, Reddit r/Nigeria, Nairaland)
- [ ] Run Twitter thread explaining PIT calculation (link to calculator)
- [ ] Monitor analytics daily (fix any UX friction)

### Post-Launch (Feb-Mar)
- [ ] A/B test CTA copy ("Get Started Free" vs "Track My Income")
- [ ] Add testimonials from early users (social proof)
- [ ] Publish blog posts targeting long-tail keywords
- [ ] Monitor conversion funnel (identify drop-off points)

---

## Technical Implementation Notes

### Recommended Stack (if building from scratch)
- **Frontend**: Next.js (React) or plain HTML/JS + TailwindCSS
- **Calculation logic**: Client-side JavaScript (no backend needed for MVP)
- **Analytics**: Plausible or Vercel Analytics (privacy-friendly)
- **Hosting**: Vercel or Netlify (free tier sufficient for MVP)

### Calculation Function Signature
```javascript
function calculatePIT({
  grossIncome,      // number - income amount
  currency,         // 'EUR' | 'USD' | 'GBP' | 'NGN'
  exchangeRate      // number (nullable if currency = NGN)
}) {
  // Returns:
  return {
    grossNGN,           // converted gross income in Naira
    craMinimum,         // minimum CRA (max of ₦200k or 1% gross)
    craAdditional,      // additional CRA (20% of gross)
    craTotal,           // total CRA amount
    chargeableIncome,   // gross - CRA
    taxBreakdown,       // array of { band, rate, amount }
    totalTax,           // sum of tax per band
    pitDue,             // total tax (same as totalTax in simplified version)
    effectiveRate       // (totalTax / grossNGN) × 100
  }
}
```

### Test Cases
```javascript
// Test 1: Worked example from spec (Sarah's calculation)
calculatePIT({
  grossIncome: 12000,
  currency: 'EUR',
  exchangeRate: 1710
})
// Expected results:
// - grossNGN = ₦20,520,000
// - craTotal = ₦4,309,200
// - chargeableIncome = ₦16,210,800
// - pitDue = ₦3,682,592
// - effectiveRate ≈ 17.95%

// Test 2: Very low income (CRA minimum applies)
calculatePIT({
  grossIncome: 150000,
  currency: 'NGN'
})
// Expected results:
// - grossNGN = ₦150,000
// - craMinimum = ₦200,000 (minimum applies)
// - craTotal = ₦230,000 (₦200k + ₦30k)
// - chargeableIncome = ₦0 (CRA exceeds income)
// - pitDue = ₦0

// Test 3: NGN income (no conversion needed)
calculatePIT({
  grossIncome: 5000000,
  currency: 'NGN'
})
// Expected results:
// - grossNGN = ₦5,000,000
// - craTotal = ₦1,200,000
// - chargeableIncome = ₦3,800,000
// - pitDue = ₦716,000
// - effectiveRate = 14.32%

// Test 4: USD income
calculatePIT({
  grossIncome: 15000,
  currency: 'USD',
  exchangeRate: 1580
})
// Expected results:
// - grossNGN = ₦23,700,000
// - craTotal = ₦4,977,000
// - chargeableIncome = ₦18,723,000
// - pitDue = ₦4,283,520
```

---

## Open Questions / Decisions Needed

1. **State-specific rates**: MVP uses federal rates. Lagos state has additional levies - include or defer?
   - **Recommendation**: Defer to full SaaS. Calculator targets federal PIT only.

2. **Year selector**: Allow users to calculate for 2024 vs 2025 (rates changed)?
   - **Recommendation**: Default to 2025 (current). Add year toggle in Phase 2.

3. **Currency auto-detect**: Detect user's likely currency based on IP/browser locale?
   - **Recommendation**: Nice-to-have. Default to EUR (most common), let user change.

4. **CRA formula clarity**: Spec says "max(₦200k, 1% of gross) + 20% of gross".
   - **Recommendation**: Use gross income (total receipts) since simplified calculator has no expense deductions. Add footnote: "CRA calculated on gross income. Deductions available in full platform."

5. **VAT mention**: Calculator focuses on PIT, but should we mention VAT threshold?
   - **Recommendation**: Add note below results: "Good news: Your income is below the ₦25M VAT registration threshold." (if applicable)

---

## Appendix: Nigerian PIT Tax Bands (2025)

| Chargeable Income (NGN) | Rate | Max Tax in Band |
|------------------------|------|-----------------|
| First ₦300,000 | 7% | ₦21,000 |
| Next ₦300,000 | 11% | ₦33,000 |
| Next ₦500,000 | 15% | ₦75,000 |
| Next ₦500,000 | 19% | ₦95,000 |
| Next ₦1,600,000 | 21% | ₦336,000 |
| Above ₦3,200,000 | 24% | (no max) |

**Cumulative thresholds:**
- Up to ₦300k → 7%
- ₦300k - ₦600k → 11%
- ₦600k - ₦1.1M → 15%
- ₦1.1M - ₦1.6M → 19%
- ₦1.6M - ₦3.2M → 21%
- Above ₦3.2M → 24%

---

## Document History
- **Version**: 1.0
- **Date**: 2025-01-05
- **Author**: Spec for TaxKobo PIT Calculator MVP
- **Status**: Ready for development
