# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-07-13

### Added
- Cross-platform Electron desktop app (macOS `.dmg` for Intel + Apple Silicon,
  Windows `.exe`).
- Dialog to add multiple IP addresses / hosts to ping.
- Configurable interval (seconds) and pings-per-host.
- Continuous pinging that runs until the user clicks **Stop**.
- Live, color-coded log showing per-host reachability and average latency.
- Cross-platform ping handling (`-c` on macOS/Linux, `-n` on Windows) with
  latency and packet-loss parsing.
- GitHub Actions workflow that builds the `.dmg` and `.exe` and uploads them as
  artifacts.

[Unreleased]: https://github.com/YOUR_GITHUB_USERNAME/V-Pinger(VPN)/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YOUR_GITHUB_USERNAME/V-Pinger(VPN)/releases/tag/v1.0.0
