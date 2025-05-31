import { fetchWithAuth } from '../fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    // Function to dynamically adjust the rows of the textarea
    function adjustTextareaRows() {
        const lineCount = chatInput.value.split('\n').length; // Count the number of newlines
        if (lineCount > 10) {
            chatInput.style.overflowY = 'auto'; // Enable scrolling if line count exceeds 10
        } else {
            chatInput.style.overflowY = 'hidden'; // Hide scrollbar if line count is 10 or less
            chatInput.rows = lineCount; // Dynamically adjust rows
        }
    }

    // Attach the input event to dynamically adjust the rows
    chatInput.addEventListener('input', adjustTextareaRows);

    // Function to add a message to the chat
    function addMessage(content, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.textContent = content; // Use textContent to preserve newlines
        chatContainer.prepend(messageElement); // Add the message at the top of the reversed container
    }

    // Handle send button click
    sendButton.addEventListener('click', () => {
        const userInput = chatInput.value.trim();

        if (!userInput) {
            alert('Please enter a message.');
            return;
        }

        // Add user message to the chat
        addMessage(userInput, 'user');

        // Clear the input field and reset rows
        chatInput.value = '';
        chatInput.style.overflowY = 'hidden'; // Reset scrollbar
        chatInput.rows = 1; // Reset rows to 1

        // Disable the button and input field during processing
        sendButton.disabled = true;
        chatInput.disabled = true;

        // Use fetchWithAuth for the API call
        fetchWithAuth('notes', {
            method: 'POST',
            body: JSON.stringify({ content: userInput })
        })
            .then(data => {
                console.log('Success:', data);

                // Add bot response to the chat
                const botResponse = data.response || 'Your note has been saved!';
                addMessage(botResponse, 'bot');
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('Failed to process your message. Please try again.', 'bot');
            })
            .finally(() => {
                // Re-enable the input field and button
                sendButton.disabled = false;
                chatInput.disabled = false;
            });
    });

    // Allow pressing Enter to send the message
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
    });
});