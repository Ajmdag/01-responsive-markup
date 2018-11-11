(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./library/Store');

},{"./library/Store":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    constructor(updateState, state) {
        this.updateState = updateState;
        this.state = state;
        this.callbacks = [];
    }
    get getState() {
        return this.state;
    }
    update(action) {
        this.state = this.updateState(this.state, action);
        this.callbacks.forEach(cb => {
            cb();
        });
    }
    subscribe(callback) {
        this.callbacks.push(callback);
        return () => (this.callbacks = this.callbacks.filter(cb => cb !== callback));
    }
}
exports.default = Store;

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

var incrementState = { type: 'CHANGE', data: 3 };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvbm9kZV9tb2R1bGVzL2ZsdXgtZnJhbWV3b3JrL2luZGV4LmpzIiwiL2hvbWUveXVyeS9wcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9ub2RlX21vZHVsZXMvZmx1eC1mcmFtZXdvcmsvbGlicmFyeS9TdG9yZS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL2Zha2VfNGNmOWI2MWQuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL3ZpZGVvcy1vYnNlcnZhdGlvbi9pbml0VmlkZW8uanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL3ZpZGVvcy1vYnNlcnZhdGlvbi93b3JrV2l0aFZpZGVvcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYnJhcnkvU3RvcmUnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHVwZGF0ZVN0YXRlLCBzdGF0ZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlID0gdXBkYXRlU3RhdGU7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBbXTtcbiAgICB9XG4gICAgZ2V0IGdldFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgICB9XG4gICAgdXBkYXRlKGFjdGlvbikge1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy51cGRhdGVTdGF0ZSh0aGlzLnN0YXRlLCBhY3Rpb24pO1xuICAgICAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKGNiID0+IHtcbiAgICAgICAgICAgIGNiKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiAodGhpcy5jYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gU3RvcmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy92aWRlb3Mtb2JzZXJ2YXRpb24vaW5pdFZpZGVvJyk7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy92aWRlb3Mtb2JzZXJ2YXRpb24vd29ya1dpdGhWaWRlb3MnKTtcblxudmFyIF9mbHV4RnJhbWV3b3JrID0gcmVxdWlyZSgnZmx1eC1mcmFtZXdvcmsnKTtcblxudmFyIF9mbHV4RnJhbWV3b3JrMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZsdXhGcmFtZXdvcmspO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgYnJpZ2h0bmVzc0lucHV0R2xvYmFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX19icmlnaHRuZXNzLWlucHV0Jyk7XG52YXIgY29udHJhc3RJbnB1dEdsb2JhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fY29udHJhc3QtaW5wdXQnKTtcblxudmFyIGNvbnRyYXN0SW5wdXRWYWx1ZURpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX2NvbnRyYXN0LXZhbHVlLWRpc3BsYXknKTtcbnZhciBicmlnaHRuZXNzSW5wdXRWYWx1ZURpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX2JyaWdodG5lc3MtdmFsdWUtZGlzcGxheScpO1xuXG52YXIgcmVkdWNlciA9IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuXHRpZiAoYWN0aW9uLnR5cGUgPT09ICdDSEFOR0UnKSB7XG5cdFx0cmV0dXJuIGFjdGlvbi5kYXRhO1xuXHR9XG5cdHJldHVybiBzdGF0ZTtcbn07XG5cbnZhciBpbml0aWFsU3RhdGUgPSB7XG5cdHZhbHVlOiAyMFxufTtcblxudmFyIHN0b3JlID0gbmV3IF9mbHV4RnJhbWV3b3JrMi5kZWZhdWx0KHJlZHVjZXIsIGluaXRpYWxTdGF0ZSk7XG5cbmJyaWdodG5lc3NJbnB1dEdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblx0dmFyIGluY3JlbWVudFN0YXRlID0geyB0eXBlOiAnQ0hBTkdFJywgZGF0YTogYnJpZ2h0bmVzc0lucHV0R2xvYmFsLnZhbHVlIH07XG5cdHN0b3JlLnVwZGF0ZShpbmNyZW1lbnRTdGF0ZSk7XG5cdGJyaWdodG5lc3NJbnB1dFZhbHVlRGlzcGxheS5pbm5lckhUTUwgPSBzdG9yZS5nZXRTdGF0ZTtcbn0pO1xuXG5jb250cmFzdElucHV0R2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuXHR2YXIgaW5jcmVtZW50U3RhdGUgPSB7IHR5cGU6ICdDSEFOR0UnLCBkYXRhOiBjb250cmFzdElucHV0R2xvYmFsLnZhbHVlIH07XG5cdHN0b3JlLnVwZGF0ZShpbmNyZW1lbnRTdGF0ZSk7XG5cdGNvbnRyYXN0SW5wdXRWYWx1ZURpc3BsYXkuaW5uZXJIVE1MID0gc3RvcmUuZ2V0U3RhdGU7XG59KTtcblxudmFyIGluY3JlbWVudFN0YXRlID0geyB0eXBlOiAnQ0hBTkdFJywgZGF0YTogMyB9O1xuXG5zdG9yZS51cGRhdGUoaW5jcmVtZW50U3RhdGUpOyIsImZ1bmN0aW9uIGluaXRWaWRlbyh2aWRlbywgdXJsKSB7XG5cdGlmIChIbHMuaXNTdXBwb3J0ZWQoKSkge1xuXHRcdGxldCBobHMgPSBuZXcgSGxzKClcblx0XHRobHMubG9hZFNvdXJjZSh1cmwpXG5cdFx0aGxzLmF0dGFjaE1lZGlhKHZpZGVvKVxuXHRcdGhscy5vbihIbHMuRXZlbnRzLk1BTklGRVNUX1BBUlNFRCwgKCkgPT4ge1xuXHRcdFx0dmlkZW8ucGxheSgpXG5cdFx0fSlcblx0fSBlbHNlIGlmICh2aWRlby5jYW5QbGF5VHlwZSgnYXBwbGljYXRpb24vdm5kLmFwcGxlLm1wZWd1cmwnKSkge1xuXHRcdHZpZGVvLnNyYyA9ICdodHRwczovL3ZpZGVvLWRldi5naXRodWIuaW8vc3RyZWFtcy94MzZ4aHp6L3gzNnhoenoubTN1OCdcblx0XHR2aWRlby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcblx0XHRcdHZpZGVvLnBsYXkoKVxuXHRcdH0pXG5cdH1cbn1cblxuaW5pdFZpZGVvKFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8tMScpLFxuXHQnaHR0cDovL2xvY2FsaG9zdDo5MTkxL21hc3Rlcj91cmw9aHR0cCUzQSUyRiUyRmxvY2FsaG9zdCUzQTMxMDIlMkZzdHJlYW1zJTJGc29zZWQlMkZtYXN0ZXIubTN1OCdcbilcblxuaW5pdFZpZGVvKFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8tMicpLFxuXHQnaHR0cDovL2xvY2FsaG9zdDo5MTkxL21hc3Rlcj91cmw9aHR0cCUzQSUyRiUyRmxvY2FsaG9zdCUzQTMxMDIlMkZzdHJlYW1zJTJGY2F0JTJGbWFzdGVyLm0zdTgnXG4pXG5cbmluaXRWaWRlbyhcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLTMnKSxcblx0J2h0dHA6Ly9sb2NhbGhvc3Q6OTE5MS9tYXN0ZXI/dXJsPWh0dHAlM0ElMkYlMkZsb2NhbGhvc3QlM0EzMTAyJTJGc3RyZWFtcyUyRmRvZyUyRm1hc3Rlci5tM3U4J1xuKVxuXG5pbml0VmlkZW8oXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby00JyksXG5cdCdodHRwOi8vbG9jYWxob3N0OjkxOTEvbWFzdGVyP3VybD1odHRwJTNBJTJGJTJGbG9jYWxob3N0JTNBMzEwMiUyRnN0cmVhbXMlMkZoYWxsJTJGbWFzdGVyLm0zdTgnXG4pXG4iLCJjb25zdCB2aWRlb0NvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lcicpXG5jb25zdCB2aWRlb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmlkZW9zLXdyYXBfX3ZpZGVvJylcblxuY29uc3QgdGltZUZvclZpZGVvVG9TaG93ID0gNDAwXG5cbi8vIEF1ZGlvIEFQSSBzZXR0aW5nc1xuY29uc3QgYXVkaW9DdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKVxuY29uc3QgYW5hbHlzZXJzID0gW2F1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCksIGF1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCksIGF1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCksIGF1ZGlvQ3R4LmNyZWF0ZUFuYWx5c2VyKCldXG5hbmFseXNlcnNbMF0uY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbilcbmFuYWx5c2Vyc1sxXS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKVxuYW5hbHlzZXJzWzJdLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pXG5hbmFseXNlcnNbM10uY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbilcblxuY29uc3Qgc291cmNlMCA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSh2aWRlb3NbMF0pXG5jb25zdCBzb3VyY2UxID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHZpZGVvc1sxXSlcbmNvbnN0IHNvdXJjZTIgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodmlkZW9zWzJdKVxuY29uc3Qgc291cmNlMyA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSh2aWRlb3NbM10pXG5zb3VyY2UwLmNvbm5lY3QoYW5hbHlzZXJzWzBdKVxuc291cmNlMS5jb25uZWN0KGFuYWx5c2Vyc1sxXSlcbnNvdXJjZTIuY29ubmVjdChhbmFseXNlcnNbMl0pXG5zb3VyY2UzLmNvbm5lY3QoYW5hbHlzZXJzWzNdKVxuXG4vLyBDYW52YXMgc2V0dGluZ3NcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aXN1YWxpemVyJylcbmNvbnN0IGNhbnZhc0N0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5jb25zdCBpbnRlbmRlZFdpZHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX192aWRlby1zZXR0aW5ncycpLmNsaWVudFdpZHRoXG5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGludGVuZGVkV2lkdGgpXG5cbmNvbnN0IGFsbENhbWVyYXNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX3ZpZGVvLWFsbC1jYW1lcmFzJylcbmxldCBpc0FsbEJ1dHRvbkNsaWNrZWQgPSBmYWxzZVxuXG4vLyBWaXN1YWxpemUgZnVuY3Rpb25cbmNvbnN0IHZpc3VhbGl6ZSA9IChhbmFseXNlcikgPT4ge1xuXHRjb25zdCBXSURUSCA9IGNhbnZhcy53aWR0aFxuXHRjb25zdCBIRUlHSFQgPSBjYW52YXMuaGVpZ2h0XG5cblx0YW5hbHlzZXIuZmZ0U2l6ZSA9IDI1NlxuXHRjb25zdCBidWZmZXJMZW5ndGhBbHQgPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudFxuXHRjb25zdCBkYXRhQXJyYXlBbHQgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGhBbHQpXG5cblx0Y2FudmFzQ3R4LmNsZWFyUmVjdCgwLCAwLCBXSURUSCwgSEVJR0hUKVxuXG5cdGNvbnN0IGRyYXdBbHQgPSAoKSA9PiB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXdBbHQpXG5cblx0XHRhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShkYXRhQXJyYXlBbHQpXG5cblx0XHRjYW52YXNDdHguZmlsbFN0eWxlID0gJ3JnYigwLCAwLCAwKSdcblx0XHRjYW52YXNDdHguZmlsbFJlY3QoMCwgMCwgV0lEVEgsIEhFSUdIVClcblxuXHRcdGNvbnN0IGJhcldpZHRoID0gV0lEVEggLyBidWZmZXJMZW5ndGhBbHRcblx0XHRsZXQgYmFySGVpZ2h0XG5cdFx0bGV0IHggPSAwXG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aEFsdDsgaSArPSAxKSB7XG5cdFx0XHRiYXJIZWlnaHQgPSBkYXRhQXJyYXlBbHRbaV1cblxuXHRcdFx0Y2FudmFzQ3R4LmZpbGxTdHlsZSA9IGByZ2IoJHtiYXJIZWlnaHQgKyAxMDB9LDUwLDUwKWBcblx0XHRcdGNhbnZhc0N0eC5maWxsUmVjdCh4LCBIRUlHSFQgLSBiYXJIZWlnaHQgLyAyLCBiYXJXaWR0aCwgYmFySGVpZ2h0IC8gMilcblxuXHRcdFx0eCArPSBiYXJXaWR0aCArIDFcblx0XHRcdGlmIChpc0FsbEJ1dHRvbkNsaWNrZWQpIHtcblx0XHRcdFx0Y2FudmFzQ3R4LmNsZWFyUmVjdCgwLCAwLCBXSURUSCwgSEVJR0hUKVxuXHRcdFx0XHRjYW5jZWxBbmltYXRpb25GcmFtZShkcmF3QWx0KVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGRyYXdBbHQoKVxufVxuXG5jb25zdCBtYWluID0gKGVsLCBhbmFseXNlckluZGV4KSA9PiB7XG5cdHZpc3VhbGl6ZShhbmFseXNlcnNbYW5hbHlzZXJJbmRleF0pXG59XG5cbmNvbnN0IGJyaWdodG5lc3NJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fYnJpZ2h0bmVzcy1pbnB1dCcpXG5jb25zdCBjb250cmFzdElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX19jb250cmFzdC1pbnB1dCcpXG5jb25zdCB2aWRlb1NldHRpbmdzUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9zLXdyYXBfX3ZpZGVvLXNldHRpbmdzJylcblxuY29uc3QgdmlkZW9zU2V0dGluZ3MgPSBbXVxuXG5jb25zdCBwYWdlQ2VudGVyID0ge1xuXHR0b3A6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAyLFxuXHRsZWZ0OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAyXG59XG5cbmNvbnN0IGdldENlbnRlckNvb3JkcyA9IChlbCkgPT4gKHtcblx0dG9wOiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBlbC5vZmZzZXRIZWlnaHQgLyAyLFxuXHRsZWZ0OiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgZWwub2Zmc2V0V2lkdGggLyAyXG59KVxuXG52aWRlb0NvbnRhaW5lcnMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0Y29uc3QgdmlkZW8gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcblxuXHRjb25zdCB2aWRlb0luZm8gPSB7XG5cdFx0YnJpZ2h0bmVzczogMSxcblx0XHRjb250cmFzdDogMVxuXHR9XG5cblx0ZnVuY3Rpb24gZGVmaW5lRmlsdGVycygpIHtcblx0XHR2aWRlb3NTZXR0aW5nc1tpbmRleF0uY29udHJhc3QgPSBjb250cmFzdElucHV0LnZhbHVlIC8gMjBcblx0XHR2aWRlb3NTZXR0aW5nc1tpbmRleF0uYnJpZ2h0bmVzcyA9IGJyaWdodG5lc3NJbnB1dC52YWx1ZSAvIDIwXG5cdFx0aXRlbS5zdHlsZS5maWx0ZXIgPSBgYnJpZ2h0bmVzcygke3ZpZGVvc1NldHRpbmdzW2luZGV4XS5icmlnaHRuZXNzfSkgY29udHJhc3QoJHt2aWRlb3NTZXR0aW5nc1tpbmRleF0uY29udHJhc3R9KWBcblx0fVxuXG5cdHZpZGVvc1NldHRpbmdzLnB1c2godmlkZW9JbmZvKVxuXG5cdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0Y29uc3QgaXRlbUNlbnRlciA9IGdldENlbnRlckNvb3JkcyhpdGVtKVxuXHRcdGlmICghaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW9wZW4nKSkge1xuXHRcdFx0aXNBbGxCdXR0b25DbGlja2VkID0gZmFsc2VcblxuXHRcdFx0dmlkZW8ubXV0ZWQgPSBmYWxzZVxuXG5cdFx0XHRpdGVtLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHstKGl0ZW1DZW50ZXIubGVmdCAtIHBhZ2VDZW50ZXIubGVmdCl9cHgsICR7LShpdGVtQ2VudGVyLnRvcCAtIHBhZ2VDZW50ZXIudG9wKX1weCkgc2NhbGUoJHtkb2N1bWVudFxuXHRcdFx0XHQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gaXRlbS5vZmZzZXRXaWR0aH0pYFxuXG5cdFx0XHRjb250cmFzdElucHV0LnZhbHVlID0gdmlkZW9zU2V0dGluZ3NbaW5kZXhdLmNvbnRyYXN0ICogMjBcblx0XHRcdGJyaWdodG5lc3NJbnB1dC52YWx1ZSA9IHZpZGVvc1NldHRpbmdzW2luZGV4XS5icmlnaHRuZXNzICogMjBcblxuXHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vdmVyZmxvdy1oaWRkZW4nKVxuXHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCd2aWRlb3Mtd3JhcF9fdmlkZW8tY29udGFpbmVyLS1vcGVuJylcblxuXHRcdFx0Y29udHJhc3RJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlZmluZUZpbHRlcnMpXG5cdFx0XHRicmlnaHRuZXNzSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZWZpbmVGaWx0ZXJzKVxuXHRcdFx0dmlkZW9TZXR0aW5nc1BhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvcy13cmFwX192aWRlby1zZXR0aW5ncy0taGlkZGVuJylcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3ZpZGVvLW9wZW4nKVxuXHRcdFx0fSwgdGltZUZvclZpZGVvVG9TaG93IC0gMTAwKVxuXHRcdFx0bWFpbih2aWRlbywgaW5kZXgpXG5cblx0XHRcdGFsbENhbWVyYXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdGlzQWxsQnV0dG9uQ2xpY2tlZCA9IHRydWVcblxuXHRcdFx0XHR2aWRlby5tdXRlZCA9IHRydWVcblxuXHRcdFx0XHRpdGVtLnN0eWxlLnRyYW5zZm9ybSA9ICdub25lJ1xuXG5cdFx0XHRcdHZpZGVvU2V0dGluZ3NQYW5lbC5jbGFzc0xpc3QuYWRkKCd2aWRlb3Mtd3JhcF9fdmlkZW8tc2V0dGluZ3MtLWhpZGRlbicpXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgndmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lci0tb3ZlcmZsb3ctaGlkZGVuJylcblx0XHRcdFx0fSwgdGltZUZvclZpZGVvVG9TaG93KVxuXG5cdFx0XHRcdGNvbnRyYXN0SW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZWZpbmVGaWx0ZXJzKVxuXHRcdFx0XHRicmlnaHRuZXNzSW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZWZpbmVGaWx0ZXJzKVxuXG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lci0tb3BlbicpXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndmlkZW8tb3BlbicpXG5cdFx0XHR9KVxuXHRcdH1cblx0fSlcbn0pXG4iXX0=
