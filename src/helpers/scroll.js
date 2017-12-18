module.exports = function scroll(element, duration, complete) {
	var offset = 20;
	$('html, body').animate({
		scrollTop: element.offset().top - offset
	}, {
		duration: duration || 800,
		complete: complete
	});
};