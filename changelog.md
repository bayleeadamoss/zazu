## 0.5.1

### Bugs

* Fix regression in beep. #279

## 0.5.0

### Bugs

* Fix debugger that would not filter plugin results correctly. (Thanks
  [nalexander50][nalexander50]!) #272
* Re-require NPM so updating works correctly. #252
* Fix screen caching issue that prevented Zazu from opening. #253
* Truncate logs to avoid overloading io/debugger. #228
* Remove the beeping sound when toggling Zazu. #217
* Remove unnecessary intervals that caused idle CPU cycles. (Thanks
  [jlaffaye][jlaffaye]!) #277 #278

### Features

* Add a Preview block type. #240
* Pass the environment object to `respondsTo` on root scripts. #244
* Remove "loaded" notification when Zazu starts up. #234

## 0.4.0

### Bugs

* Better detection if GIT is installed. #200
* Fix issue with prefix script and optional dependencies. #154
* Catch http exceptions when not connected to the internet. #211

### Features

* Add ability to be portable. (Thanks [schmic][schmic]!) #164
* Check for updates every 24 hours, not just once. #170
* Allow about text to be copy-able. #88
* Better ranking algorithm based on block type. #176
* Follow the cursor instead of always being on the primary monitor. (Thanks
  [eldinoyev][eldinoyev]!) #169
* Show error screen when no plugins are installed. (Thanks
  [eldinoyev][eldinoyev]!) #193
* Add a new block type for reloading configuration. #198

## 0.3.2

## Bugs

* No longer show transparent themes on Windows to fix windows never appearing

## 0.3.1

### Bugs

* Better handle npm install exceptions
* Revert back to old logo

## 0.3.0

### Features

* Update to a higher quality logo
* Added a default package manager plugin

### Bugs

* Fixed tray icon coloring for dark/light OS themes
* Update package installation to be more resilient

## 0.2.3

### Features

* Added default fallback searches.
* Include zazu version when logging.

### Fixed Bugs

* Allow users to use the screen, immediately after the loading screen
  disappears.
* Uses a differnet endpoint to determine the latest version, which fixes an
  issue with the website being out of sync.
* Focus correctly in linux desktops.

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

[schmic]: https://github.com/schmic
[eldinoyev]: https://github.com/eldinoyev
[nalexander50]: https://github.com/nalexander50
[jlaffaye]: https://github.com/jlaffaye
