const nunjucks = require('nunjucks');
const config = require('../config/app');

module.exports = app => {
    const env = nunjucks.configure(config.views_path, {
        autoescape: true,
        express: app
    });

    env.addGlobal('global', {
        date: new Date()
    });
};