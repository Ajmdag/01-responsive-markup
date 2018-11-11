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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL2Zha2VfNTg0YzE5NjguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZpZGVvQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyJyk7XG52YXIgdmlkZW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnZpZGVvcy13cmFwX192aWRlbycpO1xuXG52YXIgdGltZUZvclZpZGVvVG9TaG93ID0gNDAwO1xuXG4vLyBBdWRpbyBBUEkgc2V0dGluZ3NcbnZhciBhdWRpb0N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xudmFyIGFuYWx5c2VycyA9IFthdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpLCBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpLCBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpLCBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpXTtcbmFuYWx5c2Vyc1swXS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbmFuYWx5c2Vyc1sxXS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbmFuYWx5c2Vyc1syXS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbmFuYWx5c2Vyc1szXS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcblxudmFyIHNvdXJjZTAgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodmlkZW9zWzBdKTtcbnZhciBzb3VyY2UxID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHZpZGVvc1sxXSk7XG52YXIgc291cmNlMiA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSh2aWRlb3NbMl0pO1xudmFyIHNvdXJjZTMgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodmlkZW9zWzNdKTtcbnNvdXJjZTAuY29ubmVjdChhbmFseXNlcnNbMF0pO1xuc291cmNlMS5jb25uZWN0KGFuYWx5c2Vyc1sxXSk7XG5zb3VyY2UyLmNvbm5lY3QoYW5hbHlzZXJzWzJdKTtcbnNvdXJjZTMuY29ubmVjdChhbmFseXNlcnNbM10pO1xuXG4vLyBDYW52YXMgc2V0dGluZ3NcbnZhciBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlzdWFsaXplcicpO1xudmFyIGNhbnZhc0N0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xudmFyIGludGVuZGVkV2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX3ZpZGVvLXNldHRpbmdzJykuY2xpZW50V2lkdGg7XG5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGludGVuZGVkV2lkdGgpO1xuXG52YXIgYWxsQ2FtZXJhc0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fdmlkZW8tYWxsLWNhbWVyYXMnKTtcbnZhciBpc0FsbEJ1dHRvbkNsaWNrZWQgPSBmYWxzZTtcblxuLy8gVmlzdWFsaXplIGZ1bmN0aW9uXG52YXIgdmlzdWFsaXplID0gZnVuY3Rpb24gdmlzdWFsaXplKGFuYWx5c2VyKSB7XG5cdHZhciBXSURUSCA9IGNhbnZhcy53aWR0aDtcblx0dmFyIEhFSUdIVCA9IGNhbnZhcy5oZWlnaHQ7XG5cblx0YW5hbHlzZXIuZmZ0U2l6ZSA9IDI1Njtcblx0dmFyIGJ1ZmZlckxlbmd0aEFsdCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuXHR2YXIgZGF0YUFycmF5QWx0ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoQWx0KTtcblxuXHRjYW52YXNDdHguY2xlYXJSZWN0KDAsIDAsIFdJRFRILCBIRUlHSFQpO1xuXG5cdHZhciBkcmF3QWx0ID0gZnVuY3Rpb24gZHJhd0FsdCgpIHtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhd0FsdCk7XG5cblx0XHRhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShkYXRhQXJyYXlBbHQpO1xuXG5cdFx0Y2FudmFzQ3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwgMCwgMCknO1xuXHRcdGNhbnZhc0N0eC5maWxsUmVjdCgwLCAwLCBXSURUSCwgSEVJR0hUKTtcblxuXHRcdHZhciBiYXJXaWR0aCA9IFdJRFRIIC8gYnVmZmVyTGVuZ3RoQWx0O1xuXHRcdHZhciBiYXJIZWlnaHQgPSB2b2lkIDA7XG5cdFx0dmFyIHggPSAwO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGhBbHQ7IGkgKz0gMSkge1xuXHRcdFx0YmFySGVpZ2h0ID0gZGF0YUFycmF5QWx0W2ldO1xuXG5cdFx0XHRjYW52YXNDdHguZmlsbFN0eWxlID0gJ3JnYignICsgKGJhckhlaWdodCArIDEwMCkgKyAnLDUwLDUwKSc7XG5cdFx0XHRjYW52YXNDdHguZmlsbFJlY3QoeCwgSEVJR0hUIC0gYmFySGVpZ2h0IC8gMiwgYmFyV2lkdGgsIGJhckhlaWdodCAvIDIpO1xuXG5cdFx0XHR4ICs9IGJhcldpZHRoICsgMTtcblx0XHRcdGlmIChpc0FsbEJ1dHRvbkNsaWNrZWQpIHtcblx0XHRcdFx0Y2FudmFzQ3R4LmNsZWFyUmVjdCgwLCAwLCBXSURUSCwgSEVJR0hUKTtcblx0XHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUoZHJhd0FsdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdGRyYXdBbHQoKTtcbn07XG5cbnZhciBtYWluID0gZnVuY3Rpb24gbWFpbihlbCwgYW5hbHlzZXJJbmRleCkge1xuXHR2aXN1YWxpemUoYW5hbHlzZXJzW2FuYWx5c2VySW5kZXhdKTtcbn07XG5cbnZhciBicmlnaHRuZXNzSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX2JyaWdodG5lc3MtaW5wdXQnKTtcbnZhciBjb250cmFzdElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX19jb250cmFzdC1pbnB1dCcpO1xudmFyIHZpZGVvU2V0dGluZ3NQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fdmlkZW8tc2V0dGluZ3MnKTtcblxudmFyIHZpZGVvc1NldHRpbmdzID0gW107XG5cbnZhciBwYWdlQ2VudGVyID0ge1xuXHR0b3A6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAyLFxuXHRsZWZ0OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAyXG59O1xuXG52YXIgZ2V0Q2VudGVyQ29vcmRzID0gZnVuY3Rpb24gZ2V0Q2VudGVyQ29vcmRzKGVsKSB7XG5cdHJldHVybiB7XG5cdFx0dG9wOiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBlbC5vZmZzZXRIZWlnaHQgLyAyLFxuXHRcdGxlZnQ6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBlbC5vZmZzZXRXaWR0aCAvIDJcblx0fTtcbn07XG5cbnZpZGVvQ29udGFpbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuXHR2YXIgdmlkZW8gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJyk7XG5cblx0dmFyIHZpZGVvSW5mbyA9IHtcblx0XHRicmlnaHRuZXNzOiAxLFxuXHRcdGNvbnRyYXN0OiAxXG5cdH07XG5cblx0ZnVuY3Rpb24gZGVmaW5lRmlsdGVycygpIHtcblx0XHR2aWRlb3NTZXR0aW5nc1tpbmRleF0uY29udHJhc3QgPSBjb250cmFzdElucHV0LnZhbHVlIC8gMjA7XG5cdFx0dmlkZW9zU2V0dGluZ3NbaW5kZXhdLmJyaWdodG5lc3MgPSBicmlnaHRuZXNzSW5wdXQudmFsdWUgLyAyMDtcblx0XHRpdGVtLnN0eWxlLmZpbHRlciA9ICdicmlnaHRuZXNzKCcgKyB2aWRlb3NTZXR0aW5nc1tpbmRleF0uYnJpZ2h0bmVzcyArICcpIGNvbnRyYXN0KCcgKyB2aWRlb3NTZXR0aW5nc1tpbmRleF0uY29udHJhc3QgKyAnKSc7XG5cdH1cblxuXHR2aWRlb3NTZXR0aW5ncy5wdXNoKHZpZGVvSW5mbyk7XG5cblx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgaXRlbUNlbnRlciA9IGdldENlbnRlckNvb3JkcyhpdGVtKTtcblx0XHRpZiAoIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vcGVuJykpIHtcblx0XHRcdGlzQWxsQnV0dG9uQ2xpY2tlZCA9IGZhbHNlO1xuXG5cdFx0XHR2aWRlby5tdXRlZCA9IGZhbHNlO1xuXG5cdFx0XHRpdGVtLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoJyArIC0oaXRlbUNlbnRlci5sZWZ0IC0gcGFnZUNlbnRlci5sZWZ0KSArICdweCwgJyArIC0oaXRlbUNlbnRlci50b3AgLSBwYWdlQ2VudGVyLnRvcCkgKyAncHgpIHNjYWxlKCcgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyBpdGVtLm9mZnNldFdpZHRoICsgJyknO1xuXG5cdFx0XHRjb250cmFzdElucHV0LnZhbHVlID0gdmlkZW9zU2V0dGluZ3NbaW5kZXhdLmNvbnRyYXN0ICogMjA7XG5cdFx0XHRicmlnaHRuZXNzSW5wdXQudmFsdWUgPSB2aWRlb3NTZXR0aW5nc1tpbmRleF0uYnJpZ2h0bmVzcyAqIDIwO1xuXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW92ZXJmbG93LWhpZGRlbicpO1xuXHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vcGVuJyk7XG5cblx0XHRcdGNvbnRyYXN0SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZWZpbmVGaWx0ZXJzKTtcblx0XHRcdGJyaWdodG5lc3NJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlZmluZUZpbHRlcnMpO1xuXHRcdFx0dmlkZW9TZXR0aW5nc1BhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvcy13cmFwX192aWRlby1zZXR0aW5ncy0taGlkZGVuJyk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd2aWRlby1vcGVuJyk7XG5cdFx0XHR9LCB0aW1lRm9yVmlkZW9Ub1Nob3cgLSAxMDApO1xuXHRcdFx0bWFpbih2aWRlbywgaW5kZXgpO1xuXG5cdFx0XHRhbGxDYW1lcmFzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpc0FsbEJ1dHRvbkNsaWNrZWQgPSB0cnVlO1xuXG5cdFx0XHRcdHZpZGVvLm11dGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRpdGVtLnN0eWxlLnRyYW5zZm9ybSA9ICdub25lJztcblxuXHRcdFx0XHR2aWRlb1NldHRpbmdzUGFuZWwuY2xhc3NMaXN0LmFkZCgndmlkZW9zLXdyYXBfX3ZpZGVvLXNldHRpbmdzLS1oaWRkZW4nKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vdmVyZmxvdy1oaWRkZW4nKTtcblx0XHRcdFx0fSwgdGltZUZvclZpZGVvVG9TaG93KTtcblxuXHRcdFx0XHRjb250cmFzdElucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVmaW5lRmlsdGVycyk7XG5cdFx0XHRcdGJyaWdodG5lc3NJbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlZmluZUZpbHRlcnMpO1xuXG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lci0tb3BlbicpO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvLW9wZW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KTsiXX0=
