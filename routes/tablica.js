const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async function(req, res, next) {
    const sqlLiga = `SELECT * FROM liga ORDER BY bodovi DESC, gol_razlika DESC, postignuti_golovi DESC, klub ASC;`;

    try {
        const resultLiga = (await db.pool.query(sqlLiga, [])).rows;
        var _a, _b, _c;
        var username = undefined;
        if(req.oidc.isAuthenticated()) {
            username = (_b = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = req.oidc.user) === null || _c === void 0 ? void 0 : _c.sub;
        }

        res.render("tablica", {
            username: username,
            liga: resultLiga,
            linkActive: 'tablica'
        });
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;