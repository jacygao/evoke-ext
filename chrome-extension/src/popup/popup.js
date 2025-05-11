document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submit-button');
    const textBox = document.getElementById('text-input');

    submitButton.addEventListener('click', function() {
        const userInput = textBox.value;

        fetch('https://your-api-endpoint.com/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: userInput })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Optionally, handle the response data here
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const textBox = document.getElementById("textBox");
  
    // Load selected text from storage
    chrome.storage.local.get("selectedText", (data) => {
      if (data.selectedText) {
        textBox.value = data.selectedText;
        chrome.storage.local.remove("selectedText"); // Clear the stored text
      }
    });
  
    // Handle form submission
    document.getElementById("submitButton").addEventListener("click", () => {
      const text = textBox.value;
      // Add your POST request logic here
      console.log("Submitted text:", text);
    });
  });