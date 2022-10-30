const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async function(req, res, next) {
    const sqlResults = `SELECT * FROM rezultati ORDER BY kolo;`;
    const sqlDates = `SELECT * FROM datumi ORDER BY kolo;`;
    const sqlComments = `SELECT * FROM komentari ORDER BY kolo, id;`;

    try {
        const rezultatiUtakmica = (await db.pool.query(sqlResults, [])).rows;
        const datumi = (await db.pool.query(sqlDates, [])).rows;
        const komentari = (await db.pool.query(sqlComments, [])).rows;

        let rezultatiPoKolu = {};
        let komentariPoKolu = {};
        let kola = new Map();

        for(let rez of rezultatiUtakmica) {
            if(!(rez.kolo in rezultatiPoKolu)) {
                rezultatiPoKolu[rez.kolo] = [];
                komentariPoKolu[rez.kolo] = [];
            }
        }

        for(let rez of rezultatiUtakmica) {
            rezultatiPoKolu[rez.kolo].push(rez);
        }

        for(let kom of komentari) {
            if(kom.kolo in komentariPoKolu) {
                komentariPoKolu[kom.kolo].push(kom);
            }
        }

        for(let m of datumi) {
            if(m.kolo in rezultatiPoKolu) {
                let dd = m.datum.getDate()
                let mm = m.datum.getMonth() + 1
                let yyyy = m.datum.getFullYear()
                kola.set(m.kolo, dd + "." + mm + "." + yyyy + ".")
            }
        }

        var _a, _b, _c;
        var username = undefined;
        if(req.oidc.isAuthenticated()) {
            username = (_b = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = req.oidc.user) === null || _c === void 0 ? void 0 : _c.sub;
        }

        res.render("rezultati", {
            username: username,
            kola: kola,
            rezultatiPoKolu: rezultatiPoKolu,
            komentariPoKolu: komentariPoKolu,
            linkActive: 'rezultati'
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/:kolo', async function(req, res, next) {
    var _a, _b, _c;
    var username = undefined;
    if(req.oidc.isAuthenticated()) {
        username = (_b = (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = req.oidc.user) === null || _c === void 0 ? void 0 : _c.sub;
    }
    
    if(username != undefined) {
        var komentar = req.body.komentar;
        var kolo = req.params.kolo;
        const sql = "INSERT INTO komentari(kolo, vrijeme, autor, komentar) VALUES('" + kolo + "', CURRENT_TIMESTAMP::TIMESTAMP(0), '" + username + "', '" + komentar + "')";
        await db.pool.query(sql, []);
        res.redirect("/rezultati")
    }
});

router.post('/:kolo/:username/izmijeni/:id', async function(req, res, next) {
    var kolo = req.params.kolo;
    var username = req.params.username;
    var id = req.params.id;
    var komentar = req.body.komentar;

    const sql = "UPDATE komentari SET komentar = '" + komentar + "', vrijeme = CURRENT_TIMESTAMP::TIMESTAMP(0) WHERE id = " + id;
    await db.pool.query(sql, []);
    res.redirect("/rezultati");
});

router.post('/:kolo/:username/izbrisi/:id', async function(req, res, next) {
    var id = req.params.id;
    const sql = "DELETE FROM komentari WHERE id = " + id;
    await db.pool.query(sql, []);
    res.redirect("/rezultati");
});

router.post('/:kolo/:domacin/:gost/:stariRezultat/promijeniRezultat/:id', async function(req, res, next) {
    let rezultat = req.body.rezultat;
    let id = req.params.id;
    let kolo = req.params.kolo;
    let domacin = req.params.domacin;
    let gost = req.params.gost;
    let stariRezultat = req.params.stariRezultat;

    if(rezultat.includes(" : ") == true) {
        const rez = rezultat.split(" : ");
        if(rez.length == 2) {
            let a = rez[0].trim();
            let b = rez[1].trim();

            if(isNaN(a) || isNaN(b)) {
                res.redirect("/rezultati");
            } else {
                const stariRez = stariRezultat.split(" : ");
                let d = stariRez[0].trim();
                let g = stariRez[1].trim();

                const sql1 = "UPDATE liga SET postignuti_golovi = postignuti_golovi - " + d + ", primljeni_golovi = primljeni_golovi - " + g + " WHERE klub = '" + domacin + "'";
                const sql2 = "UPDATE liga SET gol_razlika = postignuti_golovi - primljeni_golovi WHERE klub = '" + domacin  + "'";
                const sql3 = "UPDATE liga SET postignuti_golovi = postignuti_golovi - " + g + ", primljeni_golovi = primljeni_golovi - " + d + " WHERE klub = '" + gost  + "'";
                const sql4 = "UPDATE liga SET gol_razlika = postignuti_golovi - primljeni_golovi WHERE klub = '" + gost  + "'";

                await db.pool.query(sql1, []);
                await db.pool.query(sql2, []);
                await db.pool.query(sql3, []);
                await db.pool.query(sql4, []);

                if(parseInt(d) > parseInt(g)) {
                    const sql5 = "UPDATE liga SET bodovi = bodovi - 3 WHERE klub = '" + domacin  + "'";
                    await db.pool.query(sql5, []);
                } else if(parseInt(d) < parseInt(g)) {
                    const sql6 = "UPDATE liga SET bodovi = bodovi - 3 WHERE klub = '" + gost  + "'";
                    await db.pool.query(sql6, []);
                } else {
                    const sql7 = "UPDATE liga SET bodovi = bodovi - 1 WHERE klub = '" + domacin  + "'";
                    const sql8 = "UPDATE liga SET bodovi = bodovi - 1 WHERE klub = '" + gost  + "'";
                    await db.pool.query(sql7, []);
                    await db.pool.query(sql8, []);
                }

                let noviRezultat = a + " : " + b;
                const sql9 = "DELETE FROM rezultati WHERE id = " + id;
                const sql10 = "INSERT INTO rezultati(kolo, domacin, gost, rezultat) VALUES('" + kolo + "', '" + domacin + "', '" + gost + "', '" + noviRezultat + "')";
                const sql11 = "UPDATE liga SET postignuti_golovi = postignuti_golovi + " + a + ", primljeni_golovi = primljeni_golovi + " + b + " WHERE klub = '" + domacin + "'";
                const sql12 = "UPDATE liga SET gol_razlika = postignuti_golovi - primljeni_golovi WHERE klub = '" + domacin  + "'";
                const sql13 = "UPDATE liga SET postignuti_golovi = postignuti_golovi + " + b + ", primljeni_golovi = primljeni_golovi + " + a + " WHERE klub = '" + gost  + "'";
                const sql14 = "UPDATE liga SET gol_razlika = postignuti_golovi - primljeni_golovi WHERE klub = '" + gost  + "'";

                await db.pool.query(sql9, []);
                await db.pool.query(sql10, []);
                await db.pool.query(sql11, []);
                await db.pool.query(sql12, []);
                await db.pool.query(sql13, []);
                await db.pool.query(sql14, []);

                if(parseInt(a) > parseInt(b)) {
                    const sql15 = "UPDATE liga SET bodovi = bodovi + 3 WHERE klub = '" + domacin  + "'";
                    await db.pool.query(sql15, []);
                } else if(parseInt(a) < parseInt(b)) {
                    const sql16 = "UPDATE liga SET bodovi = bodovi + 3 WHERE klub = '" + gost  + "'";
                    await db.pool.query(sql16, []);
                } else {
                    const sql17 = "UPDATE liga SET bodovi = bodovi + 1 WHERE klub = '" + domacin  + "'";
                    const sql18 = "UPDATE liga SET bodovi = bodovi + 1 WHERE klub = '" + gost  + "'";
                    await db.pool.query(sql17, []);
                    await db.pool.query(sql18, []);
                }

                res.redirect("/rezultati");
            }
        } else {
            res.redirect("/rezultati");
        }
    } else {
        res.redirect("/rezultati");
    }
});

module.exports = router;