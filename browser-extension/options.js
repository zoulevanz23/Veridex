// Options page JavaScript for Veridex (plain JS, runs unpacked without a bundler)
document.addEventListener('DOMContentLoaded', () => {
  const backendUrlInput = document.getElementById('backendUrl');
  const apiKeyInput = document.getElementById('apiKey');
  const showIndicatorCheckbox = document.getElementById('showIndicator');
  const showSelectionTooltipCheckbox = document.getElementById('showSelectionTooltip');
  const saveBtn = document.getElementById('saveBtn');

  const STORAGE_KEY = 'veridex-storage';

  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const data = result[STORAGE_KEY] || {};
    if (backendUrlInput) backendUrlInput.value = data.backendUrl || 'http://localhost:5000';
    if (apiKeyInput && data.apiKey) apiKeyInput.value = data.apiKey;
    if (showIndicatorCheckbox) showIndicatorCheckbox.checked = data.preferences?.showSafetyIndicator !== false;
    if (showSelectionTooltipCheckbox) showSelectionTooltipCheckbox.checked = data.preferences?.showSelectionTooltip !== false;
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const backendUrl = backendUrlInput ? backendUrlInput.value.trim() : 'http://localhost:5000';
      const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';

      const updated = {
        backendUrl: backendUrl || 'http://localhost:5000',
        apiKey,
        preferences: {
          showSafetyIndicator: showIndicatorCheckbox ? showIndicatorCheckbox.checked : true,
          showSelectionTooltip: showSelectionTooltipCheckbox ? showSelectionTooltipCheckbox.checked : true,
          autoAnalyzeLinks: false,
        }
      };

      chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
        alert('Veridex settings saved successfully!');
      });
    });
  }
});