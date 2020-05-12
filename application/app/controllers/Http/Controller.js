const BaseController = require('../Controller');

/**
 * Base controller
 * Here will be some presets
 * All controllers must be extended from this class
 */
module.exports = class Controller extends BaseController {

    constructor(req, res, emitter, auth) {
        super(req, res);

        this.emitter = emitter;
        this.auth = auth;
    }

}