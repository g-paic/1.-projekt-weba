const {Pool} = require('pg');
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'prvi_projekt_weba',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
    //ssl: true
});

const sql_drop_league = 'DROP TABLE IF EXISTS liga';

const sql_create_league = `CREATE TABLE liga(
    klub text NOT NULL UNIQUE,
    postignuti_golovi numeric NOT NULL,
    primljeni_golovi numeric NOT NULL,
    gol_razlika numeric NOT NULL,
    bodovi numeric NOT NULL
)`;

const sql_insert_league = `INSERT INTO liga(klub, postignuti_golovi, primljeni_golovi, gol_razlika, bodovi) VALUES
    ('Dinamo', '24', '9', '+15', '19'),
    ('Hajduk', '13', '8', '+5', '15'),
    ('Slaven Belupo', '6', '6', '0', '14'),
    ('Varaždin', '9', '10', '-1', '9'),
    ('Osijek', '9', '12', '-3', '8'),
    ('Istra 1961', '6', '9', '-3', '8'),
    ('Šibenik', '5', '6', '-1', '7'),
    ('Lokomotiva', '11', '13', '-2', '6'),
    ('Gorica', '7', '12', '-5', '5'),
    ('Rijeka', '5', '10', '-5', '5')
`;

const sql_drop_results = 'DROP TABLE IF EXISTS rezultati';

const sql_create_results = `CREATE TABLE rezultati(
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kolo numeric NOT NULL,
    domacin text NOT NULL,
    gost text NOT NULL,
    rezultat text NOT NULL
)`;

const sql_insert_results = `INSERT INTO rezultati(kolo, domacin, gost, rezultat) VALUES
    ('1', 'Istra 1961', 'Hajduk', '0 : 2'),
    ('1', 'Varaždin', 'Slaven Belupo', '0 : 1'),
    ('1', 'Dinamo', 'Lokomotiva', '3 : 2'),
    ('1', 'Osijek', 'Gorica', '2 : 1'),
    ('1', 'Šibenik', 'Rijeka', '0 : 1'),
    ('2', 'Hajduk', 'Rijeka', '2 : 0'),
    ('2', 'Gorica', 'Šibenik', '0 : 0'),
    ('2', 'Lokomotiva', 'Osijek', '2 : 1'),
    ('2', 'Slaven Belupo', 'Dinamo', '1 : 5'),
    ('2', 'Istra 1961', 'Varaždin', '1 : 2'),
    ('3', 'Varaždin', 'Hajduk', '0 : 2'),
    ('3', 'Dinamo', 'Istra 1961', '4 : 1'),
    ('3', 'Osijek', 'Slaven Belupo', '0 : 0'),
    ('3', 'Šibenik', 'Lokomotiva', '2 : 1'),
    ('3', 'Rijeka', 'Gorica', '1 : 1'),
    ('4', 'Lokomotiva', 'Rijeka', '3 : 1'),
    ('4', 'Slaven Belupo', 'Šibenik', '0 : 0'),
    ('4', 'Istra 1961', 'Osijek', '1 : 0'),
    ('4', 'Varaždin', 'Dinamo', '1 : 1'),
    ('4', 'Hajduk', 'Gorica', '3 : 1'),
    ('5', 'Dinamo', 'Hajduk', '4 : 1'),
    ('5', 'Osijek', 'Varaždin', '2 : 2'),
    ('5', 'Šibenik', 'Istra 1961', '0 : 0'),
    ('5', 'Rijeka', 'Slaven Belupo', '0 : 1'),
    ('5', 'Gorica', 'Lokomotiva', '3 : 2'),
    ('6', 'Hajduk', 'Lokomotiva', '2 : 1'),
    ('6', 'Slaven Belupo', 'Gorica', '2 : 1'),
    ('6', 'Istra 1961', 'Rijeka', '1 : 1'),
    ('6', 'Varaždin', 'Šibenik', '2 : 2'),
    ('6', 'Dinamo', 'Osijek', '5 : 2'),
    ('7', 'Osijek', 'Hajduk', '2 : 1'),
    ('7', 'Šibenik', 'Dinamo', '1 : 2'),
    ('7', 'Rijeka', 'Varaždin', '1 : 2'),
    ('7', 'Gorica', 'Istra 1961', '0 : 2'),
    ('7', 'Lokomotiva', 'Slaven Belupo', '0 : 1')
`;

const sql_drop_matches = 'DROP TABLE IF EXISTS utakmice';

const sql_create_matches = `CREATE TABLE utakmice(
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kolo numeric NOT NULL,
    domacin text NOT NULL,
    gost text NOT NULL
)`;

const sql_insert_matches = `INSERT INTO utakmice(kolo, domacin, gost) VALUES
    ('8', 'Hajduk', 'Slaven Belupo'),
    ('8', 'Istra 1961', 'Lokomotiva'),
    ('8', 'Varaždin', 'Gorica'),
    ('8', 'Dinamo', 'Rijeka'),
    ('8', 'Osijek', 'Šibenik'),
    ('9', 'Šibenik', 'Hajduk'),
    ('9', 'Rijeka', 'Osijek'),
    ('9', 'Gorica', 'Dinamo'),
    ('9', 'Lokomotiva', 'Varaždin'),
    ('9', 'Slaven Belupo', 'Istra 1961'),
    ('10', 'Hajduk', 'Istra 1961'),
    ('10', 'Slaven Belupo', 'Varaždin'),
    ('10', 'Lokomotiva', 'Dinamo'),
    ('10', 'Gorica', 'Osijek'),
    ('10', 'Rijeka', 'Šibenik'),
    ('11', 'Rijeka', 'Hajduk'),
    ('11', 'Šibenik', 'Gorica'),
    ('11', 'Osijek', 'Lokomotiva'),
    ('11', 'Dinamo', 'Slaven Belupo'),
    ('11', 'Varaždin', 'Istra 1961'),
    ('12', 'Hajduk', 'Varaždin'),
    ('12', 'Istra 1961', 'Dinamo'),
    ('12', 'Slaven Belupo', 'Osijek'),
    ('12', 'Lokomotiva', 'Šibenik'),
    ('12', 'Gorica', 'Rijeka'),
    ('13', 'Gorica', 'Hajduk'),
    ('13', 'Rijeka', 'Lokomotiva'),
    ('13', 'Šibenik', 'Slaven Belupo'),
    ('13', 'Osijek', 'Istra 1961'),
    ('13', 'Dinamo', 'Varaždin'),
    ('14', 'Hajduk', 'Dinamo'),
    ('14', 'Varaždin', 'Osijek'),
    ('14', 'Istra 1961', 'Šibenik'),
    ('14', 'Slaven Belupo', 'Rijeka'),
    ('14', 'Lokomotiva', 'Gorica'),
    ('15', 'Lokomotiva', 'Hajduk'),
    ('15', 'Gorica', 'Slaven Belupo'),
    ('15', 'Rijeka', 'Istra 1961'),
    ('15', 'Šibenik', 'Varaždin'),
    ('15', 'Osijek', 'Dinamo'),
    ('16', 'Hajduk', 'Osijek'),
    ('16', 'Dinamo', 'Šibenik'),
    ('16', 'Varaždin', 'Rijeka'),
    ('16', 'Istra 1961', 'Gorica'),
    ('16', 'Slaven Belupo', 'Lokomotiva'),
    ('17', 'Slaven Belupo', 'Hajduk'),
    ('17', 'Lokomotiva', 'Istra 1961'),
    ('17', 'Gorica', 'Varaždin'),
    ('17', 'Rijeka', 'Dinamo'),
    ('17', 'Šibenik', 'Osijek'),
    ('18', 'Hajduk', 'Šibenik'),
    ('18', 'Osijek', 'Rijeka'),
    ('18', 'Dinamo', 'Gorica'),
    ('18', 'Varaždin', 'Lokomotiva'),
    ('18', 'Istra 1961', 'Slaven Belupo')
`;

const sql_drop_dates = 'DROP TABLE IF EXISTS datumi';

const sql_create_dates = `CREATE TABLE datumi(
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kolo numeric NOT NULL,
    datum date NOT NULL
)`;

const sql_insert_dates = `INSERT INTO datumi(kolo, datum) VALUES
    ('1', '16.07.2022.'),
    ('2', '23.07.2022.'),
    ('3', '30.07.2022.'),
    ('4', '06.08.2022.'),
    ('5', '13.08.2022.'),
    ('6', '20.08.2022.'),
    ('7', '27.08.2022.'),
    ('8', '03.09.2022.'),
    ('9', '10.09.2022.'),
    ('10', '17.09.2022.'),
    ('11', '01.10.2022.'),
    ('12', '08.10.2022.'),
    ('13', '15.10.2022.'),
    ('14', '22.10.2022.'),
    ('15', '29.10.2022.'),
    ('16', '05.11.2022.'),
    ('17', '12.11.2022.'),
    ('18', '21.01.2023.')
`;

const sql_drop_comments = 'DROP TABLE IF EXISTS komentari';

const sql_create_comments = `CREATE TABLE komentari(
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kolo text NOT NULL,
    vrijeme timestamp without time zone NOT NULL,
    autor text NOT NULL,
    komentar text NOT NULL
)`;

pool.connect();

async function make() {
    await pool.query(sql_drop_league, [])
    await pool.query(sql_drop_results, [])
    await pool.query(sql_drop_matches, [])

    await pool.query(sql_create_league, [])
    await pool.query(sql_create_results, [])
    await pool.query(sql_create_matches, [])

    await pool.query(sql_insert_league, [])
    await pool.query(sql_insert_results, [])
    await pool.query(sql_insert_matches, [])

    await pool.query(sql_drop_dates, [])
    await pool.query(sql_create_dates, [])
    await pool.query(sql_insert_dates, [])

    await pool.query(sql_drop_comments, [])
    await pool.query(sql_create_comments, [])
}

module.exports = {
    pool: pool,
    make: make
}