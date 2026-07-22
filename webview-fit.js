/* Shared WebView compatibility fixes — loaded by every page, early, before
   layout happens. Covers three common gaps between "works great in Chrome"
   and "works great inside a native app's embedded WebView":

   1. Viewport height. Older Android System WebView builds and various
      hybrid-app shells don't support the `dvh` unit, and even `100vh` can
      be wrong once the WebView's own chrome/keyboard is factored in. We
      track the real visible height ourselves in a --vh custom property
      (see style.css: `calc(var(--vh, 1vh) * 100)`), kept in sync via
      visualViewport so it also self-corrects when the on-screen keyboard
      opens/closes.
   2. Clipboard. navigator.clipboard.writeText() is frequently unavailable
      or silently rejected in embedded WebViews (no permission UI, non-
      secure context, older engine). copyToClipboard() falls back to a
      hidden-textarea + execCommand('copy') trick that works almost
      everywhere.
   3. window.open(). Most WebView wrappers never implement the native
      hook needed to handle a new window (onCreateWindow on Android,
      WKUIDelegate on iOS), so `window.open(url, "_blank")` just does
      nothing and the tap appears dead. openOrNavigate() detects that and
      falls back to navigating the current WebView instead.
*/
(function () {
  function setViewportHeightVar() {
    var vv = window.visualViewport;
    var h = (vv && vv.height) || window.innerHeight;
    document.documentElement.style.setProperty("--vh", (h * 0.01) + "px");
  }
  setViewportHeightVar();
  window.addEventListener("resize", setViewportHeightVar);
  window.addEventListener("orientationchange", setViewportHeightVar);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setViewportHeightVar);
  }

  // Nudge a focused input back into view. Some WebView hosts (Android
  // "adjustPan"-style configuration especially) don't resize the page when
  // the on-screen keyboard opens, so a field near the bottom can end up
  // hidden behind it.
  document.addEventListener("focusin", function (e) {
    var el = e.target;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
      setTimeout(function () {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 250);
    }
  });

  window.copyToClipboard = async function (text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      throw new Error("clipboard API unavailable");
    } catch (e) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.left = "-1000px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch (e2) {
        return false;
      }
    }
  };

  window.openOrNavigate = function (url) {
    var win = null;
    try { win = window.open(url, "_blank"); } catch (e) { win = null; }
    if (!win) location.href = url;
  };
})();
