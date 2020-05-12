const http = require('http');
const path = require('path');
const express = require('express');
const csrf = require('csurf')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nunjucks = require('./system/nunjucks');
const HttpRouter = require('./system/http-router');
const config = require('./config/app');
const favicon = require('serve-favicon');

const app = express();
const server = http.createServer(app);
//session
app.use(session(config.session));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());
// parse cookie
app.use(cookieParser());
//csrf
app.use(csrf({ cookie: false }))
//static
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join('node_modules')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//configure template
nunjucks(app);

//app router init
const appRouter = express.Router();
(new HttpRouter(appRouter)).handle();
app.use(appRouter);

server.listen(config.httpPort, () => {
    console.log(`Server listen on port ${config.httpPort}`);
});
