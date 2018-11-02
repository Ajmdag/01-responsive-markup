"use strict";
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
var canvasCtx;
if (canvas) {
    canvasCtx = canvas.getContext('2d');
}
var videosWrapVideoSettings = document.querySelector('.videos-wrap__video-settings');
var intendedWidth;
if (videosWrapVideoSettings) {
    intendedWidth = videosWrapVideoSettings.clientWidth;
}
if (canvas) {
    var tempIndendedWidth = Number(intendedWidth).toString();
    canvas.setAttribute('width', tempIndendedWidth);
}
var allCamerasButton = document.querySelector('.videos-wrap__video-all-cameras');
var isAllButtonClicked = false;
// Visualize function
var visualize = function (analyser) {
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    analyser.fftSize = 256;
    var bufferLengthAlt = analyser.frequencyBinCount;
    var dataArrayAlt = new Uint8Array(bufferLengthAlt);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    var drawAlt = function () {
        requestAnimationFrame(drawAlt);
        analyser.getByteFrequencyData(dataArrayAlt);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        var barWidth = WIDTH / bufferLengthAlt;
        var barHeight;
        var x = 0;
        for (var i = 0; i < bufferLengthAlt; i += 1) {
            barHeight = dataArrayAlt[i];
            canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
            if (isAllButtonClicked) {
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                cancelAnimationFrame(Number(drawAlt)); // err
            }
        }
    };
    drawAlt();
    return true;
};
var main = function (el, analyserIndex) {
    visualize(analysers[analyserIndex]);
};
var brightnessInput = document.querySelector('.videos-wrap__brightness-input');
var contrastInput = document.querySelector('.videos-wrap__contrast-input');
var videoSettingsPanel = document.querySelector('.videos-wrap__video-settings');
var videosSettings = [];
var pageCenter;
if (document.documentElement) {
    pageCenter = {
        top: document.documentElement.clientHeight / 2,
        left: document.documentElement.clientWidth / 2
    };
}
var getCenterCoords = function (el) { return ({
    top: el.getBoundingClientRect().top + el.offsetHeight / 2,
    left: el.getBoundingClientRect().left + el.offsetWidth / 2
}); };
videoContainers.forEach(function (item, index) {
    var video = item.querySelector('video');
    var videoInfo = {
        brightness: 1,
        contrast: 1
    };
    function defineFilters() {
        if (contrastInput && brightnessInput) {
            videosSettings[index].contrast = Number(contrastInput.value) / 20;
            videosSettings[index].brightness = Number(brightnessInput.value) / 20;
        }
        ;
        item.style.filter = "brightness(" + videosSettings[index].brightness + ") contrast(" + videosSettings[index].contrast + ")";
    }
    videosSettings.push(videoInfo);
    item.addEventListener('click', function () {
        var itemCenter = getCenterCoords(item);
        if (!item.classList.contains('videos-wrap__video-container--open')) {
            isAllButtonClicked = false;
            if (video)
                video.muted = false;
            if (document.documentElement) {
                ;
                item.style.transform = "translate(" + -(itemCenter.left - pageCenter.left) + "px, " + -(itemCenter.top - pageCenter.top) + "px) scale(" + document.documentElement.clientWidth / item.offsetWidth + ")";
            }
            if (contrastInput && brightnessInput) {
                contrastInput.value = String(videosSettings[index].contrast * 20);
                brightnessInput.value = String(videosSettings[index].brightness * 20);
            }
            item.classList.remove('videos-wrap__video-container--overflow-hidden');
            item.classList.add('videos-wrap__video-container--open');
            if (contrastInput && brightnessInput && videoSettingsPanel) {
                contrastInput.addEventListener('input', defineFilters);
                brightnessInput.addEventListener('input', defineFilters);
                videoSettingsPanel.classList.remove('videos-wrap__video-settings--hidden');
            }
            setTimeout(function () {
                document.body.classList.add('video-open');
            }, timeForVideoToShow - 100);
            main(video, index);
            if (allCamerasButton && video) {
                allCamerasButton.addEventListener('click', function () {
                    isAllButtonClicked = true;
                    video.muted = true;
                    item.style.transform = 'none';
                    if (videoSettingsPanel) {
                        videoSettingsPanel.classList.add('videos-wrap__video-settings--hidden');
                    }
                    setTimeout(function () {
                        item.classList.add('videos-wrap__video-container--overflow-hidden');
                    }, timeForVideoToShow);
                    if (contrastInput && brightnessInput) {
                        contrastInput.removeEventListener('input', defineFilters);
                        brightnessInput.removeEventListener('input', defineFilters);
                    }
                    item.classList.remove('videos-wrap__video-container--open');
                    document.body.classList.remove('video-open');
                });
            }
        }
    });
});