require('./less/styles.less');
var mainTemplate = require('./template/main.html');
var contentTemplate = require('./template/content.html');

var extend = require('./helpers/extend');
var offset = require('./helpers/offset');
var scroll = require('./helpers/scroll');
var templater = require('./helpers/templater');
var Connector = require('./connector');

/**
 * Tour
 *
 * @constructor
 *
 * @param {Object} properties Options to init
 */
function Tourux(properties) {
	if (!(this instanceof Tourux)) { return new Tourux(properties); }

	// Take over options
	extend(this, properties);

	this.init();
}

// Html content template
Tourux.prototype.contentTemplate = undefined;

// Current step number
Tourux.prototype.stepNumber = 0;

// Additional paddings around the helper element (px)
Tourux.prototype.helperElementPadding = 10;

// Enable transition animtaion for the helper
Tourux.prototype.helperLayerTransition = false;

// Content position offset related to helper element
Tourux.prototype.contentPositionOffset = 150;

// Connection line smoothness, from 0 to 1
Tourux.prototype.connectorSmoothness = 0.3;

// Connection line width
Tourux.prototype.connectorLineWidth = 2;

// Connection line color
Tourux.prototype.connectorColor = '#fff';

// Steps
Tourux.prototype.steps = [];

// Currently focused element
Tourux.prototype.$element = undefined;

// Elements
Tourux.prototype.$elements = {};


Tourux.prototype.init = function() {

	var self = this;

	if (this.steps.length === 0) { return; }

	this.insertMainTemplate();

	self.render();
	$(window).on('resize', () => self.refresh());
};

Tourux.prototype.render = function() {
	if (!this.steps[this.stepNumber]) { return; }

	var step = this.steps[this.stepNumber];

	// Focus current element
	if (this.$element) {
		this.$element.toggleClass('tourux-show-element', false);
	}
	this.$element = $(step.element);
	this.$element.toggleClass('tourux-show-element', true);

	// Change helper layer position to "cover" selected element
	this.setHelperLayerPosition();

	// Scroll to element
	this.scrollToSelected(() => {

		// Set current step content
		this.setContent();

		// Set content position
		this.setContentPosition();

		// Render connector
		this.renderConnector();
	});

};

Tourux.prototype.refresh = function() {
	if (this.$element) {
		this.setHelperLayerPosition();
		this.setContentPosition();
		this.renderConnector();
	}
};
Tourux.prototype.next = function() {
	if (this.stepNumber < this.steps.length - 1) {
		this.stepNumber++;
		this.render();
	} else {
		this.end();
	}
};
Tourux.prototype.prev = function() {
	if (this.stepNumber > 0) {
		this.stepNumber--;
		this.render();
	}
};
Tourux.prototype.end = function() {
	$(window).off('resize');
	this.removeMainTemplate();
};

////

Tourux.prototype.insertMainTemplate = function() {
	var self = this;

	this.$elements.main = $(mainTemplate);
	this.$elements.overlay = this.$elements.main.find('.tourux-overlay');
	this.$elements.content = this.$elements.main.find('.tourux-content');
	this.$elements.helper = this.$elements.main.find('.tourux-helper');
	this.$elements.connector = this.$elements.main.find('.tourux-connector');
	this.$elements.buttonClose = this.$elements.main.find('.tourux-button-close');
	this.$elements.buttonClose.on('click', () => { this.end(); });
	$('body').append(this.$elements.main);

	setTimeout(function() {
		self.$elements.main.toggleClass('in', true);
	}, 100);
};

Tourux.prototype.removeMainTemplate = function() {
	var self = this;
	
	this.$elements.main.toggleClass('in', false);
	setTimeout(function() {
		self.$elements.main.remove();
		self.$elements = {};
	}, 500);
};

Tourux.prototype.initConnector = function() {
	this.connector = new Connector({
		element: this.$elements.connector[0],
		from: '.tourux-box',
		to: '.tourux-helper',
		smoothness: this.connectorSmoothness,
		padding: 0,
		lineColor: this.connectorColor,
		lineWidth: this.connectorLineWidth
	});
};

Tourux.prototype.setHelperLayerPosition = function() {
	var focusedElementRect = offset(this.$element);
	var widthHeightPadding = this.helperElementPadding || 0;

	var width = focusedElementRect.width + widthHeightPadding;
	width = width > $(window).width() ?  $(window).width() : width;

	var height = focusedElementRect.height + widthHeightPadding;

	var top = focusedElementRect.top - widthHeightPadding / 2;
	top = top < 0 ? 0 : top;

	var left = focusedElementRect.left - widthHeightPadding / 2;
	left = left < 0 ? 0 : left;

	this.$elements.helper.css({
		width: width + 'px',
		height: height + 'px',
		top: top + 'px',
		left: left + 'px'
	});

};

Tourux.prototype.scrollToSelected = function(cb) {
	var rect = offset(this.$element);
	if (rect.bottom > window.scrollY + window.innerHeight ||
		rect.bottom < window.scrollY) {
		this.$elements.content.hide();
		this.$elements.connector.hide();
		scroll(this.$element, 800, () => {
			this.$elements.content.show();
			this.$elements.connector.show();
			cb();
		});
	} else {
		cb && cb();
	}
};

Tourux.prototype.setContent = function() {
	this.$elements.content.empty();
	var step = this.steps[this.stepNumber];
	var template = this.contentTemplate || contentTemplate;
	var $result = $(templater(template, step));

	if (step.previousButton) {
		$result.find('.tourux-button-previous').on('click', () => { this.prev(); });
	} else {
		$result.find('.tourux-button-previous').remove();
	}

	if (step.nextButton) {
		$result.find('.tourux-button-next').on('click', () => { this.next(); });
	} else {
		$result.find('.tourux-button-next').remove();
	}

	this.$elements.content.html($result);
};

Tourux.prototype.setContentPosition = function() {

	// Default offset from the focused element
	var positionOffset = this.contentPositionOffset;

	var windowHeight = window.innerHeight;
	var contentHeight = this.$elements.content.outerHeight();
	var focusedElementRect = offset(this.$element);

	// Relative height above and below the focused element
	var topHeight = focusedElementRect.top - window.scrollY;
	var bottomHeight = windowHeight + window.scrollY - focusedElementRect.bottom;

	var contentTop;
	if (topHeight > bottomHeight) {
		contentTop = focusedElementRect.top - contentHeight - positionOffset;
		contentTop = contentTop < window.scrollY ? window.scrollY : contentTop;
	} else {
		contentTop = focusedElementRect.bottom + positionOffset;
		contentTop = contentTop + contentHeight > windowHeight + window.scrollY ? windowHeight + window.scrollY - contentHeight : contentTop;
	}
	this.$elements.content.css({ top: contentTop });
};

Tourux.prototype.renderConnector = function() {
	if (!this.connector) {
		this.initConnector();
	}
	this.connector.update();
};

module.exports = Tourux;
