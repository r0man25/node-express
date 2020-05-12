require('dotenv').config();
module.exports = {
    /**
     * Default http application port
     * Http application will listen this port
     * You can set yours in .env => APP_HTTP_PORT
     */
    httpPort: process.env.APP_HTTP_PORT || 3000,

    /**
     * Root dir of the project
     */
    root_dir: __dirname + '/../',

    /**
     * Default action.
     * It will be used when you didn't set `action` for route.
     * You can set yours in .env => DEFAULT_ACTION
     */
    default_action: 'index',

    auth: {
        jwt: {
            secretOrKey: process.env.JWT_SECRET || "app_secret"
        },
        expiresIn: parseInt(process.env.AUTH_EXPIRES_IN) || 86400,
        rememberExpireIn: parseInt(process.env.REMEMBER_AUTH_EXPIRES_IN) || 604800000,
        cookieAuthName: 'Authorization',
        cookieRememberName: 'remember'
    },

    views_path: process.env.VIEWS_PATH || './application/resources/views',

    session: {
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: 3600000
        }
    },

    crypto: {
        key: 'jVN5eFWK8jmuOpsqN2p22hfrb8VKjVbk'
    }
};
