# SSH Book
The SSH bookmarks app. Lightweight systemtray application for quick access to the SSH configuration files. Never forget your SSH config again.
* Owner: ashara.id
* Version: 1.0.0

## Setup
### Requirements
* Node.js 8.16.0
* npm 6.4.1

## Features
* Read user’s SSH config file
* Access menu to launch shell with SSH command

## Todo
* Read system-wine SSH config file
* Group and environment. Use the current group as title and second part as environment
* Group and environment aliases
* About software
* Icon
* Item aliases
* Preferences
    * Option to beautify name
    * Option to use custom separator (underscore, dash)
    * SSH config locations with button to open the file
* Ignore list

## Known Issues
* Duplicate shell for first lauch. Possible solution: Check shell status and use the first window if there is no open shell detected.
