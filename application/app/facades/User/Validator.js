const UsersEntity = require("../../entities/users.entity");
const BaseValidator = require('../../services/Validator');

module.exports = class Validator extends BaseValidator{

    /**
     * @param {Object} [req]
     * @param {string} [req.first_name]
     * @param {string }req.last_name
     * @param {string} [req.email]
     * @param {string} [req.password]
     * @param {string} [req.confirm_password]
     * @returns {string|null}
     */
    static async registerRequest(req) {
        let validator = new Validator();
        validator.required({field: 'first_name', value: req.first_name});
        validator.min({field: 'first_name', value: req.first_name, type: 'string', min: 3});
        validator.max({field: 'first_name', value: req.first_name, type: 'string', max: 255});
        validator.required({field: 'last_name', value: req.last_name});
        validator.min({field: 'last_name', value: req.last_name, type: 'string', min: 3});
        validator.max({field: 'last_name', value: req.last_name, type: 'string', max: 255});
        validator.required({field: 'email', value: req.email});
        await validator.unique({field: 'email', value: req.email, by: {entity: UsersEntity, field: 'email'}});
        validator.required({field: 'password', value: req.password});
        validator.min({field: 'password', value: req.password, type: 'string', min: 6});
        validator.max({field: 'password', value: req.password, type: 'string', max: 255});
        validator.confirm({field: 'confirm_password', value: req.confirm_password, confirmation: req.password});
        validator.required({field: 'confirm_password', value: req.confirm_password});
        validator.validateEmail({field: 'email', value: req.email});

        if (! validator.errors) {
            return false;
        }

        return validator.errors;
    }

    /**
     * @param {Object} [req]
     * @param {string} [req.email]
     * @param {string} [req.password]
     * @returns {string|null}
     */
    static async loginRequest(req) {
        let validator = new Validator();

        validator.required({field: 'email', value: req.email});
        validator.required({field: 'password', value: req.password});

        if (! validator.errors) {
            return false;
        }

        return validator.errors;
    }

}