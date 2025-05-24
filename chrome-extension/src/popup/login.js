document.addEventListener('DOMContentLoaded', () => {
    // Check if a username is already stored in chrome.storage.local
    chrome.storage.local.get('username', (result) => {
        const username = result.username;
        if (username) {
            // Redirect to popup.html if a username exists
            window.location.href = 'popup.html';
            return;
        }
    });

    // Handle login button click
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', () => {
        const usernameInput = document.getElementById('usernameInput').value.trim();
        if (usernameInput.length > 0) {
            // Save username to chrome.storage.local
            chrome.storage.local.set({ username: usernameInput }, () => {
                // Redirect to popup.html
                window.location.href = 'popup.html';
            });
        } else {
            alert('Please enter a valid username.');
        }
    });
});