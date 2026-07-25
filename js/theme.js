WF.theme = (function () {
  const DEFAULTS = {
    "--bg": "#060000",
    "--panel": "#0f151b",
    "--panel-hover": "#161f27",
    "--border": "#23303a",
    "--text": "#e6ecf1",
    "--item-owned": "#1a140c",
    "--item-owned-hover": "#413110",
    "--accent-color": "#bea966",
  };

  const CSS_VARS = Object.keys(DEFAULTS);

  function apply(colors) {
    CSS_VARS.forEach((cssVar) => document.documentElement.style.setProperty(cssVar, colors[cssVar] || DEFAULTS[cssVar]));
  }

  function init() {
    apply(WF.options.load().themeColors || {});
  }

  function setColor(cssVar, hexValue) {
    const options = WF.options.load();
    const themeColors = { ...(options.themeColors || {}), [cssVar]: hexValue };
    WF.options.save({ ...options, themeColors });
    apply(themeColors);
  }

  function reset() {
    WF.options.save({ ...WF.options.load(), themeColors: {} });
    apply({});
  }

  function getColor(cssVar) {
    const themeColors = WF.options.load().themeColors || {};
    return themeColors[cssVar] || DEFAULTS[cssVar];
  }

  return { CSS_VARS, DEFAULTS, apply, init, setColor, reset, getColor };
})();
