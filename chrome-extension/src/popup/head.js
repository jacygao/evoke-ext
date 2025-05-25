document.addEventListener('DOMContentLoaded', () => {
    // Check if both username and token are stored in chrome.storage.local
    chrome.storage.local.get(['userToken', 'token'], (result) => {
        const username = result.userToken;
        const token = result.token;
        if (!username || !token) {
            // Redirect to login.html if either username or token does not exist
            window.location.href = 'login.html';
            return;
        }
    });
    
    const headPlaceholder = document.getElementById('head-placeholder');
    fetch('head.html')
        .then(response => response.text())
        .then(data => {
            headPlaceholder.outerHTML = data; // Replace the placeholder with the head content
        })
        .catch(error => console.error('Error loading head:', error));
});