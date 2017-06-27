---
layout: documentation
description: "Getting started to configure your Zazu in your dotfiles."
icon: "fa-sliders"
title:  "Personal Configuration"
---

* TOC
{:toc}

## Configuring Zazu

Your personal configuration lives in `~/.zazurc.json` (or
`C:\Users\YOUR_NAME\.zazurc.json` for Windows). Here is an example of the basic
usage.

~~~ json
{
  "hotkey": "alt+space",
  "theme": "tinytacoteam/zazu-dark-theme",
  "displayOn": "detect",
  "plugins": []
}
~~~~

### Hotkey

This can be any [keyboard
accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md)
you can think of. We recommend using `alt+space` or `cmd+space`, but it's up
to you!

~~~ json
{
  "hotkey": "cmd+space"
}
~~~~

### Theme

This in the format of a relative GitHub URL. For example `tinytacoteam/zazu-dark-theme`
would translate to `https://github.com/tinytacoteam/zazu-dark-theme`.

There are a [few themes](/themes) we created that you can pick from, feel free
to fork them and make your own.

~~~ json
{
  "theme": "tinytacoteam/zazu-dark-theme"
}
~~~~

### Plugins

Plugins can be in either of two formats. The first is the short GitHub URL
format for example `tinytacoteam/zazu-dark-theme` would translate to
`https://github.com/tinytacoteam/zazu-dark-theme`.

~~~ json
{
  "plugins": [
    "tinytacoteam/zazu-calculator"
  ]
}
~~~~

The second format is an object syntax that allows you to add custom variables.
These variables will be applied differently based on which
[blocks](/documentation/blocks/) the plugin is using.

Variables *ARE* case sensitive, check with individual plugins for what variables
you can use to configure it's behavior.

~~~ json
{
  "plugins": [
    {
      "name": "tinytacoteam/zazu-calculator",
      "variables": {
        "OFFSET": 10
      }
    }
  ]
}
~~~~

### Display On

This determines whether Zazu opens in the center of the primary display each
time it is toggled, or if Zazu will display on the screen you are currently
working on.

`detect`, the default behavior,  means Zazu will open at the center of any
screen that the cursor is hovering over. Any updates to Zazu's position will be
saved for that particular screen but not the others. Each screen's custom Zazu
position will be used to position Zazu on that screen in subsequent toggles.

`primary` means Zazu will open in the center of the primary display the first
time it is toggled after launching the application. Any update to Zazu's screen
position will be saved and Zazu will open at the new position each time it is
toggled.

Set to `detect` by default.

~~~ json
{
  "displayOn": "primary"
}
~~~~

### Height

You can adjust the height of Zazu. It's worth mentioning that not all themes
support adjusting the height of Zazu.

~~~ json
{
  "height": 700
}
~~~~

### Analytics

We send anonymous usage to [New Relic](https://newrelic.com/). To opt out of
sending this anonymous data you can set `disableAnalytics` to `true` in your
configuration.

~~~ json
{
  "disableAnalytics": false
}
~~~~

## Portable Mode {#portableMode}

If you want your configuration within your application folder for portability just
create a `portable` directory inside of it. You can copy your configuration files over
from your home directory if they already exist.

## Hide Tray Item

The tray item can be hidden by setting `hideTrayItem` to `true` in your configuration.
When hidden, the menu will instead be accessible via a small cog on the search bar.
