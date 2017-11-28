var express = require('express');
var pg = require('pg');
var router = express.Router();

const connectionString = process.env.DATABASE_URL;

var pool = new pg.Pool()

router.get('/companies', function(request, response, next) {
	pool.connect(function(err, client, done) {
		client.query('SELECT company_name FROM companies ORDER BY company_name ASC', function(err, result) {
			done();
			if (err) {
				console.error(err); response.send("Error " + err);
			}
			else {

				response.json({companies: result.rows.map(function(v) { return v.company_name })});
			}
		});
	});
});

router.get('/votes', function(request, response, next) {
	var company_id = request.query.company_id || undefined;

	if(typeof(company_id) === 'undefined') {
		console.log("Got a GET VOTES request without a company_id");
		response.send("Error: Please provide a company_id");
		return;
	}

	pool.connect(function(err, client, done) {
		client.query('SELECT boss, count(*) FROM votes WHERE company_id=$1 GROUP BY boss ORDER BY boss ASC', [company_id], function(err, result) {
			done();
			if (err) {
				console.error(err); response.send("Error " + err);
			}
			else {
				response.json({votes: result.rows});
			}
		});
	});
});

module.exports = router;
