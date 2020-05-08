const SSHConfig = require('ssh-config');
const fs = require('fs');
const _ = require('lodash');
const settings = require('electron-settings');

class SSHConfigReader {
    constructor(config) {
        this.items = [];
        this.config = config;
        this.groupSeparator = settings.has('group-delimiter') ? settings.get('group-delimiter') : '__';
        this.categorySeparator = settings.has('category-delimiter') ? settings.get('category-delimiter') : '_';
        this.aliases = settings.has('aliases') ? settings.get('aliases') : {};
        this.ignoreList = [];
        this.beautify = settings.has('beautify') ? settings.get('beautify') : true;

        let ignores = settings.has('ignore-list') ? settings.get('ignore-list') : [];
        for (let i in ignores) {
            this.ignoreList.push(ignores[i].toLowerCase());
        }

        this._readConfig();
    }

    getItems() {
        return this.items;
    }

    _readConfig() {
        if (fs.existsSync(this.config)) {
            const confFile = fs.readFileSync(this.config, 'utf8');
            if (confFile) {
                const sysConfig = SSHConfig.parse(confFile.toString());
                for(var i in sysConfig) {
                    if (!sysConfig[i].value || sysConfig[i].value==='*' || 
                        this.ignoreList.includes(sysConfig[i].value.toLowerCase())) {
                        continue;
                    }
                    let sshItem = this._getItem(sysConfig[i].value);
                    this.items.push(sshItem);
                }
            }
        }
    }

    _getItem(hostName) {
        let name = hostName;
        let group = hostName;
        let category = "*";
        if (hostName.includes(this.groupSeparator)) {
            let arr = hostName.split(this.groupSeparator);
            if (arr.length>1) {
                group = arr[0];
                name = hostName.replace(group+this.groupSeparator,'');
                if (name.includes(this.categorySeparator)) {
                    let arr2 = name.split(this.categorySeparator);
                    if (arr2.length>1) {
                        category = arr2[0];
                        name = name.replace(arr2[0]+this.categorySeparator,'');
                    }
                }
            }
        }
        return {
            group: this._getBeautyName(group),
            category: this._getBeautyName(category),
            name: this._getBeautyName(name),
            hostName: hostName
        };
    }

    _getBeautyName(key) {
        if (_.has(this.aliases, key.toLowerCase())) {
            return this.aliases[key];
        }
        return this.beautify ? this._beautify(key) : key;
    }

    _beautify(str) {
        str = str.replace(/[_-]+/g, ' ');
        return str.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
    }
}

module.exports = SSHConfigReader;