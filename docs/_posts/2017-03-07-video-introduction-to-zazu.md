---
layout:      page
title:       "Video Introduction to Zazu"
description: "A walkthrough on how to use the happy path of Zazu"
permalink:   /blog/2017/video-introduction-to-zazu
---

<iframe src="https://player.vimeo.com/video/206729309" width="640" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

This is a short video about Zazu. Zazu is an open source launcher on steroids.
It ships with a rich set of plugins to make your life easy. You can write your
own plugins to extend the behavior of Zazu.

## Install Zazu

To install Zazu please visit the [website and download][download] the
appropriate binary for your operating system. Zazu is cross-platform compatible
and we currently supply binaries for Windows, Mac and Ubuntu.

## Using Zazu

Once it is successfully installed, you can launch Zazu. You’ll notice the
feather icon in the menu bar of your operating system. You can now open Zazu
using the shortcut key `Alt-Space`. Launching an application is as simple as
typing a few letters from the name of the program. For example typing `chr`
will show `Google Chrome` in the results.

## Default Plugins

Zazu ships with a rich set of plugins that go beyond the simple application
launching. One such plugin is a [calculator][calculator] which allows you to do
math calculations such as `5 * 3`. You can then press enter to automatically
copy that result into the clipboard. It can also do a few advanced calculations
like converting between feet to inches or pounds to kilograms.

Another useful plugin that ships by default is the [clipboard
manager][clipboard] which can be launched using `Cmd-Shift-V`. You can search
through this list of items you’ve copied earlier in the day. It can also show
you a handy preview of the images you have copied.

## Installing Plugins

But the real power of Zazu lies with the plugins contributed by users to satisfy
their specific needs. You can browse through a list of available plugins on the
[plugins page][plugins page] or you can look at them straight from Zazu by
typing `list`. To install plugins you can type `install emoji` and click on the
`emoji` plugin you'd like to install.

## Updating your Configuration

The configuration for Zazu is stored in a simple JSON file in your home folder.
In MacOS and Linux you can find this file under `~/.zazurc.json`. On Windows you
can find it in `C:\Users\YOUR_NAME\.zazurc.json`.

In your configuration file, you have options to modify the hotkey to launch
Zazu, change the theme, or modify the configuration for individual plugins. Like
the fallback searches to show in the results list, or the hotkey for the
clipboard manager.

Since this is a text file, you can also back it up, version it and share it with
others.

## Creating Plugins

If you are interested in creating plugins for Zazu you can find lots of help in
the [documentation of the website][documentation], you can also reach out to the
core team or the community members on [Gitter][gitter]. Lastly, if you run into
bugs please file an issue on [GitHub][github].

[plugins]: /plugins/
[documentation]: /documentation/
[download]: /download/
[calculator]: http://github.com/tinytacoteam/zazu-calculator
[clipboard]: https://github.com/tinytacoteam/zazu-clipboard
[gitter]: https://gitter.im/tinytacoteam/zazu
[github]: https://github.com/tinytacoteam/zazu
