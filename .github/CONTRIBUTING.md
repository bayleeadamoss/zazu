## Getting Involved

### What's being worked on now

The core team tracks what is currently being worked on on the [Zazu Project
Board][Zazu Project Board].

### Zazu Core

You can also look through currently open issues in Zazu Core. Often, the ones
not being worked on are marked with a [help wanted][help wanted tag]. tag.

### Plugins

Plugin development is also a great way to get involved. Zazu needs plugin to do
anything useful for a user. If you create one, start the repo name with `zazu-`
and feel free to submit it to the plugin directory once you get it working! If
you need help getting started there is documentation on [creating a
plugin][plugin page].

## Community

You can find the community and core developers on [Gitter Chat][Gitter Chat].

## Core Team Guidelines

If you're part of Zazu's core team there are a few guidelines for you as well.

When starting work, please update the [Roadmap][Roadmap] with your current task.
When you create a pull request, add a reviewer who is also on the core team. Add
a label for which [semver][semver] number needs to be bumped, for example `major
version`, `minor version` or `patch version`.

If you get added as a reviewer and you don't have time to get to it in the next
day or two, feel free to comment or re-assign the ticket, things come up, we
understand! [:

If there is no reviewer on a pull request, from a non-core member for example,
assign it to yourself and take it from there.

When making a review:

* Verify semver label
* Look at the code
* Run code/docs locally

Once approved of the change:

* Merge the pull request
* Publish the documentation if necessary (eg `npm run docs:publish`)

[semver]: http://semver.org/
[Roadmap]: https://github.com/tinytacoteam/zazu/projects/3
[help wanted tag]: https://github.com/tinytacoteam/zazu/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22
[plugin page]: http://zazuapp.org/documentation/plugins/
[Gitter Chat]: https://gitter.im/tinytacoteam/zazu
