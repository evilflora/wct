# Warframe Completion Tracker

A local, lightweight web application designed to track and manage your progression in Warframe without requiring server setup or installation.

---

## Overview

Warframe Completion Tracker runs locally in your default web browser. To get started, download or clone the repository files and open `index.html` in any modern web browser.

---

## Data Management & Persistence

All application data is saved locally within your browser's local storage.

- **Browser Cache / Storage Caution:** Clearing your browser cache or site data will reset your saved progress.
- **Export Progress:** Use the **EXPORT** button in the application to download a backup file of your progression before performing browser maintenance.
- **Import Progress:** Use the **IMPORT** button to restore your progress from a previously exported file.

---

## Features

- **Mastery Rank Tracking:** Track rank progression and Mastery Rank experience points across items.
- **Mastery Breakdown:** Same UI and order as the game for better and faster comparison, in **[STATS]**.
- **Changelog & Updates:** Track changelogs, project links, credits, and privacy information, in **[INFO]**.
- **Filtering & Search:** Narrow any category down by subtype and category-specific filters (weapon slot, node category, etc.), each pill showing its own completion percentage, plus a name search within the current view.
- **Bulk Selection:** Mass selection tools available for quicker updates.
- **Hide Checked:** Collapse already-completed items out of view to focus on what's left.
- **In-Category Help:** A contextual "?" button explains where to find that category's content in-game (hover on desktop, tap on mobile).
- **Progress Overview:** A stats panel summarizing completion by category, alongside the Mastery Breakdown, in **[STATS]**.
- **Customizable Options:** Toggle specific display settings (e.g., enable or disable Founder items) and choose whether those preferences travel along with your exported file in **[OPTIONS]**.
- **Backup & Restore:** Export your progress to a file and re-import it later, note that import fully replaces your current progress, so export first if unsure.
- **Persistent Session:** The app remembers your last active tab and filters, so refreshing the page puts you back where you left off.
- **Reset Progress:** A guarded "DELETE DATA" option (multi-click confirmation) for wiping saved progress and starting fresh, in **[OPTIONS]**.
- **Customize Colors:** Warframe gives you full color customization? I will give it to you too through **[OPTIONS]**.
- **Custom Data Import:** Option to import external item datasets using `all.json` from the [Warframe Items Repository](https://github.com/WFCD/warframe-items/blob/master/data) *(use at your own risk)*.

---

## Development & Contribution

If you plan to modify the source code for personal use or to submit a Pull Request, please ensure the following verification steps are completed:

1. Verify that the **data generator** functions without errors.
2. Ensure the **generated data** is correctly structured and legible.
3. Confirm that **output changes** accurately reflect your intended modifications (e.g., using a diff tool like WinMerge to compare before-and-after states).

---

## Roadmap / Known Issues

### Planned Features, Enhancements, Fixes & Refactoring
- Additional challenges tracking
- Use "https://wiki.warframe.com/w/Public_Export" ?
- More filters
- Clarify Railjack MK4 60%
- Clean up unused resource files and definitions
- Remove `generatedCustomEntries` and use custom_data.js
- Calculted percentage in filter are sometimes broken
- 237 star chart node instead of 238 ? (with filters: normal / normal / all)

### What I can't do for now
- A symbol "hidden from codex" at the end of an item, data from WFCD does have a field named "excludeFromCodex," but it's not for that.

### Things I don't want to do (for now)
- Add Unlock Mastery Rank for items. If you want to know how to unlock something, please visit the awesome wiki
- Nor build components / price
- Nor items stats
- Nor drop location