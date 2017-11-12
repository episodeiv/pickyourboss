var express = require('express');
var pg = require('pg');
var router = express.Router();

const connectionString = process.env.DATABASE_URL;

var pool = new pg.Pool()


router.get('/', function(request, response, next) {
	pool.connect(function(err, client, done) {
		client.query('SELECT * FROM test_table', function(err, result) {
			done();
			if (err)
				{ console.error(err); response.send("Error " + err); }
			else
				{ response.render('pages/db', {results: result.rows} ); }
		});
	});
});

module.exports = router;
