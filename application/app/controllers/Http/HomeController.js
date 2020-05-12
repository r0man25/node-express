const Controller = require('./Controller');

class HomeController extends Controller {

    constructor(req, res, emitter, auth) {
        super(req, res, emitter, auth);
        this.emitter.share = {
            menu_active: 'home'
        }
    }

    async index(req, res, data) {
        this.emitter.successRespondWithView('home.html', {
            username: this.auth.getFullName(),
            email: this.auth.session.email,
        });
    }
}

module.exports = HomeController;