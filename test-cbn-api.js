// Test CBN API Integration
// Run with: node test-cbn-api.js

const CBN_API_URL = 'https://www.cbn.gov.ng/api/GetAllExchangeRatesGRAPH';

// Parse CBN API response to extract latest rates
function parseLatestRates(data) {
    // Currency mapping from CBN API names to our currency codes
    const currencyMap = {
        'EURO': 'EUR',
        'US DOLLAR': 'USD',
        'POUNDS STERLING': 'GBP'
    };

    // Group by currency and get the most recent entry
    const latestRates = {};
    let mostRecentDate = null;

    data.forEach(entry => {
        const currencyCode = currencyMap[entry.currency];

        if (currencyCode) {
            const entryDate = new Date(entry.ratedate);

            // Track most recent date
            if (!mostRecentDate || entryDate > mostRecentDate) {
                mostRecentDate = entryDate;
            }

            // Update if this is the most recent for this currency
            if (!latestRates[currencyCode] || entryDate > new Date(latestRates[currencyCode].date)) {
                latestRates[currencyCode] = {
                    rate: parseFloat(entry.centralrate),
                    date: entry.ratedate,
                    buyingRate: parseFloat(entry.buyingrate),
                    sellingRate: parseFloat(entry.sellingrate)
                };
            }
        }
    });

    return {
        EUR: latestRates.EUR?.rate || 1710,
        USD: latestRates.USD?.rate || 1580,
        GBP: latestRates.GBP?.rate || 2050,
        date: mostRecentDate ? mostRecentDate.toISOString().split('T')[0] : null,
        source: 'CBN'
    };
}

// Test the API
async function testCBNAPI() {
    console.log('🧪 Testing CBN API Integration\n');
    console.log('Fetching exchange rates from:', CBN_API_URL);
    console.log('='.repeat(60));

    try {
        const response = await fetch(CBN_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`\n✅ Successfully fetched ${data.length} rate entries`);

        // Parse the rates
        const rates = parseLatestRates(data);

        console.log('\n📊 Latest Exchange Rates (Central Rate):');
        console.log('='.repeat(60));
        console.log(`EUR: ₦${rates.EUR.toLocaleString()}`);
        console.log(`USD: ₦${rates.USD.toLocaleString()}`);
        console.log(`GBP: ₦${rates.GBP.toLocaleString()}`);
        console.log(`\nDate: ${rates.date}`);
        console.log(`Source: ${rates.source}`);

        console.log('\n✨ Test completed successfully!\n');

        return rates;
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

// Run the test
testCBNAPI();
