const electron = require('electron');
const settings = require('electron-settings');

class Preferences {
    constructor() {
        if (!settings.has('group-delimiter')) settings.set('group-delimiter', '__');
        if (!settings.has('category-delimiter')) settings.set('category-delimiter', '_');
        if (!settings.has('aliases')) settings.set('aliases', {
            'dev': 'Development',
            'stg': 'Staging',
            'prod': 'Production'
        });
        if (!settings.has('ignore-list')) settings.set('ignore-list', []);
        if (!settings.has('beautify')) settings.set('beautify', true);
        if (!settings.has('same-window')) settings.set('same-window', false);
    }

    init() {
        const app = electron.remote.app;
        let $groupDelimiter = document.querySelector('#group-delimiter');
        let $categoryDelimiter = document.querySelector('#category-delimiter');
        let $aliases = document.querySelector('#aliases');
        let $ignoreList = document.querySelector('#ignore-list');
        let $beautify = document.querySelector('#beautify');
        let $sameWindow = document.querySelector('#same-window');
        let $save = document.querySelector('#save');

        $groupDelimiter.value = settings.get('group-delimiter');
        $categoryDelimiter.value = settings.get('category-delimiter');
        $aliases.value = this._prepareAliases(settings.get('aliases'));
        $ignoreList.value = settings.get('ignore-list').join(', ');
        if (settings.get('beautify')) {
            $beautify.checked = true;
        }
        if (settings.get('same-window')) {
            $sameWindow.checked = true;
        }

        let _this = this;
        $save.addEventListener('click', function() {
            settings.set('group-delimiter', $groupDelimiter.value);
            settings.set('category-delimiter', $categoryDelimiter.value);
            settings.set('aliases', _this._parseAliases($aliases.value));
            settings.set('ignore-list', _this._parseIgnoreList($ignoreList.value));
            settings.set('beautify', $beautify.checked);
            settings.set('same-window', $sameWindow.checked);
            
            app.relaunch();
            app.exit();
        })
    }

    _prepareAliases(aliases) {
        let stringAliases = '';
        for (let [key, value] of Object.entries(aliases)) {
            stringAliases += key + ', ' + value + '\n';
        }
        return stringAliases;
    }

    _parseAliases(stringAliases) {
        let aliases = {};
        if (!stringAliases || !stringAliases.trim()) return aliases;
        let arr = stringAliases.trim().split('\n');
        for (let i in arr) {
            if (!arr[i] || !arr[i].trim()) continue;
            let arr2 = arr[i].split(',');
            if (arr2.length===1 || !arr2[1] || !arr2[1].trim()) continue;
            aliases[arr2[0].toLowerCase()] = arr2[1].trim();
        }
        return aliases;
    }

    _parseIgnoreList(ignoreString) {
        let ignoreList = []
        if (!ignoreString || !ignoreString.trim()) return ignoreList;
        let arr = ignoreString.trim().split(/[,\n]/g);
        for (let i in arr) {
            if (!arr[i] || !arr[i].trim()) continue;
            ignoreList.push(arr[i].trim());
        }
        return ignoreList;
    }
}

module.exports = Preferences;