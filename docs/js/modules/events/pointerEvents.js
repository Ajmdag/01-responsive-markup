(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var scaleValue = 1;
var brightnessValue = 1;
var prevDiff = -1;
var prevAngle = null;

var eventCache = [];
var elementInfo = {};

function removeEvent(event) {
	for (var i = 0; i < eventCache.length; i += 1) {
		if (eventCache[i].pointerId === event.pointerId) {
			eventCache.splice(i, 1);
			break;
		}
	}
}

function pointerUpHandler(event) {
	elementInfo.oldComputedX = elementInfo.computedX;
	elementInfo.oldComputedY = elementInfo.computedY;

	removeEvent(event);

	if (eventCache.length < 2) prevDiff = -1;
}

// Создаем объект для вспомогательных функций
var helpersFunctions = {
	getDistaneBetweenTwoDots: function getDistaneBetweenTwoDots(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	},
	getAngle: function getAngle(x1, y1, x2, y2) {
		return Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
	},
	setComputedValuesViaLimits: function setComputedValuesViaLimits(computedX, computedY) {
		if (computedX > elementInfo.xMaxLimit) elementInfo.computedX = elementInfo.xMaxLimit;
		if (computedX < elementInfo.xMinLimit) elementInfo.computedX = elementInfo.xMinLimit;
		if (computedY < elementInfo.yMinLimit) elementInfo.computedY = elementInfo.yMinLimit;
		if (computedY > elementInfo.yMaxLimit) elementInfo.computedY = elementInfo.yMaxLimit;
	},
	setLimits: function setLimits() {
		elementInfo.yMaxLimit = (elementInfo.el.offsetHeight * scaleValue - elementInfo.el.parentNode.offsetHeight) / 4;
		elementInfo.yMinLimit = -(elementInfo.el.offsetHeight * scaleValue - elementInfo.el.parentNode.offsetHeight) / 4;
		elementInfo.xMaxLimit = (elementInfo.el.offsetWidth * scaleValue - elementInfo.el.parentNode.offsetWidth) / 4;
		elementInfo.xMinLimit = -(elementInfo.el.offsetWidth * scaleValue - elementInfo.el.parentNode.offsetWidth) / 4;
	}
};

function pointerDownHandler(event) {
	eventCache.push(event);

	// Запишем позицию курсора
	elementInfo.startedPointDownX = event.clientX;
	elementInfo.startedPointDownY = event.clientY;
}

function pointerMoveHandler(event) {
	for (var i = 0; i < eventCache.length; i += 1) {
		if (event.pointerId === eventCache[i].pointerId) {
			eventCache[i] = event;
			break;
		}
	}

	if (eventCache.length === 1) {
		elementInfo.computedX = event.clientX - elementInfo.startedPointDownX + elementInfo.oldComputedX;
		elementInfo.computedY = event.clientY - elementInfo.startedPointDownY + elementInfo.oldComputedY;

		helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY);

		event.target.style.transform = 'scale(' + scaleValue + ') translate(' + elementInfo.computedX + 'px, ' + elementInfo.computedY + 'px)';
	}

	if (eventCache.length === 2) {
		var x1 = eventCache[0].clientX;
		var y1 = eventCache[0].clientY;
		var x2 = eventCache[1].clientX;
		var y2 = eventCache[1].clientY;

		var curAngle = helpersFunctions.getAngle(x1, y1, x2, y2);

		if (prevAngle) {
			var increaseOn = 0.01;
			if (curAngle > prevAngle) {
				brightnessValue += increaseOn;
				elementInfo.el.style.filter = 'brightness(' + brightnessValue + ')';
			}
			if (curAngle < prevAngle) {
				brightnessValue -= increaseOn;
				elementInfo.el.style.filter = 'brightness(' + brightnessValue + ')';
			}
		}
		prevAngle = curAngle;

		var curDiff = Math.abs(eventCache[0].clientX - eventCache[1].clientX);

		if (prevDiff > 0) {
			var pinchDiff = curDiff - prevDiff;
			if (curDiff > prevDiff) {
				// ZOOM IN
				if (scaleValue >= 1) scaleValue += pinchDiff / 100;
				if (scaleValue > 2) scaleValue = 2;

				helpersFunctions.setLimits();
				helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY);

				elementInfo.el.style.transform = 'scale(' + scaleValue + ') translate(' + elementInfo.computedX + 'px, ' + elementInfo.computedY + 'px)';
			}

			if (curDiff < prevDiff) {
				// ZOOM OUT
				if (scaleValue >= 1) scaleValue -= -pinchDiff / 100;
				if (scaleValue < 1) scaleValue = 1;

				helpersFunctions.setLimits();
				helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY);

				elementInfo.el.style.transform = 'scale(' + scaleValue + ') translate(' + elementInfo.computedX + 'px, ' + elementInfo.computedY + 'px)';
			}
		}

		prevDiff = curDiff;
	}
}

function init() {
	elementInfo.el = document.querySelector('#hoover');

	// Первичные значения
	elementInfo.oldComputedX = 0;
	elementInfo.oldComputedY = 0;

	elementInfo.computedX = 0;
	elementInfo.computedY = 0;

	elementInfo.yMaxLimit = 0;
	elementInfo.yMinLimit = 0;
	elementInfo.xMaxLimit = 0;
	elementInfo.xMinLimit = 0;

	elementInfo.initialWidth = elementInfo.el.offsetWidth;
	elementInfo.initialHeight = elementInfo.el.offsetHeight;

	elementInfo.containerHeight = elementInfo.el.parentNode.offsetHeight;
	elementInfo.containerWidth = elementInfo.el.parentNode.offsetHeight;

	// Переопределяем события
	elementInfo.el.onpointerdown = pointerDownHandler;
	elementInfo.el.onpointermove = pointerMoveHandler;
	elementInfo.el.onpointerup = pointerUpHandler;
	elementInfo.el.onpointercancel = pointerUpHandler;
	elementInfo.el.onpointerout = pointerUpHandler;
	elementInfo.el.onpointerleave = pointerUpHandler;
}

if ('ontouchstart' in document.documentElement) {
	document.body.onload = init();
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL2Zha2VfODE3YmQ2YmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzY2FsZVZhbHVlID0gMTtcbnZhciBicmlnaHRuZXNzVmFsdWUgPSAxO1xudmFyIHByZXZEaWZmID0gLTE7XG52YXIgcHJldkFuZ2xlID0gbnVsbDtcblxudmFyIGV2ZW50Q2FjaGUgPSBbXTtcbnZhciBlbGVtZW50SW5mbyA9IHt9O1xuXG5mdW5jdGlvbiByZW1vdmVFdmVudChldmVudCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50Q2FjaGUubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRpZiAoZXZlbnRDYWNoZVtpXS5wb2ludGVySWQgPT09IGV2ZW50LnBvaW50ZXJJZCkge1xuXHRcdFx0ZXZlbnRDYWNoZS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcG9pbnRlclVwSGFuZGxlcihldmVudCkge1xuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFggPSBlbGVtZW50SW5mby5jb21wdXRlZFg7XG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWSA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWTtcblxuXHRyZW1vdmVFdmVudChldmVudCk7XG5cblx0aWYgKGV2ZW50Q2FjaGUubGVuZ3RoIDwgMikgcHJldkRpZmYgPSAtMTtcbn1cblxuLy8g0KHQvtC30LTQsNC10Lwg0L7QsdGK0LXQutGCINC00LvRjyDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0YTRg9C90LrRhtC40LlcbnZhciBoZWxwZXJzRnVuY3Rpb25zID0ge1xuXHRnZXREaXN0YW5lQmV0d2VlblR3b0RvdHM6IGZ1bmN0aW9uIGdldERpc3RhbmVCZXR3ZWVuVHdvRG90cyh4MSwgeTEsIHgyLCB5Mikge1xuXHRcdHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDEgLSB4MiwgMikgKyBNYXRoLnBvdyh5MSAtIHkyLCAyKSk7XG5cdH0sXG5cdGdldEFuZ2xlOiBmdW5jdGlvbiBnZXRBbmdsZSh4MSwgeTEsIHgyLCB5Mikge1xuXHRcdHJldHVybiBNYXRoLmF0YW4yKHkxIC0geTIsIHgxIC0geDIpICogMTgwIC8gTWF0aC5QSTtcblx0fSxcblx0c2V0Q29tcHV0ZWRWYWx1ZXNWaWFMaW1pdHM6IGZ1bmN0aW9uIHNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGNvbXB1dGVkWCwgY29tcHV0ZWRZKSB7XG5cdFx0aWYgKGNvbXB1dGVkWCA+IGVsZW1lbnRJbmZvLnhNYXhMaW1pdCkgZWxlbWVudEluZm8uY29tcHV0ZWRYID0gZWxlbWVudEluZm8ueE1heExpbWl0O1xuXHRcdGlmIChjb21wdXRlZFggPCBlbGVtZW50SW5mby54TWluTGltaXQpIGVsZW1lbnRJbmZvLmNvbXB1dGVkWCA9IGVsZW1lbnRJbmZvLnhNaW5MaW1pdDtcblx0XHRpZiAoY29tcHV0ZWRZIDwgZWxlbWVudEluZm8ueU1pbkxpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFkgPSBlbGVtZW50SW5mby55TWluTGltaXQ7XG5cdFx0aWYgKGNvbXB1dGVkWSA+IGVsZW1lbnRJbmZvLnlNYXhMaW1pdCkgZWxlbWVudEluZm8uY29tcHV0ZWRZID0gZWxlbWVudEluZm8ueU1heExpbWl0O1xuXHR9LFxuXHRzZXRMaW1pdHM6IGZ1bmN0aW9uIHNldExpbWl0cygpIHtcblx0XHRlbGVtZW50SW5mby55TWF4TGltaXQgPSAoZWxlbWVudEluZm8uZWwub2Zmc2V0SGVpZ2h0ICogc2NhbGVWYWx1ZSAtIGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0KSAvIDQ7XG5cdFx0ZWxlbWVudEluZm8ueU1pbkxpbWl0ID0gLShlbGVtZW50SW5mby5lbC5vZmZzZXRIZWlnaHQgKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQpIC8gNDtcblx0XHRlbGVtZW50SW5mby54TWF4TGltaXQgPSAoZWxlbWVudEluZm8uZWwub2Zmc2V0V2lkdGggKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRXaWR0aCkgLyA0O1xuXHRcdGVsZW1lbnRJbmZvLnhNaW5MaW1pdCA9IC0oZWxlbWVudEluZm8uZWwub2Zmc2V0V2lkdGggKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRXaWR0aCkgLyA0O1xuXHR9XG59O1xuXG5mdW5jdGlvbiBwb2ludGVyRG93bkhhbmRsZXIoZXZlbnQpIHtcblx0ZXZlbnRDYWNoZS5wdXNoKGV2ZW50KTtcblxuXHQvLyDQl9Cw0L/QuNGI0LXQvCDQv9C+0LfQuNGG0LjRjiDQutGD0YDRgdC+0YDQsFxuXHRlbGVtZW50SW5mby5zdGFydGVkUG9pbnREb3duWCA9IGV2ZW50LmNsaWVudFg7XG5cdGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25ZID0gZXZlbnQuY2xpZW50WTtcbn1cblxuZnVuY3Rpb24gcG9pbnRlck1vdmVIYW5kbGVyKGV2ZW50KSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRDYWNoZS5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGlmIChldmVudC5wb2ludGVySWQgPT09IGV2ZW50Q2FjaGVbaV0ucG9pbnRlcklkKSB7XG5cdFx0XHRldmVudENhY2hlW2ldID0gZXZlbnQ7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPT09IDEpIHtcblx0XHRlbGVtZW50SW5mby5jb21wdXRlZFggPSBldmVudC5jbGllbnRYIC0gZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blggKyBlbGVtZW50SW5mby5vbGRDb21wdXRlZFg7XG5cdFx0ZWxlbWVudEluZm8uY29tcHV0ZWRZID0gZXZlbnQuY2xpZW50WSAtIGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25ZICsgZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZO1xuXG5cdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0cyhlbGVtZW50SW5mby5jb21wdXRlZFgsIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSk7XG5cblx0XHRldmVudC50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZVZhbHVlICsgJykgdHJhbnNsYXRlKCcgKyBlbGVtZW50SW5mby5jb21wdXRlZFggKyAncHgsICcgKyBlbGVtZW50SW5mby5jb21wdXRlZFkgKyAncHgpJztcblx0fVxuXG5cdGlmIChldmVudENhY2hlLmxlbmd0aCA9PT0gMikge1xuXHRcdHZhciB4MSA9IGV2ZW50Q2FjaGVbMF0uY2xpZW50WDtcblx0XHR2YXIgeTEgPSBldmVudENhY2hlWzBdLmNsaWVudFk7XG5cdFx0dmFyIHgyID0gZXZlbnRDYWNoZVsxXS5jbGllbnRYO1xuXHRcdHZhciB5MiA9IGV2ZW50Q2FjaGVbMV0uY2xpZW50WTtcblxuXHRcdHZhciBjdXJBbmdsZSA9IGhlbHBlcnNGdW5jdGlvbnMuZ2V0QW5nbGUoeDEsIHkxLCB4MiwgeTIpO1xuXG5cdFx0aWYgKHByZXZBbmdsZSkge1xuXHRcdFx0dmFyIGluY3JlYXNlT24gPSAwLjAxO1xuXHRcdFx0aWYgKGN1ckFuZ2xlID4gcHJldkFuZ2xlKSB7XG5cdFx0XHRcdGJyaWdodG5lc3NWYWx1ZSArPSBpbmNyZWFzZU9uO1xuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS5maWx0ZXIgPSAnYnJpZ2h0bmVzcygnICsgYnJpZ2h0bmVzc1ZhbHVlICsgJyknO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGN1ckFuZ2xlIDwgcHJldkFuZ2xlKSB7XG5cdFx0XHRcdGJyaWdodG5lc3NWYWx1ZSAtPSBpbmNyZWFzZU9uO1xuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS5maWx0ZXIgPSAnYnJpZ2h0bmVzcygnICsgYnJpZ2h0bmVzc1ZhbHVlICsgJyknO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRwcmV2QW5nbGUgPSBjdXJBbmdsZTtcblxuXHRcdHZhciBjdXJEaWZmID0gTWF0aC5hYnMoZXZlbnRDYWNoZVswXS5jbGllbnRYIC0gZXZlbnRDYWNoZVsxXS5jbGllbnRYKTtcblxuXHRcdGlmIChwcmV2RGlmZiA+IDApIHtcblx0XHRcdHZhciBwaW5jaERpZmYgPSBjdXJEaWZmIC0gcHJldkRpZmY7XG5cdFx0XHRpZiAoY3VyRGlmZiA+IHByZXZEaWZmKSB7XG5cdFx0XHRcdC8vIFpPT00gSU5cblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPj0gMSkgc2NhbGVWYWx1ZSArPSBwaW5jaERpZmYgLyAxMDA7XG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID4gMikgc2NhbGVWYWx1ZSA9IDI7XG5cblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRMaW1pdHMoKTtcblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0cyhlbGVtZW50SW5mby5jb21wdXRlZFgsIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSk7XG5cblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZVZhbHVlICsgJykgdHJhbnNsYXRlKCcgKyBlbGVtZW50SW5mby5jb21wdXRlZFggKyAncHgsICcgKyBlbGVtZW50SW5mby5jb21wdXRlZFkgKyAncHgpJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKGN1ckRpZmYgPCBwcmV2RGlmZikge1xuXHRcdFx0XHQvLyBaT09NIE9VVFxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA+PSAxKSBzY2FsZVZhbHVlIC09IC1waW5jaERpZmYgLyAxMDA7XG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlIDwgMSkgc2NhbGVWYWx1ZSA9IDE7XG5cblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRMaW1pdHMoKTtcblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0cyhlbGVtZW50SW5mby5jb21wdXRlZFgsIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSk7XG5cblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZVZhbHVlICsgJykgdHJhbnNsYXRlKCcgKyBlbGVtZW50SW5mby5jb21wdXRlZFggKyAncHgsICcgKyBlbGVtZW50SW5mby5jb21wdXRlZFkgKyAncHgpJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcmV2RGlmZiA9IGN1ckRpZmY7XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcblx0ZWxlbWVudEluZm8uZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaG9vdmVyJyk7XG5cblx0Ly8g0J/QtdGA0LLQuNGH0L3Ri9C1INC30L3QsNGH0LXQvdC40Y9cblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYID0gMDtcblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZID0gMDtcblxuXHRlbGVtZW50SW5mby5jb21wdXRlZFggPSAwO1xuXHRlbGVtZW50SW5mby5jb21wdXRlZFkgPSAwO1xuXG5cdGVsZW1lbnRJbmZvLnlNYXhMaW1pdCA9IDA7XG5cdGVsZW1lbnRJbmZvLnlNaW5MaW1pdCA9IDA7XG5cdGVsZW1lbnRJbmZvLnhNYXhMaW1pdCA9IDA7XG5cdGVsZW1lbnRJbmZvLnhNaW5MaW1pdCA9IDA7XG5cblx0ZWxlbWVudEluZm8uaW5pdGlhbFdpZHRoID0gZWxlbWVudEluZm8uZWwub2Zmc2V0V2lkdGg7XG5cdGVsZW1lbnRJbmZvLmluaXRpYWxIZWlnaHQgPSBlbGVtZW50SW5mby5lbC5vZmZzZXRIZWlnaHQ7XG5cblx0ZWxlbWVudEluZm8uY29udGFpbmVySGVpZ2h0ID0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQ7XG5cdGVsZW1lbnRJbmZvLmNvbnRhaW5lcldpZHRoID0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQ7XG5cblx0Ly8g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRgdC+0LHRi9GC0LjRj1xuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJkb3duID0gcG9pbnRlckRvd25IYW5kbGVyO1xuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJtb3ZlID0gcG9pbnRlck1vdmVIYW5kbGVyO1xuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJ1cCA9IHBvaW50ZXJVcEhhbmRsZXI7XG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcmNhbmNlbCA9IHBvaW50ZXJVcEhhbmRsZXI7XG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcm91dCA9IHBvaW50ZXJVcEhhbmRsZXI7XG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcmxlYXZlID0gcG9pbnRlclVwSGFuZGxlcjtcbn1cblxuaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRkb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGluaXQoKTtcbn0iXX0=
