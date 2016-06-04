---
layout: documentation
description: "Blocks are the foundation of workflows. Each one represents a step to be completed."
icon: "fa-th-large"
title:  "Blocks"
---

* TOC
{:toc}

## Blocks

Blocks are the foundation of Zazu plugins. Each one represents a step to be
completed. Along the way, each block passes a value from one block to the next.
If they fork, each block will get their own copy of the current value.

Blocks link to other blocks via `connections`. Once a blocks gets executed,
it's connections will get executed after. You can link to both output and input
blocks.

All blocks can have the following properties:

* `id` *int|string*: Unique identifier of the block, used to help make connections.
* `connections` *int[]*: Blocks to execute if one of the results are chosen.
* `type` *string*: Name of the block you wish to use.

Each unique block type can have it's own properties, listed below with their
descriptions.

## External Blocks

External blocks are ways of accessing Zazu plugins without using the zazu search
bar. These types of blocks are unique because they cannot be used as a connection.

~~~ javascript
module.exports = {
  blocks: {
    external: [
      // trigger blocks
    ]
  }
};
~~~

### Hotkey

When a user hits a specific set of keys, it can activate an input or output
block of your plugin.

* `hotkey` *string*: Key combination to use. [[docs]](https://github.com/electron/electron/blob/master/docs/api/accelerator.md)

~~~ javascript
[{
  id: 1,
  type: 'Hotkey',
  hotkey: 'cmd+shift+o',
  connections: [2],
}]
~~~

### Service Script

Often a plugin will need to run jobs in the background for things like indexing
files or checking the active application. This block allows you to run your
script on a set interval. Your service is not guaranteed to run on the given
interval.

The connections on this block will be ignored.

Variables defined in the [configuration](/documentation/configuration/) will be
used as environment variables in the script call.

* `interval` *int*: Milliseconds between the time we run the script. Must be `>=100`.
* `script` *string*: Command to be ran. The return value is ignored.

~~~ javascript
[{
  id: 1,
  type: 'ServiceScript',
  script: 'node scanClipboard.js',
}]
~~~

## Input Blocks

Input blocks are blocks that are the entry points to your plugin. These usually
return results to be displayed in Zazu. If a search becomes stales, all input
scripts should be able to handle a [`SIGKILL`](http://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html)

~~~ javascript
module.exports = {
  blocks: {
    input: [
      // input blocks
    ]
  }
};
~~~

### Root Script

This allows you to execute your script without any input prefixes.

Variables defined in the [configuration](/documentation/configuration/) will be used as
environment variables in the script call.

* `respondsTo` *function*: Filter input so your plugin doesn't run after each keystroke
* `script` *string*: Shell command that returns results

~~~ javascript
[{
  id: 1,
  type: 'RootScript',
  respondsTo: (input) => {
    const hasEquation = input.match(/^[\d\.\(\)\+\-*\/\s]+$/)
    const hasNumbers = input.match(/\d/)
    return hasEquation && hasNumbers
  },
  script: 'node calculator.js {query}',
  connections: [2],
}]
~~~

### Prefix Script

This allows you to execute your script with a prefix.

Variables defined in the [configuration](/documentation/configuration/) will be used as
environment variables in the script call.

* `prefix` *string*: Prefix to be used before user input.
* `space` *boolean*: If a space should be between the Prefix and the user input.
* `args` *string*: Specifies if you want arguments. Possibles values are `Required`, `Optional` and `None`.
* `script` *string*: Shell command that returns results

~~~ javascript
[{
  id: 1,
  type: 'PrefixScript',
  prefix: 'calc',
  space: true,
  args: 'Required',
  script: 'node calculator.js {query}',
  connections: [2],
}]
~~~~

### Keyword

Keyword blocks are a useful input block, if you don't need input from the user.
Once a user types in part of your keyword, it will display as a result the user
can click on.

* `keyword` *string*: What the user input should match. Similar to the `value` in results.
* `title` *string*: Title of the result that will be displayed, similar to results.
* `subtitle` *string*: Subtitle of the result that will be displayed, similar to results.

~~~ javascript
[{
  id: 1,
  type: 'Keyword',
  keyword: 'play',
  title: 'Play Pandora',
  subtitle: 'Click to play Pandora!',
  connections: [2],
}]
~~~

## Output Blocks

Output blocks happen after an input block, these can do several things like call
a script, or copy something to your clipboard.

Most of the special attributes allow you to use a variable `{value}` which will
be replaced with the current value of the result being passed around.

~~~ javascript
module.exports = {
  blocks: {
    output: [
      // output blocks
    ]
  }
};
~~~~

### Copy To Clipboard

This block will copy the given input to the clipboard.

* `text` *string*: Text to be copied to the clipboard.

~~~ javascript
[{
  id: 2,
  type: 'CopyToClipboard',
  text: '{value}',
}]
~~~~

### Open In Browser

Open up the value in the users default Browser.

* `url` *string*: URL of the page you wish to open.

~~~ javascript
[{
  id: 3,
  type: 'OpenInBrowser',
  url: '{value}',
}]
~~~~

### Send Notification

Give the user a notification with a title and a message.

* `title` *string*: Title of the notification.
* `message` *string*: Message of the notification.

~~~ javascript
[{
  id: 4,
  type: 'SendNotification',
  title: 'Hello world',
  message: '{value}',
}]
~~~~

### User Script

For those more unique actions, you can run any script you need.

Variables will be passed as environment variables, but this plugin cannot mutate
the state.

* `script` *string*: The shell command to run to return the results.

~~~ javascript
[{
  id: 5,
  type: 'UserScript',
  script: 'ruby output.rb {value}',
}]
~~~~
