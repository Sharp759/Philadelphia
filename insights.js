/************************************
 * GLOBAL VARIABLES
 ************************************/
let excelData = null;
let currentAverages = {}; // Store averages for current view
let chartInstances = []; // Track all chart instances for cleanup

/************************************
 * WELCOME SCREEN CONTROL
 ************************************/
const welcomeScreen = document.getElementById('welcomeScreen');
const kpiContainer = document.getElementById('kpiContainer');
const chartsContainer = document.getElementById('chartsContainer');

// Function to hide welcome screen and show dashboard
function showDashboard() {
    welcomeScreen.classList.add('hidden');
    kpiContainer.classList.add('show');
    chartsContainer.classList.add('show');
}

// Function to show welcome screen (for reset)
function showWelcomeScreen() {
    welcomeScreen.classList.remove('hidden');
    kpiContainer.classList.remove('show');
    chartsContainer.classList.remove('show');
}
/************************************
 * CHART MANAGEMENT FUNCTIONS
 ************************************/

// Clear all existing charts
function clearAllCharts() {
    // Destroy all Chart.js instances to prevent memory leaks
    chartInstances.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    chartInstances = [];
    
    // Clear the container
    chartsContainer.innerHTML = '';
}

// Clear KPIs
function clearKPIs() {
    kpiContainer.innerHTML = '';
}
// Compact chart rendering function
function renderCompactChart(type, data, options, iconClass = 'fas fa-chart-bar') {
    // Create chart wrapper
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';
    
    // Create chart title with icon
    const chartTitle = document.createElement('div');
    chartTitle.className = 'chart-title';
    chartTitle.innerHTML = `<i class="${iconClass}"></i> ${options.plugins.title.text}`;
    
    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '350px';
    
    const canvas = document.createElement('canvas');
    
    // Append elements
    canvasContainer.appendChild(canvas);
    chartWrapper.appendChild(chartTitle);
    chartWrapper.appendChild(canvasContainer);
    chartsContainer.appendChild(chartWrapper);
    
    // Optimized options for compact display
    const compactOptions = {
        ...options,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            ...options.plugins,
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: {
                        size: 11
                    },
                    padding: 10,
                    boxWidth: 12,
                    usePointStyle: true
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 6,
                titleFont: {
                    size: 12
                },
                bodyFont: {
                    size: 12
                }
            }
        }
    };
    
    // Optimize scales if they exist
    if (options.scales) {
        compactOptions.scales = {};
        
        if (options.scales.x) {
            compactOptions.scales.x = {
                ...options.scales.x,
                ticks: {
                    ...options.scales.x.ticks,
                    color: 'white',
                    font: {
                        size: 10
                    },
                    maxRotation: 45,
                    padding: 5
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                }
            };
        }
        
        if (options.scales.y) {
            compactOptions.scales.y = {
                ...options.scales.y,
                ticks: {
                    ...options.scales.y.ticks,
                    color: 'white',
                    font: {
                        size: 10
                    },
                    padding: 5
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                }
            };
        }
    }
    
    // Create and store the chart instance
    const chart = new Chart(canvas, { 
        type, 
        data, 
        options: compactOptions 
    });
    
    chartInstances.push(chart);
    return chart;
}


/************************************
 * ICON MAPPING FUNCTIONS
 ************************************/
function getIconForKPI(title) {
    const titleLower = title.toLowerCase();
    
    // Funding/Financial icons
    if (titleLower.includes('funding') || titleLower.includes('dollar') || titleLower.includes('cost') || 
        titleLower.includes('value') || titleLower.includes('investment') || titleLower.includes('fiscal')) {
        return '<i class="fas fa-dollar-sign"></i>';
    }
    
    // Population/People icons
    if (titleLower.includes('population') || titleLower.includes('people') || titleLower.includes('resident') || 
        titleLower.includes('users') || titleLower.includes('demographic')) {
        return '<i class="fas fa-users"></i>';
    }
    
    // Infrastructure/Building icons
    if (titleLower.includes('infrastructure') || titleLower.includes('building') || titleLower.includes('facility') ||
        titleLower.includes('school') || titleLower.includes('site')) {
        return '<i class="fas fa-building"></i>';
    }
    
    // Growth/Improvement icons
    if (titleLower.includes('growth') || titleLower.includes('increase') || titleLower.includes('improve') ||
        titleLower.includes('trend')) {
        return '<i class="fas fa-chart-line"></i>';
    }
    
    // Safety/Security icons
    if (titleLower.includes('safety') || titleLower.includes('security') || titleLower.includes('safe') ||
        titleLower.includes('protection')) {
        return '<i class="fas fa-shield-alt"></i>';
    }
    
    // Age/Time icons
    if (titleLower.includes('age') || titleLower.includes('year') || titleLower.includes('time') ||
        titleLower.includes('expiration')) {
        return '<i class="fas fa-clock"></i>';
    }
    
    // Energy/Environment icons
    if (titleLower.includes('energy') || titleLower.includes('environment') || titleLower.includes('green') ||
        titleLower.includes('abatement') || titleLower.includes('zone')) {
        return '<i class="fas fa-leaf"></i>';
    }
    
    // Playground/Park/Recreation icons
    if (titleLower.includes('playground') || titleLower.includes('park') || titleLower.includes('recreation') ||
        titleLower.includes('amenity')) {
        return '<i class="fas fa-park"></i>';
    }
    
    // Score/Rating icons
    if (titleLower.includes('score') || titleLower.includes('rating') || titleLower.includes('index') ||
        titleLower.includes('density') || titleLower.includes('gap')) {
        return '<i class="fas fa-star"></i>';
    }
    
    // Education/Training icons
    if (titleLower.includes('cte') || titleLower.includes('education') || titleLower.includes('training') ||
        titleLower.includes('student') || titleLower.includes('school')) {
        return '<i class="fas fa-graduation-cap"></i>';
    }
    
    // Economic/Business icons
    if (titleLower.includes('economic') || titleLower.includes('business') || titleLower.includes('tax') ||
        titleLower.includes('opportunity') || titleLower.includes('corridor') || titleLower.includes('income')) {
        return '<i class="fas fa-chart-pie"></i>';
    }
    
    // Maximum/Highest icons
    if (titleLower.includes('maximum') || titleLower.includes('highest') || titleLower.includes('max')) {
        return '<i class="fas fa-arrow-up"></i>';
    }
    
    // Minimum/Lowest icons
    if (titleLower.includes('minimum') || titleLower.includes('lowest') || titleLower.includes('min')) {
        return '<i class="fas fa-arrow-down"></i>';
    }
    
    // Total/Average icons
    if (titleLower.includes('total') || titleLower.includes('sum')) {
        return '<i class="fas fa-calculator"></i>';
    }
    
    if (titleLower.includes('average') || titleLower.includes('avg') || titleLower.includes('mean')) {
        return '<i class="fas fa-balance-scale"></i>';
    }
    
    // Poverty/Need icons
    if (titleLower.includes('poverty') || titleLower.includes('poor') || titleLower.includes('need')) {
        return '<i class="fas fa-hand-holding-heart"></i>';
    }
    
    // Flood/Water icons
    if (titleLower.includes('flood') || titleLower.includes('water') || titleLower.includes('zone')) {
        return '<i class="fas fa-water"></i>';
    }
    
    // Proximity/Location icons
    if (titleLower.includes('proximity') || titleLower.includes('location') || titleLower.includes('distance') ||
        titleLower.includes('route')) {
        return '<i class="fas fa-map-marker-alt"></i>';
    }
    
    // Owner/Occupied icons
    if (titleLower.includes('owner') || titleLower.includes('occupied') || titleLower.includes('property')) {
        return '<i class="fas fa-home"></i>';
    }
    
    // Default icon
    return '<i class="fas fa-chart-bar"></i>';
}

function getTrendIndicator(value, average, fieldName = '') {
    // Convert to numbers for comparison
    const numericValue = parseFloat(value) || 0;
    const numericAverage = parseFloat(average) || 0;
    
    // For certain fields, the logic might be reversed
    // (e.g., for "Poverty rate" - lower is better)
    const shouldReverse = fieldName.toLowerCase().includes('poverty') || 
                         fieldName.toLowerCase().includes('poor') ||
                         fieldName.toLowerCase().includes('cost') ||
                         fieldName.toLowerCase().includes('gap') ||
                         fieldName.toLowerCase().includes('imbalance');
    
    let trendDirection;
    let percentageDiff;
    
    if (numericAverage === 0) {
        // Can't calculate percentage if average is zero
        trendDirection = 'neutral';
        percentageDiff = 0;
    } else {
        percentageDiff = ((numericValue - numericAverage) / numericAverage) * 100;
        
        if (shouldReverse) {
            // For metrics where lower is better
            trendDirection = (numericValue <= numericAverage) ? 'up' : 'down';
        } else {
            // For metrics where higher is better (default)
            trendDirection = (numericValue >= numericAverage) ? 'up' : 'down';
        }
    }
    
    const absPercentage = Math.abs(percentageDiff).toFixed(1);
    
    if (trendDirection === 'up') {
        return `<span class="trend-indicator trend-up">
            <i class="fas fa-arrow-up trend-arrow"></i> ${absPercentage}%
        </span>`;
    } else if (trendDirection === 'down') {
        return `<span class="trend-indicator trend-down">
            <i class="fas fa-arrow-down trend-arrow"></i> ${absPercentage}%
        </span>`;
    } else {
        return `<span class="trend-indicator trend-neutral">
            <i class="fas fa-equals trend-arrow"></i> ${absPercentage}%
        </span>`;
    }
}
function getTrendExplanation(value, average, fieldName = '') {
    const numericValue = parseFloat(value) || 0;
    const numericAverage = parseFloat(average) || 0;
    
    if (numericAverage === 0) return 'No average data available';
    
    const percentageDiff = ((numericValue - numericAverage) / numericAverage) * 100;
    const absPercentage = Math.abs(percentageDiff).toFixed(1);
    
    if (percentageDiff > 0) {
        return `${absPercentage}% above average`;
    } else if (percentageDiff < 0) {
        return `${absPercentage}% below average`;
    } else {
        return 'Equal to average';
    }
}
/************************************
 * FILE IMPORT HANDLER
 ************************************/
document.getElementById('importData').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const importLabel = document.querySelector('.import-label');
    const importStatus = document.querySelector('.import-status');
    
    // Reset to loading state
    importLabel.classList.remove('success', 'error', 'success-pulse', 'error-pulse');
    importLabel.classList.add('loading');
    importStatus.innerHTML = '<i class="fas fa-spinner"></i> Processing...';
    
    // Check file type
    if (!file.name.endsWith('.xlsx')) {
        setTimeout(() => {
            importLabel.classList.remove('loading');
            importLabel.classList.add('error', 'error-pulse');
            importStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> .xlsx only';
            alert("Error: Please upload Excel (.xlsx) files only!");
            e.target.value = '';
        }, 500);
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            excelData = {};
            
            const expectedSheets = [
                'Analytical Indicators',
                'Capital investments', 
                'District demographics',
                'Economic context',
                'Public amenities'
            ];
            
            let validSheetsFound = 0;
            
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                excelData[sheetName] = XLSX.utils.sheet_to_json(sheet, {defval: ''});
                
                if (expectedSheets.includes(sheetName)) {
                    validSheetsFound++;
                }
            });
            
            setTimeout(() => {
                importLabel.classList.remove('loading');
                
                if (validSheetsFound > 0) {
                    // SUCCESS
                    importLabel.classList.add('success', 'success-pulse');
                    importStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${validSheetsFound}/5`;
                    
                    const fileName = file.name.length > 20 ? 
                        file.name.substring(0, 17) + '...' : 
                        file.name;
                    document.querySelector('.import-text').textContent = fileName;
                    
                    showToast('success', `Data imported! ${validSheetsFound} sheets loaded`);
                    
                    enableAllButtons();
                    
                    // Hide welcome screen and show dashboard
                    showDashboard();
                    
                } else {
                    // ERROR
                    importLabel.classList.add('error', 'error-pulse');
                    importStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Invalid';
                    excelData = null;
                    document.querySelector('.import-text').textContent = 'Import Data';
                    alert("Error: The Excel file doesn't contain the expected data sheets.");
                    e.target.value = '';
                }
            }, 800);
            
        } catch (error) {
            setTimeout(() => {
                importLabel.classList.remove('loading');
                importLabel.classList.add('error', 'error-pulse');
                importStatus.innerHTML = '<i class="fas fa-times-circle"></i> Error';
                document.querySelector('.import-text').textContent = 'Import Data';
                excelData = null;
                alert("Error: Unable to read the Excel file.");
                e.target.value = '';
            }, 500);
        }
    };
    
    reader.onerror = function() {
        setTimeout(() => {
            importLabel.classList.remove('loading');
            importLabel.classList.add('error', 'error-pulse');
            importStatus.innerHTML = '<i class="fas fa-times-circle"></i> Error';
            document.querySelector('.import-text').textContent = 'Import Data';
            alert("Error: Unable to read the selected file.");
            e.target.value = '';
        }, 500);
    };
    
    reader.readAsArrayBuffer(file);
});


/************************************
 * HELPER FUNCTIONS FOR IMPORT VALIDATION
 ************************************/
function enableAllButtons() {
    const buttons = document.querySelectorAll('.sidebar-btn:not(.home-btn):not(.reset-btn)');
    buttons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });
}
/************************************
 * NUMBER FORMATTING WITH K/M/B/T SUFFIXES
 ************************************/
function formatNumberWithSuffix(value) {
    // Convert to number
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    // Handle negative numbers
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    
    let formatted;
    
    // Apply K/M/B/T formatting
    if (absNum >= 1000000000000) { // Trillions
        formatted = (absNum / 1000000000000).toFixed(1) + 'T';
    } else if (absNum >= 1000000000) { // Billions
        formatted = (absNum / 1000000000).toFixed(1) + 'B';
    } else if (absNum >= 1000000) { // Millions
        formatted = (absNum / 1000000).toFixed(1) + 'M';
    } else if (absNum >= 1000) { // Thousands
        formatted = (absNum / 1000).toFixed(1) + 'K';
    } else {
        // For numbers less than 1000
        if (Number.isInteger(absNum)) {
            formatted = absNum.toString();
        } else {
            // Check if it's effectively an integer
            if (Math.abs(absNum - Math.round(absNum)) < 0.001) {
                formatted = Math.round(absNum).toString();
            } else {
                formatted = absNum.toFixed(1);
            }
        }
    }
    
    // Remove trailing .0 for K/M/B/T values
    formatted = formatted.replace(/\.0+([KMBT])$/, '$1');
    
    // Add negative sign back if needed
    return isNegative ? '-' + formatted : formatted;
}

function disableAllButtons() {
    const buttons = document.querySelectorAll('.sidebar-btn:not(.home-btn):not(.reset-btn)');
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

function showToast(type, message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
/************************************
 * SPECIAL FORMATTING FOR PUBLIC AMENITIES SECTION ONLY
 ************************************/
/************************************
 * SPECIAL FORMATTING FOR PUBLIC AMENITIES SECTION ONLY
 ************************************/
function formatPublicAmenitiesValue(originalValue, numericValue, formatType) {
    // If the numeric value is less than 1000, just return original formatting
    if (Math.abs(numericValue) < 1000) {
        if (formatType === 'area') {
            return originalValue.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }) + ' sq ft';
        } else if (formatType === 'score') {
            return originalValue.toFixed(1) + '/10';
        } else if (originalValue.toString().includes('%')) {
            return originalValue.toFixed(1) + '%';
        }
        return originalValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    
    // For values >= 1000, apply K/M/B/T formatting
    let formatted = formatNumberWithSuffix(originalValue);
    
    // Add appropriate suffix
    if (formatType === 'area') {
        formatted += ' sq ft';
    } else if (formatType === 'score') {
        formatted += '/10';
    } else if (originalValue.toString().includes('%')) {
        formatted += '%';
    }
    
    return formatted;
}
/************************************
 * PLACEHOLDER FOR BUTTON FUNCTIONALITIES
 ************************************/
document.getElementById('btnAnalyticalIndicators').addEventListener('click', function() {
    if (!excelData || !excelData['Analytical Indicators']) {
        alert("Please import the Excel file with 'Analytical Indicators' sheet first!");
        return;
    }

    const data = excelData['Analytical Indicators'];

    // Clear previous content
    document.getElementById('kpiContainer').innerHTML = '';
    document.getElementById('chartsContainer').innerHTML = '';
     // IMPORTANT: Set display to grid
    document.getElementById('chartsContainer').style.display = 'grid';

    // Reset averages
    currentAverages = {};

    /***************
     * CALCULATE AVERAGES
     ***************/
    const sumField = (arr, field) => arr.reduce((acc,d) => acc + (parseFloat(d[field]) || 0),0);
    const avgField = (arr, field) => {
        const validValues = arr.filter(d => !isNaN(parseFloat(d[field])) && d[field] !== '');
        if (validValues.length === 0) return 0;
        return sumField(validValues, field) / validValues.length;
    };

    // Calculate averages for key metrics
    currentAverages['Funding per student'] = avgField(data, 'Funding per student');
    currentAverages['Infrastructure age index'] = avgField(data, 'Infrastructure age index');
    currentAverages['Abatement density score'] = avgField(data, 'Abatement density score');
    currentAverages['Population per Dollar'] = avgField(data, 'Population per Dollar');
    currentAverages['Deffered cost vs CIP gap'] = avgField(data, 'Deffered cost vs CIP gap');
    currentAverages['Playgrounds per 1000 youth'] = avgField(data, 'Playgrounds per 1000 youth');
    currentAverages['Workforce proximity score'] = avgField(data, 'Workforce proximity score');
    currentAverages['Fiscal imbalance index'] = avgField(data, 'Fiscal imbalance index');

    /***************
     * KPI CARDS with Trends
     ***************/
    // Helper to find max/min
    const getMax = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) >= (parseFloat(b[field]) || 0) ? a : b);
    const getMin = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) <= (parseFloat(b[field]) || 0) ? a : b);

    // Funding per student
    const maxFunding = getMax(data, 'Funding per student');
    const minFunding = getMin(data, 'Funding per student');
    
    createKpi('Highest Funding Per Student', 
          `$${formatNumberWithSuffix(maxFunding['Funding per student'])} (${maxFunding.District})`,
          'fas fa-arrow-up',
          maxFunding['Funding per student'],
          'Funding per student');
              
    createKpi('Lowest Funding Per Student', 
          `$${formatNumberWithSuffix(minFunding['Funding per student'])} (${minFunding.District})`,
          'fas fa-arrow-down',
          minFunding['Funding per student'],
          'Funding per student');

    // Infrastructure age index
    const maxInfra = getMax(data, 'Infrastructure age index');
    const minInfra = getMin(data, 'Infrastructure age index');
    
    createKpi('Highest Infrastructure Age Index', 
          `${formatNumberWithSuffix(maxInfra['Infrastructure age index'])} (${maxInfra.District})`,
          'fas fa-arrow-up',
          maxInfra['Infrastructure age index'],
          'Infrastructure age index');
              
    createKpi('Lowest Infrastructure Age Index', 
          `${formatNumberWithSuffix(minInfra['Infrastructure age index'])} (${minInfra.District})`,
          'fas fa-arrow-down',
          minInfra['Infrastructure age index'],
          'Infrastructure age index');

    // Abatement density score
    const maxAbatement = getMax(data, 'Abatement density score');
    const minAbatement = getMin(data, 'Abatement density score');
    
    createKpi('Highest Abatement Density Score', 
          `${formatNumberWithSuffix(maxAbatement['Abatement density score'])} (${maxAbatement.District})`,
          'fas fa-arrow-up',
          maxAbatement['Abatement density score'],
          'Abatement density score');
              
    createKpi('Lowest Abatement Density Score', 
          `${formatNumberWithSuffix(minAbatement['Abatement density score'])} (${minAbatement.District})`,
          'fas fa-arrow-down',
          minAbatement['Abatement density score'],
          'Abatement density score');

    // Show average values as reference KPIs
    createKpi('Average Funding Per Student', 
          `$${formatNumberWithSuffix(currentAverages['Funding per student'])}`,
          'fas fa-balance-scale',
          currentAverages['Funding per student'],
          'Funding per student');
              
    createKpi('Average Infrastructure Age', 
          `${formatNumberWithSuffix(currentAverages['Infrastructure age index'])}`,
          'fas fa-balance-scale',
          currentAverages['Infrastructure age index'],
          'Infrastructure age index');
    /***************
     * CHARTS
     ***************/
    const districts = data.map(d => d.District);

    // Population per Dollar Bar Chart with icon
    renderChart('bar', {
        labels: districts,
        datasets: [{
            label: 'Population per Dollar',
            data: data.map(d => d['Population per Dollar']),
            backgroundColor: '#4bc0c0'
        }]
    }, {
        responsive: true,
        plugins: { 
            legend: { labels: { color: 'white' } }, 
            title: { 
                display: true, 
                text: 'Population per Dollar by District', 
                color: 'white', 
                font: {size: 16}
            } 
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Population per Dollar',color: '#ffffff',}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fa-solid fa-users');

    // Deferred cost vs CIP gap Bar Chart with icon
    renderChart('bar', {
        labels: districts,
        datasets: [{
            label: 'Deferred Cost vs CIP Gap',
            data: data.map(d => d['Deffered cost vs CIP gap']),
            backgroundColor: '#ff6384'
        }]
    }, {
        responsive: true,
        plugins: { 
            legend: { labels: { color: 'white' } }, 
            title: { 
                display: true, 
                text: 'Deferred Cost vs CIP Gap by District', 
                color: 'white', 
                font: {size: 16}
            } 
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: {
                title:{display:true, text:'Deferred cost vs CIP gap', color: '#ffffff' }, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fas fa-balance-scale');

    // Funding per Student Bar Chart with icon
    renderChart('bar', {
        labels: districts,
        datasets: [{
            label: 'Funding per Student',
            data: data.map(d => d['Funding per student']),
            backgroundColor: '#36a2eb'
        }]
    }, {
        responsive: true,
        plugins: { 
            legend: { labels: { color: 'white' } }, 
            title: { 
                display: true, 
                text: 'Funding per Student by District', 
                color: 'white', 
                font: {size: 16}
            } 
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District', color:'#ffffff', font: {size:13}}, 
                grid:{color:'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: {
                title:{display:true, text:'Funding per Student', color:'#ffffff', font:{size:13}}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fas fa-graduation-cap');

    // Playgrounds per 1000 youth Bar Chart with icon
    renderChart('bar', {
        labels: districts,
        datasets: [{
            label: 'Playgrounds per 1000 youth',
            data: data.map(d => d['Playgrounds per 1000 youth']),
            backgroundColor: '#ffcd56'
        }]
    }, {
        responsive: true,
        plugins: { 
            legend: { labels: { color: 'white' } }, 
            title: { 
                display: true, 
                text: 'Playgrounds per 1000 youth by District', 
                color: 'white', 
                font: {size: 16}
            } 
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District', color:'#ffffff', font: {size:13}}, 
                grid:{color:  'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: {
                title:{display:true, text:'Playgrounds per 1000 Youth', color:'#ffffff', font:{size:13}}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fa-solid fa-person-running');

    // Workforce proximity score Line Chart with icon
    renderChart('line', {
        labels: districts,
        datasets: [{
            label: 'Workforce Proximity Score',
            data: data.map(d => d['Workforce proximity score']),
            borderColor: '#9966ff',
            backgroundColor: 'rgba(153,102,255,0.2)',
            fill: true,
            tension: 0.4
        }]
    }, {
        responsive: true,
        plugins: { 
            legend: { labels: { color: 'white' } }, 
            title: { 
                display: true, 
                text: 'Workforce proximity score across Districts', 
                color: 'white', 
                font: {size: 16}
            } 
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District', color:'#ffffff', font: {size:13}}, 
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: {
                title:{display:true, text:'Workforce Proximity Score', color:'#ffffff', font:{size:13}}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fas fa-briefcase');

    // Fiscal imbalance index Donut Chart with icon
    renderChart('doughnut', {
        labels: districts,
        datasets: [{
            label: 'Fiscal imbalance index',
            data: data.map(d => d['Fiscal imbalance index']),
            backgroundColor: [
                '#ff6384','#36a2eb','#cc65fe','#ffce56','#4bc0c0','#9966ff','#ff9f40','#c9cbcf','#8e5ea2','#3cba9f'
            ]
        }]
    }, {
        responsive: true,
        plugins: { 
            legend: { labels: { color: 'white' } }, 
            title: { 
                display: true, 
                text: 'Fiscal Imbalance Index by District', 
                color: 'white', 
                font: {size: 16}
            } 
        }
    }, 'chartsContainer', 'fas fa-chart-pie');

    // Repurposed sites Donut Chart with icon
    renderChart('doughnut', {
        labels: districts,
        datasets: [{
            label: 'Repurposed sites',
            data: data.map(d => d['Repurposed sites']),
            backgroundColor: [
                '#ff6384','#36a2eb','#cc65fe','#ffce56','#4bc0c0','#9966ff','#ff9f40','#c9cbcf','#8e5ea2','#3cba9f'
            ]
        }]
    }, {
        responsive: true,
        plugins: { 
            legend: { labels: { color: 'white' } }, 
            title: { 
                display: true, 
                text: 'Repurposed Sites by District', 
                color: 'white', 
                font: {size: 16}
            } 
        }
    }, 'chartsContainer', 'fas fa-recycle');
});

// Capital INVESTMENTS============================
// Capital INVESTMENTS============================
document.getElementById('btnCapitalInvestments').addEventListener('click', function() {
    if (!excelData || !excelData['Capital investments']) {
        alert("Please import the Excel file with 'Capital investments' sheet first!");
        return;
    }

    const data = excelData['Capital investments'];

    // Clear previous content
    document.getElementById('kpiContainer').innerHTML = '';
    document.getElementById('chartsContainer').innerHTML = '';
     // IMPORTANT: Set display to grid
    document.getElementById('chartsContainer').style.display = 'grid';
    
    // Reset averages
    currentAverages = {};

    /****************
     * PREPARE DISTRICTS & YEARS
     ****************/
    const districts = [...new Set(data.map(d => d.District))];
    const years = [...new Set(data.map(d => d.Year))];

    /****************
     * HELPER FUNCTIONS
     ****************/
    const sumField = (arr, field) => arr.reduce((acc,d) => acc + (parseFloat(d[field]) || 0), 0);
    const avgField = (arr, field) => {
        const validValues = arr.filter(d => !isNaN(parseFloat(d[field])) && d[field] !== '');
        if (validValues.length === 0) return 0;
        return sumField(validValues, field) / validValues.length;
    };
    const getMax = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) >= (parseFloat(b[field]) || 0) ? a : b);
    const getMin = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) <= (parseFloat(b[field]) || 0) ? a : b);

    /****************
     * CALCULATE AVERAGES FOR ALL FIELDS
     ****************/
    const fieldsToAverage = [
        'CIP funding total',
        'Facilities funding',
        'Playgrounds funding',
        'Energy funding',
        'Safety funding',
        'CTE funding',
        'New school allocations'
    ];
    
    fieldsToAverage.forEach(field => {
        currentAverages[field] = avgField(data, field);
    });

    /****************
     * KPI CARDS WITH TRENDS
     ****************/
    // CIP funding total
    const totalCIP = sumField(data, 'CIP funding total');
    const avgCIP = currentAverages['CIP funding total'];
    const maxCIP = getMax(data, 'CIP funding total');
    const minCIP = getMin(data, 'CIP funding total');
    
    createKpi('Total CIP Fundings', 
          `$${formatNumberWithSuffix(totalCIP)}`,
          'fas fa-calculator',
          totalCIP,
          'CIP funding total');
              
    createKpi('Average CIP Funding per District', 
          `$${formatNumberWithSuffix(avgCIP)}`,
          'fas fa-balance-scale',
          avgCIP,
          'CIP funding total');
              
    createKpi('Maximum CIP Funding', 
          `$${formatNumberWithSuffix(maxCIP['CIP funding total'])} (${maxCIP.District}, ${maxCIP.Year})`,
          'fas fa-arrow-up',
          maxCIP['CIP funding total'],
          'CIP funding total');
              
    createKpi('Minimum CIP Funding', 
          `$${formatNumberWithSuffix(minCIP['CIP funding total'])} (${minCIP.District}, ${minCIP.Year})`,
          'fas fa-arrow-down',
          minCIP['CIP funding total'],
          'CIP funding total');

    // Facilities funding
    const totalFacilities = sumField(data, 'Facilities funding');
    const avgFacilities = currentAverages['Facilities funding'];
    const maxFac = getMax(data, 'Facilities funding');
    const minFac = getMin(data, 'Facilities funding');
    
    createKpi('Total Facilities Funding', 
          `$${formatNumberWithSuffix(totalFacilities)}`,
          'fas fa-calculator',
          totalFacilities,
          'Facilities funding');
              
    createKpi('Average Facilities Funding', 
          `$${formatNumberWithSuffix(avgFacilities)}`,
          'fas fa-balance-scale',
          avgFacilities,
          'Facilities funding');
              
    createKpi('Maximum Facilities Funding', 
          `$${formatNumberWithSuffix(maxFac['Facilities funding'])} (${maxFac.District}, ${maxFac.Year})`,
          'fas fa-arrow-up',
          maxFac['Facilities funding'],
          'Facilities funding');
              
    createKpi('Minimum Facilities Funding', 
          `$${formatNumberWithSuffix(minFac['Facilities funding'])} (${minFac.District}, ${minFac.Year})`,
          'fas fa-arrow-down',
          minFac['Facilities funding'],
          'Facilities funding');

    // Playgrounds funding
    const totalPlaygrounds = sumField(data, 'Playgrounds funding');
    const avgPlaygrounds = currentAverages['Playgrounds funding'];
    const maxPlay = getMax(data, 'Playgrounds funding');
    const minPlay = getMin(data, 'Playgrounds funding');
    
    createKpi('Total Playgrounds Funding', 
          `$${formatNumberWithSuffix(totalPlaygrounds)}`,
          'fas fa-calculator',
          totalPlaygrounds,
          'Playgrounds funding');
              
    createKpi('Average Playgrounds Funding', 
          `$${formatNumberWithSuffix(avgPlaygrounds)}`,
          'fas fa-balance-scale',
          avgPlaygrounds,
          'Playgrounds funding');
              
    createKpi('Maximum Playgrounds Funding', 
          `$${formatNumberWithSuffix(maxPlay['Playgrounds funding'])} (${maxPlay.District}, ${maxPlay.Year})`,
          'fas fa-arrow-up',
          maxPlay['Playgrounds funding'],
          'Playgrounds funding');
              
    createKpi('Minimum Playgrounds Funding', 
          `$${formatNumberWithSuffix(minPlay['Playgrounds funding'])} (${minPlay.District}, ${minPlay.Year})`,
          'fas fa-arrow-down',
          minPlay['Playgrounds funding'],
          'Playgrounds funding');

    // Energy funding
    const totalEnergy = sumField(data, 'Energy funding');
    const avgEnergy = currentAverages['Energy funding'];
    const maxEnergy = getMax(data, 'Energy funding');
    const minEnergy = getMin(data, 'Energy funding');
    
    createKpi('Total Energy Funding', 
          `$${formatNumberWithSuffix(totalEnergy)}`,
          'fas fa-calculator',
          totalEnergy,
          'Energy funding');
              
    createKpi('Average Energy Funding', 
          `$${formatNumberWithSuffix(avgEnergy)}`,
          'fas fa-balance-scale',
          avgEnergy,
          'Energy funding');
              
    createKpi('Maximum Energy Funding', 
          `$${formatNumberWithSuffix(maxEnergy['Energy funding'])} (${maxEnergy.District}, ${maxEnergy.Year})`,
          'fas fa-arrow-up',
          maxEnergy['Energy funding'],
          'Energy funding');
              
    createKpi('Minimum Energy Funding', 
          `$${formatNumberWithSuffix(minEnergy['Energy funding'])} (${minEnergy.District}, ${minEnergy.Year})`,
          'fas fa-arrow-down',
          minEnergy['Energy funding'],
          'Energy funding');
    // Safety funding
    const totalSafety = sumField(data, 'Safety funding');
    const avgSafety = currentAverages['Safety funding'];
    const maxSafety = getMax(data, 'Safety funding');
    const minSafety = getMin(data, 'Safety funding');
    
    createKpi('Total Safety Funding', 
          `$${formatNumberWithSuffix(totalSafety)}`,
          'fas fa-calculator',
          totalSafety,
          'Safety funding');
              
    createKpi('Average Safety Funding', 
          `$${formatNumberWithSuffix(avgSafety)}`,
          'fas fa-balance-scale',
          avgSafety,
          'Safety funding');
              
    createKpi('Maximum Safety Funding', 
          `$${formatNumberWithSuffix(maxSafety['Safety funding'])} (${maxSafety.District}, ${maxSafety.Year})`,
          'fas fa-arrow-up',
          maxSafety['Safety funding'],
          'Safety funding');
              
    createKpi('Minimum Safety Funding', 
          `$${formatNumberWithSuffix(minSafety['Safety funding'])} (${minSafety.District}, ${minSafety.Year})`,
          'fas fa-arrow-down',
          minSafety['Safety funding'],
          'Safety funding');

    // CTE funding
    const totalCTE = sumField(data, 'CTE funding');
    const avgCTE = currentAverages['CTE funding'];
    const maxCTE = getMax(data, 'CTE funding');
    const minCTE = getMin(data, 'CTE funding');
    
    createKpi('Total CTE Funding', 
          `$${formatNumberWithSuffix(totalCTE)}`,
          'fas fa-calculator',
          totalCTE,
          'CTE funding');
              
    createKpi('Average CTE Funding', 
          `$${formatNumberWithSuffix(avgCTE)}`,
          'fas fa-balance-scale',
          avgCTE,
          'CTE funding');
              
    createKpi('Maximum CTE Funding', 
          `$${formatNumberWithSuffix(maxCTE['CTE funding'])} (${maxCTE.District}, ${maxCTE.Year})`,
          'fas fa-arrow-up',
          maxCTE['CTE funding'],
          'CTE funding');
              
    createKpi('Minimum CTE Funding', 
          `$${formatNumberWithSuffix(minCTE['CTE funding'])} (${minCTE.District}, ${minCTE.Year})`,
          'fas fa-arrow-down',
          minCTE['CTE funding'],
          'CTE funding');

    // New school allocations
    const totalSchools = sumField(data, 'New school allocations');
    const avgSchools = currentAverages['New school allocations'];
    const maxSchool = getMax(data, 'New school allocations');
    const minSchool = getMin(data, 'New school allocations');
    
    createKpi('Total New School Allocations', 
          `${formatNumberWithSuffix(totalSchools)}`,
          'fas fa-calculator',
          totalSchools,
          'New school allocations');
              
    createKpi('Average New School Allocations', 
          `${formatNumberWithSuffix(avgSchools)}`,
          'fas fa-balance-scale',
          avgSchools,
          'New school allocations');
              
    createKpi('Maximum New School Allocations', 
          `${formatNumberWithSuffix(maxSchool['New school allocations'])} (${maxSchool.District}, ${maxSchool.Year})`,
          'fas fa-arrow-up',
          maxSchool['New school allocations'],
          'New school allocations');
              
    createKpi('Minimum New School Allocations', 
          `${formatNumberWithSuffix(minSchool['New school allocations'])} (${minSchool.District}, ${minSchool.Year})`,
          'fas fa-arrow-down',
          minSchool['New school allocations'],
          'New school allocations');

    /****************
     * GROUPED BAR CHARTS
     ****************/
    const colors = ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff','#ff9f40','#c9cbcf'];

    // CIP funding total with icon
    renderChart('bar', {
        labels: districts,
        datasets: years.map((y,i)=> ({
            label: y,
            data: districts.map(d => {
                const entry = data.find(item => item.District===d && item.Year===y);
                return entry ? parseFloat(entry['CIP funding total']||0) : 0;
            }),
            backgroundColor: colors[i%colors.length]
        }))
    }, {
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'CIP Funding by District and Year', 
                color:'white', 
                font:{size:16}
            }
        },
        scales:{
            x:{
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'},
                ticks:{color:'white'}
            }, 
            y:{
                title:{display: true, text: 'CIP Funding',color: '#ffffff',font: { size: 13 }},
                ticks:{color:'white'}
            }
        }
    }, 'chartsContainer', 'fas fa-money-check-alt');

    // Similarly create grouped bar charts for Facilities, Playgrounds, Energy funding
    const fields = [
        {field:'Facilities funding', title:'Facilities Funding by District and Year', icon:'fa-solid fa-sack-dollar'},
        {field:'Playgrounds funding', title:'Playgrounds Funding by District and Year', icon:'fa-solid fa-sack-dollar'},
        {field:'Energy funding', title:'Energy Funding by District and Year', icon:'fa-solid fa-sack-dollar'}
    ];
    
    fields.forEach(f => {
        renderChart(
            'bar',
            {
                labels: districts,
                datasets: years.map((y, i) => ({
                    label: y,
                    data: districts.map(d => {
                        const entry = data.find(item => item.District === d && item.Year === y);
                        return entry ? parseFloat(entry[f.field] || 0) : 0;
                    }),
                    backgroundColor: colors[i % colors.length]
                }))
            },
            {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'white' } },
                    title: {
                        display: true,
                        text: f.title,
                        color: 'white',
                        font: { size: 16 }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: 'District',
                            color: 'white'
                        }
                    },
                    y: {
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: f.field,
                            color: 'white'
                        }
                    }
                }
            },
            'chartsContainer',
            f.icon
        );
    });

    /****************
     * LINE CHARTS
     ****************/
    // Safety funding trends with icon
    renderChart('line', {
        labels: years,
        datasets: districts.map((d,i)=> ({
            label: d,
            data: years.map(y=>{
                const entry = data.find(item => item.District===d && item.Year===y);
                return entry ? parseFloat(entry['Safety funding']||0) : 0;
            }),
            borderColor: colors[i%colors.length],
            backgroundColor: 'rgba(0,0,0,0)',
            fill:false,
            tension:0.4
        }))
    }, {
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Safety Funding Trends by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'Year',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Safety Funding',color: '#ffffff'}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fas fa-shield-alt');

    // CTE funding trends with icon
    renderChart('line', {
        labels: years,
        datasets: districts.map((d,i)=> ({
            label: d,
            data: years.map(y=>{
                const entry = data.find(item => item.District===d && item.Year===y);
                return entry ? parseFloat(entry['CTE funding']||0) : 0;
            }),
            borderColor: colors[i%colors.length],
            backgroundColor: 'rgba(0,0,0,0)',
            fill:false,
            tension:0.4
        }))
    }, {
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'CTE Funding Trends by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'Year',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'CTE Funding',color: '#ffffff'}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fas fa-graduation-cap');

    /****************
     * DONUT CHARTS
     ****************/
    const fieldsDonut = [
        {field:'CIP funding total', icon:'fas fa-money-check-alt'},
        {field:'Facilities funding', icon:'fas fa-building'},
        {field:'Playgrounds funding', icon:'fas fa-park'},
        {field:'Energy funding', icon:'fas fa-bolt'},
        {field:'Safety funding', icon:'fas fa-shield-alt'},
        {field:'CTE funding', icon:'fas fa-graduation-cap'},
        {field:'New school allocations', icon:'fas fa-school'}
    ];
    
    fieldsDonut.forEach(f=>{
        renderChart('doughnut', {
            labels: districts,
            datasets:[{
                label: f.field,
                data: districts.map(d=>{
                    const sum = sumField(data.filter(item=>item.District===d), f.field);
                    return sum;
                }),
                backgroundColor: colors
            }]
        },{
            responsive:true,
            plugins:{
                legend:{labels:{color:'white'}}, 
                title:{
                    display:true, 
                    text:`${f.field} by District`, 
                    color:'white', 
                    font:{size:16}
                }
            }
        }, 'chartsContainer', f.icon);
    });
});
//District Demographics================
document.getElementById('btnDistrictDemographics').addEventListener('click', function() {
    if (!excelData || !excelData['District demographics']) {
        alert("Please import the Excel file with 'District demographics' sheet first!");
        return;
    }

    const data = excelData['District demographics'];

    // Clear previous content
    document.getElementById('kpiContainer').innerHTML = '';
    document.getElementById('chartsContainer').innerHTML = '';
     // IMPORTANT: Set display to grid
    document.getElementById('chartsContainer').style.display = 'grid';
    
    // Reset averages
    currentAverages = {};

    /****************
     * PREPARE DISTRICTS & YEARS
     ****************/
    const districts = [...new Set(data.map(d => d.District))];
    const years = [...new Set(data.map(d => d.Year))];

    /****************
     * HELPER FUNCTIONS
     ****************/
    const sumField = (arr, field) => arr.reduce((acc,d) => acc + (parseFloat(d[field]) || 0), 0);
    const avgField = (arr, field) => {
        const validValues = arr.filter(d => !isNaN(parseFloat(d[field])) && d[field] !== '');
        if (validValues.length === 0) return 0;
        return sumField(validValues, field) / validValues.length;
    };
    const getMax = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) >= (parseFloat(b[field]) || 0) ? a : b);
    const getMin = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) <= (parseFloat(b[field]) || 0) ? a : b);

    /****************
     * CALCULATE AVERAGES FOR ALL FIELDS
     ****************/
    const fieldsToAverage = [
        'Total population',
        'School age 0-5',
        'School age 6-13',
        'School age 14-18',
        'Median income',
        'Poverty rate',
        'Owner occupied rate',
        'Population growth trend'
    ];
    
    fieldsToAverage.forEach(field => {
        currentAverages[field] = avgField(data, field);
    });

    /****************
     * KPI CARDS WITH TRENDS
     ****************/
    const kpiFields = [
        {field:'Total population', label:'Total Population', icon:'fas fa-users', reverseLogic: false},
        {field:'School age 0-5', label:'School Age 0-5 Population', icon:'fas fa-baby', reverseLogic: false},
        {field:'School age 6-13', label:'School Age 6-13 Population', icon:'fas fa-child', reverseLogic: false},
        {field:'School age 14-18', label:'School Age 14-18 Population', icon:'fas fa-user-graduate', reverseLogic: false},
        {field:'Median income', label:'Median Income', icon:'fas fa-money-bill-wave', reverseLogic: false},
        {field:'Poverty rate', label:'Poverty Rate', icon:'fas fa-hand-holding-heart', reverseLogic: true},
        {field:'Owner occupied rate', label:'Owner Occupied Rate', icon:'fas fa-home', reverseLogic: false}
    ];

    kpiFields.forEach(f=>{
        const total = sumField(data, f.field);
        const average = currentAverages[f.field];
        const maxRecord = getMax(data, f.field);
        const minRecord = getMin(data, f.field);
        
        // Format values based on field type
        const formatValue = (value) => {
            if (f.field.includes('rate') || f.field.includes('trend')) {
                return parseFloat(value).toFixed(1) + '%';
            } else if (f.field.includes('income')) {
                return '$' + parseFloat(value).toFixed(2);
            }
            return parseFloat(value).toFixed(0);
        };
        
        // Total KPI
        // Total KPI - Add $ for financial fields, not for others
        createKpi(`Total ${f.label}`, 
                (f.field.includes('income') || f.field.includes('Median income') ? '$' : '') + formatNumberWithSuffix(total),
                'fas fa-calculator',
                total,
                f.field,
                f.reverseLogic);
                        
        // Average KPI - Add $ for financial fields, not for others  
        createKpi(`Average ${f.label}`, 
                (f.field.includes('income') || f.field.includes('Median income') ? '$' : '') + formatNumberWithSuffix(average),
                'fas fa-balance-scale',
                average,
                f.field,
                f.reverseLogic);
                        
        // Maximum KPI - Add $ for financial fields, not for others
        createKpi(`Maximum ${f.label}`, 
                (f.field.includes('income') || f.field.includes('Median income') ? '$' : '') + formatNumberWithSuffix(maxRecord[f.field]) + ` (${maxRecord.District}, ${maxRecord.Year})`,
                f.reverseLogic ? 'fas fa-arrow-down' : 'fas fa-arrow-up',
                maxRecord[f.field],
                f.field,
                f.reverseLogic);
                        
        // Minimum KPI - Add $ for financial fields, not for others
        createKpi(`Minimum ${f.label}`, 
                (f.field.includes('income') || f.field.includes('Median income') ? '$' : '') + formatNumberWithSuffix(minRecord[f.field]) + ` (${minRecord.District}, ${minRecord.Year})`,
                f.reverseLogic ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
                minRecord[f.field],
                f.field,
                f.reverseLogic);
    });

    // Add Population Growth Trend KPI separately
    const avgGrowth = currentAverages['Population growth trend'];
    const maxGrowth = getMax(data, 'Population growth trend');
    const minGrowth = getMin(data, 'Population growth trend');
    
    createKpi('Average Population Growth', 
          `${formatNumberWithSuffix(avgGrowth)}%`,
          'fas fa-chart-line',
          avgGrowth,
          'Population growth trend',
          false);
              
    createKpi('Maximum Population Growth', 
          `${formatNumberWithSuffix(maxGrowth['Population growth trend'])}% (${maxGrowth.District}, ${maxGrowth.Year})`,
          'fas fa-arrow-up',
          maxGrowth['Population growth trend'],
          'Population growth trend',
          false);
              
    createKpi('Minimum Population Growth', 
          `${formatNumberWithSuffix(minGrowth['Population growth trend'])}% (${minGrowth.District}, ${minGrowth.Year})`,
          'fas fa-arrow-down',
          minGrowth['Population growth trend'],
          'Population growth trend',
          false);
    /****************
     * GROUPED BAR CHARTS
     ****************/
    const fieldsBar = [
        {field:'Total population', title:'Total Population by District and Year', icon:'fas fa-users'},
        {field:'School age 0-5', title:'School Age 0-5 Population by District and Year', icon:'fas fa-child'},
        {field:'School age 6-13', title:'School Age 6-13 Population by District and Year', icon:'fas fa-child'},
        {field:'School age 14-18', title:'School Age 14-18 Population by District and Year', icon:'fas fa-child'}
    ];

    const colors = ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff','#ff9f40','#c9cbcf'];

    fieldsBar.forEach(f => {
        renderChart(
            'bar',
            {
                labels: districts,
                datasets: years.map((y, i) => ({
                    label: y,
                    data: districts.map(d => {
                        const entry = data.find(item => item.District === d && item.Year === y);
                        return entry ? parseFloat(entry[f.field] || 0) : 0;
                    }),
                    backgroundColor: colors[i % colors.length]
                }))
            },
            {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'white' } },
                    title: {
                        display: true,
                        text: f.title,
                        color: 'white',
                        font: { size: 16 }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: 'District',
                            color: 'white'
                        }
                    },
                    y: {
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: 'Population Count',
                            color: 'white'
                        }
                    }
                }
            },
            'chartsContainer',
            f.icon
        );
    });

    /****************
     * LINE CHARTS
     ****************/
    // Owner occupied rate trends
    renderChart('line', {
        labels: years,
        datasets: districts.map((d,i)=> ({
            label: d,
            data: years.map(y=>{
                const entry = data.find(item => item.District===d && item.Year===y);
                return entry ? parseFloat(entry['Owner occupied rate']||0) : 0;
            }),
            borderColor: colors[i%colors.length],
            backgroundColor: 'rgba(0,0,0,0)',
            fill:false,
            tension:0.4
        }))
    }, {
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Owner Occupied Rate Trends by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'Year',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Owner Occupied Rate (%)',color: '#ffffff'}, 
                ticks: { 
                    color: 'white',
                    callback: function(value) {
                        return value + '%';
                    }
                } 
            } 
        }
    }, 'chartsContainer', 'fas fa-home');

    // Population growth trends
    renderChart('line', {
        labels: years,
        datasets: districts.map((d,i)=> ({
            label: d,
            data: years.map(y=>{
                const entry = data.find(item => item.District===d && item.Year===y);
                return entry ? parseFloat(entry['Population growth trend']||0) : 0;
            }),
            borderColor: colors[i%colors.length],
            backgroundColor: 'rgba(0,0,0,0)',
            fill:false,
            tension:0.4
        }))
    }, {
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Population Growth Trends by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'Year',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Population Growth Trend (%)',color: '#ffffff'}, 
                ticks: { 
                    color: 'white',
                    callback: function(value) {
                        return value + '%';
                    }
                } 
            } 
        }
    }, 'chartsContainer', 'fas fa-chart-line');

    // Poverty rate trends (with reverse logic)
    renderChart('line', {
        labels: years,
        datasets: districts.map((d,i)=> ({
            label: d,
            data: years.map(y=>{
                const entry = data.find(item => item.District===d && item.Year===y);
                return entry ? parseFloat(entry['Poverty rate']||0) : 0;
            }),
            borderColor: colors[i%colors.length],
            backgroundColor: 'rgba(0,0,0,0)',
            fill:false,
            tension:0.4
        }))
    }, {
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Poverty Rate Trends by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'Year',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Poverty Rate (%)',color: '#ffffff'}, 
                ticks: { 
                    color: 'white',
                    callback: function(value) {
                        return value + '%';
                    }
                } 
            } 
        }
    }, 'chartsContainer', 'fas fa-hand-holding-heart');

    /****************
     * SCATTER PLOT
     ****************/
    renderChart('scatter', {
        datasets: districts.map((d,i)=> ({
            label: d,
            data: years.map(y=>{
                const entry = data.find(item => item.District===d && item.Year===y);
                return entry ? {x:parseFloat(entry['Median income']||0), y:parseFloat(entry['Poverty rate']||0)} : null;
            }).filter(v=>v!==null),
            backgroundColor: colors[i%colors.length],
            pointRadius: 8,
            pointHoverRadius: 10
        }))
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Median Income vs Poverty Rate Correlation', 
                color:'white', 
                font:{size:16}
            }
        },
        scales:{
            x:{
                title:{display:true,text:'Median Income ($)',color:'white'}, 
                ticks:{
                    color:'white',
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            }, 
            y:{
                title:{display:true,text:'Poverty Rate (%)',color:'white'}, 
                ticks:{
                    color:'white',
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    }, 'chartsContainer', 'fas fa-balance-scale');
});

// Economic Context ==================
document.getElementById('btnEconomicContext').addEventListener('click', function() {
    if (!excelData || !excelData['Economic context']) {
        alert("Please import the Excel file with 'Economic context' sheet first!");
        return;
    }

    const data = excelData['Economic context'];

    // Clear previous content
    document.getElementById('kpiContainer').innerHTML = '';
    document.getElementById('chartsContainer').innerHTML = '';
     // IMPORTANT: Set display to grid
    document.getElementById('chartsContainer').style.display = 'grid';
    
    // Reset averages
    currentAverages = {};

    /****************
     * HELPER FUNCTIONS
     ****************/
    const sumField = (arr, field) => arr.reduce((acc,d) => acc + (parseFloat(d[field]) || 0), 0);
    const avgField = (arr, field) => {
        const validValues = arr.filter(d => !isNaN(parseFloat(d[field])) && d[field] !== '');
        if (validValues.length === 0) return 0;
        return sumField(validValues, field) / validValues.length;
    };
    const getMax = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) >= (parseFloat(b[field]) || 0) ? a : b);
    const getMin = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) <= (parseFloat(b[field]) || 0) ? a : b);

    /****************
     * CALCULATE AVERAGES FOR ALL ECONOMIC FIELDS
     ****************/
    const economicFields = [
        'Tax abatement zones',
        'Parcels with abatements',
        'Total abatement value',
        'Abatement expiration 2025',
        'Abatement expiration 2026',
        'Abatement expiration 2027',
        'Opportunity zones',
        'Economic corridors'
    ];
    
    economicFields.forEach(field => {
        currentAverages[field] = avgField(data, field);
    });

    /****************
     * KPI CARDS WITH SMART TRENDS
     ****************/
    const fields = [
        {
            field:'Tax abatement zones', 
            label:'Tax Abatement Zones', 
            icon:'fas fa-map-marker-alt',
            reverseLogic: false, // More zones = more economic activity
            formatType: 'count'
        },
        {
            field:'Parcels with abatements', 
            label:'Parcels with Abatements', 
            icon:'fas fa-landmark',
            reverseLogic: false, // More parcels = more tax incentives
            formatType: 'count'
        },
        {
            field:'Total abatement value', 
            label:'Total Abatement Value', 
            icon:'fas fa-money-bill-wave',
            reverseLogic: false, // Higher value = more tax relief
            formatType: 'currency'
        },
        {
            field:'Opportunity zones', 
            label:'Opportunity Zones', 
            icon:'fas fa-gem',
            reverseLogic: false, // More zones = more development opportunities
            formatType: 'count'
        },
        {
            field:'Economic corridors', 
            label:'Economic Corridors', 
            icon:'fas fa-road',
            reverseLogic: false, // More corridors = better economic infrastructure
            formatType: 'count'
        }
    ];

    fields.forEach(f=>{
        const total = sumField(data, f.field);
        const average = currentAverages[f.field];
        const maxRecord = getMax(data, f.field);
        const minRecord = getMin(data, f.field);
        
        // Format values based on type
        const formatValue = (value) => {
            if (f.formatType === 'currency') {
                return '$' + parseFloat(value).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
            return parseFloat(value).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        };

        // Total KPI - Add $ for currency fields
        createKpi(`Total ${f.label}`, 
                (f.formatType === 'currency' ? '$' : '') + formatNumberWithSuffix(total),
                'fas fa-calculator',
                total,
                f.field,
                f.reverseLogic);
                        
        // Average KPI - Add $ for currency fields
        createKpi(`Average ${f.label}`, 
                (f.formatType === 'currency' ? '$' : '') + formatNumberWithSuffix(average),
                'fas fa-balance-scale',
                average,
                f.field,
                f.reverseLogic);
                        
        // Maximum KPI - Add $ for currency fields
        createKpi(`Maximum ${f.label}`, 
                (f.formatType === 'currency' ? '$' : '') + formatNumberWithSuffix(maxRecord[f.field]) + ` (${maxRecord.District})`,
                f.reverseLogic ? 'fas fa-arrow-down' : 'fas fa-arrow-up',
                maxRecord[f.field],
                f.field,
                f.reverseLogic);
                        
        // Minimum KPI - Add $ for currency fields
        createKpi(`Minimum ${f.label}`, 
                (f.formatType === 'currency' ? '$' : '') + formatNumberWithSuffix(minRecord[f.field]) + ` (${minRecord.District})`,
                f.reverseLogic ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
                minRecord[f.field],
                f.field,
                f.reverseLogic);
    });

    // Special KPIs for Abatement Expirations (these might have reverse logic)
    const expirationFields = [
        {
            field: 'Abatement expiration 2025',
            label: '2025 Abatement Expirations',
            reverseLogic: true // Fewer expirations = better (less tax revenue loss)
        },
        {
            field: 'Abatement expiration 2026',
            label: '2026 Abatement Expirations',
            reverseLogic: true
        },
        {
            field: 'Abatement expiration 2027',
            label: '2027 Abatement Expirations',
            reverseLogic: true
        }
    ];

    expirationFields.forEach(f=>{
        const total = sumField(data, f.field);
        const average = currentAverages[f.field];
        const maxRecord = getMax(data, f.field);
        const minRecord = getMin(data, f.field);
        
        const formatValue = (value) => parseFloat(value).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        // Total KPI for expirations
       // Total KPI for expirations - NO dollar sign (counts)
        createKpi(`Total ${f.label}`, 
                `${formatNumberWithSuffix(total)}`,
                'fas fa-calculator',
                total,
                f.field,
                f.reverseLogic);
                        
        // Average KPI for expirations - NO dollar sign (counts)
        createKpi(`Average ${f.label}`, 
                `${formatNumberWithSuffix(average)}`,
                'fas fa-balance-scale',
                average,
                f.field,
                f.reverseLogic);
                        
        // Maximum KPI for expirations - NO dollar sign (counts)
        createKpi(`Maximum ${f.label}`, 
                `${formatNumberWithSuffix(maxRecord[f.field])} (${maxRecord.District})`,
                f.reverseLogic ? 'fas fa-arrow-down' : 'fas fa-arrow-up',
                maxRecord[f.field],
                f.field,
                f.reverseLogic);
                        
        // Minimum KPI for expirations - NO dollar sign (counts)
        createKpi(`Minimum ${f.label}`, 
                `${formatNumberWithSuffix(minRecord[f.field])} (${minRecord.District})`,
                f.reverseLogic ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
                minRecord[f.field],
                f.field,
                f.reverseLogic);
    });

    /****************
     * GROUPED BAR CHARTS
     ****************/
    const districts = [...new Set(data.map(d=>d.District))];
    const colors = ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff','#ff9f40','#c9cbcf'];

    // Abatement expiration 2025,2026,2027 with icon
    renderChart('bar', {
        labels: districts,
        datasets: [
            {
                label:'2025 Abatement Expirations',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Abatement expiration 2025']||0) : 0;
                }),
                backgroundColor:'#ff6384'
            },
            {
                label:'2026 Abatement Expirations',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Abatement expiration 2026']||0) : 0;
                }),
                backgroundColor:'#36a2eb'
            },
            {
                label:'2027 Abatement Expirations',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Abatement expiration 2027']||0) : 0;
                }),
                backgroundColor:'#ffce56'
            }
        ]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Abatement Expirations by Year and District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Number of Expirations',color: '#ffffff'}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fas fa-calendar-times');

    // Opportunity zones and Economic corridors with icon
    renderChart('bar', {
        labels: districts,
        datasets: [
            {
                label:'Opportunity Zones',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Opportunity zones']||0) : 0;
                }),
                backgroundColor:'#4bc0c0'
            },
            {
                label:'Economic Corridors',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Economic corridors']||0) : 0;
                }),
                backgroundColor:'#9966ff'
            }
        ]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Opportunity Zones and Economic Corridors', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Count',color: '#ffffff'}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fa-solid fa-building-columns');

    /****************
     * ADDITIONAL CHARTS FOR ECONOMIC CONTEXT
     ****************/
    
    // Tax Abatement Zones by District
    renderChart('bar', {
        labels: districts,
        datasets: [{
            label: 'Tax Abatement Zones',
            data: districts.map(d => {
                const entry = data.find(item => item.District===d);
                return entry ? parseFloat(entry['Tax abatement zones']||0) : 0;
            }),
            backgroundColor: '#ff9f40'
        }]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Tax Abatement Zones by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Number of Zones',color: '#ffffff'}, 
                ticks: { color: 'white' } 
            } 
        }
    }, 'chartsContainer', 'fas fa-map-marked-alt');

    // Total Abatement Value by District
    renderChart('bar', {
        labels: districts,
        datasets: [{
            label: 'Total Abatement Value',
            data: districts.map(d => {
                const entry = data.find(item => item.District===d);
                return entry ? parseFloat(entry['Total abatement value']||0) : 0;
            }),
            backgroundColor: '#c9cbcf'
        }]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Total Abatement Value by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Value ($)',color: '#ffffff'}, 
                ticks: { 
                    color: 'white',
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                } 
            } 
        }
    }, 'chartsContainer', 'fas fa-hand-holding-usd');

    // Parcels with Abatements vs Total Abatement Value Scatter Plot
    renderChart('scatter', {
        datasets: districts.map((d,i)=> ({
            label: d,
            data: [{
                x: (() => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Parcels with abatements']||0) : 0;
                })(),
                y: (() => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Total abatement value']||0) : 0;
                })()
            }],
            backgroundColor: colors[i%colors.length],
            pointRadius: 10,
            pointHoverRadius: 12
        }))
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Parcels vs Abatement Value Correlation', 
                color:'white', 
                font:{size:16}
            }
        },
        scales:{
            x:{
                title:{display:true,text:'Parcels with Abatements',color:'white'}, 
                ticks:{color:'white'}
            }, 
            y:{
                title:{display:true,text:'Total Abatement Value ($)',color:'white'}, 
                ticks:{
                    color:'white',
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        }
    }, 'chartsContainer', 'fa-solid fa-share-nodes');
});

//Public Amenities=================
document.getElementById('btnPublicAmenities').addEventListener('click', function() {
    if (!excelData || !excelData['Public amenities']) {
        alert("Please import the Excel file with 'Public amenities' sheet first!");
        return;
    }

    const data = excelData['Public amenities'];

    // Clear previous content
    document.getElementById('kpiContainer').innerHTML = '';
    document.getElementById('chartsContainer').innerHTML = '';
     // IMPORTANT: Set display to grid
    document.getElementById('chartsContainer').style.display = 'grid';
    
    // Reset averages
    currentAverages = {};

    const districts = [...new Set(data.map(d => d.District))];

    /****************
     * HELPER FUNCTIONS
     ****************/
    const sumField = (arr, field) => arr.reduce((acc,d) => acc + (parseFloat(d[field]) || 0), 0);
    const avgField = (arr, field) => {
        const validValues = arr.filter(d => !isNaN(parseFloat(d[field])) && d[field] !== '');
        if (validValues.length === 0) return 0;
        return sumField(validValues, field) / validValues.length;
    };
    const getMax = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) >= (parseFloat(b[field]) || 0) ? a : b);
    const getMin = (arr, field) => arr.reduce((a,b) => (parseFloat(a[field]) || 0) <= (parseFloat(b[field]) || 0) ? a : b);

    /****************
     * CALCULATE AVERAGES FOR ALL AMENITY FIELDS
     ****************/
    const amenityFields = [
        'Playground count',
        'Playground good condition',
        'Playground poor condition',
        'Parks count',
        'Rec centers count',
        'Flood zone area',
        'Safe routes score'
    ];
    
    amenityFields.forEach(field => {
        currentAverages[field] = avgField(data, field);
    });

    /****************
     * KPI CARDS WITH SMART TRENDS
     ****************/
    const amenityKPIs = [
        {
            field: 'Playground count',
            label: 'Playground Count',
            icon: 'fas fa-park',
            reverseLogic: false, // More playgrounds = better
            formatType: 'count'
        },
        {
            field: 'Playground good condition',
            label: 'Playgrounds with Good Conditions',
            icon: 'fas fa-thumbs-up',
            reverseLogic: false, // More good condition = better
            formatType: 'count'
        },
        {
            field: 'Playground poor condition',
            label: 'Playgrounds with Poor Conditions',
            icon: 'fas fa-thumbs-down',
            reverseLogic: true, // Fewer poor condition = better
            formatType: 'count'
        },
        {
            field: 'Parks count',
            label: 'Parks Count',
            icon: 'fas fa-tree',
            reverseLogic: false, // More parks = better
            formatType: 'count'
        },
        {
            field: 'Rec centers count',
            label: 'Recreation Centers Count',
            icon: 'fas fa-running',
            reverseLogic: false, // More rec centers = better
            formatType: 'count'
        },
        {
            field: 'Flood zone area',
            label: 'Flood Zone Area',
            icon: 'fas fa-water',
            reverseLogic: true, // Less flood zone area = better
            formatType: 'area'
        },
        {
            field: 'Safe routes score',
            label: 'Safe Routes Score',
            icon: 'fas fa-walking',
            reverseLogic: false, // Higher score = better
            formatType: 'score'
        }
    ];

    amenityKPIs.forEach(kpi => {
        const total = sumField(data, kpi.field);
        const average = currentAverages[kpi.field];
        const maxRecord = getMax(data, kpi.field);
        const minRecord = getMin(data, kpi.field);
        
        // Format values based on type
        const formatValue = (value) => {
            const numValue = parseFloat(value);
            if (kpi.formatType === 'area') {
                return numValue.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }) + ' sq ft';
            } else if (kpi.formatType === 'score') {
                return numValue.toFixed(1) + '/10';
            }
            return numValue.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        };

        // Total KPI
        createKpi(`Total ${kpi.label}`, 
                formatPublicAmenitiesValue(total, kpi.formatType),
                'fas fa-calculator',
                total,
                kpi.field,
                kpi.reverseLogic);
                        
        // Average KPI
        createKpi(`Average ${kpi.label}`, 
                formatPublicAmenitiesValue(average, kpi.formatType),
                'fas fa-balance-scale',
                average,
                kpi.field,
                kpi.reverseLogic);
                  
        // Maximum KPI
        const maxIsGood = kpi.reverseLogic ? false : true;
                
        createKpi(`${maxIsGood ? 'Highest' : 'Highest'} ${kpi.label}`, 
            formatPublicAmenitiesValue(maxRecord[kpi.field], kpi.formatType) + ` (${maxRecord.District})`,
            maxIsGood ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
            maxRecord[kpi.field],
            kpi.field,
            kpi.reverseLogic);
                  
        // Minimum KPI
        const minIsGood = kpi.reverseLogic ? true : false;
                
        createKpi(`${minIsGood ? 'Lowest' : 'Lowest'} ${kpi.label}`, 
            formatPublicAmenitiesValue(minRecord[kpi.field], kpi.formatType) + ` (${minRecord.District})`,
            minIsGood ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
            minRecord[kpi.field],
            kpi.field,
            kpi.reverseLogic);
    });

    // Additional KPIs for condition ratios
    const totalGood = sumField(data, 'Playground good condition');
    const totalPoor = sumField(data, 'Playground poor condition');
    const totalPlaygrounds = sumField(data, 'Playground count');
    
    if (totalPlaygrounds > 0) {
        const goodConditionRate = (totalGood / totalPlaygrounds) * 100;
        const poorConditionRate = (totalPoor / totalPlaygrounds) * 100;
        
        // Good Condition Rate KPI
        createKpi('Average Good Condition Rate', 
                formatPublicAmenitiesValue(goodConditionRate, 'percent'),
                'fas fa-thumbs-up',
                goodConditionRate,
                'Playground good condition',
                false);
            
        createKpi('Average Poor Condition Rate', 
                formatPublicAmenitiesValue(poorConditionRate, 'percent'),
                'fas fa-thumbs-down',
                poorConditionRate,
                'Playground poor condition',
                true);
    }

    /****************
     * LINE CHARTS
     ****************/
    const colors = ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff','#ff9f40','#c9cbcf'];

    // Rec centers count with icon
    renderChart('line', {
        labels: districts,
        datasets: [{
            label: 'Recreation Centers',
            data: districts.map(d => {
                const entry = data.find(item => item.District===d);
                return entry ? parseFloat(entry['Rec centers count']||0) : 0;
            }),
            borderColor:'#36a2eb',
            backgroundColor:'rgba(0,0,0,0)',
            fill:false,
            tension:0.4,
            borderWidth: 3
        }]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Recreation Centers by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Number of Centers',color: '#ffffff'}, 
                ticks: { color: 'white' },
                beginAtZero: true
            } 
        }
    }, 'chartsContainer', 'fas fa-running');

    // Flood zone area with icon
    renderChart('line', {
        labels: districts,
        datasets: [{
            label: 'Flood Zone Area',
            data: districts.map(d => {
                const entry = data.find(item => item.District===d);
                return entry ? parseFloat(entry['Flood zone area']||0) : 0;
            }),
            borderColor:'#ff6384',
            backgroundColor:'rgba(0,0,0,0)',
            fill:false,
            tension:0.4,
            borderWidth: 3
        }]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Flood Zone Area by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Area (sq ft)',color: '#ffffff'}, 
                ticks: { 
                    color: 'white',
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                },
                beginAtZero: true
            } 
        }
    }, 'chartsContainer', 'fas fa-water');

    /****************
     * BAR CHARTS
     ****************/
    // Safe routes score with icon
    renderChart('bar', {
        labels: districts,
        datasets:[{
            label:'Safe Routes Score',
            data: districts.map(d=>{
                const entry = data.find(item => item.District===d);
                return entry ? parseFloat(entry['Safe routes score']||0) : 0;
            }),
            backgroundColor:'#4bc0c0',
            borderColor: '#36a2eb',
            borderWidth: 1
        }]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Safe Routes Score by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales: { 
            x: { 
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks: { color: 'white' } 
            }, 
            y: { 
                title:{display: true,text: 'Safety Score (0-10)',color: '#ffffff'}, 
                ticks: { 
                    color: 'white',
                    max: 10,
                    min: 0,
                    stepSize: 1
                },
                beginAtZero: true
            } 
        }
    }, 'chartsContainer', 'fas fa-walking');

    /****************
     * GROUPED BAR CHART - Playground and Park Metrics
     ****************/
    renderChart('bar', {
        labels: districts,
        datasets:[
            {
                label:'Total Playgrounds',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Playground count']||0) : 0;
                }),
                backgroundColor:'#ff6384',
                borderColor: '#ff6384',
                borderWidth: 1
            },
            {
                label:'Good Condition',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Playground good condition']||0) : 0;
                }),
                backgroundColor:'#36a2eb',
                borderColor: '#36a2eb',
                borderWidth: 1
            },
            {
                label:'Poor Condition',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Playground poor condition']||0) : 0;
                }),
                backgroundColor:'#ffce56',
                borderColor: '#ffce56',
                borderWidth: 1
            },
            {
                label:'Parks',
                data: districts.map(d => {
                    const entry = data.find(item => item.District===d);
                    return entry ? parseFloat(entry['Parks count']||0) : 0;
                }),
                backgroundColor:'#4bc0c0',
                borderColor: '#4bc0c0',
                borderWidth: 1
            }
        ]
    },{
        responsive:true,
        plugins:{
            legend:{labels:{color:'white'}}, 
            title:{
                display:true, 
                text:'Public Amenities by District', 
                color:'white', 
                font:{size:16}
            }
        },
        scales:{
            x:{
                title:{display: true, text: 'District',color: '#ffffff',font: { size: 13 }},
                grid:{color: 'rgba(255,255,255,0.08)'}, 
                ticks:{color:'white'}
            }, 
            y:{
                title:{display: true, text: 'Count', color: '#ffffff'},
                ticks:{color:'white'},
                beginAtZero: true
            }
        }
    }, 'chartsContainer', 'fa-solid fa-building-columns');

    /****************
     * PIE CHART - Condition Distribution
     ****************/
    const totalGoodCondition = sumField(data, 'Playground good condition');
    const totalPoorCondition = sumField(data, 'Playground poor condition');
    
    if (totalGoodCondition > 0 || totalPoorCondition > 0) {
        renderChart('doughnut', {
            labels: ['Good Condition', 'Poor Condition'],
            datasets: [{
                data: [totalGoodCondition, totalPoorCondition],
                backgroundColor: ['#36a2eb', '#ffce56'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 2
            }]
        }, {
            responsive: true,
            plugins: {
                legend: { labels: { color: 'white' } },
                title: {
                    display: true,
                    text: 'Playground Condition Distribution',
                    color: 'white',
                    font: { size: 16 }
                }
            }
        }, 'chartsContainer', 'fas fa-chart-pie');
    }
});
/************************************
 * HOME AND RESET BUTTONS
 ************************************/
// Replace the existing btnHome event listener with this updated version
document.getElementById('btnHome').addEventListener('click', function() {
    // Clear current charts and KPIs
    clearAllCharts();
    clearKPIs();
    
    // Show message
    showToast('success', "Returning to Map Dashboard...");
    
    // Add a small delay for smooth transition
    setTimeout(() => {
        // Navigate back to main page
        window.location.href = 'index.html'; // Make sure this matches your main page filename
    }, 800);
});
document.getElementById('btnReset').addEventListener('click', function() {
    document.getElementById('importData').value = '';
    excelData = null;
    currentAverages = {};
    document.getElementById('kpiContainer').innerHTML = '';
    document.getElementById('chartsContainer').innerHTML = '';
    
    // Reset import button
    const importLabel = document.querySelector('.import-label');
    const importStatus = document.querySelector('.import-status');
    
    importLabel.classList.remove('success', 'error', 'loading', 'success-pulse', 'error-pulse');
    importStatus.innerHTML = '';
    document.querySelector('.import-text').textContent = 'Import Data';
    
    // Disable all data buttons
    disableAllButtons();
    
    // Show welcome screen again
    showWelcomeScreen();
    
    showToast('success', "Dashboard reset successfully!");
});

/************************************
 * COMPACT CHART RENDER FUNCTION
 * Replace your existing renderChart function with this
 ************************************/
function renderChart(type, data, options, containerId, iconClass = 'fas fa-chart-bar') {
    const container = document.getElementById(containerId);

    
    
    // Create chart wrapper
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';
    chartWrapper.dataset.chartId = Date.now() + Math.random(); // Unique ID
    
    // Create chart header with maximize button
    const chartHeader = document.createElement('div');
    chartHeader.className = 'chart-header';
    
    // Create chart title with icon
    const chartTitle = document.createElement('div');
    chartTitle.className = 'chart-title';
    chartTitle.innerHTML = `<i class="${iconClass}"></i> ${options.plugins.title.text}`;
    
    // Create maximize button
    const maximizeBtn = document.createElement('button');
    maximizeBtn.className = 'maximize-btn';
    maximizeBtn.title = 'Maximize chart';
    maximizeBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
    
    // Add click event for maximize
    maximizeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleChartMaximize(chartWrapper);
    });
    
    // Append header elements
    chartHeader.appendChild(chartTitle);
    chartHeader.appendChild(maximizeBtn);
    
    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '320px';
    canvasContainer.style.width = '100%';
    
    const canvas = document.createElement('canvas');
    
    // Append everything
    canvasContainer.appendChild(canvas);
    chartWrapper.appendChild(chartHeader);
    chartWrapper.appendChild(canvasContainer);
    container.appendChild(chartWrapper);
    
    // OPTIMIZED OPTIONS FOR COMPACT DISPLAY
    const compactOptions = {
        ...options,
        maintainAspectRatio: false,
        responsive: true,
        
        // Optimize legend for small space
        plugins: {
            ...options.plugins,
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: {
                        size: 16,           // ← CONTROL LEGEND FONT SIZE HERE
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                        weight: '600'
                    },
                    padding: 20,
                    boxWidth: 20,
                    boxHeight: 20,
                    usePointStyle: true
                    
                }
            },
            // Better tooltips
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 8,
                cornerRadius: 4,
                titleFont: { size: 20 },
                bodyFont: { size: 16 }
            }
        }
    };
    
    // Optimize X-axis labels
    if (compactOptions.scales && compactOptions.scales.x) {
        compactOptions.scales.x.ticks = {
            ...compactOptions.scales.x.ticks,
            color: 'white',
            font: {
                size: 16
            },
            maxRotation: 45,
            minRotation: 0,
            padding: 3
        };
    }
    
    // Optimize Y-axis labels
    if (compactOptions.scales && compactOptions.scales.y) {
        compactOptions.scales.y.ticks = {
            ...compactOptions.scales.y.ticks,
            color: 'white',
            font: {
                size: 16
            },
            padding: 3
        };
    }
    
    // For bar charts, make bars thinner
    if (type === 'bar' && data.datasets) {
        data.datasets.forEach(dataset => {
            dataset.barPercentage = 0.7;
            dataset.categoryPercentage = 0.8;
            dataset.borderRadius = 3;
        });
    }
    
    // Hide the default title (we use our own)
    compactOptions.plugins.title.display = false;
    
    // Store the chart instance on the wrapper
    const chart = new Chart(canvas, { 
        type, 
        data, 
        options: compactOptions 
    });
    
    // Store chart instance reference
    chartWrapper.chartInstance = chart;
    
    return chartWrapper;
}

/************************************
 * TOGGLE CHART MAXIMIZE FUNCTION
 ************************************/
function toggleChartMaximize(chartWrapper) {
    const isMaximized = chartWrapper.classList.contains('maximized');
    const chartsContainer = document.getElementById('chartsContainer');
    
    if (!isMaximized) {
        // MAXIMIZE THE CHART
        
        // Create overlay
        let overlay = document.querySelector('.fullscreen-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'fullscreen-overlay';
            document.body.appendChild(overlay);
        }
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'maximized-close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.title = 'Close fullscreen';
        
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleChartMaximize(chartWrapper);
        });
        
        // Add to chart wrapper
        chartWrapper.appendChild(closeBtn);
        
        // Add maximize class
        chartWrapper.classList.add('maximized');
        overlay.classList.add('active');
        
        // Disable scrolling on body
        document.body.style.overflow = 'hidden';
        
        // Store original container and position
        chartWrapper.originalParent = chartsContainer;
        chartWrapper.originalNextSibling = chartWrapper.nextSibling;
        
        // Move to body for proper z-index
        document.body.appendChild(chartWrapper);
        
        // Update maximize button icon
        const maximizeBtn = chartWrapper.querySelector('.maximize-btn');
        if (maximizeBtn) {
            maximizeBtn.innerHTML = '<i class="fas fa-compress-alt"></i>';
            maximizeBtn.title = 'Restore chart';
        }
        
        // Resize chart
        if (chartWrapper.chartInstance) {
            setTimeout(() => {
                chartWrapper.chartInstance.resize();
            }, 100);
        }
        
        // ESC key to exit fullscreen
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                toggleChartMaximize(chartWrapper);
            }
        };
        
        chartWrapper.escHandler = escHandler;
        document.addEventListener('keydown', escHandler);
        
    } else {
        // RESTORE THE CHART
        
        // Remove close button
        const closeBtn = chartWrapper.querySelector('.maximized-close-btn');
        if (closeBtn) {
            closeBtn.remove();
        }
        
        // Remove maximize class
        chartWrapper.classList.remove('maximized');
        
        // Remove overlay
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        // Move back to original position
        if (chartWrapper.originalParent && chartWrapper.originalNextSibling) {
            chartWrapper.originalParent.insertBefore(chartWrapper, chartWrapper.originalNextSibling);
        } else if (chartWrapper.originalParent) {
            chartWrapper.originalParent.appendChild(chartWrapper);
        }
        
        // Update maximize button icon
        const maximizeBtn = chartWrapper.querySelector('.maximize-btn');
        if (maximizeBtn) {
            maximizeBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
            maximizeBtn.title = 'Maximize chart';
        }
        
        // Resize chart
        if (chartWrapper.chartInstance) {
            setTimeout(() => {
                chartWrapper.chartInstance.resize();
            }, 100);
        }
        
        // Remove ESC handler
        if (chartWrapper.escHandler) {
            document.removeEventListener('keydown', chartWrapper.escHandler);
        }
    }
}


/************************************
 * HELPER FUNCTION TO CREATE KPI CARDS (Updated with icons)
 ************************************/
function createKpi(title, value, icon = null, kpiValue = null, fieldName = '') {
    const kpiContainer = document.getElementById('kpiContainer');
    const card = document.createElement('div');
    card.className = 'kpi-card';
    
    // Get icon if not provided
    const iconHtml = icon ? `<i class="${icon}"></i>` : getIconForKPI(title);
    
    // Get trend indicator if we have value and field name
    let trendIndicator = '';
    let trendExplanation = '';
    
    if (kpiValue !== null && fieldName && currentAverages[fieldName] !== undefined) {
        const average = currentAverages[fieldName];
        trendIndicator = getTrendIndicator(kpiValue, average, fieldName);
        trendExplanation = getTrendExplanation(kpiValue, average, fieldName);
    } else {
        trendExplanation = 'Average data not available';
    }
    
    // Parse value to extract district and year information
    let displayValue = value;
    let districtInfo = '';
    let yearInfo = '';
    let pureValue = value; // Value without district/year
    
    // Check if value contains parentheses with district/year info
    const match = value.match(/([^(]+)\s*\(([^)]+)\)/);
    if (match) {
        // Extract pure value (before parentheses)
        pureValue = match[1].trim();
        displayValue = pureValue;
        
        // Extract content inside parentheses
        const content = match[2];
        
        // Try to parse district and year
        // Pattern 1: "District Name, Year"
        const districtYearMatch = content.match(/([^,]+),\s*(\d{4})/);
        if (districtYearMatch) {
            const district = districtYearMatch[1].trim();
            const year = districtYearMatch[2].trim();
            
            districtInfo = `
                <div class="kpi-metadata-item">
                    <i class="fas fa-map-marker-alt metadata-icon"></i>
                    <span class="metadata-value">${district}</span>
                </div>
            `;
            
            yearInfo = `
                <div class="kpi-metadata-item">
                    <i class="fas fa-calendar-alt metadata-icon"></i>
                    <span class="metadata-value">${year}</span>
                </div>
            `;
        } 
        // Pattern 2: Just "District Name" or "Year"
        else {
            // Check if it's a year (4 digits)
            if (/^\d{4}$/.test(content.trim())) {
                yearInfo = `
                    <div class="kpi-metadata-item">
                        <i class="fas fa-calendar-alt metadata-icon"></i>
                        <span class="metadata-value">${content.trim()}</span>
                    </div>
                `;
            } else {
                // Assume it's a district
                districtInfo = `
                    <div class="kpi-metadata-item">
                        <i class="fas fa-map-marker-alt metadata-icon"></i>
                        <span class="metadata-value">${content}</span>
                    </div>
                `;
            }
        }
    }
    
    // Create metadata container if we have district/year info
    let metadataContainer = '';
    if (districtInfo || yearInfo) {
        metadataContainer = `
            <div class="kpi-metadata">
                ${districtInfo}
                ${yearInfo}
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="kpi-header">
            <div class="kpi-icon">${iconHtml}</div>
            <h3>${title}</h3>
        </div>
        <div class="kpi-value-container">
            <p>${displayValue}</p>
            ${trendIndicator}
        </div>
        ${metadataContainer}
        <div class="kpi-subtext">${trendExplanation}</div>
    `;
    
    kpiContainer.appendChild(card);
}