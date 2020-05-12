const Controller = require('./Controller');

class WelcomeController extends Controller {

    async index(req, res, data) {
        this.emitter.successRespondWithView('welcome.html');
    }

    async testApiProtect(req, res, data) {
        this.emitter.successRespondWithJson('TEST JSON ... WelcomeController@testApiProtect');
    }

    async testApiFree(req, res, data) {
        this.emitter.successRespondWithJson('TEST JSON ... WelcomeController@testApiFree');
    }
}

module.exports = WelcomeController;