document.addEventListener('DOMContentLoaded', () => {
    const headPlaceholder = document.getElementById('head-placeholder');
    fetch('head.html')
        .then(response => response.text())
        .then(data => {
            headPlaceholder.outerHTML = data; // Replace the placeholder with the head content
        })
        .catch(error => console.error('Error loading head:', error));
});