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
      "id": "42",
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

## Long Synchronous Operations

Zazu runs your application in the same thread, this is useful so your plugin can
share the same objects between blocks, however if you are planning on running a
long synchronous job, you should consider using a
[child_process.fork](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)
within your block.

## Debugging

In the Tray icon, under `Development` there is a debugger called `Plugin
Debugger` that will output info, warnings and errors of all plugins in a
filterable interface. Select the plugin you are trying to debug and get logs
for all the blocks being executed.

## Plugin Context

The `pluginContext` object passed to node scripts and contains some useful
functions to help enable your scripts.

### Console

The Plugin Debugger is useful, since we surface information to you to help you
develop your plugins better. This API allows you to surface your own logs to the
Plugin Debugger.

* `level` *string*: Log level `verbose`, `info`, or `error`
* `message` *string*: Log message to be displayed.
* `data` *object*: Other misc data that could be useful.

~~~ javascript
module.exports = (pluginContext) => {
  pluginContext.console.log('verbose', 'hello world', {
    ping: 'pong',
  })
}
~~~

### CWD

The current working directory of the node script being ran.

~~~ javascript
const path = require('path')
module.exports = (pluginContext) => {
  const outputFile = path.join(pluginContext.cwd, 'output.json')
}
~~~

### Clipboard

An instance of the [Electron
Clipboard](https://github.com/electron/electron/blob/master/docs/api/clipboard.md)
instance.

~~~ javascript
const path = require('path')
module.exports = (pluginContext) => {
  const clipboard = pluginContext.clipboard
}
~~~

### Native Image

An instance of the [Electron
Native Image](https://github.com/electron/electron/blob/master/docs/api/native-image.md)
instance.

~~~ javascript
const path = require('path')
module.exports = (pluginContext) => {
  const nativeImage = pluginContext.nativeImage
}
~~~
