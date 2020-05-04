const electron = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const SSHConfig = require('ssh-config');
const spawn = require('cross-spawn');
const _ = require('lodash');

const {app, BrowserWindow, Tray, Menu, MenuItem} = electron;

const trayIcon = path.join(__dirname, 'assets/sshbooktray.16x16.png');
const isWindows = process.platform === 'win32';

let trayMenus = [];
let tray;
let macShhUserConfig = '/.ssh/config';
let macShhSysConfig = '/etc/ssh/ssh_config';

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
    let sshItems = parseSshConfigFile();
    let grouped = _.groupBy(sshItems, 'group');
    let orderedGroup = {};
    Object.keys(grouped).sort().forEach(function(key) {
        orderedGroup[key] = grouped[key];
    });

    for (let [groupKey, groupItems] of Object.entries(orderedGroup)) {
        trayMenus.push({label: groupKey, enabled: false});
        let groupedGroupItems = _.groupBy(groupItems, 'category');

        let noCategoryItems = groupedGroupItems['*'];
        if (noCategoryItems && noCategoryItems.length>0) {
            let orderedNoCatItems = _.sortBy(noCategoryItems, ['name']);
            _.forEach(orderedNoCatItems, function(item) {
                trayMenus.push({
                    label: item.name,
                    click: function() {
                        executeSshCommand('ssh ' + item.hostName);
                    }
                });
            });
        }

        var categorized = _.pickBy(groupedGroupItems, function(value, key) {
            return key!=='*';
        });
        if (!_.isEmpty(categorized)) {
            let orderedCategorized = {};
            Object.keys(categorized).sort().forEach(function(key) {
                orderedCategorized[key] = categorized[key];
            });
            for (let [categoryKey, categoryItems] of Object.entries(orderedCategorized)) {
                var menuCategoryItems = [];
                let orderedCatItems = _.sortBy(categoryItems, ['name']);
                _.forEach(orderedCatItems, function(item) {
                    menuCategoryItems.push({
                        label: item.name,
                        click: function() {
                            executeSshCommand('ssh ' + item.hostName);
                        }
                    });
                });
                trayMenus.push({label: categoryKey, submenu: menuCategoryItems});
            }
        }
        
        trayMenus.push({type: 'separator'});
    }
    
    trayMenus.push({type: 'separator'});
    //trayMenus.push({role: 'about'});
    trayMenus.push({role: 'quit'});
};

var parseSshConfigFile = function() {
    let items = [];

    const sysFile = fs.readFileSync(macShhSysConfig, 'utf8');
    if (sysFile) {
        const sysConfig = SSHConfig.parse(sysFile.toString());
        for(var i in sysConfig) {
            if (!sysConfig[i].value || sysConfig[i].value==='*') continue;
            let sshItem = getSshItem(sysConfig[i].value, "__", "_");
            items.push(sshItem);
        }
    }

    let sshConfigFile = os.homedir() + macShhUserConfig;
    const userFile = fs.readFileSync(sshConfigFile, 'utf8');
    if (userFile) {
        const userConfig = SSHConfig.parse(userFile.toString());
        for(var i in userConfig) {
            if (!userConfig[i].value || userConfig[i].value==='*') continue;
            let sshItem = getSshItem(userConfig[i].value, "__", "_");
            items.push(sshItem);
        }
    }
    
    return _.uniq(items);
}

var getSshItem = function(hostName, groupSeparator, categorySeparator) {
    let name = hostName;
    let group = hostName;
    let category = "*";
    if (hostName.includes(groupSeparator)) {
        let arr = hostName.split(groupSeparator);
        if (arr.length>1) {
            group = arr[0];
            name = hostName.replace(group+groupSeparator,'');
            if (name.includes(categorySeparator)) {
                let arr2 = name.split(categorySeparator);
                if (arr2.length>1) {
                    category = arr2[0];
                    name = name.replace(arr2[0]+categorySeparator,'');
                }
            }
        }
    }
    return {group: group, category: category, name: name, hostName: hostName};
}

var executeSshCommand = function(command, options) {
    if (!isWindows) {
        let completeCommand = `
        if application "Terminal" is running then
            tell application "Terminal"
                do script "${command}"
                activate
            end tell
        else
            tell application "Terminal"
                do script "${command}" in window 1
                activate
            end tell
        end if
        `;
      return spawn('osascript', ['-e', completeCommand]);
    }
    console.log('Operating system not supported');
}