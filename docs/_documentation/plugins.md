---
layout: documentation
description: "Overview of what is all included in Zazu Plugins"
icon: "fa-plug"
title:  "Creating Plugins"
---

* TOC
{:toc}

## Plugin Overview

Plugins provide all the end user behavior. Plugins use a workflow architecture,
where some [blocks](/documentation/blocks/) return results, and other process
data. You can have as many blocks as you want that can do their own specific
tasks.

At the root of every plugin there is a `zazu.js` file that tells Zazu how to
communicate with your plugin.

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

The [input blocks](/documentation/blocks/#input-blocks) in your plugins will
need to return results to Zazu. Here is an example:

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

* `id` *string*: Identifier for [internal ranking](#internal-ranking).
* `icon` *string*: Supports [font awesome](http://fontawesome.io/icons/)
icons as well as relative paths to the icon in your project. If one is not
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

### Internal Ranking

If you provide results with an `id`, Zazu will rank frequently clicked items
higher in the results list. This works well even if you sort the results
yourself. If you don't want this behavior, simply don't add an `id` to the
result.

## Debugging

In the Tray icon, under `Development` there is a debugger called `Plugin
Debugger` that will output info, warnings and errors of all plugins in a
filterable interface. Select the plugin you are trying to debug and get logs
for all the blocks being executed.
