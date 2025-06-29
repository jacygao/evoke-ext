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

    // Function to remove all bot menus
    function removeAllBotMenus() {
        const botMenus = document.querySelectorAll('.bot-menu-bar');
        botMenus.forEach(menu => menu.remove());
    }

    // Function to add a message to the chat
    function addMessage(content, sender, hideMenu = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        if (sender === 'bot') {
            messageElement.innerHTML = parseMarkdown(content); // Render formatted content for bot messages
            if (!hideMenu) {
                // Add menu bar after the message is rendered
                setTimeout(() => addMenuBar(messageElement), 50); // Delay to ensure typing effect completes
            }
        } else {
            messageElement.textContent = content; // Use textContent for user messages
        }
        chatContainer.prepend(messageElement); // Add the message at the top of the reversed container
        return messageElement;
    }

    // Function to parse Markdown-like syntax
    function parseMarkdown(text) {
        // Replace **bold** with <strong> tags
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace lines starting with "-" with <ul><li>...</li></ul>
        formattedText = formattedText.replace(/^- (.*?)(\n|$)/gm, '<ul><li>$1</li></ul>');
        return formattedText;
    }

    // Function to add a menu bar below the bot message
    function addMenuBar(messageElement, data) {
        const menuBar = document.createElement('div');
        menuBar.className = 'bot-menu-bar';

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'menu-button copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>'; // Font Awesome copy icon
        copyButton.title = 'Copy';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(messageElement.textContent).then(() => {});
        });

        // Audio button
        const audioButton = document.createElement('button');
        audioButton.className = 'menu-button audio-button';
        audioButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Font Awesome audio icon
        audioButton.title = 'Play Audio';
        audioButton.addEventListener('click', async () => {
            try {
                const response = await fetchWithAuth('notes/read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: data.content, title: data.title })
                });
                if (!response.ok) throw new Error('Audio fetch failed');
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            } catch (err) {
                console.error(err);
            }
        });

        // Neuronize button
        const neuronizeButton = document.createElement('button');
        neuronizeButton.className = 'menu-button neuronize-button';
        neuronizeButton.innerHTML = '<img src="../../icon16.png" alt="Neuronize" />'; // Neuronize logo
        neuronizeButton.title = 'Neuronize';
        neuronizeButton.addEventListener('click', () => {
            console.log("bot: " + messageElement);
            const botContent = messageElement.textContent; // Get the newest bot content
            fetchWithAuth('notes', {
                method: 'POST',
                body: JSON.stringify({ content: botContent })
            })
                .then(response => {
                    removeMenuBar(messageElement); // Remove the menu bar after action
                    addMessage('I have added this note to your neurons!', 'bot', true);
                })
                .catch(error => {
                    console.error('Neuronize Error:', error);
                    alert('Failed to complete Neuronize action.');
                });
        });

        // Append buttons to the menu bar
        menuBar.appendChild(copyButton);
        menuBar.appendChild(audioButton);
        menuBar.appendChild(neuronizeButton);

        // Append the menu bar below the message
        messageElement.appendChild(menuBar);
    }

    // Function to remove the menu bar from a bot message
    function removeMenuBar(messageElement) {
        const menuBar = messageElement.querySelector('.bot-menu-bar');
        if (menuBar) {
            menuBar.remove(); // Remove the menu bar if it exists
        }
    }

    // Handle send button click
    sendButton.addEventListener('click', () => {
        const userInput = chatInput.value.trim();

        if (!userInput) {
            alert('Please enter a message.');
            return;
        }

        // Remove all existing bot menus
        removeAllBotMenus();

        // Add user message to the chat
        addMessage(userInput, 'user');

        // Show loading message
        const loadingElement = addMessage('preparing your note...', 'bot', true);

        // Clear the input field and reset rows
        chatInput.value = '';
        chatInput.style.overflowY = 'hidden'; // Reset scrollbar
        chatInput.rows = 1; // Reset rows to 1

        // Disable the button and input field during processing
        sendButton.disabled = true;
        chatInput.disabled = true;

        // Use fetchWithAuth for the API call
        fetchWithAuth('notes/complete', {
            method: 'POST',
            body: JSON.stringify({ content: userInput })
        })
            .then(data => {
                // Remove the loading message
                loadingElement.remove();

                // Extract the content field from the response
                const botResponse = data.content || 'Your note has been saved!';
                const botMessageElement = addMessage(botResponse, 'bot', true); // Add an empty message element
                addMenuBar(botMessageElement, data); // Add menu bar after message
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('Failed to process your message. Please try again.', 'bot', true); // Mark as error
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