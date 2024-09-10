function updateDashboard(data) {
    // Update CPU information
    const cpuCard = document.getElementById('cpu-card');
    const cpuPercent = data.cpu.percent;
    const cpuAvg = cpuPercent.reduce((a, b) => a + b, 0) / cpuPercent.length;
    cpuCard.querySelector('.progress-bar-fill').style.width = `${cpuAvg}%`;
    cpuCard.querySelector('.cpu-usage').textContent = `${cpuAvg.toFixed(1)}%`;

    let cpuDetails = '';
    for (let i = 0; i < cpuPercent.length; i++) {
        cpuDetails += `Core ${i}: ${cpuPercent[i].toFixed(1)}% (${data.cpu.freq[i].current.toFixed(0)} MHz)<br>`;
    }
    cpuCard.querySelector('.cpu-details').innerHTML = cpuDetails;

    // Update RAM information
    const ramCard = document.getElementById('ram-card');
    const ramPercent = data.ram.percent;
    ramCard.querySelector('.progress-bar-fill').style.width = `${ramPercent}%`;
    ramCard.querySelector('.ram-usage').textContent = `${ramPercent.toFixed(1)}%`;

    const ramTotal = data.ram.total / (1024 * 1024 * 1024);
    const ramUsed = data.ram.used / (1024 * 1024 * 1024);
    const ramFree = data.ram.free / (1024 * 1024 * 1024);
    ramCard.querySelector('.ram-details').innerHTML = `
        Total: ${ramTotal.toFixed(2)} GB<br>
        Used: ${ramUsed.toFixed(2)} GB<br>
        Free: ${ramFree.toFixed(2)} GB
    `;

    // Update GPU information
    const gpuCard = document.getElementById('gpu-card');
    if (data.gpu) {
        let gpuDetails = '';
        data.gpu.forEach(gpu => {
            const gpuMemTotal = gpu.memory.total / (1024 * 1024 * 1024);
            const gpuMemUsed = gpu.memory.used / (1024 * 1024 * 1024);
            const gpuMemFree = gpu.memory.free / (1024 * 1024 * 1024);
            gpuDetails += `
                GPU ${gpu.index}: ${gpu.name}<br>
                Utilization: ${gpu.utilization}%<br>
                Memory: ${gpuMemUsed.toFixed(2)} GB / ${gpuMemTotal.toFixed(2)} GB<br>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${gpu.utilization}%"></div>
                </div>
                <br>
            `;
        });
        gpuCard.querySelector('.gpu-details').innerHTML = gpuDetails;
        gpuCard.style.display = 'block';
    } else {
        gpuCard.style.display = 'none';
    }
}

const eventSource = new EventSource('/metrics');
eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    updateDashboard(data);
};
