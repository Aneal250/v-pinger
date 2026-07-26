<div align="center">

<img src="build/icon.png" alt="V-Pinger(VPN)" width="120" />

# V-Pinger(VPN)

**A tiny cross-platform desktop app that pings IPs on a set interval to keep a VPN connection alive.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build desktop apps](https://github.com/YOUR_GITHUB_USERNAME/V-Pinger(VPN)/actions/workflows/build.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/V-Pinger(VPN)/actions/workflows/build.yml)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-blue)](#download)
[![Built with Electron](https://img.shields.io/badge/built%20with-Electron-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)

</div>

---

Double-click the app, add your IPs, choose an interval, and click **Start**.
V-Pinger(VPN) keeps a low volume of traffic flowing so an idle VPN tunnel doesn't get
dropped. A live log shows the result of every ping.

This is the GUI version of the original [`ping-check.sh`](ping-check.sh) script.

## Table of contents

- [Features](#features)
- [Screenshot](#screenshot)
- [Download](#download)
- [Run from source](#run-from-source)
- [Build installers](#build-installers)
- [Build both via GitHub Actions](#build-both-via-github-actions-recommended)
- [Notes on unsigned builds](#notes-on-unsigned-builds)
- [Contributing](#contributing)
- [License](#license)

## Features

- Add **multiple IP addresses / hosts** to ping.
- Set the **interval** (seconds) between cycles and **pings per host**.
- **Runs until you click Stop.**
- **Live log** with per-host reachability and average latency.
- Cross-platform: builds as **`.dmg`** (macOS, Intel + Apple Silicon) and
  **`.exe`** (Windows).

## Screenshot

<!-- Add a screenshot of the app window here, e.g.:
<div align="center"><img src="docs/screenshot.png" alt="V-Pinger(VPN) window" width="520" /></div>
-->
_Coming soon — run `npm start` and grab a screenshot to add here._

## Download

Grab the latest installer from the [**Releases**](https://github.com/YOUR_GITHUB_USERNAME/V-Pinger(VPN)/releases)
page, or download the build artifacts from the most recent
[**Actions**](https://github.com/YOUR_GITHUB_USERNAME/V-Pinger(VPN)/actions) run:

- **macOS:** `V-Pinger(VPN)-<version>.dmg` (works on Intel and Apple Silicon)
- **Windows:** `V-Pinger(VPN) Setup <version>.exe`

## Run from source

Requires [Node.js](https://nodejs.org/) 18+.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/V-Pinger(VPN).git
cd V-Pinger(VPN)
npm install
npm start
```

## Build installers

```bash
# macOS (.dmg for Intel + Apple Silicon) — must run on a Mac
npm run dist:mac

# Windows (.exe) — must run on Windows
npm run dist:win
```

Output lands in `dist/`.

> You generally **cannot** build a Windows `.exe` from macOS. Use the CI
> pipeline below (or a real Windows machine) for the `.exe`.

## Build both via GitHub Actions (recommended)

The workflow in [`.github/workflows/build.yml`](.github/workflows/build.yml)
builds the `.dmg` on a macOS runner and the `.exe` on a Windows runner.

1. Push this project to a GitHub repository (make sure `package-lock.json` is
   committed — CI uses `npm ci`).
2. Open the **Actions** tab → the **Build desktop apps** run.
3. Download the `mac-installers` and `win-installers` **artifacts** from the
   completed run.

## Notes on unsigned builds

These builds are **not code-signed**, so on first launch:

- **macOS:** right-click the app → **Open** → **Open** to bypass Gatekeeper.
- **Windows:** on the SmartScreen prompt, click **More info** → **Run anyway**.

Code signing (an Apple Developer certificate and a Windows code-signing
certificate) can be added later to remove these warnings.

## Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md)
and our [Code of Conduct](CODE_OF_CONDUCT.md) before getting started. To report a
security issue, see [SECURITY.md](SECURITY.md).

## License

Released under the [MIT License](LICENSE). © 2026 Nnaemeka Anaele.
