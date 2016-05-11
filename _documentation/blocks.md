---
layout: documentation
description: "Blocks are the foundation of workflows. Each one represents a step to be completed."
icon: "fa-th-large"
title:  "Blocks"
---

* TOC
{:toc}

## Blocks

Blocks are the foundation of workflows. Each one represents a step to be completed. Along the way, each block passes a value from one block to the next, if they fork each block will get their own copy of the current value.

All blocks can have the following properties:

* `id` - *Int* The id of the block, used to help make connections.
* `connections` - *Int[]* Blocks to execute if one of the results are actioned.
* `type` - *String* The name of the block you wish to use.

Each unique block type can have it's own properties, listed below with their
descriptions.

## Input Blocks

Input blocks are blocks that are the entry points to your plugin. These usually
return results to be displayed in Zazu.

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

* `respondsTo` - *Function* Filter input so your plugin doesn't run after each keystroke
* `script` - *String* The shell command to run to return the results.

~~~ javascript
{
  id: 1,
  type: 'RootScript',
  respondsTo: (input) => {
    const hasEquation = input.match(/^[\d\.\(\)\+\-*\/\s]+$/)
    const hasNumbers = input.match(/\d/)
    return hasEquation && hasNumbers
  },
  script: 'node calculator.js {query}',
  connections: [2],
}
~~~

## Output Blocks

Output blocks happen after an input block, these can do several things like call
a script, or copy something to your clipboard.

~~~ javascript
module.exports = {
  blocks: {
    output: [
      // output blocks
    ]
  }
};
~~~

### Copy To Clipboard

This block will copy the given input to the clipboard.

~~~ javascript
{
  id: 2,
  type: 'CopyToClipboard',
}
~~~

### Open In Browser

Open up the value in the users default Browser.

~~~ javascript
{
  id: 3,
  type: 'OpenInBrowser',
}
~~~

### Send Notification

Give the user a notification with a title and a message. The special `{value}`
can be used to represent the current value being passed to the block.

* `title` - *String* Title of the notification.
* `message` - *String* Message of the notification.

~~~ javascript
{
  id: 4,
  type: 'SendNotification',
  title: 'Hello world',
  message: '{value}',
}
~~~

### User Script

For those more unique actions, you can run any script you need. The special
`{value}` can be used to represent the current value being passed to the block.

Variables will be passed as environment variables, but this plugin cannot mutate
the state.

* `script` - *String* The shell command to run to return the results.

~~~ javascript
{
  id: 5,
  type: 'UserScript',
  script: 'ruby output.rb {value}',
}
~~~
