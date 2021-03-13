let cors = require("cors"),
    helmet = require("helmet"),
    cookieParser = require("cookie-parser"),
    parser = require("body-parser"),
    morgan = require("morgan"),
    express = require("express"),
    app = express(),
    session = require("express-session"),
    path = require("path"),
    fs = require("fs"),
    https = require("https"),
    ejs = require("ejs"),
    { ipcRenderer } = require("electron");
require('dotenv').config();
let BDD = false;
let bdError = null;

var privateKey = fs.readFileSync(`${process.env.HOST_LISTEN}-key.pem`, "utf8"),
    certificate = fs.readFileSync(`${process.env.HOST_LISTEN}.pem`, "utf8"),
    credentials = { key: privateKey, cert: certificate };

// BDD Connection

let mongo = require('mongodb'),
    ObjectId = require('mongodb').ObjectID;

var url = "mongodb://127.0.0.1:27017/";
let dbo = null;

/* filterInt = (value) => {
    if (/^(-|\+)?(\d+|Infinity)$/.test(value))
        return Number(value);
    return NaN;
} */

filterInt = value => { return parseFloat(value) };

mongo.MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    bdError = err;
    if (err) throw err;
    console.info("[DATABASE] -  Created & Connected");
    BDD = true;
    dbo = db.db("McDonalds_Admin");
    dbo.createCollection("Product", (err, res) => { console.log("[DATABASE] {INFO} - Collection Created") });
    dbo.createCollection("Menu", (err, res) => { console.log("[DATABASE] {INFO} - Collection Created") });
    dbo.createCollection("Calendar", (err, res) => { console.log("[DATABASE] {INFO} - Collection Created") });
    dbo.createCollection("Supplement", (err, res) => { console.log("[DATABASE] {INFO} - Collection Created") });
});

// Express Server

app.set('trust proxy', 1);
app.use(session({
    secret: 'KronosDevPro',
    name: 'SessionID',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 }
}));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use(parser.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'node_modules')));
app.set('views', './public/view');
app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/state-bd', (_req, res) => {
    BDD ? res.send({ state: "connect-bd" }) : res.send({ state: "error-db", error: bdError });
});

app.post('/NewProduct', (_req, res) => {
    console.log('/NewProduct', _req.body);

    dbo.collection("Product").insertOne({ "Menu": _req.body.Menu, "Supplement": _req.body.Supplement, "Size": _req.body.Size, "Name": _req.body.Name, "Price": filterInt(_req.body.Price), "Type": _req.body.Type, "CatType": _req.body.CatType });
});

app.post('/NewMenu', (_req, res) => {
    console.log('/NewMenu', _req.body);

    dbo.collection("Menu").insertOne({ "Name": _req.body.Name, "Price": filterInt(_req.body.Price), "Child": _req.body.Child, "CatType": _req.body.CatType });
});

app.post('/NewSupplement', (_req, res) => {
    console.log('/NewSupplement', _req.body);

    dbo.collection("Supplement").insertOne({ "Name": _req.body.Name, "Price": filterInt(_req.body.Price), "CatType": _req.body.CatType });
});

app.post('/EditProduct', (_req, res) => {
    console.log('EditProduct', _req.body);

    dbo.collection("Product").updateOne({ "_id": ObjectId(_req.body._id) }, { "Menu": _req.body.Menu, "Supplement": _req.body.Supplement, "Size": _req.body.Size, "Name": _req.body.Name, "Price": filterInt(_req.body.Price), "Type": _req.body.Type, "CatType": _req.body.CatType });
});

app.post('/EditMenu', (_req, res) => {
    console.log('EditMenu', _req.body);

    dbo.collection("Menu").updateOne({ "_id": ObjectId(_req.body._id) }, { "Name": _req.body.Name, "Price": filterInt(_req.body.Price), "Child": _req.body.Child, "CatType": _req.body.CatType });
});

app.post('/EditSupplement', (_req, res) => {
    console.log('EditSupplement', _req.body);

    dbo.collection("Menu").updateOne({ "_id": ObjectId(_req.body._id) }, { "Name": _req.body.Name, "Price": filterInt(_req.body.Price), "CatType": _req.body.CatType });
});

app.post('/GetProduct', (_req, res) => {
    console.log('/GetProduct', _req.body);

    if (_req.body.search === undefined && _req.body.column === undefined) {
        dbo.collection("Product").find().toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (_req.body.search !== "" && _req.body.column === undefined) {
        dbo.collection("Product").find({ "Name": { $regex: `.*${_req.body.search}.*` } }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (_req.body.search !== "" && _req.body.column !== "") {
        if (_req.body.column === "_id") {
            dbo.collection("Product").find({ "_id": ObjectId(_req.body.search) }).toArray((err, result) => {
                if (err) throw err;
                res.send(result);
            });
        };
    };
});

app.post('/GetMenu', (_req, res) => {
    console.log('/GetMenu', _req.body, _req.body.column);

    if (_req.body.search === undefined && _req.body.column === undefined) {
        dbo.collection("Menu").find().toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (_req.body.search !== "" && _req.body.column === undefined) {
        dbo.collection("Menu").find({ "Name": { $regex: `.*${_req.body.search}.*` } }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (_req.body.search !== "" && _req.body.column !== "") {
        if (_req.body.column === "_id") {
            dbo.collection("Menu").find({ "_id": ObjectId(_req.body.search) }).toArray((err, result) => {
                if (err) throw err;
                res.send(result);
            });
        };
    };
});

app.post('/GetSupplement', (_req, res) => {
    console.log('/GetSupplement', _req.body);

    if (_req.body.search === undefined && _req.body.column === undefined) {
        dbo.collection("Supplement").find().toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (_req.body.search !== "" && _req.body.column === undefined) {
        dbo.collection("Supplement").find({ "Name": { $regex: `.*${_req.body.search}.*` } }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (_req.body.search !== "" && _req.body.column !== "") {
        if (_req.body.column === "_id") {
            dbo.collection("Supplement").find({ "_id": ObjectId(_req.body.search) }).toArray((err, result) => {
                if (err) throw err;
                res.send(result);
            });
        };
    }
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT_LISTEN, process.env.HOST_LISTEN);
console.info(`[*] Listen on https://${process.env.HOST_LISTEN}/`);

app.post('/quit', () => {
    dbo.close();
    httpsServer.close();
});