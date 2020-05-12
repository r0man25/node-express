const _ = require('lodash');

/**
 * Class to help in work with arrays
 */
class Arr {

    /**
     * Check if element is array
     */
    static isArray(haystack) {
        return haystack && haystack.constructor.toString().indexOf('Array') > -1;
    }

    /**
     * Check if `needle` exists in array `haystack`
     */
    static in(needle, haystack) {
        return _.indexOf(haystack, needle) > -1;
    }

    /**
     * Check if object (associative array) `haystack` has key `needle`
     */
    static keyExists(needle, haystack) {
        return _.findIndex(haystack, (element) => element === needle);
    }

    /**
     * Remove element from object by its value
     */
    static removeElementByValue(value, haystack) {
        _.remove(haystack, (element) => element === value);
        return haystack;
    }

    /**
     * Remove element from object by its key
     */
    static removeElementByKey(key, haystack) {
        if (haystack.hasOwnProperty(key) === false) {
            return haystack;
        }
        delete haystack[key];
        return haystack;
    }

    /**
     * Get random element
     */
    static random(object) {
        let keys = Object.keys(object);
        if (keys.length > 0) {
            return object[keys[keys.length * Math.random() << 0]] || null;
        }
        return null;
    }

    /**
     * Get first item from the object
     */
    static first(list, defaultReturnValue = null) {
        let keys = Object.keys(list);
        if (keys.length > 0) {
            return list[keys.shift()];
        }
        return defaultReturnValue;
    }

}

module.exports = Arr;