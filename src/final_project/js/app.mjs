import { getExchangeRate, getCurrencyList } from './exchangeRateFetcher.mjs';
import { getMexicoCityTime } from './worldClock.mjs';
import { convertUSDToMXN, formatCurrency } from './currencyConverter.mjs';
import { drawSimpleChart } from './historicalChart.mjs';

const STORAGE_KEY = 'usd-mxn_history';

document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    await updateExchangeRate();
    await updateMexicoTime();
    await updateHistoricalChart();
    await multipleCurrencies()
    setupEventListeners();
}

async function updateExchangeRate() {
    const rate = await getExchangeRate();
    if (rate) {
        document.getElementById('exchange-rate').textContent = rate.toFixed(2);

        storeDailyRate(rate);
        updateConversion();

    } else {
        showError('Failed to fetch exchange rate.');
    }
}

async function updateMexicoTime() {
    const time = await getMexicoCityTime();
    const timeString = time.toLocaleTimeString('en-US',
        {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    document.getElementById('mexico-time').textContent = timeString;
}

function setupEventListeners() {
    const usdInput = document.getElementById('usd-amount');
    usdInput.addEventListener('input', updateConversion);
}

function updateConversion() {
    const usdAmount = parseFloat(document.getElementById('usd-amount').value) || 0;
    const rate = parseFloat(document.getElementById('exchange-rate').textContent) || 0;
    if (rate > 0) {
        const mxnAmount = convertUSDToMXN(usdAmount, rate);
        document.getElementById('mxn-result').textContent = mxnAmount.toFixed(2);
    }
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.querySelector('main').prepend(errorElement);


    setTimeout(() => {
        errorElement.remove();
    }, 5000)
}

function storeDailyRate(rate) {
    try {
        const today = new Date().toDateString();
        const history = getStoredHistory();

        const todayEntry = history.find(entry => entry.date === today);
        if (!todayEntry) {
            history.push({ date: today, rate: rate });

            if (history.length > 7) {
                history.shift();
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        }

    } catch (error) {
        console.error('Error storing daily rate:', error);
    }
}

function getStoredHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error retrieving stored history:', error);
        return [];
    }
}

async function getHistoricalData() {
    try {
        const history = getStoredHistory();

        if (history.length === 0) {
            const currentRate = parseFloat(document.getElementById('exchange-rate').textContent) || 17.50;
            return generateRealisticHistory(currentRate);
        }

       
        const rates = history.map(entry => entry.rate);

        if (rates.length < 2) {
            const currentRate = rates[0] || parseFloat(document.getElementById('exchange-rate').textContent) || 17.50;
            return generateRealisticHistory(currentRate);
        }

        return rates;

    } catch (error) {
        console.error('Error fetching historical data:', error);
        const currentRate = parseFloat(document.getElementById('exchange-rate').textContent) || 17.50;
        return generateRealisticHistory(currentRate);
    }
}

function generateRealisticHistory(currentRate) {
    const rates = [];

    
    for (let i = 6; i >= 0; i--) {
        const variation = (Math.random() * 0.5) - 0.25;
        rates.push(parseFloat((currentRate + variation).toFixed(2)));
    }
    return rates;
}

async function updateHistoricalChart() {
    const weeklyRates = await getHistoricalData();
    console.log('Chart data:', weeklyRates); // Debug line

    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer && weeklyRates && weeklyRates.length > 0) {
        drawSimpleChart(weeklyRates, chartContainer);
    } else if (chartContainer) {
        chartContainer.innerHTML = '<p>No historical data available</p>';
    }
}

setInterval(async () => {
    await updateExchangeRate();
    await updateMexicoTime();
    await updateHistoricalChart();
}, 60000);

async function multipleCurrencies() {
    try {
        const currencyList = await getCurrencyList();
        console.log('Processing multiple currencies:', currencyList);

        if (currencyList.length > 0) {
            console.log('Currency properties:', Object.keys(currencyList[0]));
        } else {
            console.log('No currencies found in the list.');
        }

        console.log('Total number of currencies:', currencyList.length);
    }
    catch (error) {
        console.error('Error processing multiple currencies:', error);
    }
}