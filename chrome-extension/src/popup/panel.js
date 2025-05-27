import { fetchWithAuth } from '../fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');
    const textBox = document.getElementById('textInput');

    submitButton.addEventListener('click', () => {
        const userInput = textBox.value;

        if (!userInput.trim()) {
            alert('Please enter some text before submitting.');
            return;
        }

        // Add loading class and disable the button and textarea
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        textBox.disabled = true;

        // Use fetchWithAuth for the API call
        fetchWithAuth('notes', {
            method: 'POST',
            body: JSON.stringify({ content: userInput })
        })
            .then(data => {
                console.log('Success:', data);

                // Clear the textarea after successful submission
                textBox.value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to submit the note. Please try again.');
            })
            .finally(() => {
                // Remove loading class and re-enable the button and textarea
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                textBox.disabled = false;
            });
    });
});