
const express = require("express");
const app = express();


const multer = require('multer');



app.get("/", function (req, res) {
    res.send("go to /posts to see posts");
});

app.listen(4000, function () {
    console.log("Example app listening on port 4000!");
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


//MySQL---------------------------------------
// requireの設定
const mysql = require('mysql');

// MySQLとのコネクションの作成
let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'promotion',
    password: 'kayopile'
});

app.get("/posts", function (req, res) {
    connection.query('SELECT * from tags LIMIT 0, 10', function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.get("/tags", function (req, res) {
    connection.query('SELECT * from tags LIMIT 0, 10', function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.get("/images", function (req, res) {
    connection.query('SELECT * from images LIMIT 0, 100', function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.use("/imagepath", express.static(__dirname + "/promotionImages"));

const url = "promotionImages";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 保存したいパス

        cb(null, url);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);

    }
});
const upload = multer({
    storage: storage
});


app.post('/uploadimage', upload.single('addnewimage'), function (req, res, next) {
    const addnewimage = req.body;
    const req_file_json = JSON.stringify(req.file);
    const originalname = JSON.stringify(req.file.originalname);
    const fname = JSON.stringify(req.file.filename);
    //console.log(req_file_json);
    console.log(originalname);
    console.log(fname);
    const thisURL = "http://localhost:4000/imagepath/" + req.file.originalname;
    const filename = req.file.originalname;

    //Mysqlにinsert
    connection.query('INSERT INTO images (url, name, sizeH, sizeW) VALUES (?, ?, ?, ?)', [thisURL, filename, 10, 10], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
    });

    res.json({ 'result': 'success!' });
});