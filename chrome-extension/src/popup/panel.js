document.addEventListener('DOMContentLoaded', () => {
    // Check if a username is stored in chrome.storage.local
    chrome.storage.local.get('username', (result) => {
        const username = result.username;
        if (!username) {
            // Redirect to login.html if no username exists
            window.location.href = 'login.html';
            return;
        }

        // Existing functionality
        const submitButton = document.getElementById('submitButton');
        const textBox = document.getElementById('textInput');

        submitButton.addEventListener('click', () => {
            const userInput = textBox.value;
            fetch('http://localhost:7174/api/notes?code=PLACEHOLDER_CODE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': "dd6d5e42-1516-4dfd-9e04-42047e5e4a0c"
                },
                body: JSON.stringify({ content: userInput })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    });

    // Navigate to notes page
    document.getElementById('viewNotesButton').addEventListener('click', () => {
        window.location.href = 'notes.html';
    });
});