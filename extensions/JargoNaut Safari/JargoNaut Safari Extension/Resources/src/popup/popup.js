document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const statusDiv = document.getElementById('status');
    const setupSection = document.getElementById('setupSection');
    const instructions = document.getElementById('instructions');
    
    // TEMPORARILY DISABLED FOR SCREENSHOTS
    // Check if already set up
    /*
    chrome.storage.local.get(['modelSetup'], function(result) {
        if (result.modelSetup) {
            statusDiv.innerHTML = '<p>API key configured!</p>';
            statusDiv.style.background = '#f0fdf4';
            setupSection.style.display = 'none';
            instructions.style.display = 'block';
        }
    });
    */
    
    // Save button click
    saveBtn.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            statusDiv.innerHTML = '<p>Please enter an API key</p>';
            statusDiv.style.background = '#fee2e2';
            statusDiv.querySelector('p').style.color = '#991b1b';
            return;
        }
        
        statusDiv.innerHTML = '<p>Testing API key...</p>';
        statusDiv.style.background = '#fef3c7';
        statusDiv.querySelector('p').style.color = '#92400e';
        
        chrome.runtime.sendMessage(
            { action: 'setupModel', apiKey: apiKey },
            function(response) {
                if (response.success) {
                    statusDiv.innerHTML = '<p>Setup complete!</p>';
                    statusDiv.style.background = '#f0fdf4';
                    statusDiv.querySelector('p').style.color = '#166534';
                    setupSection.style.display = 'none';
                    instructions.style.display = 'block';
                    apiKeyInput.value = '';
                } else {
                    statusDiv.innerHTML = '<p>Error: ' + response.error + '</p>';
                    statusDiv.style.background = '#fee2e2';
                    statusDiv.querySelector('p').style.color = '#991b1b';
                }
            }
        );
    });
});
