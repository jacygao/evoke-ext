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

let pendingNeuronizeContent = null;

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addToNotes" && info.selectionText) {
    pendingNeuronizeContent = info.selectionText;
    chrome.sidePanel.open({tabId: tab.id});
  }
});

// Listen for panel ready and send the content
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "panelReady" && pendingNeuronizeContent) {
    chrome.runtime.sendMessage({
      action: "sendNeuronizeMessage",
      content: pendingNeuronizeContent
    });
    pendingNeuronizeContent = null;
  }
});