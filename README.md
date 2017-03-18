# android-cli


[![Build Status](https://api.travis-ci.org/endlessdev/android-cli.svg?branch=master)](https://travis-ci.org/endlessdev/android-cli)

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

