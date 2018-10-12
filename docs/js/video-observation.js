(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/videos-observation/initVideo');

require('./modules/videos-observation/workWithVideos');
},{"./modules/videos-observation/initVideo":2,"./modules/videos-observation/workWithVideos":3}],2:[function(require,module,exports){
function initVideo(video, url) {
	if (Hls.isSupported()) {
		var hls = new Hls()
		hls.loadSource(url)
		hls.attachMedia(video)
		hls.on(Hls.Events.MANIFEST_PARSED, function() {
			video.play()
		})
	} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'
		video.addEventListener('loadedmetadata', function() {
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

},{}],3:[function(require,module,exports){
const brightnessInput = document.querySelector('.videos-wrap__brightness-input')
const contrastInput = document.querySelector('.videos-wrap__contrast-input')
const videoSettings = document.querySelector('.videos-wrap__video-settings')

const pageCenter = {
	top: document.documentElement.clientHeight / 2,
	left: document.documentElement.clientWidth / 2
}

const getCenterCoords = (el) => {
	return {
		top: el.getBoundingClientRect().top + el.offsetHeight / 2,
		left: el.getBoundingClientRect().left + el.offsetWidth / 2
	}
}

const videos = document.querySelectorAll('.videos-wrap__video-container')

videos.forEach((item, i) => {
	const videoInfo = {
		brightness: 1,
		contrast: 1
	}

	item.addEventListener('click', () => {
		const itemCenter = getCenterCoords(item)
		if (!item.classList.contains('videos-wrap__video--open')) {
			item.style.transform = `translate(${-(itemCenter.left - pageCenter.left)}px, ${-(itemCenter.top - pageCenter.top)}px) scale(${document
				.documentElement.clientWidth / item.offsetWidth})`
			item.classList.remove('videos-wrap__video-container--overflow-hidden')
			item.classList.add('videos-wrap__video--open')
		} else {
			item.style.transform = 'none'
			setTimeout(() => {
				item.classList.add('videos-wrap__video-container--overflow-hidden')
			}, 400)
			item.classList.remove('videos-wrap__video--open')
		}
	})
})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzL3NocmktMjAxOC8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV9iNGFkMjNmNy5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL3ZpZGVvcy1vYnNlcnZhdGlvbi9pbml0VmlkZW8uanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzL3NocmktMjAxOC8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvbW9kdWxlcy92aWRlb3Mtb2JzZXJ2YXRpb24vd29ya1dpdGhWaWRlb3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy92aWRlb3Mtb2JzZXJ2YXRpb24vaW5pdFZpZGVvJyk7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy92aWRlb3Mtb2JzZXJ2YXRpb24vd29ya1dpdGhWaWRlb3MnKTsiLCJmdW5jdGlvbiBpbml0VmlkZW8odmlkZW8sIHVybCkge1xuXHRpZiAoSGxzLmlzU3VwcG9ydGVkKCkpIHtcblx0XHR2YXIgaGxzID0gbmV3IEhscygpXG5cdFx0aGxzLmxvYWRTb3VyY2UodXJsKVxuXHRcdGhscy5hdHRhY2hNZWRpYSh2aWRlbylcblx0XHRobHMub24oSGxzLkV2ZW50cy5NQU5JRkVTVF9QQVJTRUQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmlkZW8ucGxheSgpXG5cdFx0fSlcblx0fSBlbHNlIGlmICh2aWRlby5jYW5QbGF5VHlwZSgnYXBwbGljYXRpb24vdm5kLmFwcGxlLm1wZWd1cmwnKSkge1xuXHRcdHZpZGVvLnNyYyA9ICdodHRwczovL3ZpZGVvLWRldi5naXRodWIuaW8vc3RyZWFtcy94MzZ4aHp6L3gzNnhoenoubTN1OCdcblx0XHR2aWRlby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmlkZW8ucGxheSgpXG5cdFx0fSlcblx0fVxufVxuXG5pbml0VmlkZW8oXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby0xJyksXG5cdCdodHRwOi8vbG9jYWxob3N0OjkxOTEvbWFzdGVyP3VybD1odHRwJTNBJTJGJTJGbG9jYWxob3N0JTNBMzEwMiUyRnN0cmVhbXMlMkZzb3NlZCUyRm1hc3Rlci5tM3U4J1xuKVxuXG5pbml0VmlkZW8oXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby0yJyksXG5cdCdodHRwOi8vbG9jYWxob3N0OjkxOTEvbWFzdGVyP3VybD1odHRwJTNBJTJGJTJGbG9jYWxob3N0JTNBMzEwMiUyRnN0cmVhbXMlMkZjYXQlMkZtYXN0ZXIubTN1OCdcbilcblxuaW5pdFZpZGVvKFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8tMycpLFxuXHQnaHR0cDovL2xvY2FsaG9zdDo5MTkxL21hc3Rlcj91cmw9aHR0cCUzQSUyRiUyRmxvY2FsaG9zdCUzQTMxMDIlMkZzdHJlYW1zJTJGZG9nJTJGbWFzdGVyLm0zdTgnXG4pXG5cbmluaXRWaWRlbyhcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLTQnKSxcblx0J2h0dHA6Ly9sb2NhbGhvc3Q6OTE5MS9tYXN0ZXI/dXJsPWh0dHAlM0ElMkYlMkZsb2NhbGhvc3QlM0EzMTAyJTJGc3RyZWFtcyUyRmhhbGwlMkZtYXN0ZXIubTN1OCdcbilcbiIsImNvbnN0IGJyaWdodG5lc3NJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb3Mtd3JhcF9fYnJpZ2h0bmVzcy1pbnB1dCcpXG5jb25zdCBjb250cmFzdElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX19jb250cmFzdC1pbnB1dCcpXG5jb25zdCB2aWRlb1NldHRpbmdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvcy13cmFwX192aWRlby1zZXR0aW5ncycpXG5cbmNvbnN0IHBhZ2VDZW50ZXIgPSB7XG5cdHRvcDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDIsXG5cdGxlZnQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDJcbn1cblxuY29uc3QgZ2V0Q2VudGVyQ29vcmRzID0gKGVsKSA9PiB7XG5cdHJldHVybiB7XG5cdFx0dG9wOiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBlbC5vZmZzZXRIZWlnaHQgLyAyLFxuXHRcdGxlZnQ6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBlbC5vZmZzZXRXaWR0aCAvIDJcblx0fVxufVxuXG5jb25zdCB2aWRlb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lcicpXG5cbnZpZGVvcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdGNvbnN0IHZpZGVvSW5mbyA9IHtcblx0XHRicmlnaHRuZXNzOiAxLFxuXHRcdGNvbnRyYXN0OiAxXG5cdH1cblxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdGNvbnN0IGl0ZW1DZW50ZXIgPSBnZXRDZW50ZXJDb29yZHMoaXRlbSlcblx0XHRpZiAoIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCd2aWRlb3Mtd3JhcF9fdmlkZW8tLW9wZW4nKSkge1xuXHRcdFx0aXRlbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7LShpdGVtQ2VudGVyLmxlZnQgLSBwYWdlQ2VudGVyLmxlZnQpfXB4LCAkey0oaXRlbUNlbnRlci50b3AgLSBwYWdlQ2VudGVyLnRvcCl9cHgpIHNjYWxlKCR7ZG9jdW1lbnRcblx0XHRcdFx0LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIGl0ZW0ub2Zmc2V0V2lkdGh9KWBcblx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9zLXdyYXBfX3ZpZGVvLWNvbnRhaW5lci0tb3ZlcmZsb3ctaGlkZGVuJylcblx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgndmlkZW9zLXdyYXBfX3ZpZGVvLS1vcGVuJylcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXRlbS5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSdcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvcy13cmFwX192aWRlby1jb250YWluZXItLW92ZXJmbG93LWhpZGRlbicpXG5cdFx0XHR9LCA0MDApXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvcy13cmFwX192aWRlby0tb3BlbicpXG5cdFx0fVxuXHR9KVxufSlcbiJdfQ==
