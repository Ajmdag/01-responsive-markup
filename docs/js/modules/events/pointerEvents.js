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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV9kNjAwMjYwNi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNjYWxlVmFsdWUgPSAxO1xudmFyIGJyaWdodG5lc3NWYWx1ZSA9IDE7XG52YXIgcHJldkRpZmYgPSAtMTtcbnZhciBwcmV2QW5nbGUgPSBudWxsO1xuXG52YXIgZXZlbnRDYWNoZSA9IFtdO1xudmFyIGVsZW1lbnRJbmZvID0ge307XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50KGV2ZW50KSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRDYWNoZS5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGlmIChldmVudENhY2hlW2ldLnBvaW50ZXJJZCA9PT0gZXZlbnQucG9pbnRlcklkKSB7XG5cdFx0XHRldmVudENhY2hlLnNwbGljZShpLCAxKTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBwb2ludGVyVXBIYW5kbGVyKGV2ZW50KSB7XG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWCA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWDtcblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZID0gZWxlbWVudEluZm8uY29tcHV0ZWRZO1xuXG5cdHJlbW92ZUV2ZW50KGV2ZW50KTtcblxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPCAyKSBwcmV2RGlmZiA9IC0xO1xufVxuXG4vLyDQodC+0LfQtNCw0LXQvCDQvtCx0YrQtdC60YIg0LTQu9GPINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDRhNGD0L3QutGG0LjQuVxudmFyIGhlbHBlcnNGdW5jdGlvbnMgPSB7XG5cdGdldERpc3RhbmVCZXR3ZWVuVHdvRG90czogZnVuY3Rpb24gZ2V0RGlzdGFuZUJldHdlZW5Ud29Eb3RzKHgxLCB5MSwgeDIsIHkyKSB7XG5cdFx0cmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4MSAtIHgyLCAyKSArIE1hdGgucG93KHkxIC0geTIsIDIpKTtcblx0fSxcblx0Z2V0QW5nbGU6IGZ1bmN0aW9uIGdldEFuZ2xlKHgxLCB5MSwgeDIsIHkyKSB7XG5cdFx0cmV0dXJuIE1hdGguYXRhbjIoeTEgLSB5MiwgeDEgLSB4MikgKiAxODAgLyBNYXRoLlBJO1xuXHR9LFxuXHRzZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0czogZnVuY3Rpb24gc2V0Q29tcHV0ZWRWYWx1ZXNWaWFMaW1pdHMoY29tcHV0ZWRYLCBjb21wdXRlZFkpIHtcblx0XHRpZiAoY29tcHV0ZWRYID4gZWxlbWVudEluZm8ueE1heExpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFggPSBlbGVtZW50SW5mby54TWF4TGltaXQ7XG5cdFx0aWYgKGNvbXB1dGVkWCA8IGVsZW1lbnRJbmZvLnhNaW5MaW1pdCkgZWxlbWVudEluZm8uY29tcHV0ZWRYID0gZWxlbWVudEluZm8ueE1pbkxpbWl0O1xuXHRcdGlmIChjb21wdXRlZFkgPCBlbGVtZW50SW5mby55TWluTGltaXQpIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSA9IGVsZW1lbnRJbmZvLnlNaW5MaW1pdDtcblx0XHRpZiAoY29tcHV0ZWRZID4gZWxlbWVudEluZm8ueU1heExpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFkgPSBlbGVtZW50SW5mby55TWF4TGltaXQ7XG5cdH0sXG5cdHNldExpbWl0czogZnVuY3Rpb24gc2V0TGltaXRzKCkge1xuXHRcdGVsZW1lbnRJbmZvLnlNYXhMaW1pdCA9IChlbGVtZW50SW5mby5lbC5vZmZzZXRIZWlnaHQgKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQpIC8gNDtcblx0XHRlbGVtZW50SW5mby55TWluTGltaXQgPSAtKGVsZW1lbnRJbmZvLmVsLm9mZnNldEhlaWdodCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodCkgLyA0O1xuXHRcdGVsZW1lbnRJbmZvLnhNYXhMaW1pdCA9IChlbGVtZW50SW5mby5lbC5vZmZzZXRXaWR0aCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldFdpZHRoKSAvIDQ7XG5cdFx0ZWxlbWVudEluZm8ueE1pbkxpbWl0ID0gLShlbGVtZW50SW5mby5lbC5vZmZzZXRXaWR0aCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldFdpZHRoKSAvIDQ7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHBvaW50ZXJEb3duSGFuZGxlcihldmVudCkge1xuXHRldmVudENhY2hlLnB1c2goZXZlbnQpO1xuXG5cdC8vINCX0LDQv9C40YjQtdC8INC/0L7Qt9C40YbQuNGOINC60YPRgNGB0L7RgNCwXG5cdGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25YID0gZXZlbnQuY2xpZW50WDtcblx0ZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blkgPSBldmVudC5jbGllbnRZO1xufVxuXG5mdW5jdGlvbiBwb2ludGVyTW92ZUhhbmRsZXIoZXZlbnQpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBldmVudENhY2hlLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0aWYgKGV2ZW50LnBvaW50ZXJJZCA9PT0gZXZlbnRDYWNoZVtpXS5wb2ludGVySWQpIHtcblx0XHRcdGV2ZW50Q2FjaGVbaV0gPSBldmVudDtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGlmIChldmVudENhY2hlLmxlbmd0aCA9PT0gMSkge1xuXHRcdGVsZW1lbnRJbmZvLmNvbXB1dGVkWCA9IGV2ZW50LmNsaWVudFggLSBlbGVtZW50SW5mby5zdGFydGVkUG9pbnREb3duWCArIGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWDtcblx0XHRlbGVtZW50SW5mby5jb21wdXRlZFkgPSBldmVudC5jbGllbnRZIC0gZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blkgKyBlbGVtZW50SW5mby5vbGRDb21wdXRlZFk7XG5cblx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGVsZW1lbnRJbmZvLmNvbXB1dGVkWCwgZWxlbWVudEluZm8uY29tcHV0ZWRZKTtcblxuXHRcdGV2ZW50LnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlVmFsdWUgKyAnKSB0cmFuc2xhdGUoJyArIGVsZW1lbnRJbmZvLmNvbXB1dGVkWCArICdweCwgJyArIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSArICdweCknO1xuXHR9XG5cblx0aWYgKGV2ZW50Q2FjaGUubGVuZ3RoID09PSAyKSB7XG5cdFx0dmFyIHgxID0gZXZlbnRDYWNoZVswXS5jbGllbnRYO1xuXHRcdHZhciB5MSA9IGV2ZW50Q2FjaGVbMF0uY2xpZW50WTtcblx0XHR2YXIgeDIgPSBldmVudENhY2hlWzFdLmNsaWVudFg7XG5cdFx0dmFyIHkyID0gZXZlbnRDYWNoZVsxXS5jbGllbnRZO1xuXG5cdFx0dmFyIGN1ckFuZ2xlID0gaGVscGVyc0Z1bmN0aW9ucy5nZXRBbmdsZSh4MSwgeTEsIHgyLCB5Mik7XG5cblx0XHRpZiAocHJldkFuZ2xlKSB7XG5cdFx0XHR2YXIgaW5jcmVhc2VPbiA9IDAuMDE7XG5cdFx0XHRpZiAoY3VyQW5nbGUgPiBwcmV2QW5nbGUpIHtcblx0XHRcdFx0YnJpZ2h0bmVzc1ZhbHVlICs9IGluY3JlYXNlT247XG5cdFx0XHRcdGVsZW1lbnRJbmZvLmVsLnN0eWxlLmZpbHRlciA9ICdicmlnaHRuZXNzKCcgKyBicmlnaHRuZXNzVmFsdWUgKyAnKSc7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY3VyQW5nbGUgPCBwcmV2QW5nbGUpIHtcblx0XHRcdFx0YnJpZ2h0bmVzc1ZhbHVlIC09IGluY3JlYXNlT247XG5cdFx0XHRcdGVsZW1lbnRJbmZvLmVsLnN0eWxlLmZpbHRlciA9ICdicmlnaHRuZXNzKCcgKyBicmlnaHRuZXNzVmFsdWUgKyAnKSc7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHByZXZBbmdsZSA9IGN1ckFuZ2xlO1xuXG5cdFx0dmFyIGN1ckRpZmYgPSBNYXRoLmFicyhldmVudENhY2hlWzBdLmNsaWVudFggLSBldmVudENhY2hlWzFdLmNsaWVudFgpO1xuXG5cdFx0aWYgKHByZXZEaWZmID4gMCkge1xuXHRcdFx0dmFyIHBpbmNoRGlmZiA9IGN1ckRpZmYgLSBwcmV2RGlmZjtcblx0XHRcdGlmIChjdXJEaWZmID4gcHJldkRpZmYpIHtcblx0XHRcdFx0Ly8gWk9PTSBJTlxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA+PSAxKSBzY2FsZVZhbHVlICs9IHBpbmNoRGlmZiAvIDEwMDtcblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPiAyKSBzY2FsZVZhbHVlID0gMjtcblxuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldExpbWl0cygpO1xuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGVsZW1lbnRJbmZvLmNvbXB1dGVkWCwgZWxlbWVudEluZm8uY29tcHV0ZWRZKTtcblxuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlVmFsdWUgKyAnKSB0cmFuc2xhdGUoJyArIGVsZW1lbnRJbmZvLmNvbXB1dGVkWCArICdweCwgJyArIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSArICdweCknO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY3VyRGlmZiA8IHByZXZEaWZmKSB7XG5cdFx0XHRcdC8vIFpPT00gT1VUXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID49IDEpIHNjYWxlVmFsdWUgLT0gLXBpbmNoRGlmZiAvIDEwMDtcblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPCAxKSBzY2FsZVZhbHVlID0gMTtcblxuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldExpbWl0cygpO1xuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGVsZW1lbnRJbmZvLmNvbXB1dGVkWCwgZWxlbWVudEluZm8uY29tcHV0ZWRZKTtcblxuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHNjYWxlVmFsdWUgKyAnKSB0cmFuc2xhdGUoJyArIGVsZW1lbnRJbmZvLmNvbXB1dGVkWCArICdweCwgJyArIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSArICdweCknO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByZXZEaWZmID0gY3VyRGlmZjtcblx0fVxufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuXHRlbGVtZW50SW5mby5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNob292ZXInKTtcblxuXHQvLyDQn9C10YDQstC40YfQvdGL0LUg0LfQvdCw0YfQtdC90LjRj1xuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFggPSAwO1xuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFkgPSAwO1xuXG5cdGVsZW1lbnRJbmZvLmNvbXB1dGVkWCA9IDA7XG5cdGVsZW1lbnRJbmZvLmNvbXB1dGVkWSA9IDA7XG5cblx0ZWxlbWVudEluZm8ueU1heExpbWl0ID0gMDtcblx0ZWxlbWVudEluZm8ueU1pbkxpbWl0ID0gMDtcblx0ZWxlbWVudEluZm8ueE1heExpbWl0ID0gMDtcblx0ZWxlbWVudEluZm8ueE1pbkxpbWl0ID0gMDtcblxuXHRlbGVtZW50SW5mby5pbml0aWFsV2lkdGggPSBlbGVtZW50SW5mby5lbC5vZmZzZXRXaWR0aDtcblx0ZWxlbWVudEluZm8uaW5pdGlhbEhlaWdodCA9IGVsZW1lbnRJbmZvLmVsLm9mZnNldEhlaWdodDtcblxuXHRlbGVtZW50SW5mby5jb250YWluZXJIZWlnaHQgPSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodDtcblx0ZWxlbWVudEluZm8uY29udGFpbmVyV2lkdGggPSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodDtcblxuXHQvLyDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdC8INGB0L7QsdGL0YLQuNGPXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcmRvd24gPSBwb2ludGVyRG93bkhhbmRsZXI7XG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcm1vdmUgPSBwb2ludGVyTW92ZUhhbmRsZXI7XG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcnVwID0gcG9pbnRlclVwSGFuZGxlcjtcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVyY2FuY2VsID0gcG9pbnRlclVwSGFuZGxlcjtcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVyb3V0ID0gcG9pbnRlclVwSGFuZGxlcjtcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVybGVhdmUgPSBwb2ludGVyVXBIYW5kbGVyO1xufVxuXG5pZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG5cdGRvY3VtZW50LmJvZHkub25sb2FkID0gaW5pdCgpO1xufSJdfQ==
