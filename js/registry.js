WF.generators = WF.generators || [];

WF.escapeQuotes = function (value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g,'');
};
