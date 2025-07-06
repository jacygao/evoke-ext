chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension installed.');
  chrome.contextMenus.create({
    id: "addToNotes",
    title: "Neuronize",
    contexts: ["selection"]
  });

  // Set the default side panel options (removed invalid property)
  chrome.sidePanel
    .setOptions({
      path: "src/popup/panel.html", // Path to the panel page
      enabled: true
    })
    .catch((error) => console.error("Error setting side panel options:", error));
});

const panelOpenTabs = new Set();
let pendingNeuronizeContent = null;
let currentTabId = null;

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addToNotes" && info.selectionText) {
    currentTabId = tab.id;
    console.log("Neuronize context menu clicked with selection:", info.selectionText);
    if (panelOpenTabs.has(tab.id)) {
      // Panel is already open, send message directly to runtime
      chrome.runtime.sendMessage({
        action: "sendNeuronizeMessage",
        content: info.selectionText
      });
    } else {
      // Panel not open, open it and wait for panelReady
      pendingNeuronizeContent = info.selectionText;
      chrome.sidePanel.open({tabId: tab.id});
    }
  }
});

// Listen for panel ready and send the content
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "panelReady") {
    // Mark the current tab as having the panel open
    if (currentTabId) {
      panelOpenTabs.add(currentTabId);
    }
    
    if (pendingNeuronizeContent) {
      chrome.runtime.sendMessage({
        action: "sendNeuronizeMessage",
        content: pendingNeuronizeContent
      });
      pendingNeuronizeContent = null;
    }
  }
});

// Clean up panelOpenTabs when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  panelOpenTabs.delete(tabId);
});