chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension installed.');
  chrome.contextMenus.create({
    id: "addToNotes",
    title: "Neuronize",
    contexts: ["selection"]
  });

  // Set the default side panel options
  chrome.sidePanel
    .setOptions({
      path: "src/popup/panel.html", // Path to the panel page
      enabled: true,
      openPanelOnActionClick: true
    })
    .catch((error) => console.error("Error setting side panel options:", error));
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  
  if (info.menuItemId === "addToNotes" && info.selectionText) {
    // Store the selected content in local storage
    chrome.storage.local.set({ neuronizeContent: info.selectionText }, () => {
      // Open the side panel
      chrome.sidePanel
        .open({tabId: tab.id})
        chrome.sidePanel.setOptions({
          tabId: sender.tab.id,
          path: 'src/popup/panel.html',
          enabled: true
        });
    });
  }
});