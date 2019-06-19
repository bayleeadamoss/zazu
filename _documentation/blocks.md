---
layout: documentation
description: "Blocks are the foundation of workflows. Each one represents a step to be completed."
icon: "fa-th-large"
title:  "Blocks"
---

* TOC
{:toc}

## Blocks

Blocks are the foundation of Zazu plugins and are defined in the `zazu.json`
file in each plugin. Each one represents a step to be completed. Along the way,
each block passes a value from one block to the next. If they fork, each block
will get their own copy of the current value.

Blocks link to other blocks via `connections`. Once a blocks gets executed,
it's connections will get executed after. You can link to both output and input
blocks. All blocks have connections unless the block explicitly mentions
otherwise.

All blocks can have the following properties:

* `id` *mixed*: Unique identifier of the block, used for logging and connections.
* `connections` *mixed[]*: Blocks to execute if one of the results are chosen.
* `type` *string*: Name of the block you wish to use.

Each unique block type can have it's own properties, listed below with their
descriptions.

If a block is missing a required argument, you will see an error in the `Plugin
Debugger` or in the logs in `~/.zazu/log/`.

## External Blocks

External blocks are ways of accessing Zazu plugins without using the Zazu search
bar. These types of blocks are unique because they cannot be used as a connection.

~~~ json
{
  "blocks": {
    "external": [
      // trigger blocks
    ]
  }
}
~~~

### Hotkey

When a user hits a specific set of keys, it can activate an input or output
block of your plugin.

A hotkey can be overwritten in the user's local [configuration file](/documentation/configuration/#plugins).

* `hotkey` *string*: Key combination to use. [[docs]](https://github.com/electron/electron/blob/master/docs/api/accelerator.md)

In this example you have a hotkey block named `Inverse`, when somebody hits that
hotkey it goes to the next block `PlayPandora` which is most likely a [user
script](#user-script).

~~~ json
[{
  "id": "Inverse",
  "type": "Hotkey",
  "hotkey": "cmd+shift+o",
  "connections": ["PlayPandora"]
}]
~~~

### Service Script

Often a plugin will need to run jobs in the background for things like indexing
files or checking the active application. This block allows you to run your
script on a set interval. Your service is not guaranteed to run on the given
interval.

NOTICE: The connections on this block will be ignored.

Variables defined in the [configuration](/documentation/configuration/) will be
used as environment variables passed into the script.

* `interval` *int*: Milliseconds between the time we run the script. Must be `>=100`.
* `script` *string*: Path to the node file to execute.

~~~ javascript
[{
  "id": "Cache Packages",
  "type": "ServiceScript",
  "script": "cachePackages.js",
  "interval": 100
}]
~~~

Below is an example of the `Cache Packages` block we defined earlier. It fetches
a JSON file from the [internet](https://en.wikipedia.org/wiki/Internet) and
store it in the plugin directory under the name `packages.json`.

The `pluginContext` is provided when your plugin is loaded, and the returned
function will be called as needed.

~~~ javascript
// cachePackages.js
const fs = require('fs')
const http = require('http')
const path = require('path')

module.exports = (pluginContext) => {
  const packageUrl = 'http://zazuapp.org/api/packages.json'
  const outputFile = path.join(pluginContext.cwd, 'packages.json')

  return (env = {}) => {
    return new Promise((resolve, reject) => {
      http.get(packageUrl, (response) => {
        const chunks = []

        response.on('data', (chunk) => {
          chunks.push(chunk.toString())
        })

        response.on('end', () => {
          resolve(chunks.join(''))
        })
      })
    }).then((data) => {
      return fs.writeFileSync(outputFile, data)
    })
  }
}
~~~

## Input Blocks

Input blocks are blocks that are the entry points to your plugin. These usually
return results to be displayed in Zazu. If a search becomes stales, all input
scripts should be able to handle a [`SIGKILL`](http://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html)

~~~ json
{
  "blocks": {
    "input": [
      // input blocks
    ]
  }
}
~~~

### Root Script

This allows you to execute a node script without a prefix.

* `script` *string*: Path to the node file to execute.
* `debounce` *int*: How long in milliseconds we should wait between calls,
  useful for resource intensive or slow running plugins. Defaults to `100`.

~~~ javascript
[{
  "id": "Calculator",
  "type": "RootScript",
  "script": "calculator.js",
  "debounce": 100,
  "connections": ["Copy"]
}]
~~~

We call the `export` with the [Plugin
Context](/documentation/plugins/#plugin-context), which should return an object
with two methods `respondsTo` and `search`.

The `respondsTo` method takes a `query` and asks the plugin if they are willing
to respond to that input.

The `search` method takes a `query` and `env` and returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
that resolves with results.

The `pluginContext` is provided when your plugin is loaded, and the returned
functions will be called as needed.

Variables defined in the [configuration](/documentation/configuration/) will be used as
environment variables in the script call.

~~~ javascript
// calculator.js
module.exports = (pluginContext) => {
  return {
    respondsTo: (query, env = {}) => {
      return query.match(/\d/)
    },
    search: (query, env = {}) => {
      return new Promise((resolve, reject) => {
        const value = eval(query)
        resolve([
          {
            icon: 'fa-calculator',
            title: value,
            subtitle: 'Select item to copy the value to the clipboard.',
            value: value,
          }
        ])
      })
    },
  }
}
~~~

### Prefix Script

This allows you to execute a node script with a prefix.

* `prefix` *string*: Prefix to be used before user input.
* `space` *boolean*: If a space should be between the Prefix and the user input.
* `args` *string*: Specifies if you want arguments. Possibles values are `Required`, `Optional` and `None`.
* `script` *string*: Path to the node file to execute.
* `debounce` *int*: How long in milliseconds we should wait between calls,
  useful for resource intensive or slow running plugins. Defaults to `0`.

~~~ json
[{
  "id": "Calculator",
  "type": "PrefixScript",
  "prefix": "calc",
  "space": true,
  "args": "Required",
  "script": "calculator.js",
  "debounce": 100,
  "connections": ["Copy"]
}]
~~~~

The node script needs to have a curried function that returns a promise. We call
the export with the [Plugin Context](/documentation/plugins/#plugin-context).
The search function can accept a query and the environment variables, and it
should return a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

The `pluginContext` is provided when your plugin is loaded, and the returned
function will be called as needed.

Variables defined in the [configuration](/documentation/configuration/) will be used as
environment variables in the script call.

~~~ javascript
// calculator.js
module.exports = (pluginContext) => {
  return (query, env = {}) => {
    return new Promise((resolve, reject) => {
      const value = eval(query)
      resolve([
        {
          icon: 'fa-calculator',
          title: value,
          subtitle: 'Select item to copy the value to the clipboard.',
          value: value,
        }
      ])
    })
  }
}
~~~

### Keyword

Keyword blocks are a useful input block, if you don't need input from the user.
Once a user types in part of your keyword, it will display as a result the user
can click on.

* `keyword` *string*: What the user input should match. Similar to the `value` in results.
* `title` *string*: Title of the result that will be displayed, similar to results.
* `subtitle` *string*: Subtitle of the result that will be displayed, similar to results.
* `icon` *string*: [Font awesome](http://fontawesome.io/icons/) or the relative path to an icon to be displayed next to the result.

~~~ json
[{
  "id": "Play",
  "type": "Keyword",
  "keyword": "play",
  "title": "Play Pandora",
  "subtitle": "Click to play Pandora!",
  "icon": "fa-play",
  "connections": ["PlayPandora"]
}]
~~~

## Output Blocks

Output blocks happen after an input block, these can do several things like call
a script, or copy something to your clipboard.

Most of the special attributes allow you to use a variable `{value}` which will
be replaced with the current value of the result being passed around.

~~~ json
{
  "blocks": {
    "output": [
      // output blocks
    ]
  }
}
~~~~

### Copy To Clipboard

This block will copy the given input to the clipboard.

* `text` *string*: Text to be copied to the clipboard.

~~~ json
[{
  "id": "Copy",
  "type": "CopyToClipboard",
  "text": "{value}"
}]
~~~~

### Open In Browser

Open up the value in the users default Browser.

* `url` *string*: URL of the page you wish to open.

~~~ json
[{
  "id": "Link",
  "type": "OpenInBrowser",
  "url": "{value}"
}]
~~~~

### Send Notification

Give the user a notification with a title and a message.

* `title` *string*: Title of the notification.
* `message` *string*: Message of the notification.

~~~ json
[{
  "id": "Notify",
  "type": "SendNotification",
  "title": "Hello world",
  "message": "{value}"
}]
~~~~

### Preview

You can display large text in a preview window.

* `message` *string*: Message to display in the window.

~~~ json
[{
  "id": "Display",
  "type": "Preview",
  "message": "{value}"
}]
~~~

### Open File

To open a file in the default application.

~~~ json
[{
  "id": "Open",
  "type": "OpenFile"
}]
~~~~

### Show File

To show a file in it's folder.

~~~ json
[{
  "id": "Show",
  "type": "ShowFile"
}]
~~~~

### User Script

If you need to process or modify your state, this allows you to run any script
on the current state being passed down.

* `script` *string*: Path to the node file to execute.

~~~ json
[{
  "id": "Process",
  "type": "UserScript",
  "script": "process.js",
  "connections": ["Copy"]
}]
~~~

In the example below we take in a unicode value and output the character that
corresponds to that unicode value using
[`String.fromCharCode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode).

The `pluginContext` is provided when your plugin is loaded, and the returned
function will be called as needed.

~~~ javascript
// process.js
module.exports = (pluginContext) => {
  return (value, env = {}) => {
    return new Promise((resolve, reject) => {
      resolve(String.fromCharCode(value))
    })
  }
}
~~~

### Reload Configuration

If a plugin is changing values inside of the `~/.zazurc.json` file, it can often
be useful to tell Zazu to reload this configuration.

~~~ json
[{
  "id": "Reload",
  "type": "ReloadConfig"
}]
~~~

### Play Sound

Playing a sound to alert the user, or signal an event is sometimes more useful
then a Notification. This block allows you to play abritrary sounds inside of
your plugin.

* `file` *string*: Path to the audio file you want Zazu to play. You can also
  add a `{value}` inside of this string to make it more dynamic.

~~~ json
[{
  "id": "Play",
  "type": "PlaySound",
  "file": "beep.mp3"
}]
~~~
