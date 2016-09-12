var auth = require('basic-auth');

var basicAuth = {
    authenticate: function (req, res, next) {
        var credentials = auth(req);

        if (!credentials || credentials.name !== 'edwin' || credentials.pass !== 'ganteng') {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="Dragon Realm"');
            res.end('Access denied');
        } else {
            next();
        }
    }
};

module.exports = basicAuth;
