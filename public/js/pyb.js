(function($) {
	"use strict";
	var company, boss;

	$('#pyb-main form').submit(function(e) {
		e.preventDefault();
		var t = $(e.target);

		if(t.hasClass('pyb-company')) {
			company = t.find('input#company').val();
			$('div.pyb-company').addClass('d-none');
			$('div.pyb-boss').removeClass('d-none');
			$('input#boss').focus();
		}
		else if(t.hasClass('pyb-boss')) {
			boss = t.find('input#boss').val();

			$('div.pyb-boss').addClass('d-none');
			$('div.pyb-results').removeClass('d-none');

			$.post('/add', {company_name: company, boss: boss}, function(response) {
				var result = response.success;

				if(result == true) {
					var company_id = response.company_id;

					$.get('/get/votes', {company_id: company_id}, function(response) {
						var votes = response.votes;

						$('.pyb-results-company').text(company_name);

						$.each(votes, function(i, vote) {
							$('.pyb-results-content table').append('<tr><th>' + vote.boss + '</th><td>' + vote.count + '</td></tr>');
						});
					});

				}
				else {
					$('.pyb-results-content').text('Argh, sorry, something went wrong while submitting your boss. Please try again later.')
				}
			});
		}
	})
})(jQuery);
