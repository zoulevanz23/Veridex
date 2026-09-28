// Veridex Background Service Worker (Manifest V3 - Pure JS)

const ANALYZE_ENDPOINTS = [
  'http://localhost:5000/api/analyze',
  'http://localhost:5000/analyze'
];

function getBackendBase() {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(['veridex-storage', 'veridex-backend'], (result) => {
        const custom =
          result['veridex-backend'] ||
          result['veridex-storage']?.backendUrl ||
          null;
        if (custom && typeof custom === 'string' && custom.trim()) {
          resolve(custom.trim().replace(/\/$/, ''));
        } else {
          resolve('http://localhost:5000');
        }
      });
    } catch {
      resolve('http://localhost:5000');
    }
  });
}

async function getAnalyzeEndpoints() {
  const base = await getBackendBase();
  if (base === 'http://localhost:5000') return ANALYZE_ENDPOINTS;
  return [`${base}/api/analyze`, `${base}/analyze`];
}

function setupContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'verify-selection',
      title: 'Check selection with Veridex',
      contexts: ['selection']
    });
    chrome.contextMenus.create({
      id: 'verify-link',
      title: 'Verify link with Veridex',
      contexts: ['link']
    });
    chrome.contextMenus.create({
      id: 'verify-image',
      title: 'Check image with Veridex',
      contexts: ['image']
    });
    chrome.contextMenus.create({
      id: 'verify-page',
      title: 'Verify page with Veridex',
      contexts: ['page']
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
  setupContextMenus();
});

async function ensureContentScript(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'veridex-ping' });
    return true;
  } catch {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/ui-injector.js']
      });
      try {
        await chrome.scripting.insertCSS({
          target: { tabId },
          files: ['content/ui-injector.css']
        });
      } catch {}
      return true;
    } catch (err) {
      console.warn('[Veridex] Cannot inject content script:', err?.message || err);
      return false;
    }
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || tab.id == null) return;

  let text = '';
  let contentType = 'message';

  if (info.menuItemId === 'verify-selection') {
    text = (info.selectionText || '').trim();
    contentType = 'message';
  } else if (info.menuItemId === 'verify-link') {
    text = (info.linkUrl || info.selectionText || info.pageUrl || '').trim();
    contentType = 'link';
  } else if (info.menuItemId === 'verify-image') {
    const src = (info.srcUrl || '').trim();
    if (src.startsWith('data:image/')) {
      text = src;
    } else if (src) {
      // Fetch the image content so the backend can actually inspect pixels,
      // not just read the URL string.
      try {
        const fetched = await fetch(src);
        if (fetched.ok) {
          const blob = await fetched.blob();
          text = await blobToBase64(blob);
        } else {
          text = src;
        }
      } catch {
        text = src;
      }
    } else {
      text = (info.linkUrl || info.pageUrl || '').trim();
    }
    contentType = 'image';
  } else if (info.menuItemId === 'verify-page') {
    text = (info.pageUrl || '').trim();
    contentType = 'link';
  }

  if (!text) return;

  const ok = await ensureContentScript(tab.id);
  if (!ok) {
    notify('Veridex', 'Cannot analyze this page (restricted page or no content script). Try reloading the page.');
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'verify-link', text, contentType, url: text });
  } catch (err) {
    console.error('[Veridex] Failed to send verify-link:', err);
    notify('Veridex', 'Could not reach the page. Please reload the tab and try again.');
  }
});

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function notify(title, message) {
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title,
      message: String(message || '').slice(0, 180)
    }, () => {
      if (chrome.runtime.lastError) {
        console.warn('[Veridex] notification failed:', chrome.runtime.lastError.message);
      }
    });
  } catch (err) {
    console.warn('[Veridex] notification error:', err?.message || err);
  }
}

async function postAnalyze(text, contentType) {
  const endpoints = await getAnalyzeEndpoints();
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, type: contentType || 'message' })
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.result) return { ok: true, data };
      if (r.status === 404) {
        lastError = new Error(`404 from ${endpoint}`);
        continue;
      }
      return { ok: false, data, status: r.status };
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('Analysis request failed');
}

function guessContentType(text) {
  if (text.startsWith('data:image/') || /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(text)) return 'image';
  if (/https?:\/\/[^\s]+/i.test(text) && text.trim().length < 2000) return 'link';
  return 'message';
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'analyze-selection') {
    const text = (message.text || '').trim();
    if (!text) {
      sendResponse({ ok: false, error: 'Empty selection' });
      return false;
    }
    const tabId = sender.tab?.id;
    if (tabId != null) {
      chrome.action.setBadgeText({ tabId, text: '...' });
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#E4A61B' });
    }

    const typeToUse = message.contentType || guessContentType(text);

    postAnalyze(text, typeToUse)
      .then(({ ok, data }) => {
        if (ok && data.result) {
          notify(`Veridex: ${data.result.verdict}`, data.result.explanation || '');
          if (tabId != null) {
            chrome.tabs.sendMessage(tabId, {
              type: 'update-safety-indicator',
              verdict: data.result.verdict,
              confidence: data.result.confidence,
              signals: data.result.signals || [],
              explanation: data.result.explanation || '',
              query: text.slice(0, 100)
            }).catch(err => {
              console.error('[Veridex] Failed to send update message:', err);
            });
          }
          sendResponse({ ok: true, result: data.result });
        } else {
          const errMsg = (data && data.error) || 'Analysis failed';
          notify('Veridex', errMsg);
          if (tabId != null) {
            chrome.tabs.sendMessage(tabId, {
              type: 'update-safety-indicator',
              verdict: 'Error',
              confidence: 0,
              signals: [errMsg]
            }).catch(() => {});
          }
          sendResponse({ ok: false, error: errMsg });
        }
      })
      .catch(err => {
        console.error('[Veridex] Analysis error:', err);
        const errMsg = 'Cannot reach Veridex server on port 5000. Start the backend with npm run dev.';
        notify('Veridex', errMsg);
        if (tabId != null) {
          chrome.tabs.sendMessage(tabId, {
            type: 'update-safety-indicator',
            verdict: 'Error',
            confidence: 0,
            signals: [errMsg]
          }).catch(() => {});
        }
        sendResponse({ ok: false, error: String(err?.message || err) });
      })
      .finally(() => {
        if (tabId != null) chrome.action.setBadgeText({ tabId, text: '' });
      });
    return true;
  }

  if (message.type === 'toggle-indicator') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle-indicator' }).catch(() => {});
    });
    sendResponse({ success: true });
    return true;
  }

  return false;
});
