/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.theme = (function () {
  const CSS_VARS = Object.keys(WF.THEME_DEFAULTS);

  function sanitizeColors(rawColors) {
    const safe = {};
    if (!rawColors || typeof rawColors !== "object") return safe;
    CSS_VARS.forEach((cssVar) => {
      const value = rawColors[cssVar];
      if (typeof value === "string" && WF.HEX_COLOR.test(value)) safe[cssVar] = value;
    });
    return safe;
  }

  function apply(colors) {
    const safeColors = sanitizeColors(colors);
    CSS_VARS.forEach((cssVar) => document.documentElement.style.setProperty(cssVar, safeColors[cssVar] || WF.THEME_DEFAULTS[cssVar]));
  }

  function init() {
    apply(WF.options.load().themeColors || {});
  }

  function setColor(cssVar, hexValue) {
    if (!CSS_VARS.includes(cssVar) || !HEX_COLOR.test(hexValue)) return;
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
    const themeColors = sanitizeColors(WF.options.load().themeColors);
    return themeColors[cssVar] || WF.THEME_DEFAULTS[cssVar];
  }

  return { CSS_VARS, apply, init, setColor, reset, getColor, sanitizeColors };
})();
