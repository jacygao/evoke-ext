document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('menu');
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            headerContainer.innerHTML = data;

            // Add event listeners for menu buttons after loading the header
            document.getElementById('takeNotesButton').addEventListener('click', () => {
                window.location.href = 'panel.html'; // Replace with the actual path
            });

            document.getElementById('viewNotesButton').addEventListener('click', () => {
                window.location.href = 'notes.html'; // Replace with the actual path
            });
            
            // Dropdown menu toggle
            const dropdownButton = document.getElementById('dropdownButton');
            const dropdownMenu = document.getElementById('dropdownMenu');
            dropdownButton.addEventListener('click', () => {
                dropdownMenu.classList.toggle('show');
            });

            // Hide dropdown menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });

            // Logout functionality
            const logoutButton = document.getElementById('logoutButton');
            logoutButton.addEventListener('click', () => {
                chrome.storage.local.remove(['username', 'token'], () => {
                    console.log('Username and token cleared from storage.');
                    window.location.href = 'login.html'; // Redirect to login page
                });
            });
        })
        .catch(error => console.error('Error loading header:', error));
});