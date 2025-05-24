document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');

    const fetchOptions = {
        headers: {
            'userId': "dd6d5e42-1516-4dfd-9e04-42047e5e4a0c"
        }
    };

    function fetchAndRenderNotes() {
        fetch('http://localhost:7174/api/notes?code=PLACEHOLDER_CODE', fetchOptions)
            .then(response => response.json())
            .then(data => {
            notesContainer.innerHTML = ''; // Clear previous notes
            if (data && Array.isArray(data)) {
                // Reverse the notes array to display in opposite order
                data.slice().reverse().forEach(note => {
                const noteCard = document.createElement('div');
                noteCard.className = 'note-card';
                const formattedContent = note.content.replace(/\n/g, '<br>');
                noteCard.innerHTML = `<p>${formattedContent}</p>`;
                notesContainer.appendChild(noteCard);
                });
                if (data.length === 0) {
                notesContainer.innerHTML = '<p>No notes found.</p>';
                }
            } else {
                notesContainer.innerHTML = '<p>No notes found.</p>';
            }
            })
            .catch(error => {
            console.error('Error fetching notes:', error);
            notesContainer.innerHTML = '<p>Failed to load notes.</p>';
            });
    }

    fetchAndRenderNotes(); // Initial fetch
    setInterval(fetchAndRenderNotes, 30000); // Poll every 5 seconds
});