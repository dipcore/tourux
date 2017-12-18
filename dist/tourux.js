(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tourux", [], factory);
	else if(typeof exports === 'object')
		exports["tourux"] = factory();
	else
		root["tourux"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function extend(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];

		for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (element) {
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);
var mainTemplate = __webpack_require__(4);
var contentTemplate = __webpack_require__(5);

var extend = __webpack_require__(0);
var offset = __webpack_require__(1);
var scroll = __webpack_require__(6);
var templater = __webpack_require__(7);
var Connector = __webpack_require__(8);

/**
 * Tour
 *
 * @constructor
 *
 * @param {Object} properties Options to init
 */
function Tourux(properties) {
	if (!(this instanceof Tourux)) {
		return new Tourux(properties);
	}

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

Tourux.prototype.init = function () {

	var self = this;

	if (this.steps.length === 0) {
		return;
	}

	this.insertMainTemplate();

	self.render();
	$(window).on('resize', function () {
		return self.refresh();
	});
};

Tourux.prototype.render = function () {
	var _this = this;

	if (!this.steps[this.stepNumber]) {
		return;
	}

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
	this.scrollToSelected(function () {

		// Set current step content
		_this.setContent();

		// Set content position
		_this.setContentPosition();

		// Render connector
		_this.renderConnector();
	});
};

Tourux.prototype.refresh = function () {
	if (this.$element) {
		this.setHelperLayerPosition();
		this.setContentPosition();
		this.renderConnector();
	}
};
Tourux.prototype.next = function () {
	if (this.stepNumber < this.steps.length - 1) {
		this.stepNumber++;
		this.render();
	} else {
		this.end();
	}
};
Tourux.prototype.prev = function () {
	if (this.stepNumber > 0) {
		this.stepNumber--;
		this.render();
	}
};
Tourux.prototype.end = function () {
	$(window).off('resize');
	this.removeMainTemplate();
};

////

Tourux.prototype.insertMainTemplate = function () {
	var _this2 = this;

	var self = this;

	this.$elements.main = $(mainTemplate);
	this.$elements.overlay = this.$elements.main.find('.tourux-overlay');
	this.$elements.content = this.$elements.main.find('.tourux-content');
	this.$elements.helper = this.$elements.main.find('.tourux-helper');
	this.$elements.connector = this.$elements.main.find('.tourux-connector');
	this.$elements.buttonClose = this.$elements.main.find('.tourux-button-close');
	this.$elements.buttonClose.on('click', function () {
		_this2.end();
	});
	$('body').append(this.$elements.main);

	setTimeout(function () {
		self.$elements.main.toggleClass('in', true);
	}, 100);
};

Tourux.prototype.removeMainTemplate = function () {
	var self = this;

	this.$elements.main.toggleClass('in', false);
	setTimeout(function () {
		self.$elements.main.remove();
		self.$elements = {};
	}, 500);
};

Tourux.prototype.initConnector = function () {
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

Tourux.prototype.setHelperLayerPosition = function () {
	var focusedElementRect = offset(this.$element);
	var widthHeightPadding = this.helperElementPadding || 0;

	var width = focusedElementRect.width + widthHeightPadding;
	width = width > $(window).width() ? $(window).width() : width;

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

Tourux.prototype.scrollToSelected = function (cb) {
	var _this3 = this;

	var rect = offset(this.$element);
	if (rect.bottom > window.scrollY + window.innerHeight || rect.bottom < window.scrollY) {
		this.$elements.content.hide();
		this.$elements.connector.hide();
		scroll(this.$element, 800, function () {
			_this3.$elements.content.show();
			_this3.$elements.connector.show();
			cb();
		});
	} else {
		cb && cb();
	}
};

Tourux.prototype.setContent = function () {
	var _this4 = this;

	this.$elements.content.empty();
	var step = this.steps[this.stepNumber];
	var template = this.contentTemplate || contentTemplate;
	var $result = $(templater(template, step));

	if (step.previousButton) {
		$result.find('.tourux-button-previous').on('click', function () {
			_this4.prev();
		});
	} else {
		$result.find('.tourux-button-previous').remove();
	}

	if (step.nextButton) {
		$result.find('.tourux-button-next').on('click', function () {
			_this4.next();
		});
	} else {
		$result.find('.tourux-button-next').remove();
	}

	this.$elements.content.html($result);
};

Tourux.prototype.setContentPosition = function () {

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

Tourux.prototype.renderConnector = function () {
	if (!this.connector) {
		this.initConnector();
	}
	this.connector.update();
};

module.exports = Tourux;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<div class=\"tourux\">\r\n\r\n\t<button class=\"tourux-button-close\">×</button>\r\n\r\n\t<div class=\"tourux-helper\"></div>\r\n\t\r\n\t<div class=\"tourux-content\"></div>\r\n\r\n\t<div class=\"tourux-connector\"></div>\r\n\r\n\t<div class=\"tourux-overlay\"></div>\r\n\t\r\n</div>";

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "<div class=\"tourux-box\">\r\n\t<div class=\"tourux-title\">\r\n\t\t<h1>{{title}}</h1>\r\n\t</div>\r\n\t<div class=\"tourux-description\">\r\n\t\t{{description}}\r\n\t</div>\r\n\t<div class=\"tourux-buttons\">\r\n\t\t<button class=\"tourux-button tourux-button-previous\">{{previousButton}}</button>\r\n\t\t<button class=\"tourux-button tourux-button-next\">{{nextButton}}</button>\r\n\t</div>\r\n</div>\r\n";

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function scroll(element, duration, complete) {
	var offset = 20;
	$('html, body').animate({
		scrollTop: element.offset().top - offset
	}, {
		duration: duration || 800,
		complete: complete
	});
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function templater(tpl, data) {
	var re = /{{([^%>]+)?}}/g,
	    match;
	while (match = re.exec(tpl)) {
		tpl = tpl.replace(match[0], data[match[1]]);
	}
	return tpl;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Connection-line element controller
 *
 */
var extend = __webpack_require__(0);
var offset = __webpack_require__(1);
var Rect = __webpack_require__(9);

/**
 * Connector
 *
 * @constructor
 *
 * @param {Object} properties Options to init
 */
function Connector(properties) {
	if (!(this instanceof Connector)) {
		return new Connector(properties);
	}

	//take over options
	extend(this, properties);

	this.ns = 'http://www.w3.org/2000/svg';

	//ensure element
	if (!this.element) {
		//FIXME: this element may fail in IE etc
		this.element = document.createElement('connection-line');
	}

	//create path
	this.svg = document.createElementNS(this.ns, 'svg');
	this.path = document.createElementNS(this.ns, 'path');
	this.path.style.stroke = this.lineColor;
	this.path.style.fill = 'transparent';
	this.path.style.strokeWidth = this.lineWidth;

	//create marks
	this.lineEndEl = document.createElement('div');
	this.lineStartEl = document.createElement('div');
	this.lineMiddleEl = document.createElement('div');
	this.lineEndEl.className = 'connection-line-end';
	this.lineStartEl.className = 'connection-line-start';
	this.lineMiddleEl.className = 'connection-line-mark';
	this.lineEndEl.innerHTML = this.lineEnd;
	this.lineStartEl.innerHTML = this.lineStart;
	this.lineMiddleEl.innerHTML = this.lineMiddle;

	this.svg.appendChild(this.path);
	this.element.appendChild(this.svg);
	this.element.appendChild(this.lineEndEl);
	this.element.appendChild(this.lineStartEl);
	this.element.appendChild(this.lineMiddleEl);

	//set proper connector attributes
	this.update();
}

/**
 * Source/target element or coordinates
 */
Connector.prototype.from = [0, 0];
Connector.prototype.to = [100, 100];

/**
 * Display labels on top of the connector, e. g. →, ✘ or ✔
 */
Connector.prototype.lineEnd = '➤';
Connector.prototype.lineStart = '';
Connector.prototype.lineMiddle = '';

/**
 * Line style options
 */
Connector.prototype.lineWidth = 1;
Connector.prototype.lineColor = 'black';

/**
 * Curvature displays style of rendering
 * 1 - smooth curve
 * 0 - straight line
 */
Connector.prototype.smoothness = 1;

/**
 * Padding - the area around the target
 * to let connections with the opposite directions take place
 */
Connector.prototype.padding = 20;

/**
 * Adittional paddings around the From and To elements
 */
Connector.prototype.fromElementPadding = 10;
Connector.prototype.toElementPadding = 10;

/**
 * Initial directions, by default undefined
 */
Connector.prototype.fromDirection = undefined;
Connector.prototype.toDirection = undefined;

/**
 * Update position, according to the selectors, if any
 */
Connector.prototype.update = function () {

	//no sense to update detached element
	if (!this.element.parentNode) {
		return;
	}

	//get target offsets
	var from = getOffset(this.from);
	var to = getOffset(this.to);

	// Apply padding
	from = addPaddings(from, this.fromElementPadding);
	to = addPaddings(to, this.toElementPadding);

	//absolute size rect, covering both from and to
	//FIXME: add margins
	var size = Rect(Math.min(to.left, from.left) - this.padding, Math.min(to.top, from.top) - this.padding, Math.max(to.right, from.right) + this.padding, Math.max(to.bottom, from.bottom) + this.padding);

	//FIXME: set z-index lower than the both targets

	//ensure element size
	this.svg.setAttribute('width', Math.max(size.width, this.lineWidth));
	this.svg.setAttribute('height', Math.max(size.height, this.lineWidth));

	//calculate needed parent offsets
	var parentOffset = Rect();
	if (this.element.offsetParent && this.element.offsetParent !== document.body && this.element.offsetParent !== document.documentElement) {
		parentOffset = offset(this.element.offsetParent);
	}

	//place self so to fit space between source and target
	this.element.style.top = size.top - parentOffset.top + 'px';
	this.element.style.left = size.left - parentOffset.left + 'px';

	//centers of masses - relative coords
	var fromCenter = [from.left + from.width / 2 - size.left, from.top + from.height / 2 - size.top];
	var toCenter = [to.left + to.width / 2 - size.left, to.top + to.height / 2 - size.top];

	//detect dominant direction vector based on centers of masses
	var mainV = [toCenter[0] - fromCenter[0], toCenter[1] - fromCenter[1]];

	var angle = Math.atan2(-mainV[1], mainV[0]);
	var Pi = Math.PI;
	if (angle < 0) {
		angle += Pi * 2;
	}

	//if initial directions are not specified - detect based on angle
	var fromDirection = this.fromDirection || (angle < Pi / 4 ? 'right' : angle < 3 * Pi / 4 ? 'top' : angle < 5 * Pi / 4 ? 'left' : angle < 7 * Pi / 4 ? 'bottom' : 'right');
	var toDirection = this.toDirection || (angle < Pi / 4 ? 'left' : angle < 3 * Pi / 4 ? 'bottom' : angle < 5 * Pi / 4 ? 'right' : angle < 7 * Pi / 4 ? 'top' : 'left');

	//calculate start/end points from base directions
	//express in relative coords
	var start0 = getDirectionCoords(fromDirection, from, size);
	var end0 = getDirectionCoords(toDirection, to, size);
	var center = [(end0[0] + start0[0]) / 2, (end0[1] + start0[1]) / 2];

	//form path from 3-parts (most difficult case)
	//at first align initial directions around the targets
	//then - draw through the central point
	var start1 = [toUnit(start0[0] - fromCenter[0]) * this.smoothness * 500 + start0[0], toUnit(start0[1] - fromCenter[1]) * this.smoothness * 500 + start0[1]];
	var end1 = [toUnit(end0[0] - toCenter[0]) * this.smoothness * 500 + end0[0], toUnit(end0[1] - toCenter[1]) * this.smoothness * 500 + end0[1]];

	//form path
	var path = 'M ' + start0[0] + ' ' + start0[1] + ' ' + 'C ' + start1[0] + ' ' + start1[1] + ' ' + end1[0] + ' ' + end1[1] + ' ' + end0[0] + ' ' + end0[1];

	//set path coords
	this.path.setAttribute('d', path);

	//correct position of marks
	var leSize = [this.lineEndEl.clientWidth, this.lineEndEl.clientHeight];
	var lsSize = [this.lineStartEl.clientWidth, this.lineStartEl.clientHeight];
	var lmSize = [this.lineMiddleEl.clientWidth, this.lineMiddleEl.clientHeight];
	this.lineEndEl.style.left = end0[0] - leSize[0] / 2 + 'px';
	this.lineEndEl.style.top = end0[1] - leSize[1] / 2 + 'px';
	this.lineStartEl.style.left = start0[0] - lsSize[0] / 2 + 'px';
	this.lineStartEl.style.top = start0[1] - lsSize[1] / 2 + 'px';
	this.lineMiddleEl.style.left = center[0] - lmSize[0] / 2 + 'px';
	this.lineMiddleEl.style.top = center[1] - lmSize[1] / 2 + 'px';

	//rotate the marks properly
	var len = this.path.getTotalLength();
	var start = this.path.getPointAtLength(0);
	var startNext = this.path.getPointAtLength(lsSize[0] / 2);
	var end = this.path.getPointAtLength(len);
	var endNext = this.path.getPointAtLength(len - leSize[0] / 2);
	var startAngle = Math.atan2(startNext.y - start.y, startNext.x - start.x);
	var endAngle = Math.atan2(-endNext.y + end.y, -endNext.x + end.x);
	this.lineEndEl.style.transform = 'rotate(' + endAngle.toFixed(2) + 'rad)';
	this.lineStartEl.style.transform = 'rotate(' + startAngle.toFixed(2) + 'rad)';

	//map diff to a 0..1 coef
	function toUnit(value) {
		return value > 0 ? 1 : value < 0 ? -1 : 0;
	}

	//return coords from the direction
	function getDirectionCoords(direction, rect, size) {
		var coords = [0, 0];

		switch (direction) {
			case 'top':
				coords[0] = rect.left + rect.width / 2 - size.left;
				coords[1] = rect.top - size.top;
				break;
			case 'bottom':
				coords[0] = rect.left + rect.width / 2 - size.left;
				coords[1] = rect.bottom - size.top;
				break;
			case 'left':
				coords[0] = rect.left - size.left;
				coords[1] = rect.top + rect.height / 2 - size.top;
				break;
			case 'right':
				coords[0] = rect.right - size.left;
				coords[1] = rect.top + rect.height / 2 - size.top;
				break;
		}

		return coords;
	}

	//return absolute offset for a target
	function getOffset(target) {
		if (target instanceof Array) {
			return Rect(target[0], target[1], target[2] || target[0], target[3] || target[1]);
		}

		if (typeof target === 'string') {
			//`100, 200` - coords relative to offsetParent
			var coords = target.split(/\s*,\s*/).length;
			if (coords === 2) {
				return Rect(parseInt(coords[0]), parseInt(coords[1]));
			}
		}

		if (!target) {
			return Rect();
		}

		//`.selector` - calc selected target coords relative to offset parent
		return offset(target);
	}

	function addPaddings(rect, padding) {
		return {
			left: rect.left - padding,
			top: rect.top - padding,
			right: rect.right + padding,
			bottom: rect.bottom + padding,
			width: rect.width + 2 * padding,
			height: rect.height + 2 * padding
		};
	}
};

module.exports = Connector;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Simple rect constructor.
 * It is just faster and smaller than constructing an object.
 *
 * @module mucss/rect
 *
 * @param {number} l left
 * @param {number} t top
 * @param {number} r right
 * @param {number} b bottom
 *
 * @return {Rect} A rectangle object
 */
module.exports = function Rect(l, t, r, b) {
  if (!(this instanceof Rect)) {
    return new Rect(l, t, r, b);
  }

  this.left = l || 0;
  this.top = t || 0;
  this.right = r || 0;
  this.bottom = b || 0;
  this.width = Math.abs(this.right - this.left);
  this.height = Math.abs(this.bottom - this.top);
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=tourux.js.map