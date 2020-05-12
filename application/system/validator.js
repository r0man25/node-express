const ErrorsChunk = require('./errors');

/**
 * Validator class.
 * Can validate incoming data
 */
class Validator {

    /**
     * Class constructor
     */
    constructor() {
        this.errors = new ErrorsChunk();
    }

    /**
     * Get Errors exemplar with current errors data
     */
    getErrorsChunk() {
        return this.errors;
    }

    /**
     * Start validation
     */
    run(data, parameters, prefix = '') {
        // Check if incoming data is object
        if (typeof data !== 'object' && data !== null && data !== undefined) {
            this.errors.add(null, 'Data must be an object or no data needed at all!');
            return false;
        }
        if (!(this.errors instanceof ErrorsChunk)) {
            console.log('Wrong parameter! Errors type needed');
            return false;
        }
        for (let field in parameters) {
            if (parameters.hasOwnProperty(field) === false) {
                continue;
            }
            // Get incoming date value
            let value = data[field];
            // Get current parameter options
            let parameter = parameters[field];
            // Check for required
            if (parameter.required === true) {
                if (typeof value === 'undefined' || value === null) {
                    this.errors.add(
                        prefix + field,
                        `Data must be an object or no data needed at all! prefix: ${prefix}, field: ${field}}`
                    );
                    continue;
                }
            }
            else if (typeof value === 'undefined' || value === null) {
                continue;
            }
            // Check if parameter has type parameter
            if (typeof parameter.type !== 'string') {
                continue;
            }
            // Check type of incoming data
            if (parameter.type === 'array') {
                if (Array.isArray(value) === false) {
                    this.errors.add(prefix + field, `"array" needed for prefix: ${prefix}, field: ${field}!`);
                }
                if (
                    typeof parameter.parameters === 'object' &&
                    Object.keys(parameter.parameters).length > 0
                ) {
                    value.forEach((array, index) => {
                        this.run(
                            array,
                            parameter.parameters,
                            prefix + index + '.'
                        )
                    });
                }
                continue;
            }
            if (parameter.type === 'number' && value !== '' && value !== null) {
                value = +value;
            }
            if (typeof value !== parameter.type) {
                this.errors.add(prefix + field, `"{type}" needed for prefix: ${prefix}, field: ${field}!`);
                continue;
            }
            // Check min & max options for numbers
            if (parameter.type === 'number') {
                if (this.number(value, parameter, prefix + field) === false) {
                    continue;
                }
            }
            // Check min & max options for strings
            if (parameter.type === 'string' &&
                this.string(value, parameter, prefix + field) === false) {
                continue;
            }
            // Check parameters options
            if (
                parameter.type === 'object' &&
                typeof parameter.parameters === 'object' &&
                Object.keys(parameter.parameters).length > 0 &&
                this.run(value, parameter.parameters, prefix + field + '.') === false
            ) {
                continue;
            }
        }
    }

    /**
     * Check incoming number with all rules
     */
    number(number, options, fieldName = '') {
        // Check minimum option
        if (typeof options.min !== 'undefined' && number < options.min) {
            this.errors.add(fieldName, `Value can not be less then ${options.min + ''} for ${fieldName}`);
            return false;
        }
        // Check maximum option
        if (typeof options.max !== 'undefined' && number > options.max) {
            this.errors.add(fieldName, `Value can not be bigger then ${options.max + ''} for ${fieldName}`);
            return false;
        }
        // Check equal option
        if (typeof options.equal !== 'undefined' && number !== options.equal) {
            this.errors.add(fieldName, `Value must be equal to ${options.equal + ''} for ${fieldName}`);
            return false;
        }
        // All ok
        return true;
    }

    /**
     * Check incoming string with all rules
     */
    string(string, options, fieldName = '') {
        let lengthOfTheString = string.length;
        // Check minimum option
        if (typeof options.min !== 'undefined' && lengthOfTheString < options.min) {
            this.errors.add(fieldName, `String can not be shorter then ${options.min + ''} for ${fieldName}`);
            return false;
        }
        // Check maximum option
        if (typeof options.max !== 'undefined' && lengthOfTheString > options.max) {
            this.errors.add(fieldName, `String can not be longer then ${options.max + ''} for ${fieldName}`);
            return false;
        }
        // Check equal option
        if (typeof options.equal !== 'undefined' && lengthOfTheString !== options.equal) {
            this.errors.add(fieldName, `String must be equal to ${options.equal + ''} for ${fieldName}`);
            return false;
        }
        // Regular expression
        if (typeof options.regex !== 'undefined' &&
            Validator.regularExpression(string, options.regex) === false) {
            this.errors.add(fieldName, `String must equal to regular expression ${options.regex + ''} for ${fieldName}`);
            return false;
        }
        // All ok
        return true;
    }

    /**
     * Check `element` for matches with the `regularExpression`
     */
    static regularExpression(element, regularExpression) {
        return element.search(regularExpression) !== -1;
    }

}

module.exports = Validator;
