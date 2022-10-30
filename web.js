const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const openidConnect = require("express-openid-connect");
const dotenv = require("dotenv");
const db = require('./database');

const homeRouter = require('./routes/home');
const tablicaRouter = require('./routes/tablica');
const rezultatiRouter = require('./routes/rezultati');
const rasporedRouter = require('./routes/raspored');

dotenv.config();

db.make();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var externalUrl = process.env.RENDER_EXTERNAL_URL;
var port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

var config = {
    authRequired: false,
    idpLogout: true,
    secret: process.env.SECRET,
    baseURL: externalUrl || "https://localhost:".concat(port),
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://fer-web2.eu.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code',
        scope: "openid profile email"
    }
};

app.use(openidConnect.auth(config));

app.use('/', homeRouter);
app.use('/tablica', tablicaRouter);
app.use('/rezultati', rezultatiRouter);
app.use('/raspored', rasporedRouter);

if(externalUrl) {
    var hostname = '127.0.0.1';
    app.listen(port, hostname, function() {
        console.log("Server locally running at http://".concat(hostname, ":").concat(port, "/ and from outside on ").concat(externalUrl));
    });
} else {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app).listen(port, function() {
        console.log("Server running at https://localhost:".concat(port, "/"));
    });
}