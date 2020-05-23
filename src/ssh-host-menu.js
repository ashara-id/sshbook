const _ = require('lodash');
const spawn = require('cross-spawn');
const settings = require('electron-settings');
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

class SSHHostMenu {
    constructor(sshItems, homeDir) {
        this.template = [];
        this.sshItems = sshItems;
        this.openInTheSameWindow = settings.get('same-window');
        this.homeDir = homeDir;
        this._prepare();
    }

    getTemplate() {
        return this.template;
    }

    _prepare() {
        let _this = this;
        let grouped = _.groupBy(this.sshItems, 'group');
        let orderedGroup = {};
        Object.keys(grouped).sort().forEach(function(key) {
            orderedGroup[key] = grouped[key];
        });

        for (let [groupKey, groupItems] of Object.entries(orderedGroup)) {
            this.template.push({label: groupKey, enabled: false});

            let groupedGroupItems = _.groupBy(groupItems, 'category');
            let noCategoryItems = groupedGroupItems['*'];
            if (noCategoryItems && noCategoryItems.length>0) {
                let orderedNoCatItems = _.sortBy(noCategoryItems, ['name']);
                _.forEach(orderedNoCatItems, function(item) {
                    _this.template.push({
                        label: item.name,
                        click: function() {
                            _this._executeSSH('ssh ' + item.hostName);
                        }
                    });
                });
            }

            let categorized = _.pickBy(groupedGroupItems, function(value, key) {
                return key!=='*';
            });
            if (!_.isEmpty(categorized)) {
                let orderedCategorized = {};
                Object.keys(categorized).sort().forEach(function(key) {
                    orderedCategorized[key] = categorized[key];
                });
                for (let [categoryKey, categoryItems] of Object.entries(orderedCategorized)) {
                    let menuCategoryItems = [];
                    let orderedCatItems = _.sortBy(categoryItems, ['name']);
                    _.forEach(orderedCatItems, function(item) {
                        menuCategoryItems.push({
                            label: item.name,
                            click: function() {
                                _this._executeSSH('ssh ' + item.hostName);
                            }
                        });
                    });
                    this.template.push({label: categoryKey, submenu: menuCategoryItems});
                }
            }
            
            this.template.push({type: 'separator'});
        }
    }

    _executeSSH(command, options) {
        if (isMac) {
            let sameWinCommand = `
                if application "Terminal" is running then
                    tell application "Terminal"
                        if busy of window 1 then
                            do script "${command}"
                        else
                            do script "${command}" in window 1
                        end if
                        activate
                    end tell
                else
                    tell application "Terminal"
                        do script "${command}" in window 1
                        activate
                    end tell
                end if
            `;
            
            let newWinCommand = `
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

            let sshCommand = this.openInTheSameWindow ? sameWinCommand : newWinCommand;
            let result = spawn('osascript', ['-e', sshCommand]);
            result.on('close', code => {
                if (code!==0) {
                    console.log("Error:" + code);
                }
            });
            return;
        }
        console.log('Operating system not supported');
    }
}

module.exports = SSHHostMenu;