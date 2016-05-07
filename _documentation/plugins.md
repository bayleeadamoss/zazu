---
layout: documentation
description: "Getting started to configure your Zazu in your dotfiles."
icon: "fa-sliders"
title:  "Configuration"
---

* TOC
{:toc}

## Configuration

Currently only a JavaScript format is supported. Here is an example of the basic
usage.

~~~
module.exports = {
  'hotkey': 'alt+space',
  'theme': 'tinytacoteam/dark-theme',
  'plugins': [],
}
~~~

### Hotkey

This can be any [keyboard
accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md)
you can think of. We recommend using `alt+space` or `Command+space`, but it's up
to you!

### Theme

This in the format of a short GitHub url. For example `tinytacoteam/dark-theme`
would translate to `https://github.com/tinytacoteam/dark-theme`.

There are a [few themes](/packages) we created that you can pick from, feel free
to fork them and make your own.

### Plugins

Plugins can be in either of two formats. The first is the short Github url
forma for example `tinytacoteam/dark-theme` would translate to
`https://github.com/tinytacoteam/dark-theme`.

~~~
module.exports = {
  // ...
  'plugins': [
    'tinytacoteam/calculator',
  ],
}
~~~

The second format is an object syntax that allows you to add custom variables.
These variables will be applied differently based on which
[blocks](/documentation/blocks/) the plugin is using.

Variables *ARE* case sensitive, check with individual plugins for what variables
you can use to configure it's behavior.

~~~
module.exports = {
  // ...
  'plugins': [
    {
      name: 'tinytacoteam/calculator',
      variables: {
        OFFSET: 10,
      }
  ],
}
~~~
