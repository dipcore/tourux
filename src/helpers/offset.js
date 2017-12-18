module.exports = function(element) {
	element = $(element);
	var offset = element.offset();
	var height = element.outerHeight();
	var width = element.outerWidth();
	return {
		height: height,
		width: width,
		top: offset.top,
		bottom: offset.top + height,
		left: offset.left,
		right: offset.left + width
	};
};