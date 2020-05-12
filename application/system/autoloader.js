const config = require('../config/app');
const fs = require('fs');

/**
 * Autoloader class.
 * Load files only once, a-la singleton
 */
class Autoloader {

    static map;

    /**
     * Method require controller file only once and mapped it.
     */
    static loadController(controllerName) {
        let controllerPath = `${config.root_dir}app/controllers/${controllerName}.js`;
        if (this.map[controllerName] !== undefined) {
            return this.map[controllerName];
        } else if (fs.existsSync(controllerPath) === true) {
            return this.map[controllerName] = require(controllerPath);
        }
        return null;
    }

}

/**
 * Map of controllers
 * @type {{}}
 */
Autoloader.map = {};

module.exports = Autoloader;