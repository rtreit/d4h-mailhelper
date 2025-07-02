// background.js

// Function to inject the content script
function runContentScript(tab) {
  console.log("D4H Mail Helper: Browser action clicked, attempting to inject script.");
  const supported = /\/team\/(?:exercises|incidents|events)/.test(tab.url || "");
  if (supported) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ["content.js"],
    });
  } else {
    console.log("D4H Mail Helper: Not a supported page.");
  }
}

// Listen for a click on the browser action icon
chrome.action.onClicked.addListener((tab) => {
  runContentScript(tab);
});

// Optional: Listen for tab updates to run automatically if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Inject when the page has finished loading
  if (changeInfo.status === 'complete') {
    runContentScript(tab);
  }
});
