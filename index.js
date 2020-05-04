const electron = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const SSHConfig = require('ssh-config');
const spawn = require('cross-spawn');

const {app, BrowserWindow, Tray, Menu, MenuItem} = electron;

const trayIcon = path.join(__dirname, 'assets/sshbooktray.16x16.png');
const isMac = process.platform === 'darwin';

let trayMenus = [];
let tray;
let macShhDefaultConfig = '/.ssh/config';

app.on('ready', function(){
    app.dock.hide();
    prepareTray();
});

var prepareTray = function() {
    createTrayMenus();
    const ctxMenu = Menu.buildFromTemplate(trayMenus);
    tray = new Tray(trayIcon);
    tray.setContextMenu(ctxMenu);
    tray.setToolTip('SSH Book');
};

var createTrayMenus = function() {
    var sshItems = parseSshConfigFile();
    const ordered = {};
    Object.keys(sshItems).sort().forEach(function(key) {
        ordered[key] = sshItems[key];
    });
    for (let [key, subItems] of Object.entries(ordered)) {
        if (key==='*') continue;
        let submenus = [];
        for (let i in subItems.sort((a, b) => (a.name > b.name) ? 1 : -1)) {
            let subItem = subItems[i];
            submenus.push({
                label: subItem.name,
                click: function() {
                    openTerminal('ssh ' + subItem.command);
                }
            });
        }
        trayMenus.push({type: 'separator'});
        trayMenus.push({label: key, submenu: submenus});
    }
    trayMenus.push({type: 'separator'});
    trayMenus.push({label: 'Quit', click: function(){
        app.quit();
    }});
};

var parseSshConfigFile = function() {
    let sshConfigFile = os.homedir() + macShhDefaultConfig;
    const file = fs.readFileSync(sshConfigFile, 'utf8');
    const fileContent = file.toString();
    const config = SSHConfig.parse(fileContent);
    
    let groups = {};
    for(var i in config) {
        let sshItem = getSshItem(config[i].value);
        if (typeof groups[sshItem.key]==='undefined') groups[sshItem.key] = [];
        groups[sshItem.key].push(sshItem);
    }
    return groups;
}

var getSshItem = function(command) {
    let name = command;
    let key = command;
    if (command.includes('__')) {
        let arr = name.split('__');
        if (arr.length>1) {
            key = arr[0];
            name = arr[1];
        }
    }
    return {key: key, name: name, command: command};
}

var openTerminal = function(command, options) {
    if (isMac) {
        let completeCommand = `
        tell application "Terminal"
            activate
            do script "${command}"
        end tell
        `;
      return spawn('osascript', ['-e', completeCommand]);
    }
    console.log('Operating system not supported');
}