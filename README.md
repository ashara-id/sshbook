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
* Option to use custom separator
* Option to beautify name
* Words alias
* Ignore host names

## Preferences
* Default hostname format: `client__dev_web`
* Default group delimiter is double underscore "__"
* Default category delimiter is single underscore "_"
* Aliases:
    * dev = Development
    * stg = Staging
    * prod = Production
* Always ignored: *

## Todo
* Preferences window style
* SSH config locations with button to open the file
* About software
* Remake icon

## Known Issues
* Nah
