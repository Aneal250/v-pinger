const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow = null;

// --- Ping engine state ---------------------------------------------------
let loopTimer = null; // handle for the setTimeout between cycles
let activeChildren = new Set(); // in-flight ping child processes
let running = false;

const isWindows = process.platform === 'win32';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 640,
    height: 620,
    minWidth: 480,
    minHeight: 480,
    title: 'V-Pinger(VPN)',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Send a log line to the renderer. `success` is true/false/null (null = info).
function sendLog(message, success = null, ip = null) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('ping-log', {
      time: new Date().toLocaleTimeString(),
      message,
      success,
      ip
    });
  }
}

// Ping a single IP once; resolves with { ip, success }.
function pingOnce(ip, count) {
  return new Promise((resolve) => {
    const args = isWindows ? ['-n', String(count), ip] : ['-c', String(count), ip];
    const child = spawn('ping', args);
    activeChildren.add(child);

    let output = '';
    child.stdout.on('data', (d) => { output += d.toString(); });
    child.stderr.on('data', (d) => { output += d.toString(); });

    child.on('error', (err) => {
      activeChildren.delete(child);
      sendLog(`Error pinging ${ip}: ${err.message}`, false, ip);
      resolve({ ip, success: false });
    });

    child.on('close', (code) => {
      activeChildren.delete(child);
      const success = code === 0;
      // Pull a useful summary line from ping output when available.
      const summary = extractSummary(output);
      sendLog(
        `${ip} — ${success ? 'reachable' : 'NO RESPONSE'}${summary ? ' (' + summary + ')' : ''}`,
        success,
        ip
      );
      resolve({ ip, success });
    });
  });
}

// Grab a human-friendly stat line from ping's output, cross-platform.
function extractSummary(output) {
  // Unix: "round-trip min/avg/max/stddev = 12.3/14.5/..."
  const rtt = output.match(/=\s*[\d.]+\/([\d.]+)\/[\d.]+/);
  if (rtt) return `avg ${rtt[1]} ms`;
  // Windows: "Average = 14ms"
  const win = output.match(/Average\s*=\s*(\d+)ms/i);
  if (win) return `avg ${win[1]} ms`;
  // Fallback: packet loss info if present ([\d.]+ so "100.0%" isn't misread as "0%").
  const loss = output.match(/([\d.]+)% packet loss/i) || output.match(/\(([\d.]+)% loss\)/i);
  if (loss) return `${Math.round(parseFloat(loss[1]))}% loss`;
  return '';
}

// Run one full cycle: ping every IP, then schedule the next cycle.
async function runCycle(config) {
  if (!running) return;

  sendLog('──────────────────────────────', null);
  sendLog(`Cycle start — pinging ${config.ips.length} host(s)`, null);

  for (const ip of config.ips) {
    if (!running) return;
    await pingOnce(ip, config.count);
  }

  if (!running) return;

  sendLog(`Waiting ${config.intervalSeconds}s until next cycle...`, null);
  loopTimer = setTimeout(() => runCycle(config), config.intervalSeconds * 1000);
}

function startPinging(config) {
  if (running) return { ok: false, error: 'Already running' };

  const ips = (config.ips || []).map((s) => String(s).trim()).filter(Boolean);
  if (ips.length === 0) return { ok: false, error: 'No IP addresses provided' };

  const intervalSeconds = Math.max(1, parseInt(config.intervalSeconds, 10) || 120);
  const count = Math.max(1, parseInt(config.count, 10) || 4);

  running = true;
  sendLog(`Started. Interval: ${intervalSeconds}s, pings per host: ${count}`, null);
  runCycle({ ips, intervalSeconds, count });
  return { ok: true };
}

function stopPinging() {
  if (!running) return { ok: false, error: 'Not running' };
  running = false;
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  // Kill any in-flight ping processes.
  for (const child of activeChildren) {
    try { child.kill(); } catch (_) { /* ignore */ }
  }
  activeChildren.clear();
  sendLog('Stopped by user.', null);
  return { ok: true };
}

// --- IPC wiring ----------------------------------------------------------
ipcMain.handle('start-pinging', (_event, config) => startPinging(config));
ipcMain.handle('stop-pinging', () => stopPinging());

// --- App lifecycle -------------------------------------------------------
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopPinging();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  stopPinging();
});
