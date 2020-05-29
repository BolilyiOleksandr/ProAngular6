const jwt = require('jsonwebtoken');

const APP_SECRET = 'myappsecret';
const USERNAME = 'admin';
const PASSWORD = 'secret';

module.exports = function (req, res, next) {
    if ((req.url === '/api/login' || req.url === '/login') && req.method === 'POST') {
        if (req.body !== null && req.body.name === USERNAME && req.body.password === PASSWORD) {
            let token = jwt.sign({data: USERNAME, expiresIn: '1h'}, APP_SECRET);
            res.json({success: true, token: token});
        } else {
            res.json({success: false});
        }
        res.end();
        return;
    } else if ((((req.url.startsWith('/api/products') || req.url.startsWith('/products'))
            || (req.url.startsWith('/api/categories') || req.url.startsWith('/categories'))) && req.method !== 'GET')
            || ((req.url.startsWith('/api/orders') || req.url.startsWith('/orders')) && req.method !== 'POST')) {
        let innerToken = req.headers['authorization'];
        if (innerToken !== null && innerToken.startsWith('Bearer<')) {
            innerToken = innerToken.substring(7, innerToken.length - 1);
            try {
                jwt.verify(innerToken, APP_SECRET);
                next();
                return;
            } catch (err) { }
        }
        res.statusCode = 401;
        res.end();
        return;
    }
    next();
};
