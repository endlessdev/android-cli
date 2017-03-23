# android-cli

<img alt="AndroidCLI" src="http://i.imgur.com/3wCVzej.png" width="400" />


[![Join Gitter chat][gitter-image]][gitter-url]
[![Build Status](https://api.travis-ci.org/endlessdev/android-cli.svg?branch=master?style=flat-square)](https://travis-ci.org/endlessdev/android-cli)
[![npm Version][npm-image]][npm-url]

CLI for android applications

## Usage
<pre>
android help
</pre>

### Options
<pre>
 -h, --help               output usage information
 -V, --version            output the version number
 -g, --generate [name]    component (e.g activity, fragment etc..)
 -p, --permission [name]  add uses-permission to manifest file(e.g INTERNET
 -adb [name]              control adb (required environment variable for ADB_PATH)
</pre>


#### Generating activity
<pre>
$android -g activity ACTIVITY_NAME
</pre>
**result**

>Successful generated activity [ACTIVITY_NAME]Activity.java!
>Successful generated activity layout file activity_[ACTIVITY_NAME].xml!

#### Generating fragment
<pre>
$android -g fragment FRAGMENT_NAME
</pre>
**result**

>Successful generated activity [FRAGMENT_NAME]Fragment.java!
>Successful generated activity layout file fragment_[FRAGMENT_NAME].xml!

## Milestone

- [x] Get packages at java src path by work module
- [ ] Parse AndroidManifest.xml and for add permission
- [ ] Connect travis.ci to stick green passing image-!
- [ ] Deploy this project to NPM (Node Package Manager)

[npm-url]: https://npmjs.org/package/android-cli
[npm-image]: https://img.shields.io/npm/v/android-cli.svg?style=flat-square
[gitter-image]: https://img.shields.io/gitter/room/android-cli/android-cli.svg?style=flat-square
[gitter-url]: https://gitter.im/endlessdev/android-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge?style=flat-square