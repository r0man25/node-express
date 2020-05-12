const {errors} = require('../config/static');
const env = require('dotenv').config();
const { auth: authConfig } = require('../config/app')

const successStatus = 200;

/**
 * Class HttpEmitter.
 * Can send response to users that connected to NodeJS
 */
module.exports = class HttpEmitter {

    /**
     * Constructor of the Emitter class
     */
    constructor(req, res, next, type) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.routeType = type;
        this.auth = null;
        this.flash_data = null;
        this.share = null;
        this.res.setHeader('Last-Modified', (new Date()).toUTCString());
        this._removeFlashData();
        this.loginRoute = '/login';
    }

    /**
     * Send error response back to connection
     */
    errorRespondWithJson(code, data = null, statusText = '') {
        if (typeof data === 'string') {
            data = {
                message: data,
            };
        } else if(!data) {
            data = {};
        }
        data.success = false;
        data.error = {
            code,
            message: statusText || errors[code] || 'Unknown status',
        };
        // data.query = this.ctx.query;
        // data.parameters = this.ctx.request.body;
        this.answer(data);
    }

    /**
     * Send success response back to connection
     */
    successRespondWithJson(data = null, statusText = '') {
        if (typeof data === 'string') {
            data = {
                message: data,
            };
        } else if(!data) {
            data = {};
        }
        data.success = true;
        data.error = {
            code: successStatus,
            message: statusText || errors[successStatus] || 'Unknown status',
        };
        this.answer(data);
    }

    /**
     * Send success response back to connection
     */
    successRespondWithView(template, data = {}) {
        if (typeof data === 'string') {
            data = {
                message: data,
            };
        }

        this.view(template, data);
    }

    /**
     * Send answer back to connection
     */
    answer(data) {
        this.res.json(data);
    }

    /**
     * Send view back to connection
     */
    view(template, data) {
        this.res.render(template, {
            auth: this.auth,
            config: env.parsed,
            csrfToken: this.req.csrfToken(),
            data: {...data, ...this.share}
        });
    }

    isApi() {
        return this.routeType === 'api';
    }

    isWeb() {
        return this.routeType === 'web';
    }

    unauthorized() {
        if (this.isWeb()) {
            return this.res.redirect(this.loginRoute);
        }
        if (this.isApi()) {
            return this.errorRespondWithJson(401);
        }

        return this.res.status(401).send('Unauthorized');
    }

    flash(data) {
        if (this.req.session) {
            this.req.session.flash = data;
        }
    }

    _removeFlashData() {
        if (this.req.session && this.req.session.flash) {
            this.flash_data = this.req.session.flash;
            delete this.req.session.flash;
        }
    }

}