const electron = require('electron');

class About {
    constructor() {
        this.copyright = '&copy;ashara.id';
    }

    init() {
        const app = electron.remote.app;
        let $name = document.querySelector('#about-name');
        let $version = document.querySelector('#about-version');
        let $copyright = document.querySelector('#about-copyright');

        $name.innerHTML = app.name;
        $version.innerHTML = app.getVersion();
        $copyright.innerHTML = this.copyright;
    }
}

module.exports = About;