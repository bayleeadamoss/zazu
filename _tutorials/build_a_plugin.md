---
layout: sidebar-page
title: How to Build a Plugin
---

* TOC
{:toc}

## What is a plugin?

A plugin is a script that integrates with Zazu and leverages the [blocks](http://zazuapp.org/documentation/blocks/)
to provide functionality to the user via the Zazu interface.

## Getting started

The first thing you want to do is create a `.zazu.js` in the root of your
project. This file tells Zazu how to use your project. It contains information
about the author, and entry points to the plugin.

A complete example might look like:

~~~ javascript
module.exports = {
  name: 'Calculator',
  author: 'Tiny Taco Team',
  description: 'Calculate stuff.',
  icon: 'icon.png',
  homepage: 'https://github.com/tinytacoteam/calculator',
  git: 'git@github.com:tinytacoteam/calculator.git',
  install: 'npm install',
  blocks: {
    input: [
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
      },
    ],
    output: [
      {
        id: 2,
        type: 'CopyToClipboard',
      },
    ],
  },
}
~~~~

To break this up, let's start with the meta information:

~~~ javascript
module.exports = {
  name: 'Calculator',
  author: 'Tiny Taco Team',
  description: 'Calculate stuff.',
  icon: 'icon.png',
  homepage: 'https://github.com/tinytacoteam/calculator',
  git: 'git@github.com:tinytacoteam/calculator.git',
  install: 'npm install',
  // Rest of plugin
}
~~~~

In this example we have information about who created the plugin and ways to
discover the repo and the website. There is also an `install` step that gets
executed after your plugin is downloaded.


We might also want to describe the [blocks](/documentation/blocks/) that make up
the plugin.

~~~ javascript
module.exports = {
  // rest of plugin
  blocks: {
    input: [
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
    ]
  }
}
~~~~

This input block is listed as a [Root Script](/documentation/blocks/#root-script)
block, which allows you to accept any input without any prefixes. This is great
for a calculator, so they only have to enter the equation into Zazu.

You can see we give the block an `id`. This is so we can reference it later in
the plugin. If you don't give it any `id`, a unique `id` will be provided for
it.

The next section `respondsTo` is unique to the block type. Since there is no
prefix, we give you the option of limiting the numbers of requests to your
plugin. On a given session a user could send lots of requests, as they keep
typing. Here you can provide a criteria for if you want to see the request at
all.

Once the plugin has decided you want to proceed to your real plugin, it uses
it's plugin specific `script` to start your script up. You can see we are going
to be using a [node](https://nodejs.org/) script, but you can use any language
you like. I'm also using a special `{query}` which will be interpolated with the
query the user has typed.

Lastly we have another item in the object called `connections`, this array
contains the block ids that will get executed after the user has clicked on one
of the results your plugin has provided.

~~~ javascript
module.exports = {
  // rest of plugin
  blocks: {
    output: [
      {
        id: 2,
        type: 'CopyToClipboard',
      },
    ],
  }
}
~~~~

The last block is a much simpler block. This output block takes input and copies
it to the clipboard. It contains an `id` since we reference it earlier in the
Root Script block earlier in the tutorial.
