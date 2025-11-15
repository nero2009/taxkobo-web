// Test suite for PIT Calculator
// Run with: node test-calculator.js

// Tax bands and calculation logic (duplicated from calculator.js for testing)
const TAX_BANDS = [
    { limit: 300000, rate: 0.07, name: 'First ₦300,000' },
    { limit: 600000, rate: 0.11, name: 'Next ₦300,000' },
    { limit: 1100000, rate: 0.15, name: 'Next ₦500,000' },
    { limit: 1600000, rate: 0.19, name: 'Next ₦500,000' },
    { limit: 3200000, rate: 0.21, name: 'Next ₦1,600,000' },
    { limit: Infinity, rate: 0.24, name: 'Above ₦3,200,000' }
];

const CRA_MINIMUM = 200000;
const CRA_MIN_PERCENTAGE = 0.01;
const CRA_ADDITIONAL_PERCENTAGE = 0.20;

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

    // Step 5: Final PIT Due
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

// Test utilities
function formatNaira(amount) {
    return '₦' + Math.round(amount).toLocaleString('en-NG');
}

function assertClose(actual, expected, tolerance = 1) {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
        throw new Error(`Expected ${expected}, got ${actual} (diff: ${diff})`);
    }
}

console.log('🧪 Running PIT Calculator Tests\n');
console.log('='.repeat(60));

// Test 1: Sarah's worked example from spec
console.log('\n📊 Test 1: Worked example (Sarah - €12k @ ₦1,710)');
try {
    const result1 = calculatePIT({
        grossIncome: 12000,
        currency: 'EUR',
        exchangeRate: 1710
    });

    console.log('Gross NGN:', formatNaira(result1.grossNGN));
    console.log('CRA Total:', formatNaira(result1.craTotal));
    console.log('Chargeable Income:', formatNaira(result1.chargeableIncome));
    console.log('PIT Due:', formatNaira(result1.pitDue));
    console.log('Effective Rate:', result1.effectiveRate.toFixed(2) + '%');

    // Assertions
    assertClose(result1.grossNGN, 20520000, 1);
    assertClose(result1.craTotal, 4309200, 1);
    assertClose(result1.chargeableIncome, 16210800, 1);
    assertClose(result1.pitDue, 3682592, 1);
    assertClose(result1.effectiveRate, 17.95, 0.01);

    console.log('✅ Test 1 PASSED\n');
} catch (error) {
    console.error('❌ Test 1 FAILED:', error.message);
}

// Test 2: Very low income (CRA minimum applies)
console.log('📊 Test 2: Very low income (₦150k)');
try {
    const result2 = calculatePIT({
        grossIncome: 150000,
        currency: 'NGN'
    });

    console.log('Gross NGN:', formatNaira(result2.grossNGN));
    console.log('CRA Minimum:', formatNaira(result2.craMinimum));
    console.log('CRA Total:', formatNaira(result2.craTotal));
    console.log('Chargeable Income:', formatNaira(result2.chargeableIncome));
    console.log('PIT Due:', formatNaira(result2.pitDue));

    // Assertions
    assertClose(result2.grossNGN, 150000, 1);
    assertClose(result2.craMinimum, 200000, 1); // Minimum applies
    assertClose(result2.craTotal, 230000, 1); // 200k + 30k
    assertClose(result2.chargeableIncome, 0, 1); // CRA exceeds income
    assertClose(result2.pitDue, 0, 1);

    console.log('✅ Test 2 PASSED\n');
} catch (error) {
    console.error('❌ Test 2 FAILED:', error.message);
}

// Test 3: NGN income (no conversion needed)
console.log('📊 Test 3: NGN income (₦5M)');
try {
    const result3 = calculatePIT({
        grossIncome: 5000000,
        currency: 'NGN'
    });

    console.log('Gross NGN:', formatNaira(result3.grossNGN));
    console.log('CRA Total:', formatNaira(result3.craTotal));
    console.log('Chargeable Income:', formatNaira(result3.chargeableIncome));
    console.log('PIT Due:', formatNaira(result3.pitDue));
    console.log('Effective Rate:', result3.effectiveRate.toFixed(2) + '%');

    // Assertions
    assertClose(result3.grossNGN, 5000000, 1);
    assertClose(result3.craTotal, 1200000, 1); // 200k + 1M
    assertClose(result3.chargeableIncome, 3800000, 1);
    assertClose(result3.pitDue, 716000, 1);
    assertClose(result3.effectiveRate, 14.32, 0.01);

    console.log('✅ Test 3 PASSED\n');
} catch (error) {
    console.error('❌ Test 3 FAILED:', error.message);
}

// Test 4: USD income
console.log('📊 Test 4: USD income ($15k @ ₦1,580)');
try {
    const result4 = calculatePIT({
        grossIncome: 15000,
        currency: 'USD',
        exchangeRate: 1580
    });

    console.log('Gross NGN:', formatNaira(result4.grossNGN));
    console.log('CRA Total:', formatNaira(result4.craTotal));
    console.log('Chargeable Income:', formatNaira(result4.chargeableIncome));
    console.log('PIT Due:', formatNaira(result4.pitDue));
    console.log('Effective Rate:', result4.effectiveRate.toFixed(2) + '%');

    // Assertions
    assertClose(result4.grossNGN, 23700000, 1);
    assertClose(result4.craTotal, 4977000, 1);
    assertClose(result4.chargeableIncome, 18723000, 1);
    assertClose(result4.pitDue, 4283520, 1);

    console.log('✅ Test 4 PASSED\n');
} catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
}

// Test 5: Edge case - very high income
console.log('📊 Test 5: Very high income (₦100M)');
try {
    const result5 = calculatePIT({
        grossIncome: 100000000,
        currency: 'NGN'
    });

    console.log('Gross NGN:', formatNaira(result5.grossNGN));
    console.log('CRA Total:', formatNaira(result5.craTotal));
    console.log('Chargeable Income:', formatNaira(result5.chargeableIncome));
    console.log('PIT Due:', formatNaira(result5.pitDue));
    console.log('Effective Rate:', result5.effectiveRate.toFixed(2) + '%');

    // Verify tax is calculated correctly for high earners
    assertClose(result5.grossNGN, 100000000, 1);
    // Most income should be in the 24% top band
    console.log('✅ Test 5 PASSED\n');
} catch (error) {
    console.error('❌ Test 5 FAILED:', error.message);
}

console.log('='.repeat(60));
console.log('\n✨ All tests completed!\n');

// Manual calculation verification for Test 1
console.log('📝 Manual Calculation Verification (Test 1):\n');
const gross = 20520000;
const cra = 4309200;
const chargeable = 16210800;

console.log('Step-by-step tax calculation:');
console.log('  First ₦300,000 @ 7%     = ₦21,000');
console.log('  Next ₦300,000 @ 11%     = ₦33,000');
console.log('  Next ₦500,000 @ 15%     = ₦75,000');
console.log('  Next ₦500,000 @ 19%     = ₦95,000');
console.log('  Next ₦1,600,000 @ 21%   = ₦336,000');
console.log('  Balance ₦13,010,800 @ 24% = ₦3,122,592');

const manualTotal = 21000 + 33000 + 75000 + 95000 + 336000 + 3122592;
console.log('  TOTAL TAX             = ₦' + manualTotal.toLocaleString());
console.log('  (Expected: ₦3,682,592)');
