# SSH Book
The SSH bookmarks app. Lightweight systemtray application for quick access to the SSH configuration files. Help you remember the SSH configurations.
* Owner: ashara.id
* Contact: marjan@ashara.id
* Version: 1.0.0

## Features
* Read and create bookmarks from user’s SSH config file (`~/.ssh/config`)
* Read and create bookmarks from system-wide SSH config file (`/etc/ssh/ssh_config`)
* Access systemtray menu to launch shell and execute SSH command
* Grouping support:
    * Default group separator is double underscore (`__`) and default category separator is single underscore (`_`)
    * Group and category details: First part of hostname is group and second part is category, the rest is the systemtray submenu name
* Use custom separator
* Beautify the names
* Words alias to translate the names
* Ignore host names

## Preferences
* Default hostname format: `client__dev_web`, which is `client ` as the group name, `dev` as the category name, and the rest is the item name
* Alternative hostname format without category: `client__cms`, which is `client ` as the group name and `cms` as the item name
* Default group delimiter is double underscore (`__`)
* Default category delimiter is single underscore (`_`)
* Default aliases:
    * `dev` will be translated to `Development`
    * `stg` will be translated to `Staging`
    * `prod` will be translated to `Production`
* Global host (`*`) is always ignored

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
* About software
* Remake preferences window
* First release
* Download page
* Linux support
* Windows support
* Ignore hostname by prefix
* SSH config locations with button to open the file

## Known Issues
Nah
