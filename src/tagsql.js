
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

app.post('/gettags', function (req, res) {
    const id = req.body;
    var str = [];
    for (var i in id) {
        str.push(id[i].tagid);
    }
    connection.query('SELECT * from tags where id in (?)', [str], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });

});

app.post('/addtags', function (req, res) {
    const tag = req.body['newtag'];
    connection.query('INSERT INTO tags (name) VALUES (?)', [tag], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/gettagtoimage', function (req, res) {
    const id = req.body['imageid'];
    connection.query('SELECT * from tagtoimage where imageid=?', [id], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/gettagtoimageBytag', function (req, res) {
    const id = req.body['tagid'];
    connection.query('SELECT * from tagtoimage where tagid=?', [id], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/addtagtoimage', function (req, res) {
    const imageid = req.body['imageid'];
    const tagid = req.body['tagid'];
    connection.query('INSERT INTO tagtoimage (imageid,tagid) VALUES (?, ?)', [imageid, tagid], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/deletetagtoimage', function (req, res) {
    const imageid = req.body['imageid'];
    const idlist = req.body['idlist'];
    connection.query('DELETE from tagtoimage where imageid=? and tagid in (?)', [imageid, idlist], function (
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

//選択画像取得*複数
app.post("/findimagemulti", urlparser, function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');

    const id = req.body['imageid'];
    connection.query('SELECT * from images where id in (?)', [id], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/updateimage', function (req, res) {
    const imageid = req.body['imageid'];
    const name = req.body['nickname'];
    connection.query('UPDATE images SET name=? where (id=?)', [name, imageid], function (
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
    connection.query('DELETE from tagtoimage where imageid=?', [id], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
    });
    connection.query('DELETE from images where id=?', [id], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        res.send(results);
    });
});