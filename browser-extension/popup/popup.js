const HISTORY_KEY = 'veridex-history';
const MAX_HISTORY = 15;
const DISPLAY_HISTORY = 5;

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addToHistory(result, text) {
  const history = loadHistory();
  const entry = {
    id: Date.now(),
    text: text.slice(0, 80),
    verdict: result.verdict || 'SAFE',
    confidence: result.confidence || 0,
    timestamp: new Date().toISOString()
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history.pop();
  }
  saveHistory(history);
  renderHistory();
}

function renderHistory() {
  const history = loadHistory();
  const historyList = document.getElementById('historyList');
  const historyCount = document.getElementById('historyCount');
  
  if (historyCount) historyCount.textContent = history.length;
  if (!historyList) return;
  
  if (history.length === 0) {
    historyList.innerHTML = '<div class="empty-history">No recent checks</div>';
    return;
  }
  
  const displayHistory = history.slice(0, DISPLAY_HISTORY);
  historyList.innerHTML = displayHistory.map(item => {
    const verdictClass = (item.verdict || 'safe').toLowerCase();
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="history-item" data-id="${item.id}">
        <div class="history-item-title">${item.text}</div>
        <div class="history-item-meta">
          <span class="history-verdict ${verdictClass}">${item.verdict}</span>
          <span>${time}</span>
        </div>
      </div>
    `;
  }).join('');
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

// Server Health Indicator
function checkHealth() {
  const statusBadge = document.getElementById('serverStatus');
  const statusText = document.getElementById('statusText');
  
  fetch('http://localhost:5000/health', { signal: AbortSignal.timeout(3000) })
    .then(res => {
      if (res.ok) {
        if (statusBadge) statusBadge.classList.remove('offline');
        if (statusText) statusText.textContent = 'Server Online';
      } else {
        if (statusBadge) statusBadge.classList.add('offline');
        if (statusText) statusText.textContent = 'Degraded';
      }
    })
    .catch(() => {
      if (statusBadge) statusBadge.classList.add('offline');
      if (statusText) statusText.textContent = 'Local Engine';
    });
}

function displayResult(result, inputQuery) {
  const resultCard = document.getElementById('resultCard');
  const resultBanner = document.getElementById('resultBanner');
  const verdictEl = document.getElementById('resultVerdict');
  const confidenceEl = document.getElementById('resultConfidence');
  const snippetEl = document.getElementById('resultSnippet');
  const explanationEl = document.getElementById('resultExplanation');
  const signalsEl = document.getElementById('resultSignals');

  if (!resultCard || !result) return;

  const verdict = (result.verdict || 'SAFE').toUpperCase();
  const verdictClass = verdict.toLowerCase();

  verdictEl.textContent = verdict;
  confidenceEl.textContent = `${result.confidence || 0}% Confidence`;
  snippetEl.textContent = `"${inputQuery.slice(0, 100)}${inputQuery.length > 100 ? '…' : ''}"`;
  explanationEl.textContent = result.explanation || 'Forensic verification completed.';

  if (result.signals && result.signals.length > 0) {
    signalsEl.innerHTML = result.signals.map(s => `<span>${s}</span>`).join('');
  } else {
    signalsEl.innerHTML = '';
  }

  resultBanner.className = `result-banner ${verdictClass}`;
  resultCard.className = 'result-card show';

  addToHistory(result, inputQuery);
}

function runAnalysis(content, type = 'message', triggerBtn) {
  if (!content) return;
  const originalText = triggerBtn.innerHTML;
  triggerBtn.disabled = true;
  triggerBtn.innerHTML = '<span class="spinner"></span> <span>Analyzing…</span>';

  fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, type })
  })
  .then(res => res.json().then(d => ({ ok: res.ok, status: res.status, data: d })))
  .then(({ ok, status, data }) => {
    if (ok || status !== 404) return { ok, data };
    return fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type })
    }).then(r => r.json().then(d => ({ ok: r.ok, data: d })));
  })
  .then(({ ok, data }) => {
    if (data && data.result) {
      displayResult(data.result, content);
    } else {
      alert((data && data.error) || 'Analysis request failed.');
    }
  })
  .catch(err => {
    console.error(err);
    alert('Could not connect to Veridex backend. Please start backend on port 5000 (npm run dev).');
  })
  .finally(() => {
    triggerBtn.disabled = false;
    triggerBtn.innerHTML = originalText;
  });
}

// Event Bindings
document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
  checkHealth();

  const clearHistoryBtn = document.getElementById('clearHistory');
  if (clearHistoryBtn) clearHistoryBtn.onclick = clearHistory;

  const historyBtn = document.getElementById('historyBtn');
  if (historyBtn) {
    historyBtn.onclick = () => {
      const historySection = document.getElementById('historySection');
      if (historySection) historySection.classList.toggle('show');
    };
  }

  const verifyBtn = document.getElementById('verifyBtn');
  if (verifyBtn) {
    verifyBtn.onclick = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.url) {
          runAnalysis(tabs[0].url, 'link', verifyBtn);
        }
      });
    };
  }

  const checkCustomBtn = document.getElementById('checkCustomBtn');
  const customInput = document.getElementById('customInput');
  if (checkCustomBtn && customInput) {
    checkCustomBtn.onclick = () => {
      const text = customInput.value.trim();
      if (text) {
        const isUrl = /https?:\/\/[^\s]+/i.test(text);
        runAnalysis(text, isUrl ? 'link' : 'message', checkCustomBtn);
      }
    };
  }

  const toggleBtn = document.getElementById('toggleBtn');
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.id) chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle-indicator' });
      });
    };
  }

  const optionsBtn = document.getElementById('optionsBtn');
  if (optionsBtn) {
    optionsBtn.onclick = () => chrome.runtime.openOptionsPage();
  }

  const manifest = chrome.runtime.getManifest();
  const versionEl = document.getElementById('version');
  if (versionEl && manifest) {
    versionEl.textContent = `v${manifest.version}`;
  }
});
