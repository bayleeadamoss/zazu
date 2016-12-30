---
layout: documentation
description: "Overview of what is all included in Zazu Themes"
icon: "fa-paint-brush"
title:  "Creating Themes"
---

* TOC
{:toc}

## Theme Overview

The compiled CSS gets included when Zazu is launched. Be sure to include a
`zazu.json` file in the root of your project with the following information:

~~~ javascript
{
  "name": "Light Theme",
  "stylesheet": "dist/main.css"
}
~~~~

### Fields

* `stylesheet` *string*: A relative path to the CSS to be used when displaying
  the Zazu window.

## Previewing your theme

A [theme
playbook](https://tinytacoteam.github.io/zazu-theme-playbook) exists so you can
preview your Zazu theme with a few of the basic cases.

Take a look at some of the other themes on the [packages](/packages/) page for
some inspiration.

## Using your theme

Just add your relative path to your GitHub repo inside of your [personal
configuration](/documentation/configuration/#theme).
