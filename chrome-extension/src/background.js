// This file contains the background script for the Chrome extension. 
// It manages events and can handle API calls or other background tasks.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Chrome extension installed.');
});

// You can add more event listeners or functions to handle background tasks here.
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "addToNotes",
      title: "Add to My Notes",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToNotes" && info.selectionText) {
      chrome.storage.local.set({ selectedText: info.selectionText }, () => {
        chrome.action.openPopup();
      });
    }
  });