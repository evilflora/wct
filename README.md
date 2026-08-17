# Warframe Completion Tracker

A local, lightweight web application designed to track and manage your progression in Warframe without requiring server setup or installation.

---

## Overview

Warframe Completion Tracker runs locally in your default web browser. To get started, download or clone the repository files and open `index.html` in any modern web browser.

---

## Data Management & Persistence

All application data is saved locally within your browser's local storage, unless you set up the SYNC functionality.

- **Browser Cache / Storage Caution:** Clearing your browser cache or site data will reset your saved progress.
- **Export Progress:** Use the **EXPORT** button in the application to download a backup file of your progression before performing browser maintenance.
- **Import Progress:** Use the **IMPORT** button to restore your progress from a previously exported file.

---

## Features
### Global
- **Mastery Rank Tracking:** Track rank progression and Mastery Rank experience points across items.
- **Filtering & Search:** Narrow any category down by subtype and category-specific filters (weapon slot, node category, etc.), with each pill showing its own completion percentage, plus a name search within the current view.
- **Hide Checked:** Collapse already-completed items out of view to focus on what's left.
- **In-Category Help:** A contextual "?" button explains where to find that category's content in-game (hover on desktop, tap on mobile).
- **Persistent Session:** The app remembers your last active tab and filters, so refreshing the page puts you back where you left off.
- **Mobile capability:** Everything should work fine on mobile devices; some slowdowns may occur when a large list is loaded.
### Update
- A small icon is shown when an update is available.
### SYNC (needs internet and a web server if self-hosted)
- **Create:** Generate a random secret key (do not share it), allowing you to save / sync data outside the browser.
- **Sync:** Paste your secret key on any other device to download or upload data to your cloud save.
- **Upload:** Erase all data from the cloud server and replace it with your local save.
- **Download:** Erase all local data and replace it with the cloud data.
- **Disconnect:** Stop the sync and remove your secret key from your local save.
- **Delete Key and remove data:** Remove all data from the cloud server and remove the secret key from your local data.
### STATS
- **Mastery Breakdown:** Same UI and order as the game for better and faster comparison.
- **Progress Overview:** A stats panel summarizing completion by category, alongside the Mastery Breakdown.
### INFO
- **Changelog & Updates:**** Track changelogs, project links, credits, and privacy information.
- **Bulk Selection:** Mass selection tools available for quicker updates.
### OPTIONS
- **Save Options:** Check this setting to add options to the export data.
- **Founder:** You can add founder exclusive items to the dataset.
- **PVP:** Not everyone likes PVP, but if you do, this setting adds all PVP mods.
- **Backup & Restore:** Export your progress to a file and re-import it later; note that import fully replaces your current progress, so export first if unsure.
- **Customize Colors:** Warframe gives you full color customization? I will give it to you too.
- **Reset Progress:** A guarded "DELETE DATA" option for wiping saved progress and starting fresh.

### Generate your own dataset
- **Custom Data Import:** Option to import external item datasets using `all.json` from the [Warframe Items Repository](https://github.com/WFCD/warframe-items/blob/master/data) *(use at your own risk)*.
- **custom_data.js:** For more advanced users, you can add your own personal data.
---

## Development & Contribution

If you plan to modify the source code for personal use or to submit a Pull Request, please ensure the following verification steps are completed:

1. Verify that the **data generator** functions without errors.
2. Ensure the **generated data** is correctly structured and legible.
3. Confirm that **output changes** accurately reflect your intended modifications (e.g., using a diff tool like WinMerge to compare before-and-after states).

---

## Roadmap / Known Issues

### Planned Features, Enhancements, Fixes & Refactoring
- More filters
- Finish WIP

### Things I don't want to do (for now)
- Add Unlock Mastery Rank for items. If you want to know how to unlock something, please visit the awesome wiki
- Nor build components / price
- Nor items stats
- Nor drop location
