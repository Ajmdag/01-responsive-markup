(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var videoContainers = document.querySelectorAll('.videos-wrap__video-container');
var videos = document.querySelectorAll('.videos-wrap__video');

var timeForVideoToShow = 400;

// Audio API settings
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analysers = [audioCtx.createAnalyser(), audioCtx.createAnalyser(), audioCtx.createAnalyser(), audioCtx.createAnalyser()];
analysers[0].connect(audioCtx.destination);
analysers[1].connect(audioCtx.destination);
analysers[2].connect(audioCtx.destination);
analysers[3].connect(audioCtx.destination);

var source0 = audioCtx.createMediaElementSource(videos[0]);
var source1 = audioCtx.createMediaElementSource(videos[1]);
var source2 = audioCtx.createMediaElementSource(videos[2]);
var source3 = audioCtx.createMediaElementSource(videos[3]);
source0.connect(analysers[0]);
source1.connect(analysers[1]);
source2.connect(analysers[2]);
source3.connect(analysers[3]);

// Canvas settings
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext('2d');
var intendedWidth = document.querySelector('.videos-wrap__video-settings').clientWidth;
canvas.setAttribute('width', intendedWidth);

var allCamerasButton = document.querySelector('.videos-wrap__video-all-cameras');
var isAllButtonClicked = false;

// Visualize function
var visualize = function visualize(analyser) {
	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;

	analyser.fftSize = 256;
	var bufferLengthAlt = analyser.frequencyBinCount;
	var dataArrayAlt = new Uint8Array(bufferLengthAlt);

	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

	var drawAlt = function drawAlt() {
		requestAnimationFrame(drawAlt);

		analyser.getByteFrequencyData(dataArrayAlt);

		canvasCtx.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

		var barWidth = WIDTH / bufferLengthAlt;
		var barHeight = void 0;
		var x = 0;

		for (var i = 0; i < bufferLengthAlt; i += 1) {
			barHeight = dataArrayAlt[i];

			canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
			canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

			x += barWidth + 1;
			if (isAllButtonClicked) {
				canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
				cancelAnimationFrame(drawAlt);
			}
		}
	};

	drawAlt();
};

var main = function main(el, analyserIndex) {
	visualize(analysers[analyserIndex]);
};

var brightnessInput = document.querySelector('.videos-wrap__brightness-input');
var contrastInput = document.querySelector('.videos-wrap__contrast-input');
var videoSettingsPanel = document.querySelector('.videos-wrap__video-settings');

var videosSettings = [];

var pageCenter = {
	top: document.documentElement.clientHeight / 2,
	left: document.documentElement.clientWidth / 2
};

var getCenterCoords = function getCenterCoords(el) {
	return {
		top: el.getBoundingClientRect().top + el.offsetHeight / 2,
		left: el.getBoundingClientRect().left + el.offsetWidth / 2
	};
};

videoContainers.forEach(function (item, index) {
	var video = item.querySelector('video');

	var videoInfo = {
		brightness: 1,
		contrast: 1
	};

	function defineFilters() {
		videosSettings[index].contrast = contrastInput.value / 20;
		videosSettings[index].brightness = brightnessInput.value / 20;
		item.style.filter = 'brightness(' + videosSettings[index].brightness + ') contrast(' + videosSettings[index].contrast + ')';
	}

	videosSettings.push(videoInfo);

	item.addEventListener('click', function () {
		var itemCenter = getCenterCoords(item);
		if (!item.classList.contains('videos-wrap__video-container--open')) {
			isAllButtonClicked = false;

			video.muted = false;

			item.style.transform = 'translate(' + -(itemCenter.left - pageCenter.left) + 'px, ' + -(itemCenter.top - pageCenter.top) + 'px) scale(' + document.documentElement.clientWidth / item.offsetWidth + ')';

			contrastInput.value = videosSettings[index].contrast * 20;
			brightnessInput.value = videosSettings[index].brightness * 20;

			item.classList.remove('videos-wrap__video-container--overflow-hidden');
			item.classList.add('videos-wrap__video-container--open');

			contrastInput.addEventListener('input', defineFilters);
			brightnessInput.addEventListener('input', defineFilters);
			videoSettingsPanel.classList.remove('videos-wrap__video-settings--hidden');
			setTimeout(function () {
				document.body.classList.add('video-open');
			}, timeForVideoToShow - 100);
			main(video, index);

			allCamerasButton.addEventListener('click', function () {
				isAllButtonClicked = true;

				video.muted = true;

				item.style.transform = 'none';

				videoSettingsPanel.classList.add('videos-wrap__video-settings--hidden');
				setTimeout(function () {
					item.classList.add('videos-wrap__video-container--overflow-hidden');
				}, timeForVideoToShow);

				contrastInput.removeEventListener('input', defineFilters);
				brightnessInput.removeEventListener('input', defineFilters);

				item.classList.remove('videos-wrap__video-container--open');
				document.body.classList.remove('video-open');
			});
		}
	});
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV84MWI1NTQ2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmlkZW9Db250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnZpZGVvcy13cmFwX192aWRlby1jb250YWluZXInKTtcbnZhciB2aWRlb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmlkZW9zLXdyYXBfX3ZpZGVvJyk7XG5cbnZhciB0aW1lRm9yVmlkZW9Ub1Nob3cgPSA0MDA7XG5cbi8vIEF1ZGlvIEFQSSBzZXR0aW5nc1xudmFyIGF1ZGlvQ3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG52YXIgYW5hbHlzZXJzID0gW2F1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCksIGF1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCksIGF1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCksIGF1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCldO1xuYW5hbHlzZXJzWzBdLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuYW5hbHlzZXJzWzFdLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuYW5hbHlzZXJzWzJdLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuYW5hbHlzZXJzWzNdLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuXG52YXIgc291cmNlMCA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSh2aWRlb3NbMF0pO1xudmFyIHNvdXJjZTEgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodmlkZW9zWzFdKTtcbnZhciBzb3VyY2UyID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHZpZGVvc1syXSk7XG52YXIgc291cmNlMyA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSh2aWRlb3NbM10pO1xuc291cmNlMC5jb25uZWN0KGFuYWx5c2Vyc1swXSk7XG5zb3VyY2UxLmNvbm5lY3QoYW5hbHlzZXJzWzFdKTtcbnNvdXJjZTIuY29ubmVjdChhbmFseXNlcnNbMl0pO1xuc291cmNlMy5jb25uZWN0KGFuYWx5c2Vyc1szXSk7XG5cbi8vIENhbnZhcyBzZXR0aW5nc1xudmFyIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aXN1YWxpemVyJyk7XG52YXIgY2FudmFzQ3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG52YXIgaW50ZW5kZWRXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fdmlkZW8tc2V0dGluZ3MnKS5jbGllbnRXaWR0aDtcbmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgaW50ZW5kZWRXaWR0aCk7XG5cbnZhciBhbGxDYW1lcmFzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX192aWRlby1hbGwtY2FtZXJhcycpO1xudmFyIGlzQWxsQnV0dG9uQ2xpY2tlZCA9IGZhbHNlO1xuXG4vLyBWaXN1YWxpemUgZnVuY3Rpb25cbnZhciB2aXN1YWxpemUgPSBmdW5jdGlvbiB2aXN1YWxpemUoYW5hbHlzZXIpIHtcblx0dmFyIFdJRFRIID0gY2FudmFzLndpZHRoO1xuXHR2YXIgSEVJR0hUID0gY2FudmFzLmhlaWdodDtcblxuXHRhbmFseXNlci5mZnRTaXplID0gMjU2O1xuXHR2YXIgYnVmZmVyTGVuZ3RoQWx0ID0gYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQ7XG5cdHZhciBkYXRhQXJyYXlBbHQgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGhBbHQpO1xuXG5cdGNhbnZhc0N0eC5jbGVhclJlY3QoMCwgMCwgV0lEVEgsIEhFSUdIVCk7XG5cblx0dmFyIGRyYXdBbHQgPSBmdW5jdGlvbiBkcmF3QWx0KCkge1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3QWx0KTtcblxuXHRcdGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKGRhdGFBcnJheUFsdCk7XG5cblx0XHRjYW52YXNDdHguZmlsbFN0eWxlID0gJ3JnYigwLCAwLCAwKSc7XG5cdFx0Y2FudmFzQ3R4LmZpbGxSZWN0KDAsIDAsIFdJRFRILCBIRUlHSFQpO1xuXG5cdFx0dmFyIGJhcldpZHRoID0gV0lEVEggLyBidWZmZXJMZW5ndGhBbHQ7XG5cdFx0dmFyIGJhckhlaWdodCA9IHZvaWQgMDtcblx0XHR2YXIgeCA9IDA7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aEFsdDsgaSArPSAxKSB7XG5cdFx0XHRiYXJIZWlnaHQgPSBkYXRhQXJyYXlBbHRbaV07XG5cblx0XHRcdGNhbnZhc0N0eC5maWxsU3R5bGUgPSAncmdiKCcgKyAoYmFySGVpZ2h0ICsgMTAwKSArICcsNTAsNTApJztcblx0XHRcdGNhbnZhc0N0eC5maWxsUmVjdCh4LCBIRUlHSFQgLSBiYXJIZWlnaHQgLyAyLCBiYXJXaWR0aCwgYmFySGVpZ2h0IC8gMik7XG5cblx0XHRcdHggKz0gYmFyV2lkdGggKyAxO1xuXHRcdFx0aWYgKGlzQWxsQnV0dG9uQ2xpY2tlZCkge1xuXHRcdFx0XHRjYW52YXNDdHguY2xlYXJSZWN0KDAsIDAsIFdJRFRILCBIRUlHSFQpO1xuXHRcdFx0XHRjYW5jZWxBbmltYXRpb25GcmFtZShkcmF3QWx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0ZHJhd0FsdCgpO1xufTtcblxudmFyIG1haW4gPSBmdW5jdGlvbiBtYWluKGVsLCBhbmFseXNlckluZGV4KSB7XG5cdHZpc3VhbGl6ZShhbmFseXNlcnNbYW5hbHlzZXJJbmRleF0pO1xufTtcblxudmFyIGJyaWdodG5lc3NJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fYnJpZ2h0bmVzcy1pbnB1dCcpO1xudmFyIGNvbnRyYXN0SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX2NvbnRyYXN0LWlucHV0Jyk7XG52YXIgdmlkZW9TZXR0aW5nc1BhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX192aWRlby1zZXR0aW5ncycpO1xuXG52YXIgdmlkZW9zU2V0dGluZ3MgPSBbXTtcblxudmFyIHBhZ2VDZW50ZXIgPSB7XG5cdHRvcDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDIsXG5cdGxlZnQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDJcbn07XG5cbnZhciBnZXRDZW50ZXJDb29yZHMgPSBmdW5jdGlvbiBnZXRDZW50ZXJDb29yZHMoZWwpIHtcblx0cmV0dXJuIHtcblx0XHR0b3A6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGVsLm9mZnNldEhlaWdodCAvIDIsXG5cdFx0bGVmdDogZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGVsLm9mZnNldFdpZHRoIC8gMlxuXHR9O1xufTtcblxudmlkZW9Db250YWluZXJzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG5cdHZhciB2aWRlbyA9IGl0ZW0ucXVlcnlTZWxlY3RvcigndmlkZW8nKTtcblxuXHR2YXIgdmlkZW9JbmZvID0ge1xuXHRcdGJyaWdodG5lc3M6IDEsXG5cdFx0Y29udHJhc3Q6IDFcblx0fTtcblxuXHRmdW5jdGlvbiBkZWZpbmVGaWx0ZXJzKCkge1xuXHRcdHZpZGVvc1NldHRpbmdzW2luZGV4XS5jb250cmFzdCA9IGNvbnRyYXN0SW5wdXQudmFsdWUgLyAyMDtcblx0XHR2aWRlb3NTZXR0aW5nc1tpbmRleF0uYnJpZ2h0bmVzcyA9IGJyaWdodG5lc3NJbnB1dC52YWx1ZSAvIDIwO1xuXHRcdGl0ZW0uc3R5bGUuZmlsdGVyID0gJ2JyaWdodG5lc3MoJyArIHZpZGVvc1NldHRpbmdzW2luZGV4XS5icmlnaHRuZXNzICsgJykgY29udHJhc3QoJyArIHZpZGVvc1NldHRpbmdzW2luZGV4XS5jb250cmFzdCArICcpJztcblx0fVxuXG5cdHZpZGVvc1NldHRpbmdzLnB1c2godmlkZW9JbmZvKTtcblxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciBpdGVtQ2VudGVyID0gZ2V0Q2VudGVyQ29vcmRzKGl0ZW0pO1xuXHRcdGlmICghaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW9wZW4nKSkge1xuXHRcdFx0aXNBbGxCdXR0b25DbGlja2VkID0gZmFsc2U7XG5cblx0XHRcdHZpZGVvLm11dGVkID0gZmFsc2U7XG5cblx0XHRcdGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnICsgLShpdGVtQ2VudGVyLmxlZnQgLSBwYWdlQ2VudGVyLmxlZnQpICsgJ3B4LCAnICsgLShpdGVtQ2VudGVyLnRvcCAtIHBhZ2VDZW50ZXIudG9wKSArICdweCkgc2NhbGUoJyArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIGl0ZW0ub2Zmc2V0V2lkdGggKyAnKSc7XG5cblx0XHRcdGNvbnRyYXN0SW5wdXQudmFsdWUgPSB2aWRlb3NTZXR0aW5nc1tpbmRleF0uY29udHJhc3QgKiAyMDtcblx0XHRcdGJyaWdodG5lc3NJbnB1dC52YWx1ZSA9IHZpZGVvc1NldHRpbmdzW2luZGV4XS5icmlnaHRuZXNzICogMjA7XG5cblx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lci0tb3ZlcmZsb3ctaGlkZGVuJyk7XG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW9wZW4nKTtcblxuXHRcdFx0Y29udHJhc3RJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlZmluZUZpbHRlcnMpO1xuXHRcdFx0YnJpZ2h0bmVzc0lucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVmaW5lRmlsdGVycyk7XG5cdFx0XHR2aWRlb1NldHRpbmdzUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9zLXdyYXBfX3ZpZGVvLXNldHRpbmdzLS1oaWRkZW4nKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3ZpZGVvLW9wZW4nKTtcblx0XHRcdH0sIHRpbWVGb3JWaWRlb1RvU2hvdyAtIDEwMCk7XG5cdFx0XHRtYWluKHZpZGVvLCBpbmRleCk7XG5cblx0XHRcdGFsbENhbWVyYXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlzQWxsQnV0dG9uQ2xpY2tlZCA9IHRydWU7XG5cblx0XHRcdFx0dmlkZW8ubXV0ZWQgPSB0cnVlO1xuXG5cdFx0XHRcdGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnO1xuXG5cdFx0XHRcdHZpZGVvU2V0dGluZ3NQYW5lbC5jbGFzc0xpc3QuYWRkKCd2aWRlb3Mtd3JhcF9fdmlkZW8tc2V0dGluZ3MtLWhpZGRlbicpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW92ZXJmbG93LWhpZGRlbicpO1xuXHRcdFx0XHR9LCB0aW1lRm9yVmlkZW9Ub1Nob3cpO1xuXG5cdFx0XHRcdGNvbnRyYXN0SW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZWZpbmVGaWx0ZXJzKTtcblx0XHRcdFx0YnJpZ2h0bmVzc0lucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVmaW5lRmlsdGVycyk7XG5cblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vcGVuJyk7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndmlkZW8tb3BlbicpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn0pOyJdfQ==
