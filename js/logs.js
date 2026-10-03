/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.logs = (function () {
  const STORAGE_KEY = "wf_checklist_logs"; 
  const MAX_ENTRIES = 1000; 

  InitLogs();

  function _readLogs() { 
    try { 
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)); 
      return Array.isArray(parsed) ? parsed : []; 
    } catch { 
      return []; 
    } 
  }

  function _writeLogs(logs) { 
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)); 
    } catch (error) { 
      console.error("Log write failed:", error); 
    } 
  }

  function InitLogs() { 
    if (localStorage.getItem(STORAGE_KEY) === null) _writeLogs([]); 
  }

  function AddLog( message) { 
    const logs = _readLogs(); 
    logs.unshift({ Date: Date.now(), Message: message }); 
    _writeLogs(logs.slice(0, MAX_ENTRIES)); 
  }

  function GetLogs() { 
    return _readLogs(); 
  }

  return { AddLog, GetLogs };
})();