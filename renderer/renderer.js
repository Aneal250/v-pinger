// Renderer UI logic. Talks to the main process only through window.pinger.

const ipInput = document.getElementById('ipInput');
const addBtn = document.getElementById('addBtn');
const ipListEl = document.getElementById('ipList');
const intervalInput = document.getElementById('intervalInput');
const countInput = document.getElementById('countInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');
const logEl = document.getElementById('log');

// The list of IPs the user has added. Seeded with the original script's IPs.
let ips = ['10.8.12.28', '10.8.9.9'];

function renderList() {
  ipListEl.innerHTML = '';
  if (ips.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No IPs added yet.';
    ipListEl.appendChild(li);
    return;
  }
  ips.forEach((ip, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = ip;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.textContent = '✕';
    remove.title = 'Remove';
    remove.addEventListener('click', () => {
      ips.splice(index, 1);
      renderList();
    });
    li.appendChild(span);
    li.appendChild(remove);
    ipListEl.appendChild(li);
  });
}

function addIp() {
  const value = ipInput.value.trim();
  if (!value) return;
  if (ips.includes(value)) {
    ipInput.value = '';
    return;
  }
  ips.push(value);
  ipInput.value = '';
  ipInput.focus();
  renderList();
}

addBtn.addEventListener('click', addIp);
ipInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addIp();
});

function appendLog(entry) {
  const line = document.createElement('div');
  line.className = 'log-line';
  if (entry.success === true) line.classList.add('ok');
  else if (entry.success === false) line.classList.add('fail');
  else line.classList.add('info');
  line.textContent = `[${entry.time}] ${entry.message}`;
  logEl.appendChild(line);
  // Autoscroll to the newest line.
  logEl.scrollTop = logEl.scrollHeight;
}

function setRunning(isRunning) {
  startBtn.disabled = isRunning;
  stopBtn.disabled = !isRunning;
  addBtn.disabled = isRunning;
  ipInput.disabled = isRunning;
  intervalInput.disabled = isRunning;
  countInput.disabled = isRunning;
  statusEl.textContent = isRunning ? 'Running' : 'Idle';
  statusEl.className = 'status ' + (isRunning ? 'running' : 'idle');
}

startBtn.addEventListener('click', async () => {
  if (ips.length === 0) {
    appendLog({ time: now(), message: 'Add at least one IP before starting.', success: false });
    return;
  }
  const config = {
    ips,
    intervalSeconds: parseInt(intervalInput.value, 10) || 120,
    count: parseInt(countInput.value, 10) || 4
  };
  const res = await window.pinger.start(config);
  if (res && res.ok) {
    setRunning(true);
  } else {
    appendLog({ time: now(), message: 'Could not start: ' + (res && res.error), success: false });
  }
});

stopBtn.addEventListener('click', async () => {
  await window.pinger.stop();
  setRunning(false);
});

clearBtn.addEventListener('click', () => {
  logEl.innerHTML = '';
});

function now() {
  return new Date().toLocaleTimeString();
}

// Receive log lines pushed from the main process.
window.pinger.onLog(appendLog);

// Initial paint.
renderList();
setRunning(false);
