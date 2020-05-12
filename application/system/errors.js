const Arr = require("../helpers/array");

/**
 * Class that stores errors
 */
class Errors {

    constructor() {
        this.errors = {};
    }

    /**
     * Count of errors we have in current request
     */
    count() {
        return Object.keys(this.getAll()).length;
    }

    /**
     * Add error in list
     */
    add(fieldName, message) {
        if (fieldName !== null && fieldName !== undefined) {
            this.errors[fieldName] = message;
        } else {
            this.errors['message'] = message;
        }
    }

    /**
     * Get errors list for current request
     */
    getAll() {
        return this.errors;
    }

    /**
     * Get first error fro the errors list
     */
    first() {
        return Arr.first(this.errors);
    }
}

module.exports = Errors;