window.WF = window.WF || {};

WF.toast = (function () {
  const MAX_VISIBLE_TOASTS = 3; 
  const DEFAULT_TIMEOUT_MS = 3000;
  const FADE_OUT_MS = 300;

  const queue = [];
  let visibleCount = 0;
  let container = null;

  function ensureContainer() {
    if (container) return container;
    container = document.createElement("div");
    container.id = "wf-toast-container";
    container.className = "wf-toast-container";
    document.body.appendChild(container);
    return container;
  }

  function dismiss(toastEl) {
    if (!toastEl || toastEl.dataset.dismissing === "1") return;
    toastEl.dataset.dismissing = "1";
    toastEl.classList.remove("visible");
    setTimeout(() => {
      toastEl.remove();
      visibleCount--;
      processQueue();
    }, FADE_OUT_MS);
  }

  function renderToast(item) {
    const toastEl = document.createElement("div");
    toastEl.className = `wf-toast wf-toast-${item.type}`;
    toastEl.innerHTML = item.message;

    if (item.timeoutMs === 0) {
      toastEl.classList.add("wf-toast-clickable");
      toastEl.title = "Click to dismiss";
      toastEl.addEventListener("click", () => dismiss(toastEl));
    } else {
      setTimeout(() => dismiss(toastEl), item.timeoutMs);
    }

    ensureContainer().appendChild(toastEl);
    requestAnimationFrame(() => toastEl.classList.add("visible")); 
    visibleCount++;
  }

  function processQueue() {
    while (visibleCount < MAX_VISIBLE_TOASTS && queue.length > 0) {
      renderToast(queue.shift());
    }
  }

  function show(message, options = {}) {
    queue.push({
      message,
      timeoutMs: options.timeoutMs === undefined ? DEFAULT_TIMEOUT_MS : options.timeoutMs,
      type: options.type || "info"
    });
    processQueue();
  }

  return { show };
})();
