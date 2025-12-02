export function drawSimpleChart(weeklyRates, container) {
    
    container.innerHTML = '';

    if (!weeklyRates || weeklyRates.length === 0) {
        container.innerHTML = '<p>No historical data available</p>';
        return;
    }

    
    if (weeklyRates.length === 1) {
        weeklyRates = [weeklyRates[0], weeklyRates[0]];
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '150');
    svg.setAttribute('viewBox', '0 0 400 150');

    const padding = 40;
    const chartWidth = 400 - (padding * 2);
    const chartHeight = 150 - (padding * 2);

    const minRate = Math.min(...weeklyRates);
    const maxRate = Math.max(...weeklyRates);
    const rateRange = maxRate - minRate || 1; 

    let pathData = '';

    weeklyRates.forEach((rate, index) => {
        const x = padding + (index * (chartWidth / Math.max(1, weeklyRates.length - 1)));
        const y = padding + chartHeight - ((rate - minRate) / rateRange * chartHeight);

        if (index === 0) {
            pathData += `M ${x} ${y} `;
        } else {
            pathData += `L ${x} ${y} `;
        }
    });

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#2E8B57');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('class', 'chart-line');

    svg.appendChild(path);

    weeklyRates.forEach((rate, index) => {
        const x = padding + (index * (chartWidth / Math.max(1, weeklyRates.length - 1)));
        const y = padding + chartHeight - ((rate - minRate) / rateRange * chartHeight);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#2E8B57');
        circle.setAttribute('class', 'chart-point');
        
        svg.appendChild(circle);
    });

    container.appendChild(svg);
}