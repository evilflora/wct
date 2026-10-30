<div align="center">

# Warframe Completion Tracker (WCT)

**Track everything you own in Warframe, and everything you still need to unlock.**

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-evilflora.github.io%2Fwct-1e2327?style=for-the-badge)](https://evilflora.github.io/wct/)
[![License: PolyForm Noncommercial](https://img.shields.io/badge/license-PolyForm_Noncommercial_1.0.0-blue?style=for-the-badge)](LICENSE)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase_Firestore-FFCA28?logo=firebase&logoColor=black)
![GitHub last commit](https://img.shields.io/github/last-commit/evilflora/wct)
![GitHub stars](https://img.shields.io/github/stars/evilflora/wct?style=social)

</div>

---

## Overview

**WCT** is a lightweight, zero-install web app for **Warframe players** who want a clear picture of their collection: Warframes, weapons, companions, Archwings, mods, Arcanes, Honoria, and Mastery Rank progression.

- **No account, no install**: open the site and click items to mark them as owned.
- **Privacy-first**: your progress lives in your browser's local storage. Nothing is sent anywhere unless you opt in to SYNC.
- **Works on desktop and mobile**, with a customizable theme.
- **Works offline / locally**: download the repo and open `index.html` or use the live version.

> WCT tracks what is **freely obtainable through login or gameplay**. It does **not** include Twitch rewards, redeem codes, console exclusives, Platinum-only market items, or rewards from the Warframe website (promo codes, event pages, etc.). Founder and Conclave (PVP) items can be enabled in the options.

---

## Quick Start

| Method | Steps |
|---|---|
| **Online** | Open **https://evilflora.github.io/wct/** |
| **Local** | `git clone https://github.com/evilflora/wct.git`, then open `index.html` in any modern browser |

> ⚠️ SYNC requires an internet connection and is **disabled when the app is opened from `file://`** (it needs an HTTP server).

**First time and already played a bit?** Use **OPTIONS → Import from Warframe** to merge data from your public profile (see [Import from Warframe](#import-from-warframe-pc-only)).

---

## Features

### Tracking

- **Warframes**
- **Primary, Secondary & Melee weapons**
- **Companions & Archwings**
- **Mods & Arcanes**
- **Honoria**
- **Mastery Rank tracking**
- **... and much more**

### Navigation & Usability

- **Filters & search**: filter by subtype and category-specific criteria (weapon slot, node category, etc.).
- **Hide checked**: collapse completed items to focus on what's left. Global search and category search are available.
- **Bulk selection**: mass-selection tools for quicker updates.
- **In-category help (`?`)**: explains where to find that category's content in-game (hover on desktop, tap on mobile).
- **Persistent session**: remembers your last tab and filters across refreshes.
- **Mobile-friendly**: responsive layout with a collapsible sidebar (large lists may load slower on mobile).
- **Welcome guide**: reopenable anytime from the NEWS panel.

### STATS

- **Mastery Breakdown**: same layout and order as the in-game screen, for quick comparison.
- **Progression**: completion summary per category.
- **Endo spent**: Endo spent tally (from owned mods at max rank).

### SYNC (optional, cross-device)

Powered by **Google Firebase** and a randomly generated 64-character secret key.

| Action | Description |
|---|---|
| **Create** | Generate a secret key (**keep it private**: anyone with it can modify your save). |
| **Sync** | Paste your key on another device to access your cloud save. |
| **Upload** | Replace the cloud data with your local save. |
| **Download** | Replace your local data with the cloud data. |
| **Disconnect** | Stop syncing and remove the key from your local save. |
| **Delete key and remove data** | Wipe the cloud data and remove the key locally. |

> Syncing data from a newer version to an older one locally strips items that don't exist yet.

### OPTIONS

- **Export / Import**: JSON backup and restore (import fully replaces current progress, so export first if unsure).
- **Save options in export** and optionally **include the SYNC key** in the export file.
- **Founder exclusive items**: toggle with a browsable item list.
- **Conclave (PVP) items**: toggle with a browsable item list.
- **Theme customization**: change the UI colors (Warframe lets you customize everything, so does WCT).
- **Logs / History**: view recent actions, notifications (errors, warnings, successes) and background information.
- **Danger zone**: guarded `DELETE DATA` option (multiple confirmations, auto-cancels).

### NEWS & Updates

- In-app changelog, project links, credits and privacy information.
- A one time **Toast notification** beside an **update icon** appears in the header when a new version is available.

### Import from Warframe (PC only)

Save time by merging data from your **public profile**. It's a multi-step process, fully guided in **OPTIONS → Import from Warframe**:

1. Retrieve your `ACCOUNTID` from your local Warframe `EE.log`.
2. Open your public profile and save the page content as a `.json` file.
3. Select the file and start the merge.

> PC only, and it may stop working at any time. **Do not guess account IDs**: repeated wrong attempts can get your IP temporarily banned from Warframe login.

### Generate your own dataset for your local version

- Use **`generate.html`** to build a dataset from `all.json` of the [Warframe Items repository](https://github.com/WFCD/warframe-items/blob/master/data) *(use at your own risk)*.
- Advanced users can add personal data through **`custom_data.js`**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, **vanilla JavaScript** (including ES modules), no framework |
| Assets | Minified JS/CSS (`js/min`, `css/min`) |
| Data | Generated dataset (`js/data/data_generated.js`) from [WFCD/warframe-items](https://github.com/WFCD/warframe-items) and the [Warframe Wiki](https://wiki.warframe.com) |
| Persistence | Browser `localStorage` |
| Cloud sync (optional) | Google Firebase / Firestore |
| Hosting | GitHub Pages |
| Security | Strict Content-Security-Policy, secret key input validation (64 hex chars) |

### Project Structure

```text
wct/
├── css/             # Stylesheets (source + minified)
├── img/             # Icons and images
├── js/              # Application logic (source, minified, generated data)
├── generate.html    # Dataset generator
├── index.html       # Application entry point
└── LICENSE          # PolyForm Noncommercial 1.0.0
```

---

## Contributing

Feedback, bug reports and data corrections are very welcome! Open an [issue](https://github.com/evilflora/wct/issues) or join the [discussion on r/Warframe](https://www.reddit.com/r/Warframe/comments/1w1xgfw/warframe_completion_tracker_wct/).

Before submitting a Pull Request, please verify that:

1. The **data generator** runs without errors.
2. The **generated data** is correctly structured and readable.
3. The **output changes** match your intent (e.g., compare before/after with a diff tool such as WinMerge).

---

## Out of scope
This project is not intended to guide you in obtaining the items. 

- Unlock Mastery Rank requirements for items (the [Warframe Wiki](https://wiki.warframe.com) does this better)
- Build components and prices
- Item stats
- Drop locations

---

## Privacy

- All progress stays in your browser's local storage.
- Nothing leaves your device unless you explicitly enable **SYNC** and use the **UPLOAD** button.
- ⚠️ Clearing your browser cache or site data **erases your progress**, so use **Export** or **SYNC** regularly.

---

## License

Distributed under the **[PolyForm Noncommercial License 1.0.0](LICENSE)**. Personal, educational and other noncommercial use is permitted.

## Credits

- Item data: [WFCD (Warframe Community Developers)](https://github.com/WFCD/warframe-items) and the [Warframe Wiki](https://wiki.warframe.com).
- Made by [@evilflora](https://github.com/evilflora).

> *This project is not affiliated with Digital Extremes or Warframe. Data may be incorrect or out of date, so please report any issue.*