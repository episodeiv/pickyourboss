var express = require('express');
var pg = require('pg');
var router = express.Router();

const connectionString = process.env.DATABASE_URL;

var pool = new pg.Pool()

router.post('/', function(request, response, next) {
	var company_name = request.body.company_name || undefined;
	var boss = request.body.boss || undefined;
	var sourceip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

	if(typeof(company_name) === 'undefined') {
		console.log("Got an ADD request missing a company_name");
		response.send("Error: Please provide a company_name");
		return;
	}
	if(typeof(boss) === 'undefined') {
		console.log("Got an ADD request missing a boss");
		response.send("Error: Please provide a boss");
		return;
	}

	// TODO: Rate-Limiting
	(async () => {
		const client = await pool.connect();
		var company_id;

		try {
			const matching_companies = await client.query('SELECT company_id FROM companies WHERE lower(company_name) = $1',
				[company_name.toLowerCase()]);

			// Found matching company
			if(matching_companies.rows.length > 0) {
				company_id = matching_companies.rows[0].company_id;
			}
			// Create new company
			else {
				const create_company = await client.query('INSERT INTO companies (company_name) VALUES($1) RETURNING company_id',
					[company_name]);

				company_id = create_company.rows[0].company_id;
			}


			const insert_vote = await client.query('INSERT INTO votes (company_id, boss, sourceip) VALUES($1, $2, $3)',
				[company_id, boss, sourceip]);


			response.json({success: true});
			return;

		} catch(err) {
			console.error(err.stack);
			response.json({success: false});
		}

	})().catch(e => {
		console.error(e.stack)
		response.json({success: false});
	});
});

module.exports = router;
