const routes = require('../routes/http');
const Autoloader = require('./autoloader');
const config = require('../config/app');
const Emitter = require('./http-emitter');
const Validator = require('./validator');
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const HttpAuth = require('../app/services/Auth/HttpAuth');
const UsersEntity = require("../app/entities/users.entity");

module.exports = class HttpRouter {

    constructor(ExpressRouter) {
        this.ExpressRouter = ExpressRouter;
        this.emitter = null;
        this.auth = null;
    }

    handle() {
        this.registerPassport();
        this.registerRoutes();
    }

    registerPassport() {
        let options = config.auth.jwt;

        options.jwtFromRequest = req => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies[config.auth.cookieAuthName];
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        };

        passport.use(
            new JwtStrategy(options, async (jwt_payload, done) => {
                if (jwt_payload.user_id) {
                    try {
                        let user = await UsersEntity.findById(jwt_payload.user_id);
                        if (user) {
                            return await done(null, user);
                        }
                    } catch (err) {
                        return await done(err, false);
                    }
                }
                return await done(new Error('Token mismatch.'), false);
            })
        );
    }

    registerRoutes() {
        for (let type in routes) {
            let list = routes[type];
            for (let url in list) {
                if (list.hasOwnProperty(url) !== true) {
                    continue;
                }
                let routesBlocks = list[url];
                for (let method in routesBlocks) {
                    if (routesBlocks.hasOwnProperty(method) !== true) {
                        continue;
                    }
                    this.createRoute(method, url, routesBlocks[method], type);
                }
            }
        }
    }

    authMiddleware(options, type) {
        return (req, res, next) => {
            this.emitter = new Emitter(req, res, next, type);
            this.auth = new HttpAuth(this.emitter);
            return this.auth.checkSession(options);
        }
    }

    createRoute(method, url, options, type) {
        this.ExpressRouter[method](url, this.authMiddleware(options, type), async (req, res) => {
            let input = method === 'get' ? req.query : req.body;
            let validation = this.validate(input, options)
            if (! validation.success) {
                this.emitter.errorRespondWithJson(422, null, validation.error);
                return;
            }

            let controllerClassName = options.controller;
            let controllerClass = Autoloader.loadController(controllerClassName);

            if (typeof controllerClass !== 'function') {
                this.emitter.errorRespondWithJson(404, null, `There is no controller ${controllerClassName}`);
                return;
            }

            let controller = new controllerClass(req, res, this.emitter, this.auth);

            if (! this.controllerMiddleware(controller)) {
                return false;
            }

            let action = options.action || config.default_action;

            if (typeof controller[action] !== 'function') {
                this.emitter.errorRespondWithJson(404, null, `There is no action ${controllerClassName}::${action}`);
                return;
            }

            try {
                await controller[action](req, res, input);
            } catch (e) {
                console.log(`Error on execute ${controllerClassName}::${action}: ${e}`);
            }
        });
    }

    controllerMiddleware(controller) {
        for (let index in controller.middleware) {
            if (controller.middleware.hasOwnProperty(index) !== true) {
                continue;
            }
            if (! controller.middleware[index]()) {
                return false;
            }
        }
        return true;
    }

    validate(data, options) {
        // If route has no options
        if (
            typeof options.parameters === 'undefined' ||
            Object.keys(options.parameters).length === 0
        ) {
            return {success: true, error: ''};
        }
        // Validate data
        let validator = new Validator();
        validator.run(data, options.parameters, '');
        // Check if we have errors in incoming data
        if (validator.getErrorsChunk().count() > 0) {
            return {success: false, error: validator.getErrorsChunk().first()};
        }
        return {success: true, error: ''};
    }

}