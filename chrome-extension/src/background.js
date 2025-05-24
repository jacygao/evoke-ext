chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension installed.');
  chrome.contextMenus.create({
    id: "addToNotes",
    title: "Neuralize",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addToNotes" && info.selectionText) {
    // Send selected text to your API endpoint
    fetch('http://localhost:7174/api/notes?code=', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userId': "dd6d5e42-1516-4dfd-9e04-42047e5e4a0c"
      },
      body: JSON.stringify({ content: info.selectionText })
    })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data);
      // Optionally, store or use the response
    })
    .catch(error => {
      console.error('API error:', error);
    });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));