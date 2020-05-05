const SSHConfig = require('ssh-config');
const fs = require('fs');

class SSHConfigReader {
    constructor(config, groupSeparator, categorySeparator) {
        this.items = [];
        this.config = config;
        this.groupSeparator = groupSeparator ? groupSeparator : '__';
        this.categorySeparator = categorySeparator ? categorySeparator : '_';
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
                    if (!sysConfig[i].value || sysConfig[i].value==='*') continue;
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
            group: group,
            category: category,
            name: name,
            hostName: hostName
        };
    }
}

module.exports = SSHConfigReader;