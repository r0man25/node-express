const passport = require("passport");
const jwt = require('jsonwebtoken');
const { auth: authConfig } = require('../../../config/app');
const Crypto = require('../../../helpers/crypto');
const UsersEntity = require('../../entities/users.entity');

/**
 * Authorization class
 * Through this middleware we check user for access
 */
module.exports = class HttpAuth {

    /**
     * Class constructor
     */
    constructor(emitter) {
        this.emitter = emitter;
        this.session = null;
        this.emitter.auth = this;
    }

    checkSession(options) {
        return passport.authenticate('jwt', {session: false}, async (err, user, info) => {
                if (err || !user) {
                    let rememberCookie = this.getRememberCookieFromRequest();
                    if (rememberCookie) {
                        let rememberUser = await this.loginViaRemember(rememberCookie);
                        if (rememberUser) {
                            return this.setSession(rememberUser);
                        }
                    }

                    if (!options.auth) {
                        return this.setSession(user);
                    }

                    let error = err || info;
                    console.error('Error on jwt authenticate: ', error.message);
                    return this.emitter.unauthorized();
                }

                return this.setSession(user);
            }
        )(this.emitter.req, this.emitter.res, this.emitter.next);
    }

    setSession(user = null) {
        if (user) {
            this.authenticate(user);
        }
        this.emitter.next();
    }

    authenticate(user) {
        this.emitter.req.user = user;
        this.session = user;
        this.session.token = passport._strategies.jwt._jwtFromRequest(this.emitter.req);
        this.emitter.auth = this;
    }

    clearSession() {
        this.emitter.req.user = null;
        this.session = null;
        this.emitter.auth = null;
    }

    createToken(user_id) {
        return jwt.sign({user_id}, authConfig.jwt.secretOrKey, {expiresIn: authConfig.expiresIn});
    }

    getRememberCookieFromRequest() {
        if (this.emitter.req && this.emitter.req.cookies) {
            return this.emitter.req.cookies[authConfig.cookieRememberName];
        }
        return null;
    }

    attempt(user, remember = false) {
        this.emitter.res.cookie(authConfig.cookieAuthName, this.createToken(user._id), {
            httpOnly: true,
            expires: new Date(Date.now() + authConfig.expiresIn * 1000)
        });
        if (remember) {
            this.rememberMe(user);
        }
        return true;
    }

    async loginViaRemember(rememberCookie) {
        let [userId,token] = Crypto.decrypt(rememberCookie).split('|');
        let user = await UsersEntity.findById(userId);

        if (user && user.remember_token === token) {
            return this.attempt(user) ? user : null;
        }

        return false;
    }

    rememberMe(user) {
        this.emitter.res.cookie(
            authConfig.cookieRememberName,
            Crypto.encrypt(`${user._id}|${this.generateNewRememberToken(user)}`),
            {
                httpOnly: true,
                expires: new Date(Date.now() + authConfig.rememberExpireIn)
            }
        );
    }

    logout() {
        //TODO: if api, we need to create a black list of jwt token
        try {
            this.generateNewRememberToken(this.session);
            this.clearAuthCookie();
            this.clearSession();
            return true;
        } catch (e) {
            console.error('Error on logout: ', e.message);
        }
        return false;
    }

    generateNewRememberToken(user) {
        let token = this._generateRandom();
        UsersEntity.update(user._id, {data: {remember_token: token}})
            .catch(reason => console.log('Error on update user remember token:', reason.message));
        return token;
    }

    clearAuthCookie() {
        this.emitter.res.clearCookie(authConfig.cookieAuthName);
        this.emitter.res.clearCookie(authConfig.cookieRememberName);
    }

    guest() {
        return this.session === null;
    }

    check() {
        return this.guest() === false;
    }

    userId() {
        return this.session._id;
    }

    token() {
        return this.session ? this.session.token : null;
    }

    _generateRandom() {
        return new Date().getTime() + Crypto.crypto.randomBytes(20).toString('hex');
    }

    getFullName() {
        return `${this.session.first_name} ${this.session.last_name}`
    }
}
