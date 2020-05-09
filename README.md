# SSH Book
The lightweight SSH bookmarks app. Help you remember your SSH configs.
* Owner: ashara.id
* Contact: marjan@ashara.id
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
* Default group delimiter is double underscore (`__`)
* Default category delimiter is single underscore (`_`)
* Alias uses comma separator format and use line break for each alias items. Sample of alias: "`dev, Development`", where `dev` is the name and `Development` is the replacement.
* Default aliases:
    * `dev` will be translated to `Development`
    * `stg` will be translated to `Staging`
    * `prod` will be translated to `Production`
* Igone list supports full host name and prefix. Uses line break or comma for each items.
    * Given `client_x_old`, ignore host with name `client_x_old`
    * Given `client1_*`, ignore hosts that starts with `client1_`

## App Support & Download
* Download executable file at download page
* Supported platforms: macOS
* Supported languages: English

## Development Setup
### Requirements
* Node.js 8.16.0
* npm 6.4.1

### Run & Build
* Run project: `npm start`
* Create macOS distribution package: `npm run build-osx`

## Todo
* Linux support
* First release
* Windows support
* Download page
* Auto update
* Crash reporting
* Remake preferences window
* Custom order with alias numbering
* SSH config editor

## Known Issues
Nah
