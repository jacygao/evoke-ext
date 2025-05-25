import { fetchWithAuth } from './fetch.js';

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
    // Use fetchWithAuth for the API call
    fetchWithAuth('notes?code=', {
      method: 'POST',
      body: JSON.stringify({ content: info.selectionText })
    })
      .then(data => {
        console.log('API response:', data);
        // Optionally, store or use the response
      })
      .catch(error => {
        if (error.message.includes('Missing bearerToken or userId')) {
          // If credentials are missing, open the side panel
          chrome.sidePanel.setOptions({
            path: "src/popup/login.html", // Path to the login page
            enabled: true
          }).catch(err => console.error('Error opening side panel:', err));
        } else {
          console.error('API error:', error);
        }
      });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));