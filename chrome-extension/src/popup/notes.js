import { fetchWithAuth } from '../fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');

    function fetchAndRenderNotes() {
        fetchWithAuth('notes', { method: 'GET' })
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
    setInterval(fetchAndRenderNotes, 30000); // Poll every 30 seconds
});