// Veridex Content Script (Manifest V3 - Pure JS for unpacked extension)
(function () {
  if (window.__veridexInjected) return;
  window.__veridexInjected = true;

  let floatingTrigger = null;
  let activeSelectedText = '';

  // Floating trigger button for text selection
  function ensureFloatingTrigger() {
    if (floatingTrigger && document.body.contains(floatingTrigger)) return floatingTrigger;
    
    floatingTrigger = document.createElement('button');
    floatingTrigger.id = 'veridex-floating-trigger';
    floatingTrigger.setAttribute('type', 'button');
    floatingTrigger.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <span>Check with Veridex</span>
    `;

    floatingTrigger.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    floatingTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToAnalyze = activeSelectedText.trim();
      hideFloatingTrigger();
      highlightPhrase();
      if (textToAnalyze) {
        showAnalyzing(textToAnalyze);
        chrome.runtime.sendMessage({ type: 'analyze-selection', text: textToAnalyze }, (res) => {
          if (chrome.runtime.lastError) {
            updateUI({
              verdict: 'Error',
              confidence: 0,
              signals: ['Service worker unavailable. Reload page.'],
              explanation: chrome.runtime.lastError.message
            });
          }
        });
      }
    });

    (document.body || document.documentElement).appendChild(floatingTrigger);
    return floatingTrigger;
  }

  function showFloatingTriggerAt(x, y, text) {
    const btn = ensureFloatingTrigger();
    activeSelectedText = text;
    btn.style.left = Math.max(10, x - 60) + 'px';
    btn.style.top = Math.max(10, y) + 'px';
    btn.classList.add('visible');
  }

  function hideFloatingTrigger() {
    if (floatingTrigger) {
      floatingTrigger.classList.remove('visible');
    }
  }

  // ---- Phrase highlight: wrap the remembered range in a lamp-tinted mark ----
  let activeRange = null;
  let highlightMark = null;

  function rememberSelection() {
    try {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        activeRange = null;
        return;
      }
      activeRange = selection.getRangeAt(0).cloneRange();
    } catch (e) {
      activeRange = null;
    }
  }

  function highlightPhrase() {
    highlightMark && highlightMark.remove();
    highlightMark = null;
    if (!activeRange) return;
    try {
      const mark = document.createElement('mark');
      mark.className = 'veridex-phrase-mark';
      mark.textContent = activeRange.toString();
      activeRange.deleteContents();
      activeRange.insertNode(mark);
      highlightMark = mark;
      return mark;
    } catch (e) {
      return null;
    }
  }

  function clearPhraseHighlight() {
    if (highlightMark && highlightMark.parentNode) {
      const parent = highlightMark.parentNode;
      const text = document.createTextNode(highlightMark.textContent || '');
      parent.replaceChild(text, highlightMark);
      highlightMark = null;
    }
    if (activeRange) {
      try { window.getSelection().removeAllRanges(); } catch (e) {}
      activeRange = null;
    }
  }

  // ---- Inline verdict chip pinned to the highlighted phrase ----
  function showInlineVerdict(data, anchorMark) {
    const existing = document.getElementById('veridex-inline-chip');
    existing && existing.remove();
    if (!anchorMark) anchorMark = highlightMark;
    if (!anchorMark || typeof anchorMark.getBoundingClientRect !== 'function') return;

    const v = (data.verdict || 'SAFE').toLowerCase();
    const chip = document.createElement('div');
    chip.id = 'veridex-inline-chip';
    chip.className = 'veridex-inline-chip ' + v;
    chip.innerHTML =
      '<span class="veridex-inline-chip-label">VERDICT</span>' +
      '<span class="veridex-inline-chip-verdict">' + String(data.verdict || 'SAFE').toUpperCase() + '</span>' +
      '<span class="veridex-inline-chip-conf">' + Math.round(data.confidence || 0) + '%</span>';
    document.body.appendChild(chip);

    const rect = anchorMark.getBoundingClientRect();
    const posX = Math.min(rect.left + window.scrollX, document.documentElement.scrollWidth - chip.offsetWidth - 12);
    chip.style.left = Math.max(8, posX) + 'px';
    chip.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    chip.classList.add('visible');

    chip.addEventListener('click', () => {
      const ui = getUI();
      if (ui) {
        ui.indicator.classList.remove('dismissed');
        ui.indicator.classList.add('visible');
      }
    });
  }

  // Handle selection on page plus keep a visible highlight while checking
  function handleSelectionChange() {
    setTimeout(() => {
      try {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          hideFloatingTrigger();
          return;
        }

        const selectedText = selection.toString().trim();
        if (selectedText.length >= 4 && selectedText.length <= 2500) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect && rect.width > 0 && rect.height > 0) {
            const posX = rect.left + window.scrollX + (rect.width / 2);
            const posY = rect.bottom + window.scrollY + 8;
            rememberSelection();
            showFloatingTriggerAt(posX, posY, selectedText);
            return;
          }
        }
        hideFloatingTrigger();
      } catch (e) {
        hideFloatingTrigger();
      }
    }, 10);
  }

  document.addEventListener('mouseup', handleSelectionChange);
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      handleSelectionChange();
    }
  });
  document.addEventListener('mousedown', (e) => {
    if (floatingTrigger && !floatingTrigger.contains(e.target)) {
      hideFloatingTrigger();
    }
  });

  // In-Page Card UI Injection
  function ensureUI() {
    if (document.getElementById('veridex-safety-indicator')) return true;
    if (!document.body) return false;
    try {
      const indicator = document.createElement('div');
      indicator.id = 'veridex-safety-indicator';
      indicator.className = 'veridex-safety-indicator';
      indicator.innerHTML = `
        <div class="veridex-card-header">
          <div class="veridex-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <span>VERIDEX EXAMINER</span>
          </div>
          <button class="veridex-close-btn" title="Close Card">✕</button>
        </div>
        <div class="veridex-stamp-banner">
          <span class="veridex-stamp safe">READY</span>
          <span class="veridex-confidence">100%</span>
        </div>
        <div class="veridex-snippet">Highlight text or right-click to analyze</div>
        <div class="veridex-explanation">Veridex checks claims, links, and content for deception.</div>
        <div class="veridex-signals-list"></div>
        <div class="veridex-action-footer">
          <a href="http://localhost:3000" target="_blank" class="veridex-app-link">Open in Veridex App →</a>
        </div>
      `;
      document.body.appendChild(indicator);

      const closeBtn = indicator.querySelector('.veridex-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          indicator.classList.remove('visible');
          indicator.classList.add('dismissed');
          clearPhraseHighlight();
        });
      }
      return true;
    } catch (e) {
      console.warn('[Veridex Content] UI init failed:', e);
      return false;
    }
  }

  if (!ensureUI()) {
    document.addEventListener('DOMContentLoaded', ensureUI, { once: true });
  }

  function getUI() {
    if (!ensureUI()) return null;
    const indicator = document.getElementById('veridex-safety-indicator');
    if (!indicator) return null;
    return {
      indicator,
      stampEl: indicator.querySelector('.veridex-stamp'),
      confidenceEl: indicator.querySelector('.veridex-confidence'),
      snippetEl: indicator.querySelector('.veridex-snippet'),
      explanationEl: indicator.querySelector('.veridex-explanation'),
      signalsListEl: indicator.querySelector('.veridex-signals-list')
    };
  }

  function showAnalyzing(text) {
    const ui = getUI();
    if (!ui) return;
    ui.indicator.className = 'veridex-safety-indicator visible';
    if (ui.stampEl) {
      ui.stampEl.className = 'veridex-stamp suspicious';
      ui.stampEl.textContent = 'ANALYZING…';
    }
    if (ui.confidenceEl) ui.confidenceEl.textContent = 'Scanning…';
    if (ui.snippetEl) ui.snippetEl.textContent = '"' + text.slice(0, 140) + (text.length > 140 ? '…' : '') + '"';
    if (ui.explanationEl) ui.explanationEl.textContent = 'Running Veridex forensic checks and risk model evaluation…';
    if (ui.signalsListEl) ui.signalsListEl.innerHTML = '<div class="veridex-signal-item"><div class="veridex-signal-dot"></div><div>Analyzing structural features…</div></div>';
    ui.indicator.classList.remove('dismissed');
    ui.indicator.classList.add('visible');
  }

  function updateUI(data) {
    const ui = getUI();
    if (!ui) return;

    const v = (data.verdict || 'SAFE').toLowerCase();
    ui.indicator.className = 'veridex-safety-indicator visible ' + v;

    if (ui.stampEl) {
      ui.stampEl.className = 'veridex-stamp ' + v;
      ui.stampEl.textContent = 'VERDICT: ' + (data.verdict || 'SAFE').toUpperCase();
    }

    if (ui.confidenceEl) {
      ui.confidenceEl.textContent = 'Confidence: ' + (data.confidence || 0) + '%';
    }

    if (data.query && ui.snippetEl) {
      ui.snippetEl.textContent = '"' + data.query.slice(0, 140) + (data.query.length > 140 ? '…' : '') + '"';
    }

    if (ui.explanationEl) {
      ui.explanationEl.textContent = data.explanation || 'Verification check completed.';
    }

    if (ui.signalsListEl) {
      const signals = data.signals || [];
      ui.signalsListEl.innerHTML = signals.map(s => `
        <div class="veridex-signal-item">
          <div class="veridex-signal-dot"></div>
          <div>${String(s).replace(/</g, '&lt;')}</div>
        </div>
      `).join('');
    }

    ui.indicator.classList.remove('dismissed');
    ui.indicator.classList.add('visible');
    showInlineVerdict(data, null);
  }

  // Handle messages from extension background
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'veridex-ping') {
      sendResponse({ ok: true });
      return true;
    }

    if (message.type === 'verify-link') {
      let text = (message.text || message.url || '').trim();
      rememberSelection();
      if (!text) {
        try { text = window.getSelection().toString().trim(); } catch {}
      }
      if (text) {
        highlightPhrase();
        showAnalyzing(text);
        chrome.runtime.sendMessage({ type: 'analyze-selection', text, contentType: message.contentType }, (res) => {
          if (chrome.runtime.lastError) {
            updateUI({
              verdict: 'Error',
              confidence: 0,
              signals: ['Background connection failed.'],
              explanation: 'Please start backend server on port 5000.'
            });
          }
        });
      }
      sendResponse({ ok: true });
      return true;
    }

    if (message.type === 'update-safety-indicator') {
      updateUI({
        verdict: message.verdict,
        confidence: message.confidence,
        signals: message.signals || [],
        explanation: message.explanation,
        query: message.query
      });
      sendResponse({ ok: true });
      return true;
    }

    if (message.type === 'toggle-indicator') {
      const ui = getUI();
      if (ui) {
        if (ui.indicator.classList.contains('visible') && !ui.indicator.classList.contains('dismissed')) {
          ui.indicator.classList.add('dismissed');
        } else {
          ui.indicator.classList.remove('dismissed');
          ui.indicator.classList.add('visible');
        }
      }
      sendResponse({ ok: true });
      return true;
    }

    return false;
  });
})();
