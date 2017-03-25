# android-cli

<img alt="AndroidCLI" src="http://i.imgur.com/3wCVzej.png" width="400" />


[![Join Gitter chat][gitter-image]][gitter-url]
[![Build Status](https://api.travis-ci.org/endlessdev/android-cli.svg?branch=master&style=flat-square)](https://travis-ci.org/endlessdev/android-cli)
[![npm Version][npm-image]][npm-url]

CLI for android applications

## Usage
<pre>
$acli --help
</pre>

### Options
<pre>
-h, --help                     output usage information
-V, --version                  output the version number
-g, --generate [name]          generate component (e.g activity, fragment etc..)
-p, --permission <permission>  add uses-permission to manifest file(e.g INTERNET)
-d, --dependency <dependency>  add dependency to build.gradle and sync gradle
</pre>

## Generate

Generate component (e.g activity, fragment etc..)

You can find all possible blueprints in the table below

Scaffold  | Usage
---       | ---
Activity | `acli -g activity my-new-activity`
Fragment | `acli -g fragment my-new-fragment`
LoginActivity    | `acli -g login-acitivty my-new-login-activity`
TabbedActivity    | `acli -g tabbed-acitivty my-tabbed-activity`

### Result Example

>Successful generated activity [ACTIVITY_NAME]Activity.java!<br>
>Successful generated activity layout file activity_[ACTIVITY_NAME].xml!


## Permission
add uses-permission to manifest file(e.g INTERNET)

Permission  | Usage
---       | ---
INTERNET | `acli -p INTERNET`

### Result Example

> Successful adding permission

## Dependency
add dependency to build.gradle and sync gradle

<pre>
$acli -d "com.android.support:cardview-v7:+"
</pre>

### Result Example

> Successful adding Dependency <br>
> Syncing gradle.. <run ./gradlew build>


## Milestone

Milestone of this project

- [x] Get packages at java src path by work module
- [x] Parse AndroidManifest.xml and for add permission
- [ ] Connect travis.ci to stick green passing image-!
- [x] Deploy this project to NPM (Node Package Manager)

[npm-url]: https://npmjs.org/package/android-cli
[npm-image]: https://img.shields.io/npm/v/android-cli.svg?style=flat-square
[gitter-image]: https://img.shields.io/gitter/room/android-cli/android-cli.svg?style=flat-square
[gitter-url]: https://gitter.im/endlessdev/android-cli?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge?style=flat-square
