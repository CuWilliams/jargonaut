// This will handle the popup interactions
document.addEventListener('DOMContentLoaded', function() {
    const setupBtn = document.getElementById('setupBtn');
    const statusDiv = document.getElementById('status');
    
    // Check if AI model is already set up
    chrome.storage.local.get(['modelSetup'], function(result) {
        if (result.modelSetup) {
            statusDiv.innerHTML = '<p>✅ AI Model ready!</p>';
            statusDiv.style.background = '#f0fdf4';
            setupBtn.textContent = 'Model Ready';
            setupBtn.disabled = true;
            setupBtn.style.opacity = '0.6';
        }
    });
    
    // Setup button click
    setupBtn.addEventListener('click', function() {
        statusDiv.innerHTML = '<p>⏳ Setting up AI model... (this may take a minute)</p>';
        statusDiv.style.background = '#fef3c7';
        statusDiv.querySelector('p').style.color = '#92400e';
        
        // Send message to background script to initialize AI
        chrome.runtime.sendMessage({action: 'setupModel'}, function(response) {
            if (response.success) {
                statusDiv.innerHTML = '<p>✅ Model setup complete!</p>';
                statusDiv.style.background = '#f0fdf4';
                setupBtn.textContent = 'Model Ready';
                setupBtn.disabled = true;
                setupBtn.style.opacity = '0.6';
            } else {
                statusDiv.innerHTML = '<p>❌ Setup failed. Please try again.</p>';
                statusDiv.style.background = '#fee2e2';
                statusDiv.querySelector('p').style.color = '#991b1b';
            }
        });
    });
});