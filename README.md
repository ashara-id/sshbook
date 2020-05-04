# SSH Book
The SSH bookmarks app. Lightweight systemtray application for quick access to the SSH configuration files. Never forget your SSH config again.
* Owner: ashara.id
* Version: 1.0.0

## Setup
### Requirements
* Node.js 8.16.0
* npm 6.4.1

### Run & Build
* Run project: `npm start`
* Create distribution package: `npm run build-osx`

## Features
* Read and create bookmarks from user’s SSH config file (~/.ssh/config)
* Read and create bookmarks from system-wide SSH config file (/etc/ssh/ssh_config)
* Access systemtray menu to launch shell and execute SSH command
* Default group separator is "__" and default category separator is "_"
* Group and category details: First part of hostname is group and second part is category, the rest is the systemtray submenu name

## Todo
* Preferences
    * Option to beautify name
    * Option to use custom separator
    * SSH config locations with button to open the file
* Group and category aliases
* Refactore project structure
* About software
* Remake icon
* Ignore list

## Known Issues
* Nah
