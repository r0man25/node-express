module.exports = class Validator {

    constructor() {
        this.errors = null;
    }

    validateEmail(obj) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        try {
            if (! re.test(String(obj.value).toLowerCase())) {
                let message = `The ${this.snakeCaseToString(obj.field)} must be a valid email address.`;
                return this._fail(obj, message);
            }
        } catch (e) {
            console.error('Validation error:', e);
        }

        return this._success();
    }

    required(obj) {
        try {
            if (! obj.value) {
                let message = `${this.snakeCaseToString(this.firstToUppercase(obj.field))} is required.`;
                return this._fail(obj, message);
            }
        } catch (e) {
            console.error('Validation error:', e);
        }

        return this._success();
    }

    min(obj) {
        try {
            if (! obj.type || ! obj.min) {
                return this._error('Object params not completed.')
            }
            if (obj.type === 'string') {
                if (obj.value.length < obj.min) {
                    let message = `The ${this.snakeCaseToString(obj.field)} must be at least ${obj.min} characters.`;
                    return this._fail(obj, message);
                }
            } else {
                if (parseInt(obj.value) < obj.min) {
                    let message = `The ${this.snakeCaseToString(obj.field)} must be at least ${obj.min}.`;
                    return this._fail(obj, message);
                }
            }
        } catch (e) {
            console.error('Validation error:', e);
        }

        return this._success();
    }

    max(obj) {
        try {
            if (! obj.type || ! obj.max) {
                return this._error('Object params not completed.')
            }
            if (obj.type === 'string') {
                if (obj.value.length > obj.max) {
                    let message = `The ${this.snakeCaseToString(obj.field)} may not be greater than ${obj.max} characters.`;
                    return this._fail(obj, message);
                }
            } else {
                if (parseInt(obj.value) > obj.max) {
                    let message = `The ${this.snakeCaseToString(obj.field)} may not be greater than ${obj.max}.`;
                    return this._fail(obj, message);
                }
            }
        } catch (e) {
            console.error('Validation error:', e);
        }

        return this._success();
    }

    confirm(obj) {
        try {
            if (obj.value !== obj.confirmation) {
                let message = `The ${this.snakeCaseToString(obj.field)} does not match.`;
                return this._fail(obj, message);
            }
        } catch (e) {
            console.error('Validation error:', e);
        }

        return this._success();
    }

    async unique(obj) {
        try {
            let { entity, field } = obj.by;
            let model = await entity.findBy(field, obj.value);
            if (model) {
                let message = `The ${this.snakeCaseToString(obj.field)} has already been taken.`;
                return this._fail(obj, message);
            }
        } catch (e) {
            console.error('Validation error:', e);
        }

        return this._success();
    }

    snakeCaseToString(string) {
        return string.replace('_', ' ');
    }

    /**
     * @param {string} [string]
     * @returns {string}
     */
    firstToUppercase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    _success() {
        return {
            success: true,
            message: null
        };
    }

    _error(mes) {
        throw new Error(mes);
    }

    _fail(obj, message) {
        if (!this.errors) {
            this.errors = {};
        }

        if (!this.errors[obj.field]) {
            this.errors[obj.field] = [];
        }

        this.errors[obj.field].push(message);

        return {
            success: false,
            message: message
        };
    }

}