
/*
export default function mysqlLoad() {
    // requireの設定
    const mysql = require('mysql');

    // MySQLとのコネクションの作成
    let connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        database: 'promotion',
        password: 'kayopile'
    });

    // 接続
    connection.connect();

    // userdataの取得
    connection.query('SELECT * from tags;', function (err, rows, fields) {
        if (err) { console.log('err: ' + err); }

        for (var i = 0; i < rows.length; i++) {
            console.log('name: ' + rows[i].name);
        }


    });
    // 接続終了
    connection.end();

}
*/

const express = require("express");
const app = express();

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