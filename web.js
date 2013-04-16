var express = require("express");
var app = express();

app.get('/', function(req, res) {
	res.send('Testing');
})

var port = process.env.PORT || 5000;

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: process.env.HOSTNAME,
	user: process.env.USERNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE
});
connection.connect();

/**
* Main APP
*/
app.listen(port, function () {
	connection.query('SELECT * FROM articles LIMIT 1', function (err, rows, fields) {
		if(err) throw err;
		res.send(rows[0].title + '<br />');
	});
});


process.on('SIGTERM', function () {
	console.log('CLosing app');
	//connection.end();
})
