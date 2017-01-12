---
layout: documentation
description: "Getting started to configure your Zazu in your dotfiles."
icon: "fa-sliders"
title:  "Personal Configuration"
---

* TOC
{:toc}

## Configuring Zazu

Your personal configuration lives in `~/.zazurc.json`. Here is an example of the
basic usage.

~~~ json
{
  "hotkey": "alt+space",
  "theme": "tinytacoteam/dark-theme",
  "plugins": []
}
~~~~

### Hotkey

This can be any [keyboard
accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md)
you can think of. We recommend using `alt+space` or `cmd+space`, but it's up
to you!

### Theme

This in the format of a relative GitHub URL. For example `tinytacoteam/dark-theme`
would translate to `https://github.com/tinytacoteam/dark-theme`.

There are a [few themes](/themes) we created that you can pick from, feel free
to fork them and make your own.

### Plugins

Plugins can be in either of two formats. The first is the short GitHub URL
format for example `tinytacoteam/dark-theme` would translate to
`https://github.com/tinytacoteam/dark-theme`.

~~~ json
{
  "plugins": [
    "tinytacoteam/calculator"
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
      "name": "tinytacoteam/calculator",
      "variables": {
        "OFFSET": 10
      }
    }
  ]
}
~~~~

### Analytics

We send anonymous usage to [New Relic](https://newrelic.com/). To opt out of
sending this anonymous data you can set `disableAnalytics` to `true` in your
configuration.

## Portable Mode {#portableMode}

If you want your configuration within your application folder for portability just
create a `portable` directory inside of it. You can copy your configuration files over
from your home directory if they already exist.
