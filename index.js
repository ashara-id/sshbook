const electron = require('electron');
const path = require('path');
const os = require('os');
const _ = require('lodash');
const SSHConfigReader = require('./src/ssh-conf-reader');
const SSHHostMenu = require('./src/ssh-host-menu');
const Preferences = require('./src/preferences');

const {app, BrowserWindow, Tray, Menu} = electron;

const trayIcon = path.join(__dirname, 'assets/icons/sshbooktray.png');
const taskbarIcon = path.join(__dirname, 'assets/icons/sshbook.png');
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
//const isWindows = process.platform === 'win32';
const homedir = app.getPath('home');

let tray;
let macShhUserConfig = path.join(os.homedir(), '.ssh/config');
let macShhSysConfig = '/etc/ssh/ssh_config';
let wins = {};

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    console.info('Another ' + app.name + ' instance is currently running');
    app.quit();
} else {
    app.allowRendererProcessReuse = true;

    app.on('ready', function() {
        if (!_isDev() && isMac) app.dock.hide();
        new Preferences(); // Set the default user preferences
        _createSystemtray();
    });

    app.on('window-all-closed', function() {
        // Do nothing
    });
}

_createSystemtray = () => {
    let systemtrayTempate = _getSystemtrayTempate();
    const ctxMenu = Menu.buildFromTemplate(systemtrayTempate);
    tray = new Tray(trayIcon);
    tray.setContextMenu(ctxMenu);
    tray.setToolTip(app.name);
}

_getSystemtrayTempate = () => {
    let sysHosts = new SSHConfigReader(macShhSysConfig).getItems();
    let userHosts = new SSHConfigReader(macShhUserConfig).getItems();
    let sshItems = _.uniq(_.concat(sysHosts, userHosts));
    let sshMenus = new SSHHostMenu(sshItems, homedir).getTemplate();

    let menus = [];
    menus.push({label: 'About ' + app.name, click: function() {
        _openWindow({
            id: 'about',
            html: "src/about.html",
            title: 'About ' + app.name,
            width: 300,
            height: 175,
            useContentSize: true,
            center: true,
            backgroundColor: '#ececec'
        }, true);
    }});
    menus.push({label: 'Preferences...', click: function() {
        _openWindow({
            id: 'preferences',
            html: "src/preferences.html",
            title: 'Preferences',
            backgroundColor: '#ececec'
        }, true);
    }});
    menus.push({type: 'separator'});
    menus = _.concat(menus, sshMenus)
    menus.push({role: 'quit'});

    return menus;
}

_openWindow = (options, withoutMenu) => {
    let win = wins[options.id];
    if (typeof win!=='undefined' && win) {
        win.show();
        return;
    }
    let resizable = _isDev();
    let winOption = {
        icon: taskbarIcon,
        show: false,
        minimizable: false,
        fullscreenable: false,
        maximizable: false,
        resizable: resizable,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: withoutMenu
    };
    for (let [key, value] of Object.entries(options)) {
        winOption[key] = value;
    }
    win = new BrowserWindow(winOption);
    win.loadURL(path.join('file://', __dirname, options.html));
    if (withoutMenu) {
        win.setMenu(null);
        win.removeMenu();
        win.setMenuBarVisibility(false);
    }

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        wins[options.id] = null;
    });

    wins[options.id] = win;
}

_isDev = () => {
    return process.argv && process.argv.length > 1 && process.argv[2] === '--dev'
}