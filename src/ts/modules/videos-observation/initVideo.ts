function initVideo(video: HTMLVideoElement, url: string) {
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

const video1: HTMLElement | null = document.getElementById('video-1')
const video2: HTMLElement | null = document.getElementById('video-2')
const video3: HTMLElement | null = document.getElementById('video-3')
const video4: HTMLElement | null = document.getElementById('video-4')

if (video1 && video2 && video3 && video4) {
	initVideo(<HTMLVideoElement>video1, 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8')

	initVideo(<HTMLVideoElement>video2, 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8')

	initVideo(<HTMLVideoElement>video3, 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8')

	initVideo(<HTMLVideoElement>video4, 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8')
}
