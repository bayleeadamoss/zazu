---
layout: documentation
description: "Overview of what is all included in Zazu Plugins"
icon: "fa-plug"
title:  "Creating Plugins"
---

* TOC
{:toc}

## Plugin Overview

A plugin can be in any language but required a `zazu.js` file in the root of the
project to communicate how to talk to Zazu. Included is some meta information
about the project and a description of the [blocks](/documentation/blocks/) that
the plugin make use of.

~~~ javascript
module.exports = {
  name: 'Demo Plugin',
  icon: 'icon.png',
  install: 'npm install',
  stylesheet: 'dist/main.css',
  blocks: {
    input: [
      {
        id: 1,
        type: 'Keyword',
        keyword: 'play',
        title: 'Test Notification',
        subtitle: 'Click to test notifications',
        connections: [2],
      },
    ],
    output: [
      {
        id: 2,
        type: 'SendNotification',
        title: 'Hello world',
        message: '{value}',
      },
    ],
  },
}
~~~~

### Plugin Fields

* `icon` *string*: If the result does not provide an individual icon, the plugin
icon will be used. The icon here is treated as a relative path.
* `install` *string*: Optional. A script to warm up your application. Such as a
`bundle install`, warming up a cache or migrating a local database.
* `stylesheet` *string*: Optional. Relative path of a compiled stylesheet to be
  used when a single result is being previewed.
* `blocks` *object*:  Blocks are the foundations of every great plugin. They are
so great, they have their own [block page](/documentation/blocks/).

## Results

Your plugin can be written in any language, but it needs to output in a
[JSON](https://en.wikipedia.org/wiki/JSON) format. An example with a single
result might look like:

~~~ json
[
    {
      "icon": "fa-calculator",
      "title": "The answer is 42",
      "subtitle": "Answer to the Ultimate Question of Life, the Universe, and Everything",
      "preview": "<span>42!</span>",
      "value": 42
    }
]
~~~

### Result Fields

* `icon` *string*: Supports [font awesome](http://fontawesome.io/icons/)
icons as well as absolute paths to the icon in your project. If one is not
provided it will fallback tot he icon for your project.
* `title` *string*: Larger text you see in a result.
* `subtitle` *string*: Optional. Smaller text under the title.
* `preview` *string*: Optional. HTML that shows up next to an active result.
  This will be in an iframe and include any `stylesheet` for styling.
* `value` *mixed*: Value is the what is passed from block to block to make your
plugin run. In this case the value `42` as a number would be passed to whatever
the connection block is, which could be to
[copy to the clipboard](/documentation/blocks/#copy-to-clipboard) or it could
run a custom [user script](/documentation/blocks/#user-script).
