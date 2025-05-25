import { fetchWithAuth } from '../fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    // Existing functionality
    const submitButton = document.getElementById('submitButton');
    const textBox = document.getElementById('textInput');

    submitButton.addEventListener('click', () => {
        const userInput = textBox.value;

        // Use fetchWithAuth for the API call
        fetchWithAuth('notes', {
            method: 'POST',
            body: JSON.stringify({ content: userInput })
        })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    // Navigate to notes page
    document.getElementById('viewNotesButton').addEventListener('click', () => {
        window.location.href = 'notes.html';
    });
});