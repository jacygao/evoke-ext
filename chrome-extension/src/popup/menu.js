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
        })
        .catch(error => console.error('Error loading header:', error));
});