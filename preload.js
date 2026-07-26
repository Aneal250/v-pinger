const { contextBridge, ipcRenderer } = require('electron');

// Expose a small, safe API to the renderer. No direct Node access leaks.
contextBridge.exposeInMainWorld('pinger', {
  start: (config) => ipcRenderer.invoke('start-pinging', config),
  stop: () => ipcRenderer.invoke('stop-pinging'),
  onLog: (callback) => {
    const listener = (_event, entry) => callback(entry);
    ipcRenderer.on('ping-log', listener);
    // Return an unsubscribe function.
    return () => ipcRenderer.removeListener('ping-log', listener);
  }
});
