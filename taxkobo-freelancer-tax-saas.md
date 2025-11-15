
# Nigeria Freelancer Tax & SaaS Plan — *TaxKobo* (Business Name)
**Owner:** Tejumola "Tej" Animashaun • **Residence:** Lagos, Nigeria • **Date:** 3 Nov 2025
**Use‑case:** Foreign‑paid freelance software engineer earning **€1,000/month** via CAC **Business Name** ("TaxKobo") and transferring to personal account.

---

## 1) Assumptions & Exchange Rate
- Nigeria tax resident (Lagos).  
- CAC **Business Name/Enterprise** (sole proprietor); no employees.  
- Client is **outside Nigeria** (exported services).  
- No pension/NHF/life assurance contributions.  
- Annual expenses given: **Rent ₦3,200,000; Electricity ₦40k/mo; Internet ₦50k/mo.**  
- **Business-use apportioning:** 50% of home costs are deductible for tax.  
- **EUR→NGN** used: **₦1,710/€** (for illustration; assessments use the applicable rate on each receipt date).  

> ⚠️ This is an informational working note, not legal/tax advice. Rules change; confirm before filing.

---

## 2) Income & Expenses (Annualised)
**Gross receipts:** €12,000 ⇒ **₦20,520,000**  

**Expenses (user-provided):**
| Item | Monthly | Annual | Business-use % | **Deductible** |
|---|---:|---:|---:|---:|
| House rent | — | ₦3,200,000 | 50% | **₦1,600,000** |
| Electricity | ₦40,000 | ₦480,000 | 50% | **₦240,000** |
| Internet | ₦50,000 | ₦600,000 | 50% | **₦300,000** |
| **Total** | — | **₦4,280,000** | — | **₦2,140,000** |

---

## 3) Lagos Personal Income Tax (Direct Assessment) — Worked Example
**Step A — “Gross income” for CRA:** ₦20,520,000 − ₦2,140,000 = **₦18,380,000**  
**Step B — CRA (Consolidated Relief Allowance):** max(₦200,000, 1% of ₦18.38m) + 20% = **₦200,000 + ₦3,676,000 = ₦3,876,000**  
**Step C — Chargeable income:** ₦18,380,000 − ₦3,876,000 = **₦14,504,000**

**Step D — Apply bands** (PITA schedule widely used by states):
- First ₦300,000 @ **7%** = ₦21,000  
- Next ₦300,000 @ **11%** = ₦33,000  
- Next ₦500,000 @ **15%** = ₦75,000  
- Next ₦500,000 @ **19%** = ₦95,000  
- Next ₦1,600,000 @ **21%** = ₦336,000  
- Above ₦3,200,000: (₦14,504,000 − ₦3,200,000) @ **24%** = **₦2,712,960**

**Total PIT due (annual):** **₦3,272,960**  
**Monthly budget:** **≈ ₦272,747**  
**Effective rate on receipts:** **≈ 15.95%**

**Net after PIT:** ₦20,520,000 − ₦3,272,960 = **₦17,247,040** (≈ **₦1,437,253/mo**, ≈ **€840/mo** at ₦1,710/€)

> Notes:  
> • If you increase/justify the business-use %, PIT falls. Pension/NHF/life assurance would also reduce the taxable base.  
> • Lagos uses **Direct Assessment** for sole proprietors. Filing deadline: **31 March** following the year of income.

---

## 4) VAT, WHT & Other Statutes (Given Today’s Facts)
| Topic | Does it apply now? | Rate/Rule | What to do |
|---|---|---|---|
| **VAT** | Not required (turnover **₦20.52m < ₦25m** threshold). Exports zero-rated. | 7.5% (if registered). | If you later register (or cross threshold), file monthly by the **21st** (FIRS). Exported services likely **0%**; keep proof of non‑Nigerian consumption. |
| **WHT** | No (foreign client). | 5% for professional services if **paid by Nigerian** clients. | If a Nigerian company pays you and withholds WHT, collect the **WHT credit certificate** and offset against your PIT. |
| **Pension/NHF/NSITF/ITF** | No staff ⇒ not applicable. | Typical rules: Pension employer 10%/employee 8% if ≥15 staff; NSITF 1%; ITF 1% with thresholds. | Ignore unless you hire. |
| **CAC** | Business Name annual renewal. | — | Renew on CAC portal yearly. |

**Compliance calendar**
- **31 March** — File & pay **PIT (Direct Assessment)** on **LIRS e-Tax**.  
- **Monthly (21st)** — VAT/WHT (only if/when applicable) on **FIRS TaxPro-Max**.  

**Evidence to keep**
- Dated invoices/receipts, proof of export (client country, service location/benefit outside Nigeria), FX rate used per receipt, expense receipts, WHT certificates (if any).

---

## 5) Is This a Viable SaaS? (Nigeria, 2025)
**Thesis:** A focused SaaS for **foreign‑paid Nigerian freelancers** (dev/design/content) is viable. The pain is real (rules, portals, exchange‑rate conversions, evidence for exports) and deadlines are rigid.

**Signals**
- Large freelancer/gig pool; MSMEs dominate the economy.  
- Portals exist but are fiddly; rules are in flux (2025 reforms).  
- Clear willingness to pay for “get it right, on time.”

**Risks & Mitigations**
- **Policy volatility** → Versioned rules engine with effective dates.  
- **Portal changes** → Mapping layer for CSV/schedules, loose coupling.  
- **Support spike in March** → Offer DIY → Assisted → Full‑service tiers via partner tax pros.  
- **Trust** → Transparent calculations, exportable working papers.

---

## 6) MVP Spec (Tailored to Nigerian Freelancers)
**Core Features**
1. **Ledger with multi‑currency**: capture EUR receipts, store **per‑receipt NGN rate**.  
2. **PIT calculator**: CRA + bands; toggles for **reform years**; shows line‑by‑line math.  
3. **VAT threshold & export tagging**: warn at **₦25m** (and upcoming **₦50m** if/when effective); export = **0%** VAT.  
4. **WHT credit vault**: store certificates, auto‑offset in PIT.  
5. **Deadline coach**: 31 Mar PIT; 21st monthly VAT/WHT; deep links to **LIRS e‑Tax** and **FIRS TaxPro‑Max**.

**UX Flow**
- Onboarding → ask State, CAC type, currencies, export share, staff Y/N.  
- Money‑in → amount, currency, NGN rate, counterparty country, export flag.  
- Expenses → category + business‑use % slider (kept as audit trail).  
- Dashboard → “Tax this year” (PIT accrued, WHT credits, VAT status), deadlines, quick links.  
- **One‑click return pack** → PIT summary (income, expenses, CRA, bands), VAT schedules (if any), WHT reconciliation.

**Data Model (lean)**
- `users(id, name, state, tin)`  
- `entities(id, type, display_name, vat_registered bool, vat_threshold_rule, effective_from_date)`  
- `receipts(id, entity_id, date, currency, amt_fx, ngn_rate, amt_ngn, counterparty_country, export bool, wht_withheld_ngn, wht_cert_id)`  
- `expenses(id, entity_id, name, period, amt_ngn, business_use_pct, receipt_url)`  
- `pit_runs(id, tax_year, gross_ngn, allow_ngn, cra_ngn, chargeable_ngn, pit_due_ngn, bands_version)`  
- `vat_runs(id, month, sales_ngn, purchases_ngn, output_vat_ngn, input_vat_ngn, status)`  
- `wht_certs(id, payer_name, period, amount_ngn, rate_pct, certificate_url)`

**Pricing**
- **Free**: tracking + PIT estimate + reminders.  
- **Pro (₦3k–₦5k/mo)**: bank sync, receipt OCR, WHT vault, VAT exports.  
- **File‑for‑me (flat fee)**: human‑assisted filing (seasonal upsell).

---

## 7) Global Comps (for inspiration)
- **UK:** Taxfix/TaxScouts (flat‑fee pro‑filed), untied, GoSimpleTax.  
- **US:** Keeper, FlyFin, TurboTax Premium.  
- **Canada:** Wealthsimple Tax, TurboTax Self‑Employed.  
- **Germany/Spain:** Taxfix DE, Wundertax, TaxDown.  
- **Australia:** Etax. **South Africa:** TaxTim. **India:** Clear (ClearTax). **Estonia:** Xolo (incorporated freelancers).  
- Borrow: **pay‑when‑you‑file**, **AI + human CPA**, **bank feeds + receipt capture**, **direct e‑filing**, tiered help.

---

## 8) Roadmap (90‑day → 12‑month)
**0–90 days**
- Ship calculator + ledger + export tagging + deadline coach.  
- Generate **PIT working papers** and **TaxPro‑Max‑ready CSVs**.  
- Pilot with 50–100 Lagos freelancers; iterate on deductions & evidence UX.

**3–6 months**
- Bank connections & receipt OCR.  
- Rule‑versioning for **2025 reforms**; add **what‑if** simulations.  
- Partner network for assisted filing.

**6–12 months**
- Team plans (PAYE/Pension) for small studios.  
- Lite incorporation path (when a user outgrows Business Name).  
- Expand beyond Lagos; add knowledge‑base with examples and templates.

---

## 9) Appendix

### A) PIT JSON Contract (example)
```json
{
  "tax_year": 2025,
  "residency_state": "Lagos",
  "receipts": [
    {"date": "2025-01-15", "currency": "EUR", "amount": 1000, "ngn_rate": 1710, "type": "services", "counterparty_country": "DE"}
  ],
  "expenses": [
    {"name": "Rent", "annual_ngn": 3200000, "business_use_pct": 50},
    {"name": "Electricity", "monthly_ngn": 40000, "months": 12, "business_use_pct": 50},
    {"name": "Internet", "monthly_ngn": 50000, "months": 12, "business_use_pct": 50}
  ],
  "pension_nhf_life": []
}
```

### B) PIT Bands (commonly used under PITA)
- ₦0–300k @ 7% · next 300k @ 11% · next 500k @ 15% · next 500k @ 19% · next 1.6m @ 21% · balance @ 24%.  
- CRA = max(₦200k or 1% of gross income) + 20% of gross income.  
- Some 2025 reforms increase progressivity (up to 25%); implement as versioned rules.

### C) Filing Portals
- **LIRS e‑Tax (PIT):** https://etax.lirs.net  
- **FIRS TaxPro‑Max (VAT/WHT):** Search “TaxPro‑Max login” (URLs change); file VAT/WHT by the 21st if applicable.

---

**Prepared for:** Tej (TaxKobo) · **Focus:** Freelancer taxes + SaaS blueprint
