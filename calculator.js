// Nigerian PIT Calculator 2025
// Tax bands and calculation logic per PITA Fifth Schedule

// 2025 Tax Bands (progressive)
const TAX_BANDS = [
    { limit: 300000, rate: 0.07, name: 'First ₦300,000' },
    { limit: 600000, rate: 0.11, name: 'Next ₦300,000' },
    { limit: 1100000, rate: 0.15, name: 'Next ₦500,000' },
    { limit: 1600000, rate: 0.19, name: 'Next ₦500,000' },
    { limit: 3200000, rate: 0.21, name: 'Next ₦1,600,000' },
    { limit: Infinity, rate: 0.24, name: 'Above ₦3,200,000' }
];

// CRA Constants
const CRA_MINIMUM = 200000; // Minimum CRA is ₦200k
const CRA_MIN_PERCENTAGE = 0.01; // 1% of gross
const CRA_ADDITIONAL_PERCENTAGE = 0.20; // 20% of gross

// DOM Elements
const form = document.getElementById('pit-calculator-form');
const grossIncomeInput = document.getElementById('gross-income');
const currencySelect = document.getElementById('currency');
const exchangeRateContainer = document.getElementById('exchange-rate-container');
const exchangeRateInput = document.getElementById('exchange-rate');
const currencyLabel = document.getElementById('currency-label');
const ngnEquivalent = document.getElementById('ngn-equivalent');
const ngnAmount = document.getElementById('ngn-amount');
const resultsSection = document.getElementById('results-section');
const pitResult = document.getElementById('pit-result');
const effectiveRate = document.getElementById('effective-rate');
const craBenefit = document.getElementById('cra-benefit');
const breakdownToggle = document.getElementById('breakdown-toggle');
const breakdownContent = document.getElementById('breakdown-content');
const breakdownIcon = document.getElementById('breakdown-icon');
const breakdownDetails = document.getElementById('breakdown-details');
const conversionCTA = document.getElementById('conversion-cta');
const vatNotice = document.getElementById('vat-notice');
const tryExampleBtn = document.getElementById('try-example-btn');

// Analytics helper (placeholder - replace with actual analytics)
function trackEvent(eventName, properties = {}) {
    console.log('Analytics Event:', eventName, properties);
    // TODO: Replace with actual analytics implementation (Plausible, GA, etc.)
}

// Format number as Nigerian Naira
function formatNaira(amount) {
    return '₦' + Math.round(amount).toLocaleString('en-NG');
}

// Calculate CRA (Consolidated Relief Allowance)
function calculateCRA(grossNGN) {
    const craMinimum = Math.max(CRA_MINIMUM, grossNGN * CRA_MIN_PERCENTAGE);
    const craAdditional = grossNGN * CRA_ADDITIONAL_PERCENTAGE;
    const craTotal = craMinimum + craAdditional;

    return {
        craMinimum,
        craAdditional,
        craTotal
    };
}

// Calculate tax using progressive bands
function calculateProgressiveTax(chargeableIncome) {
    let remainingIncome = chargeableIncome;
    let totalTax = 0;
    const breakdown = [];

    let previousLimit = 0;

    for (const band of TAX_BANDS) {
        if (remainingIncome <= 0) break;

        const bandSize = band.limit - previousLimit;
        const taxableInBand = Math.min(remainingIncome, bandSize);
        const taxAmount = taxableInBand * band.rate;

        if (taxableInBand > 0) {
            breakdown.push({
                band: band.name,
                rate: band.rate * 100,
                taxableAmount: taxableInBand,
                taxAmount: taxAmount
            });

            totalTax += taxAmount;
            remainingIncome -= taxableInBand;
        }

        previousLimit = band.limit;
    }

    return {
        totalTax,
        breakdown
    };
}

// Main PIT calculation function
function calculatePIT({ grossIncome, currency, exchangeRate }) {
    // Step 1: Convert to NGN
    let grossNGN;
    if (currency !== 'NGN') {
        if (!exchangeRate || exchangeRate <= 0) {
            throw new Error('Exchange rate is required for foreign currency');
        }
        grossNGN = grossIncome * exchangeRate;
    } else {
        grossNGN = grossIncome;
    }

    // Step 2: Calculate CRA
    const { craMinimum, craAdditional, craTotal } = calculateCRA(grossNGN);

    // Step 3: Calculate Chargeable Income
    const chargeableIncome = Math.max(0, grossNGN - craTotal);

    // Step 4: Apply Progressive Tax Bands
    const { totalTax, breakdown: taxBreakdown } = calculateProgressiveTax(chargeableIncome);

    // Step 5: Final PIT Due (no WHT in simplified version)
    const pitDue = totalTax;

    // Calculate effective rate
    const effectiveRate = grossNGN > 0 ? (totalTax / grossNGN) * 100 : 0;

    return {
        grossNGN,
        craMinimum,
        craAdditional,
        craTotal,
        chargeableIncome,
        taxBreakdown,
        totalTax,
        pitDue,
        effectiveRate
    };
}

// Update NGN equivalent display in real-time
function updateNGNEquivalent() {
    const grossIncome = parseFloat(grossIncomeInput.value);
    const exchangeRate = parseFloat(exchangeRateInput.value);
    const currency = currencySelect.value;

    if (currency !== 'NGN' && grossIncome > 0 && exchangeRate > 0) {
        const ngnValue = grossIncome * exchangeRate;
        ngnAmount.textContent = formatNaira(ngnValue);
        ngnEquivalent.classList.remove('hidden');
    } else {
        ngnEquivalent.classList.add('hidden');
    }
}

// Handle currency selection
currencySelect.addEventListener('change', (e) => {
    const currency = e.target.value;

    trackEvent('currency_selected', { currency });

    if (currency && currency !== 'NGN') {
        // Show exchange rate field
        exchangeRateContainer.classList.remove('hidden');
        currencyLabel.textContent = currency;
        exchangeRateInput.required = true;

        // Set default exchange rates (optional - for better UX)
        if (!exchangeRateInput.value) {
            const defaultRates = {
                'EUR': 1710,
                'USD': 1580,
                'GBP': 2050
            };
            exchangeRateInput.value = defaultRates[currency] || '';
        }

        updateNGNEquivalent();
    } else if (currency === 'NGN') {
        // Hide exchange rate field
        exchangeRateContainer.classList.add('hidden');
        exchangeRateInput.required = false;
        exchangeRateInput.value = '';
        ngnEquivalent.classList.add('hidden');
    }
});

// Update NGN equivalent on input
grossIncomeInput.addEventListener('input', updateNGNEquivalent);
exchangeRateInput.addEventListener('input', () => {
    trackEvent('exchange_rate_entered');
    updateNGNEquivalent();
});

// Generate breakdown HTML
function generateBreakdownHTML(result, currency, exchangeRate) {
    const currencySymbol = {
        'EUR': '€',
        'USD': '$',
        'GBP': '£',
        'NGN': '₦'
    }[currency] || currency;

    let html = '<div class="space-y-4">';

    // Step 1: Gross Income
    html += '<div class="calculation-step">';
    html += '<p class="font-semibold text-gray-900 mb-1">1. Gross Income</p>';
    if (currency !== 'NGN') {
        html += `<p class="text-gray-700">${currencySymbol}${parseFloat(grossIncomeInput.value).toLocaleString()} × ₦${exchangeRate.toLocaleString()} = <span class="font-medium">${formatNaira(result.grossNGN)}</span></p>`;
    } else {
        html += `<p class="text-gray-700">${formatNaira(result.grossNGN)}</p>`;
    }
    html += '</div>';

    // Step 2: CRA
    html += '<div class="calculation-step">';
    html += '<p class="font-semibold text-gray-900 mb-1">2. Less: Consolidated Relief Allowance (CRA)</p>';
    html += `<p class="text-gray-700 text-sm">• Minimum relief: ${formatNaira(result.craMinimum)} (max of ₦200k or 1% of gross)</p>`;
    html += `<p class="text-gray-700 text-sm">• Additional relief: ${formatNaira(result.craAdditional)} (20% of gross)</p>`;
    html += `<p class="text-gray-700 font-medium mt-1">• Total CRA: ${formatNaira(result.craTotal)}</p>`;
    html += '</div>';

    // Step 3: Chargeable Income
    html += '<div class="calculation-step">';
    html += '<p class="font-semibold text-gray-900 mb-1">3. Chargeable Income</p>';
    html += `<p class="text-gray-700">${formatNaira(result.chargeableIncome)}</p>`;
    html += '</div>';

    // Step 4: Tax Calculation
    html += '<div class="calculation-step">';
    html += '<p class="font-semibold text-gray-900 mb-2">4. Tax Calculation (Progressive Bands)</p>';

    if (result.taxBreakdown.length > 0) {
        result.taxBreakdown.forEach(item => {
            html += `<p class="text-gray-700 text-sm">• ${item.band} @ ${item.rate}% = ${formatNaira(item.taxAmount)}</p>`;
        });
    } else {
        html += '<p class="text-gray-700 text-sm">No tax due (income below threshold)</p>';
    }
    html += '</div>';

    // Step 5: Total PIT Due
    html += '<div class="calculation-step">';
    html += '<p class="font-semibold text-gray-900 mb-1">5. TOTAL PIT DUE</p>';
    html += `<p class="text-2xl font-bold text-green-700">${formatNaira(result.pitDue)}</p>`;
    html += '</div>';

    html += '</div>';

    return html;
}

// Display results
function displayResults(result, currency, exchangeRate) {
    // Main result
    pitResult.textContent = formatNaira(result.pitDue);

    // Key metrics
    effectiveRate.textContent = result.effectiveRate.toFixed(2) + '%';
    craBenefit.textContent = formatNaira(result.craTotal);

    // Generate breakdown
    breakdownDetails.innerHTML = generateBreakdownHTML(result, currency, exchangeRate);

    // Show VAT notice if income < ₦25M
    if (result.grossNGN < 25000000) {
        vatNotice.classList.remove('hidden');
    } else {
        vatNotice.classList.add('hidden');
    }

    // Show results section with smooth scroll
    resultsSection.classList.remove('hidden');
    conversionCTA.classList.remove('hidden');

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    trackEvent('result_displayed', {
        pitDue: result.pitDue,
        grossNGN: result.grossNGN,
        currency: currency,
        effectiveRate: result.effectiveRate
    });
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    trackEvent('calculate_clicked');

    // Get form values
    const grossIncome = parseFloat(grossIncomeInput.value);
    const currency = currencySelect.value;
    const exchangeRate = currency !== 'NGN' ? parseFloat(exchangeRateInput.value) : null;

    // Validate
    if (!grossIncome || grossIncome <= 0) {
        alert('Please enter a valid gross income');
        return;
    }

    if (!currency) {
        alert('Please select a currency');
        return;
    }

    if (currency !== 'NGN' && (!exchangeRate || exchangeRate <= 0)) {
        alert('Please enter a valid exchange rate');
        return;
    }

    try {
        // Calculate PIT
        const result = calculatePIT({
            grossIncome,
            currency,
            exchangeRate
        });

        // Display results
        displayResults(result, currency, exchangeRate);

    } catch (error) {
        alert('Error calculating PIT: ' + error.message);
        console.error(error);
    }
});

// Breakdown toggle
breakdownToggle.addEventListener('click', () => {
    const isHidden = breakdownContent.classList.contains('hidden');

    if (isHidden) {
        breakdownContent.classList.remove('hidden');
        breakdownIcon.style.transform = 'rotate(180deg)';
        trackEvent('breakdown_expanded');
    } else {
        breakdownContent.classList.add('hidden');
        breakdownIcon.style.transform = 'rotate(0deg)';
    }
});

// Try Example Button (Sarah's calculation)
tryExampleBtn.addEventListener('click', () => {
    grossIncomeInput.value = '12000';
    currencySelect.value = 'EUR';

    // Trigger currency change to show exchange rate field
    currencySelect.dispatchEvent(new Event('change'));

    // Set exchange rate
    setTimeout(() => {
        exchangeRateInput.value = '1710';
        updateNGNEquivalent();
    }, 100);

    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });

    trackEvent('worked_example_clicked');
});

// Track page load
trackEvent('calculator_loaded');

// Initialize: Set default currency to EUR
currencySelect.value = 'EUR';
currencySelect.dispatchEvent(new Event('change'));
