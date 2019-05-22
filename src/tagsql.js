
const express = require("express");
const app = express();


const multer = require('multer');


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var urlparser = bodyParser.urlencoded({ extended: false });


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

//選択画像取得
app.post("/findimage", urlparser, function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');

    const id = req.body['imageid'];
    connection.query('SELECT * from images where id=?', [id], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

//保存ディレクトリ
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
//画像のアップロード
app.post('/uploadimage', upload.single('addnewimage'), function (req, res, next) {
    const addnewimage = req.body['imageTitle'];
    const thisURL = "http://localhost:4000/imagepath/" + req.file.originalname;
    const filename = addnewimage;
    const filesize = req.file.size;

    //Mysqlにinsert
    connection.query('INSERT INTO images (url, name, size) VALUES (?, ?, ?)', [thisURL, filename, filesize], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
    });


    res.json({ 'result': 'success!' });
});
//画像の削除
app.put('/deleteimage', function (req, res) {
    const id = req.body['imageid'];
    connection.query('DELETE from images where id=?', [id], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});