/**
 * Base controller
 * Here will be some presets
 * All controllers must be extended from this class
 */
module.exports = class Controller {
    /**
     * Class constructor
     */
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.middleware = [];
    }
}