const express = require('express');
const router = express.Router();
const openidConnect = require("express-openid-connect");

router.get('/', function (req, res, next) {
    var _a, _b, _c;
    var username = undefined;
    if(req.oidc.isAuthenticated()) {
        username = (_b = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = req.oidc.user) === null || _c === void 0 ? void 0 : _c.sub;
    }

    res.render('home', {
        username: username,
        linkActive: 'home'
    });
});

router.get('/prijava', openidConnect.requiresAuth(), function(req, res) {
    var username = JSON.stringify(req.oidc.user);
    res.redirect("/")
});

router.get("/registracija", function(req, res) {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {
            screen_hint: "signup"
        }
    });
});

module.exports = router;