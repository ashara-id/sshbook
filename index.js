const electron = require('electron');
const path = require('path');
const os = require('os');
const _ = require('lodash');
const SSHConfigReader = require('./src/ssh-conf-reader');
const SSHHostMenu = require('./src/ssh-host-menu');

const {app, BrowserWindow, Tray, Menu} = electron;

const trayIcon = path.join(__dirname, 'assets/icons/sshbooktray.16x16.png');
const isWindows = process.platform === 'win32';

let tray;
let macShhUserConfig = path.join(os.homedir(), '.ssh/config');
let macShhSysConfig = '/etc/ssh/ssh_config';

app.on('ready', function(){
    app.dock.hide();
    createSystemtray();
});

function createSystemtray() {
    let systemtrayTempate = getSystemtrayTempate();
    const ctxMenu = Menu.buildFromTemplate(systemtrayTempate);
    tray = new Tray(trayIcon);
    tray.setContextMenu(ctxMenu);
    tray.setToolTip('SSH Book');
}

function getSystemtrayTempate() {
    let sysHosts = new SSHConfigReader(macShhSysConfig).getItems();
    let userHosts = new SSHConfigReader(macShhUserConfig).getItems();
    let sshItems = _.uniq(_.concat(sysHosts, userHosts));
    let sshMenus = new SSHHostMenu(sshItems, isWindows).getTemplate();

    let menus = [];
    //menus.push({role: 'about'});
    //menus.push({type: 'separator'});
    menus = _.concat(menus, sshMenus)
    menus.push({role: 'quit'});

    return menus;
}