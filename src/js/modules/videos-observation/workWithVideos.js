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
