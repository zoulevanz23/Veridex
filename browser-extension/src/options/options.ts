// Options page JavaScript for Veridex
document.addEventListener('DOMContentLoaded', () => {
  const backendUrlInput = document.getElementById('backendUrl') as HTMLInputElement;
  const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
  const showIndicatorCheckbox = document.getElementById('showIndicator') as HTMLInputElement;
  const showSelectionTooltipCheckbox = document.getElementById('showSelectionTooltip') as HTMLInputElement;
  const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;

  const STORAGE_KEY = 'veridex-storage';

  // Load saved settings
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const data = result[STORAGE_KEY] || {};
    if (backendUrlInput) backendUrlInput.value = data.backendUrl || 'http://localhost:5000';
    if (apiKeyInput && data.apiKey) apiKeyInput.value = data.apiKey;
    if (showIndicatorCheckbox) showIndicatorCheckbox.checked = data.preferences?.showSafetyIndicator !== false;
    if (showSelectionTooltipCheckbox) showSelectionTooltipCheckbox.checked = data.preferences?.showSelectionTooltip !== false;
  });

  // Save settings
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