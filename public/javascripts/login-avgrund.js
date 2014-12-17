$(document).ready(function() {
	$('#show').avgrund({
		height: 200,
		holderClass: 'custom',
		showClose: true,
		showCloseText: 'close',
		// onBlurContainer: '.container',
		template: $('#modal')
	});
});