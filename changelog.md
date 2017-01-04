## 0.2.2

### Features

* Loading screen when plugins are still loading.

### Fixed Bugs

* Set default state for plugins.
* Fix github fallback for fresh downloads resulting in plugins not loading.

## v0.2.1

### Features

* Github fallback if git is not installed.
* Switched all incoming formats to json.
* Better plugin validation/debugging.

### Fixed Bugs

* Fix ctrl+j and ctrl+k going the wrong directions in search results.

## v0.1.3

### Features

* Mouse controls no longer change active index.
* Added univeral logging for easier debugging.

### Fixed Bugs

* Broken packages no longer break installs and updates.
* Verify `app.hide` exists before calling it, to support windows.

## v0.1.2

### Fixed Bugs

* Don't hide app when debug or about screens are showing.
* Correctly clear results when toggling Zazu.

## v0.1.1

### Fixed Bugs

* Refocus the previous application when toggling Zazu. #27
* Scoped blocks now descope when toggling via the menu item. #44
* Gracefully handle toggling devtools when no window is open. #45
* Clear results when you close Zazu so they don't clear when you open. #46
