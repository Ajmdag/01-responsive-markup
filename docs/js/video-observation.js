(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./library/Store.js');

},{"./library/Store.js":2}],2:[function(require,module,exports){
module.exports = class Store {
  constructor(updateState, state) {
    this._updateState = updateState;
    this._state = state;
    this._callbacks = [];
  }

  get getState() {
    return this._state;
  }

  update(action) {
    this._state = this._updateState(this._state, action);
    this._callbacks.forEach(cb => {
      cb();
    });
  }

  subscribe(callback) {
    this._callbacks.push(callback);
    return () => this._callbacks = this._callbacks.filter(cb => cb !== callback);
  }
};
},{}],3:[function(require,module,exports){
'use strict';

require('./modules/videos-observation/initVideo');

require('./modules/videos-observation/workWithVideos');

var _fluxFramework = require('flux-framework');

var _fluxFramework2 = _interopRequireDefault(_fluxFramework);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var brightnessInputGlobal = document.querySelector('.videos-wrap__brightness-input');
var contrastInputGlobal = document.querySelector('.videos-wrap__contrast-input');

var contrastInputValueDisplay = document.querySelector('.videos-wrap__contrast-value-display');
var brightnessInputValueDisplay = document.querySelector('.videos-wrap__brightness-value-display');

var reducer = function reducer(state, action) {
  if (action.type === 'CHANGE') {
    return action.data;
  }
  return state;
};

var initialState = {
  value: 20
};

var store = new _fluxFramework2.default(reducer, initialState);

brightnessInputGlobal.addEventListener('input', function () {
  var incrementState = { type: 'CHANGE', data: brightnessInputGlobal.value };
  store.update(incrementState);
  brightnessInputValueDisplay.innerHTML = store.getState;
});

contrastInputGlobal.addEventListener('input', function () {
  var incrementState = { type: 'CHANGE', data: contrastInputGlobal.value };
  store.update(incrementState);
  contrastInputValueDisplay.innerHTML = store.getState;
});

var incrementState = { type: "CHANGE", data: 3 };

store.subscribe(function () {
  console.log('HELLO WORLD', store.getState);
});

store.update(incrementState);
},{"./modules/videos-observation/initVideo":4,"./modules/videos-observation/workWithVideos":5,"flux-framework":1}],4:[function(require,module,exports){
function initVideo(video, url) {
	if (Hls.isSupported()) {
		let hls = new Hls()
		hls.loadSource(url)
		hls.attachMedia(video)
		hls.on(Hls.Events.MANIFEST_PARSED, () => {
			video.play()
		})
	} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'
		video.addEventListener('loadedmetadata', () => {
			video.play()
		})
	}
}

initVideo(
	document.getElementById('video-1'),
	'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
)

initVideo(
	document.getElementById('video-2'),
	'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
)

initVideo(
	document.getElementById('video-3'),
	'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
)

initVideo(
	document.getElementById('video-4'),
	'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
)

},{}],5:[function(require,module,exports){
const videoContainers = document.querySelectorAll('.videos-wrap__video-container')
const videos = document.querySelectorAll('.videos-wrap__video')

const timeForVideoToShow = 400

// Audio API settings
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const analysers = [audioCtx.createAnalyser(), audioCtx.createAnalyser(), audioCtx.createAnalyser(), audioCtx.createAnalyser()]
analysers[0].connect(audioCtx.destination)
analysers[1].connect(audioCtx.destination)
analysers[2].connect(audioCtx.destination)
analysers[3].connect(audioCtx.destination)

const source0 = audioCtx.createMediaElementSource(videos[0])
const source1 = audioCtx.createMediaElementSource(videos[1])
const source2 = audioCtx.createMediaElementSource(videos[2])
const source3 = audioCtx.createMediaElementSource(videos[3])
source0.connect(analysers[0])
source1.connect(analysers[1])
source2.connect(analysers[2])
source3.connect(analysers[3])

// Canvas settings
const canvas = document.querySelector('.visualizer')
const canvasCtx = canvas.getContext('2d')
const intendedWidth = document.querySelector('.videos-wrap__video-settings').clientWidth
canvas.setAttribute('width', intendedWidth)

const allCamerasButton = document.querySelector('.videos-wrap__video-all-cameras')
let isAllButtonClicked = false

// Visualize function
const visualize = (analyser) => {
	const WIDTH = canvas.width
	const HEIGHT = canvas.height

	analyser.fftSize = 256
	const bufferLengthAlt = analyser.frequencyBinCount
	const dataArrayAlt = new Uint8Array(bufferLengthAlt)

	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

	const drawAlt = () => {
		requestAnimationFrame(drawAlt)

		analyser.getByteFrequencyData(dataArrayAlt)

		canvasCtx.fillStyle = 'rgb(0, 0, 0)'
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

		const barWidth = WIDTH / bufferLengthAlt
		let barHeight
		let x = 0

		for (let i = 0; i < bufferLengthAlt; i += 1) {
			barHeight = dataArrayAlt[i]

			canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`
			canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

			x += barWidth + 1
			if (isAllButtonClicked) {
				canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
				cancelAnimationFrame(drawAlt)
			}
		}
	}

	drawAlt()
}

const main = (el, analyserIndex) => {
	visualize(analysers[analyserIndex])
}

const brightnessInput = document.querySelector('.videos-wrap__brightness-input')
const contrastInput = document.querySelector('.videos-wrap__contrast-input')
const videoSettingsPanel = document.querySelector('.videos-wrap__video-settings')

const videosSettings = []

const pageCenter = {
	top: document.documentElement.clientHeight / 2,
	left: document.documentElement.clientWidth / 2
}

const getCenterCoords = (el) => ({
	top: el.getBoundingClientRect().top + el.offsetHeight / 2,
	left: el.getBoundingClientRect().left + el.offsetWidth / 2
})

videoContainers.forEach((item, index) => {
	const video = item.querySelector('video')

	const videoInfo = {
		brightness: 1,
		contrast: 1
	}

	function defineFilters() {
		videosSettings[index].contrast = contrastInput.value / 20
		videosSettings[index].brightness = brightnessInput.value / 20
		item.style.filter = `brightness(${videosSettings[index].brightness}) contrast(${videosSettings[index].contrast})`
	}

	videosSettings.push(videoInfo)

	item.addEventListener('click', () => {
		const itemCenter = getCenterCoords(item)
		if (!item.classList.contains('videos-wrap__video-container--open')) {
			isAllButtonClicked = false

			video.muted = false

			item.style.transform = `translate(${-(itemCenter.left - pageCenter.left)}px, ${-(itemCenter.top - pageCenter.top)}px) scale(${document
				.documentElement.clientWidth / item.offsetWidth})`

			contrastInput.value = videosSettings[index].contrast * 20
			brightnessInput.value = videosSettings[index].brightness * 20

			item.classList.remove('videos-wrap__video-container--overflow-hidden')
			item.classList.add('videos-wrap__video-container--open')

			contrastInput.addEventListener('input', defineFilters)
			brightnessInput.addEventListener('input', defineFilters)
			videoSettingsPanel.classList.remove('videos-wrap__video-settings--hidden')
			setTimeout(() => {
				document.body.classList.add('video-open')
			}, timeForVideoToShow - 100)
			main(video, index)

			allCamerasButton.addEventListener('click', () => {
				isAllButtonClicked = true

				video.muted = true

				item.style.transform = 'none'

				videoSettingsPanel.classList.add('videos-wrap__video-settings--hidden')
				setTimeout(() => {
					item.classList.add('videos-wrap__video-container--overflow-hidden')
				}, timeForVideoToShow)

				contrastInput.removeEventListener('input', defineFilters)
				brightnessInput.removeEventListener('input', defineFilters)

				item.classList.remove('videos-wrap__video-container--open')
				document.body.classList.remove('video-open')
			})
		}
	})
})

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9ub2RlX21vZHVsZXMvZmx1eC1mcmFtZXdvcmsvaW5kZXguanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9ub2RlX21vZHVsZXMvZmx1eC1mcmFtZXdvcmsvbGlicmFyeS9TdG9yZS5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9mYWtlXzg4NGMwZjA0LmpzIiwiL1VzZXJzL3VzZXIvUHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL21vZHVsZXMvdmlkZW9zLW9ic2VydmF0aW9uL2luaXRWaWRlby5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL3ZpZGVvcy1vYnNlcnZhdGlvbi93b3JrV2l0aFZpZGVvcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYnJhcnkvU3RvcmUuanMnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RvcmUge1xuICBjb25zdHJ1Y3Rvcih1cGRhdGVTdGF0ZSwgc3RhdGUpIHtcbiAgICB0aGlzLl91cGRhdGVTdGF0ZSA9IHVwZGF0ZVN0YXRlO1xuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gIH1cblxuICBnZXQgZ2V0U3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgdXBkYXRlKGFjdGlvbikge1xuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5fdXBkYXRlU3RhdGUodGhpcy5fc3RhdGUsIGFjdGlvbik7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2IgPT4ge1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN1YnNjcmliZShjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9tb2R1bGVzL3ZpZGVvcy1vYnNlcnZhdGlvbi9pbml0VmlkZW8nKTtcblxucmVxdWlyZSgnLi9tb2R1bGVzL3ZpZGVvcy1vYnNlcnZhdGlvbi93b3JrV2l0aFZpZGVvcycpO1xuXG52YXIgX2ZsdXhGcmFtZXdvcmsgPSByZXF1aXJlKCdmbHV4LWZyYW1ld29yaycpO1xuXG52YXIgX2ZsdXhGcmFtZXdvcmsyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZmx1eEZyYW1ld29yayk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBicmlnaHRuZXNzSW5wdXRHbG9iYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX2JyaWdodG5lc3MtaW5wdXQnKTtcbnZhciBjb250cmFzdElucHV0R2xvYmFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX19jb250cmFzdC1pbnB1dCcpO1xuXG52YXIgY29udHJhc3RJbnB1dFZhbHVlRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fY29udHJhc3QtdmFsdWUtZGlzcGxheScpO1xudmFyIGJyaWdodG5lc3NJbnB1dFZhbHVlRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fYnJpZ2h0bmVzcy12YWx1ZS1kaXNwbGF5Jyk7XG5cbnZhciByZWR1Y2VyID0gZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0NIQU5HRScpIHtcbiAgICByZXR1cm4gYWN0aW9uLmRhdGE7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufTtcblxudmFyIGluaXRpYWxTdGF0ZSA9IHtcbiAgdmFsdWU6IDIwXG59O1xuXG52YXIgc3RvcmUgPSBuZXcgX2ZsdXhGcmFtZXdvcmsyLmRlZmF1bHQocmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcblxuYnJpZ2h0bmVzc0lucHV0R2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICB2YXIgaW5jcmVtZW50U3RhdGUgPSB7IHR5cGU6ICdDSEFOR0UnLCBkYXRhOiBicmlnaHRuZXNzSW5wdXRHbG9iYWwudmFsdWUgfTtcbiAgc3RvcmUudXBkYXRlKGluY3JlbWVudFN0YXRlKTtcbiAgYnJpZ2h0bmVzc0lucHV0VmFsdWVEaXNwbGF5LmlubmVySFRNTCA9IHN0b3JlLmdldFN0YXRlO1xufSk7XG5cbmNvbnRyYXN0SW5wdXRHbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBpbmNyZW1lbnRTdGF0ZSA9IHsgdHlwZTogJ0NIQU5HRScsIGRhdGE6IGNvbnRyYXN0SW5wdXRHbG9iYWwudmFsdWUgfTtcbiAgc3RvcmUudXBkYXRlKGluY3JlbWVudFN0YXRlKTtcbiAgY29udHJhc3RJbnB1dFZhbHVlRGlzcGxheS5pbm5lckhUTUwgPSBzdG9yZS5nZXRTdGF0ZTtcbn0pO1xuXG52YXIgaW5jcmVtZW50U3RhdGUgPSB7IHR5cGU6IFwiQ0hBTkdFXCIsIGRhdGE6IDMgfTtcblxuc3RvcmUuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coJ0hFTExPIFdPUkxEJywgc3RvcmUuZ2V0U3RhdGUpO1xufSk7XG5cbnN0b3JlLnVwZGF0ZShpbmNyZW1lbnRTdGF0ZSk7IiwiZnVuY3Rpb24gaW5pdFZpZGVvKHZpZGVvLCB1cmwpIHtcblx0aWYgKEhscy5pc1N1cHBvcnRlZCgpKSB7XG5cdFx0bGV0IGhscyA9IG5ldyBIbHMoKVxuXHRcdGhscy5sb2FkU291cmNlKHVybClcblx0XHRobHMuYXR0YWNoTWVkaWEodmlkZW8pXG5cdFx0aGxzLm9uKEhscy5FdmVudHMuTUFOSUZFU1RfUEFSU0VELCAoKSA9PiB7XG5cdFx0XHR2aWRlby5wbGF5KClcblx0XHR9KVxuXHR9IGVsc2UgaWYgKHZpZGVvLmNhblBsYXlUeXBlKCdhcHBsaWNhdGlvbi92bmQuYXBwbGUubXBlZ3VybCcpKSB7XG5cdFx0dmlkZW8uc3JjID0gJ2h0dHBzOi8vdmlkZW8tZGV2LmdpdGh1Yi5pby9zdHJlYW1zL3gzNnhoenoveDM2eGh6ei5tM3U4J1xuXHRcdHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuXHRcdFx0dmlkZW8ucGxheSgpXG5cdFx0fSlcblx0fVxufVxuXG5pbml0VmlkZW8oXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby0xJyksXG5cdCdodHRwOi8vbG9jYWxob3N0OjkxOTEvbWFzdGVyP3VybD1odHRwJTNBJTJGJTJGbG9jYWxob3N0JTNBMzEwMiUyRnN0cmVhbXMlMkZzb3NlZCUyRm1hc3Rlci5tM3U4J1xuKVxuXG5pbml0VmlkZW8oXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby0yJyksXG5cdCdodHRwOi8vbG9jYWxob3N0OjkxOTEvbWFzdGVyP3VybD1odHRwJTNBJTJGJTJGbG9jYWxob3N0JTNBMzEwMiUyRnN0cmVhbXMlMkZjYXQlMkZtYXN0ZXIubTN1OCdcbilcblxuaW5pdFZpZGVvKFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8tMycpLFxuXHQnaHR0cDovL2xvY2FsaG9zdDo5MTkxL21hc3Rlcj91cmw9aHR0cCUzQSUyRiUyRmxvY2FsaG9zdCUzQTMxMDIlMkZzdHJlYW1zJTJGZG9nJTJGbWFzdGVyLm0zdTgnXG4pXG5cbmluaXRWaWRlbyhcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLTQnKSxcblx0J2h0dHA6Ly9sb2NhbGhvc3Q6OTE5MS9tYXN0ZXI/dXJsPWh0dHAlM0ElMkYlMkZsb2NhbGhvc3QlM0EzMTAyJTJGc3RyZWFtcyUyRmhhbGwlMkZtYXN0ZXIubTN1OCdcbilcbiIsImNvbnN0IHZpZGVvQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyJylcbmNvbnN0IHZpZGVvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52aWRlb3Mtd3JhcF9fdmlkZW8nKVxuXG5jb25zdCB0aW1lRm9yVmlkZW9Ub1Nob3cgPSA0MDBcblxuLy8gQXVkaW8gQVBJIHNldHRpbmdzXG5jb25zdCBhdWRpb0N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpXG5jb25zdCBhbmFseXNlcnMgPSBbYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKSwgYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKSwgYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKSwgYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKV1cbmFuYWx5c2Vyc1swXS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKVxuYW5hbHlzZXJzWzFdLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pXG5hbmFseXNlcnNbMl0uY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbilcbmFuYWx5c2Vyc1szXS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKVxuXG5jb25zdCBzb3VyY2UwID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHZpZGVvc1swXSlcbmNvbnN0IHNvdXJjZTEgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodmlkZW9zWzFdKVxuY29uc3Qgc291cmNlMiA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSh2aWRlb3NbMl0pXG5jb25zdCBzb3VyY2UzID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHZpZGVvc1szXSlcbnNvdXJjZTAuY29ubmVjdChhbmFseXNlcnNbMF0pXG5zb3VyY2UxLmNvbm5lY3QoYW5hbHlzZXJzWzFdKVxuc291cmNlMi5jb25uZWN0KGFuYWx5c2Vyc1syXSlcbnNvdXJjZTMuY29ubmVjdChhbmFseXNlcnNbM10pXG5cbi8vIENhbnZhcyBzZXR0aW5nc1xuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpc3VhbGl6ZXInKVxuY29uc3QgY2FudmFzQ3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbmNvbnN0IGludGVuZGVkV2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX3ZpZGVvLXNldHRpbmdzJykuY2xpZW50V2lkdGhcbmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgaW50ZW5kZWRXaWR0aClcblxuY29uc3QgYWxsQ2FtZXJhc0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fdmlkZW8tYWxsLWNhbWVyYXMnKVxubGV0IGlzQWxsQnV0dG9uQ2xpY2tlZCA9IGZhbHNlXG5cbi8vIFZpc3VhbGl6ZSBmdW5jdGlvblxuY29uc3QgdmlzdWFsaXplID0gKGFuYWx5c2VyKSA9PiB7XG5cdGNvbnN0IFdJRFRIID0gY2FudmFzLndpZHRoXG5cdGNvbnN0IEhFSUdIVCA9IGNhbnZhcy5oZWlnaHRcblxuXHRhbmFseXNlci5mZnRTaXplID0gMjU2XG5cdGNvbnN0IGJ1ZmZlckxlbmd0aEFsdCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50XG5cdGNvbnN0IGRhdGFBcnJheUFsdCA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlckxlbmd0aEFsdClcblxuXHRjYW52YXNDdHguY2xlYXJSZWN0KDAsIDAsIFdJRFRILCBIRUlHSFQpXG5cblx0Y29uc3QgZHJhd0FsdCA9ICgpID0+IHtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhd0FsdClcblxuXHRcdGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKGRhdGFBcnJheUFsdClcblxuXHRcdGNhbnZhc0N0eC5maWxsU3R5bGUgPSAncmdiKDAsIDAsIDApJ1xuXHRcdGNhbnZhc0N0eC5maWxsUmVjdCgwLCAwLCBXSURUSCwgSEVJR0hUKVxuXG5cdFx0Y29uc3QgYmFyV2lkdGggPSBXSURUSCAvIGJ1ZmZlckxlbmd0aEFsdFxuXHRcdGxldCBiYXJIZWlnaHRcblx0XHRsZXQgeCA9IDBcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoQWx0OyBpICs9IDEpIHtcblx0XHRcdGJhckhlaWdodCA9IGRhdGFBcnJheUFsdFtpXVxuXG5cdFx0XHRjYW52YXNDdHguZmlsbFN0eWxlID0gYHJnYigke2JhckhlaWdodCArIDEwMH0sNTAsNTApYFxuXHRcdFx0Y2FudmFzQ3R4LmZpbGxSZWN0KHgsIEhFSUdIVCAtIGJhckhlaWdodCAvIDIsIGJhcldpZHRoLCBiYXJIZWlnaHQgLyAyKVxuXG5cdFx0XHR4ICs9IGJhcldpZHRoICsgMVxuXHRcdFx0aWYgKGlzQWxsQnV0dG9uQ2xpY2tlZCkge1xuXHRcdFx0XHRjYW52YXNDdHguY2xlYXJSZWN0KDAsIDAsIFdJRFRILCBIRUlHSFQpXG5cdFx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKGRyYXdBbHQpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZHJhd0FsdCgpXG59XG5cbmNvbnN0IG1haW4gPSAoZWwsIGFuYWx5c2VySW5kZXgpID0+IHtcblx0dmlzdWFsaXplKGFuYWx5c2Vyc1thbmFseXNlckluZGV4XSlcbn1cblxuY29uc3QgYnJpZ2h0bmVzc0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX19icmlnaHRuZXNzLWlucHV0JylcbmNvbnN0IGNvbnRyYXN0SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX2NvbnRyYXN0LWlucHV0JylcbmNvbnN0IHZpZGVvU2V0dGluZ3NQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fdmlkZW8tc2V0dGluZ3MnKVxuXG5jb25zdCB2aWRlb3NTZXR0aW5ncyA9IFtdXG5cbmNvbnN0IHBhZ2VDZW50ZXIgPSB7XG5cdHRvcDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDIsXG5cdGxlZnQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDJcbn1cblxuY29uc3QgZ2V0Q2VudGVyQ29vcmRzID0gKGVsKSA9PiAoe1xuXHR0b3A6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGVsLm9mZnNldEhlaWdodCAvIDIsXG5cdGxlZnQ6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBlbC5vZmZzZXRXaWR0aCAvIDJcbn0pXG5cbnZpZGVvQ29udGFpbmVycy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuXHRjb25zdCB2aWRlbyA9IGl0ZW0ucXVlcnlTZWxlY3RvcigndmlkZW8nKVxuXG5cdGNvbnN0IHZpZGVvSW5mbyA9IHtcblx0XHRicmlnaHRuZXNzOiAxLFxuXHRcdGNvbnRyYXN0OiAxXG5cdH1cblxuXHRmdW5jdGlvbiBkZWZpbmVGaWx0ZXJzKCkge1xuXHRcdHZpZGVvc1NldHRpbmdzW2luZGV4XS5jb250cmFzdCA9IGNvbnRyYXN0SW5wdXQudmFsdWUgLyAyMFxuXHRcdHZpZGVvc1NldHRpbmdzW2luZGV4XS5icmlnaHRuZXNzID0gYnJpZ2h0bmVzc0lucHV0LnZhbHVlIC8gMjBcblx0XHRpdGVtLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7dmlkZW9zU2V0dGluZ3NbaW5kZXhdLmJyaWdodG5lc3N9KSBjb250cmFzdCgke3ZpZGVvc1NldHRpbmdzW2luZGV4XS5jb250cmFzdH0pYFxuXHR9XG5cblx0dmlkZW9zU2V0dGluZ3MucHVzaCh2aWRlb0luZm8pXG5cblx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRjb25zdCBpdGVtQ2VudGVyID0gZ2V0Q2VudGVyQ29vcmRzKGl0ZW0pXG5cdFx0aWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucygndmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lci0tb3BlbicpKSB7XG5cdFx0XHRpc0FsbEJ1dHRvbkNsaWNrZWQgPSBmYWxzZVxuXG5cdFx0XHR2aWRlby5tdXRlZCA9IGZhbHNlXG5cblx0XHRcdGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgkey0oaXRlbUNlbnRlci5sZWZ0IC0gcGFnZUNlbnRlci5sZWZ0KX1weCwgJHstKGl0ZW1DZW50ZXIudG9wIC0gcGFnZUNlbnRlci50b3ApfXB4KSBzY2FsZSgke2RvY3VtZW50XG5cdFx0XHRcdC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyBpdGVtLm9mZnNldFdpZHRofSlgXG5cblx0XHRcdGNvbnRyYXN0SW5wdXQudmFsdWUgPSB2aWRlb3NTZXR0aW5nc1tpbmRleF0uY29udHJhc3QgKiAyMFxuXHRcdFx0YnJpZ2h0bmVzc0lucHV0LnZhbHVlID0gdmlkZW9zU2V0dGluZ3NbaW5kZXhdLmJyaWdodG5lc3MgKiAyMFxuXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW92ZXJmbG93LWhpZGRlbicpXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW9wZW4nKVxuXG5cdFx0XHRjb250cmFzdElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVmaW5lRmlsdGVycylcblx0XHRcdGJyaWdodG5lc3NJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlZmluZUZpbHRlcnMpXG5cdFx0XHR2aWRlb1NldHRpbmdzUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9zLXdyYXBfX3ZpZGVvLXNldHRpbmdzLS1oaWRkZW4nKVxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndmlkZW8tb3BlbicpXG5cdFx0XHR9LCB0aW1lRm9yVmlkZW9Ub1Nob3cgLSAxMDApXG5cdFx0XHRtYWluKHZpZGVvLCBpbmRleClcblxuXHRcdFx0YWxsQ2FtZXJhc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0aXNBbGxCdXR0b25DbGlja2VkID0gdHJ1ZVxuXG5cdFx0XHRcdHZpZGVvLm11dGVkID0gdHJ1ZVxuXG5cdFx0XHRcdGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnXG5cblx0XHRcdFx0dmlkZW9TZXR0aW5nc1BhbmVsLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvcy13cmFwX192aWRlby1zZXR0aW5ncy0taGlkZGVuJylcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vdmVyZmxvdy1oaWRkZW4nKVxuXHRcdFx0XHR9LCB0aW1lRm9yVmlkZW9Ub1Nob3cpXG5cblx0XHRcdFx0Y29udHJhc3RJbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlZmluZUZpbHRlcnMpXG5cdFx0XHRcdGJyaWdodG5lc3NJbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlZmluZUZpbHRlcnMpXG5cblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vcGVuJylcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlby1vcGVuJylcblx0XHRcdH0pXG5cdFx0fVxuXHR9KVxufSlcbiJdfQ==
