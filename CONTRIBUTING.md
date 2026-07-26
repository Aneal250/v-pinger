# Contributing to V-Pinger(VPN)

Thanks for your interest in improving V-Pinger(VPN)! Contributions of all kinds are
welcome — bug reports, feature ideas, documentation, and code.

## Ways to contribute

- **Report a bug** — open an [issue](<https://github.com/aneal250/V-Pinger(VPN)/issues>)
  using the Bug report template.
- **Request a feature** — open an issue using the Feature request template.
- **Submit code** — fork the repo, make your change on a branch, and open a
  pull request.

## Development setup

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
git clone https://github.com/aneal250/V-Pinger(VPN).git
cd V-Pinger(VPN)
npm install
npm start        # launches the app in development
```

### Project layout

| Path                          | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `main.js`                     | Electron main process — the ping engine and IPC handlers  |
| `preload.js`                  | Secure bridge exposing a small API to the UI              |
| `renderer/`                   | The window UI (`index.html`, `renderer.js`, `styles.css`) |
| `build/`                      | App icons (`icon.icns`, `icon.ico`, `icon.png`)           |
| `.github/workflows/build.yml` | CI that builds the `.dmg` and `.exe`                      |

## Building installers

```bash
npm run dist:mac   # .dmg (macOS, must run on macOS)
npm run dist:win   # .exe (Windows, must run on Windows)
```

Cross-platform builds are produced automatically by CI on every push — see the
**Actions** tab.

## Pull request guidelines

1. **One focused change per PR.** Small, reviewable PRs get merged faster.
2. **Match the existing style.** The code uses plain modern JavaScript, 2-space
   indentation, and semicolons — see `.editorconfig`.
3. **Test your change locally** with `npm start` before opening the PR, and note
   in the PR what you verified (which OS, what you clicked).
4. **Update docs** (README/CHANGELOG) when your change affects behavior.
5. **Describe the change** clearly in the PR description using the template.

## Commit messages

Write clear, imperative-mood commit subjects, e.g. `Add IPv6 support to ping
engine`. Reference issues where relevant (`Fixes #12`).

## Code of Conduct

By participating, you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the
project's [MIT License](LICENSE).
