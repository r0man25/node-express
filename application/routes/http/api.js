module.exports = {
    '/test-api-protect': {
        get: {
            controller: 'Http/WelcomeController',
            action: 'testApiProtect',
            auth: true,
        },
    },
    '/test-api-free': {
        get: {
            controller: 'Http/WelcomeController',
            action: 'testApiFree',
            auth: false,
        },
    },
};
