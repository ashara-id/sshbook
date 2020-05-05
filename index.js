const electron = require('electron');
const path = require('path');
const os = require('os');
const _ = require('lodash');
const SSHConfigReader = require('./src/ssh-conf-reader');
const SSHHostMenu = require('./src/ssh-host-menu');
const Preferences = require('./src/preferences');

const {app, BrowserWindow, Tray, Menu} = electron;

const trayIcon = path.join(__dirname, 'assets/icons/sshbooktray.16x16.png');
const isWindows = process.platform === 'win32';

let tray;
let macShhUserConfig = path.join(os.homedir(), '.ssh/config');
let macShhSysConfig = '/etc/ssh/ssh_config';
let preferenceWin;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('ready', function(){
        app.dock.hide();
        new Preferences(); // Set the default user preference
        _createSystemtray();
    });

    app.on('window-all-closed', function () {
        // Do nothing
    });
}

_createSystemtray = () => {
    let systemtrayTempate = _getSystemtrayTempate();
    const ctxMenu = Menu.buildFromTemplate(systemtrayTempate);
    tray = new Tray(trayIcon);
    tray.setContextMenu(ctxMenu);
    tray.setToolTip('SSH Book');
}

_getSystemtrayTempate = () => {
    let sysHosts = new SSHConfigReader(macShhSysConfig).getItems();
    let userHosts = new SSHConfigReader(macShhUserConfig).getItems();
    let sshItems = _.uniq(_.concat(sysHosts, userHosts));
    let sshMenus = new SSHHostMenu(sshItems, isWindows).getTemplate();

    let menus = [];
    menus.push({label: 'SSH Book', enabled: false});
    //menus.push({role: 'about'});
    menus.push({label: 'Preferences...', click: function() {
        _openPopupWindow("src/preferences.html")
    }});
    menus.push({type: 'separator'});
    menus = _.concat(menus, sshMenus)
    menus.push({role: 'quit'});

    return menus;
}

_openPopupWindow = (html) => {
    if (preferenceWin) {
        preferenceWin.show();
        return;
    }
    preferenceWin = new BrowserWindow({
        show: false,
        minimizable: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    preferenceWin.loadURL(path.join('file://', __dirname, html));

    preferenceWin.once('ready-to-show', () => {
        preferenceWin.show()
    });

    preferenceWin.on('closed', () => {
        preferenceWin = null;
    });
}