# SSH Book
The lightweight SSH bookmarks app. Help you remember your SSH configs.
* Owner: ashara.id
* Contact: support@ashara.id
* Version: 1.0.0

## Features
* Read and create bookmarks from user’s SSH config file (`~/.ssh/config`)
* Read and create bookmarks from system-wide SSH config file (`/etc/ssh/ssh_config`)
* Access systemtray menu to launch shell and execute SSH command
* Group and category support
* Use custom separator
* Ignore host names
* Global host (`*`) is always ignored
* Option to beautify the names
* Words alias to translate the names

## Preferences
* Default hostname format: `client__dev_web`, which is `client ` as the group name, `dev` as the category name, and the rest is the item name
* Alternative hostname format without category: `client__cms`, which is `client ` as the group name and `cms` as the item name
* Default group separator is double underscore (`__`)
* Default category separator is single underscore (`_`)
* Alias uses comma separator format and use line break for each alias items. Sample of alias: "`dev, Development`", where `dev` is the name and `Development` is the replacement.
* Default aliases:
    * `dev` will be translated to `Development`
    * `stg` will be translated to `Staging`
    * `prod` will be translated to `Production`
* Igone list supports full host name and prefix. Uses line break or comma for each items.
    * Given `client_x_old`, ignore host with name `client_x_old`
    * Given `client1_*`, ignore hosts that starts with `client1_`

## Supported Operating Systems
* macOS Catalina, tested on version 10.15.4

## How To Use
### macOS
* Download the "SSH Book-darwin-x64.zip" and extract the contents
* Move the "SSH Book.app" to the Applications
* Open the "SSH Book.app"

## Development Setup
### Requirements
* Node.js v14.2.0
* npm 6.14.4

### Run & Build
* Run project: `npm start`
* Create macOS distribution package: `npm run build-osx`

## Todo
* First release
* Linux support
* Windows support
* Installer
* Auto update
* Crash reporting
* Remake preferences window
* Ordering with alias number
* SSH config editor
