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
		}
		else if(t.hasClass('pyb-boss')) {
			boss = t.find('input#boss').val();

			$('div.pyb-boss').addClass('d-none');
			$('div.pyb-results').removeClass('d-none');

			alert(company);
			alert(boss);
		}
	})
})(jQuery);
