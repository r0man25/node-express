const Controller = require('../Controller');
const Validator = require('../../../facades/User/Validator');
const UsersEntity = require("../../../entities/users.entity");

class LoginController extends Controller {

    constructor(req, res, emitter, auth) {
        super(req, res, emitter, auth);
        this.emitter.share = {
            menu_active: 'login'
        }

        this.middleware = [
            () => {
                if (this.emitter.req.originalUrl !== '/logout' && this.auth.check()) {
                    this.emitter.res.redirect('/home');
                    return false;
                }
                return true;
            }
        ];
    }

    async index() {
        this.emitter.successRespondWithView('auth/login.html', this.emitter.flash_data);
    }

    async login(req, res, data) {
        let errors = await Validator.loginRequest(data);

        if (errors) {
            this.emitter.flash({data,errors});
            return this.emitter.res.redirect('back');
        }

        let user = await UsersEntity.findBy('email', data.email);
        if (! UsersEntity.checkCredentials(user, data.password)) {
            this.emitter.flash({data, errors: {email: ['User not exist or password not correct.']}});
            return this.emitter.res.redirect('back');
        }

        if (this.auth.attempt(user, data.remember)) {
            return this.emitter.res.redirect('/home');
        }

        return this.emitter.res.status(400).redirect('back');
    }

    async logout() {
        if (this.auth.logout()) {
            return this.emitter.unauthorized();
        }
        return this.emitter.res.status(500).send('Internal server error');
    }

}

module.exports = LoginController;