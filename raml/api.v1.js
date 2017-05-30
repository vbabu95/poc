/**
 * Create a router for the API so we can either
 * create a real backend implementation or
 * create a dynamic mocking implementation.
 * 
 * Anything we DON'T capture at this level will
 * be delegated down to static mocks from 
 * the RAML osprey mock server based on example
 * data in your RAML files.
 */
const Router = require('express').Router;
const router = new Router();

/**
 * Add a custom login method
 */
router.post('/login', (req, res) => {
    let mock = require('./api/v1/login/member.example.json');

    if (mock.email.toLowerCase() === req.body.email.toLowerCase()) {
        res.json(mock);
    }
    else {
        res.status(401);
        res.json(null);
    }
});

/**
 * Add a custom resume login method
 */
router.put('/login', (req, res) => {
    let mock = require('./api/v1/login/member.example.json');

    if (mock.token === req.headers['x-auth-token']) {
        res.json(mock);
    }
    else {
        res.status(401);
        res.json(null);
    }
});

/**
 * Add a custom logout method
 */
router.delete('/login', (req, res) => {
    res.json(null);
});

module.exports = router;
