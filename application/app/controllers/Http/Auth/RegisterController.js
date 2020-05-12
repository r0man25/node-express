const Controller = require('../Controller');
const Validator = require('../../../facades/User/Validator');
const UsersEntity = require("../../../entities/users.entity");

class RegisterController extends Controller {

    constructor(req, res, emitter, auth) {
        super(req, res, emitter, auth);
        this.emitter.share = {
            menu_active: 'register'
        }
    }

    async index(req) {
        this.emitter.successRespondWithView('auth/register.html', this.emitter.flash_data);
    }

    async register(req, res, data) {
        let errors = await Validator.registerRequest(data);

        if (errors) {
            this.emitter.flash({data,errors});
            return this.emitter.res.redirect('back');
        }

        let response = await UsersEntity.store(data);

        if (response.success && this.auth.attempt(response.user)) {
            return this.emitter.res.redirect('/home');
        }

        return this.emitter.res.status(400).redirect('back');
    }

}

module.exports = RegisterController;