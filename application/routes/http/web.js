module.exports = {
    '/': {
        get: {
            controller: 'Http/WelcomeController',
            action: 'index',
            auth: false,
        },
    },
    '/register': {
        get: {
            controller: 'Http/Auth/RegisterController',
            action: 'index',
            auth: false,
        },
        post: {
            controller: 'Http/Auth/RegisterController',
            action: 'register',
            auth: false,
        },
    },
    '/login': {
        get: {
            controller: 'Http/Auth/LoginController',
            action: 'index',
            auth: false,
        },
        post: {
            controller: 'Http/Auth/LoginController',
            action: 'login',
            auth: false,
        },
    },
    '/logout': {
        post: {
            controller: 'Http/Auth/LoginController',
            action: 'logout',
            auth: true,
        },
    },
    '/home': {
        get: {
            controller: 'Http/HomeController',
            action: 'index',
            auth: true,
        },
    },

};
