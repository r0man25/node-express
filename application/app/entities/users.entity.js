const UsersModel = require('../models/users.model');
const bcrypt = require('bcrypt');

/*
 * Entity for UsersSessions collection
 */
module.exports = class UsersEntity {

    static async store(data) {
        let userInstance = new UsersModel(data);
        return userInstance.save().then((data) => {
            return {
                success: true,
                user: userInstance,
            };
        }).catch((fail) => {
            let errors = [];
            for (let errorIndex in fail.errors) {
                if (fail.errors.hasOwnProperty(errorIndex)) {
                    console.log(`Error ${errorIndex} on store new user: ${fail.errors[errorIndex].message}`);
                    errors.push(fail.errors[errorIndex].message);
                }
            }
            return {
                success: false,
                errors: errors,
            };
        });
    }

    static async update(userId, {data: {first_name, last_name, remember_token}}) {
        let data = {};
        if (first_name) {
            data.first_name = first_name;
        }
        if (last_name) {
            data.last_name = last_name;
        }
        if (remember_token) {
            data.remember_token = remember_token;
        }
        if (!data) {
            return false;
        }
        return UsersModel.updateOne({_id: userId}, {$set: data});
    }

    static async delete(userId) {
        return UsersModel.remove({_id: userId});
    }

    static async findById(userId) {
        return UsersModel.findOne({_id: userId}).exec();
    }

    static async findBy(field, val) {
        let query = {};
        query[field] = val;
        return UsersModel.findOne(query).exec();
    }

    static async all() {
        return await UsersModel.find({});
    }

    static checkCredentials(user = null, password) {
        return !(!user || !bcrypt.compareSync(password, user.password));
    }

}