(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function initVideo(video, url) {
	if (Hls.isSupported()) {
		var hls = new Hls();
		hls.loadSource(url);
		hls.attachMedia(video);
		hls.on(Hls.Events.MANIFEST_PARSED, function () {
			video.play();
		});
	} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
		video.addEventListener('loadedmetadata', function () {
			video.play();
		});
	}
}

initVideo(document.getElementById('video-1'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8');

initVideo(document.getElementById('video-2'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8');

initVideo(document.getElementById('video-3'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8');

initVideo(document.getElementById('video-4'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8');
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL2Zha2VfOWRiODBlYjAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGluaXRWaWRlbyh2aWRlbywgdXJsKSB7XG5cdGlmIChIbHMuaXNTdXBwb3J0ZWQoKSkge1xuXHRcdHZhciBobHMgPSBuZXcgSGxzKCk7XG5cdFx0aGxzLmxvYWRTb3VyY2UodXJsKTtcblx0XHRobHMuYXR0YWNoTWVkaWEodmlkZW8pO1xuXHRcdGhscy5vbihIbHMuRXZlbnRzLk1BTklGRVNUX1BBUlNFRCwgZnVuY3Rpb24gKCkge1xuXHRcdFx0dmlkZW8ucGxheSgpO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKHZpZGVvLmNhblBsYXlUeXBlKCdhcHBsaWNhdGlvbi92bmQuYXBwbGUubXBlZ3VybCcpKSB7XG5cdFx0dmlkZW8uc3JjID0gJ2h0dHBzOi8vdmlkZW8tZGV2LmdpdGh1Yi5pby9zdHJlYW1zL3gzNnhoenoveDM2eGh6ei5tM3U4Jztcblx0XHR2aWRlby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZpZGVvLnBsYXkoKTtcblx0XHR9KTtcblx0fVxufVxuXG5pbml0VmlkZW8oZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLTEnKSwgJ2h0dHA6Ly9sb2NhbGhvc3Q6OTE5MS9tYXN0ZXI/dXJsPWh0dHAlM0ElMkYlMkZsb2NhbGhvc3QlM0EzMTAyJTJGc3RyZWFtcyUyRnNvc2VkJTJGbWFzdGVyLm0zdTgnKTtcblxuaW5pdFZpZGVvKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby0yJyksICdodHRwOi8vbG9jYWxob3N0OjkxOTEvbWFzdGVyP3VybD1odHRwJTNBJTJGJTJGbG9jYWxob3N0JTNBMzEwMiUyRnN0cmVhbXMlMkZjYXQlMkZtYXN0ZXIubTN1OCcpO1xuXG5pbml0VmlkZW8oZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLTMnKSwgJ2h0dHA6Ly9sb2NhbGhvc3Q6OTE5MS9tYXN0ZXI/dXJsPWh0dHAlM0ElMkYlMkZsb2NhbGhvc3QlM0EzMTAyJTJGc3RyZWFtcyUyRmRvZyUyRm1hc3Rlci5tM3U4Jyk7XG5cbmluaXRWaWRlbyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8tNCcpLCAnaHR0cDovL2xvY2FsaG9zdDo5MTkxL21hc3Rlcj91cmw9aHR0cCUzQSUyRiUyRmxvY2FsaG9zdCUzQTMxMDIlMkZzdHJlYW1zJTJGaGFsbCUyRm1hc3Rlci5tM3U4Jyk7Il19
