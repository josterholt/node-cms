var express = require("express");
var app = express();

app.get('/', function(req, res) {
	res.send('Testing');
})

var port = process.env.PORT || 5000;

app.listen(port, function () {
	console.log("Listening on " + port);
});

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: process.env.HOSTNAME,
	user: process.env.USERNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE
});
connection.connect();
connection.query('SELECT * FROM articles LIMIT 1', function (err, rows, fields) {
	if(err) throw err;
	console.log(rows);
});
connection.end();