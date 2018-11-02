const videoContainers = document.querySelectorAll('.videos-wrap__video-container')
const videos = document.querySelectorAll('.videos-wrap__video')

const timeForVideoToShow = 400

interface IWindow {
	AudioContext: typeof AudioContext
	webkitAudioContext: typeof AudioContext
	mozAudioContext: typeof AudioContext
}
declare const window: IWindow

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
const canvas = <HTMLCanvasElement>document.querySelector('.visualizer')
let canvasCtx: CanvasRenderingContext2D
if (canvas) {
	canvasCtx = <CanvasRenderingContext2D>canvas.getContext('2d')
}
const videosWrapVideoSettings = document.querySelector('.videos-wrap__video-settings')

let intendedWidth
if (videosWrapVideoSettings) {
	intendedWidth = videosWrapVideoSettings.clientWidth
}

if (canvas) {
	let tempIndendedWidth = Number(intendedWidth).toString()
	canvas.setAttribute('width', tempIndendedWidth)
}

const allCamerasButton = document.querySelector('.videos-wrap__video-all-cameras')
let isAllButtonClicked = false

// Visualize function
const visualize = (analyser: AnalyserNode) => {
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
				cancelAnimationFrame(Number(drawAlt)) // err
			}
		}
	}

	drawAlt()
	return true
}

const main = (el: HTMLElement, analyserIndex: number) => {
	visualize(analysers[analyserIndex])
}

const brightnessInput: HTMLInputElement | null = document.querySelector('.videos-wrap__brightness-input')
const contrastInput: HTMLInputElement | null = document.querySelector('.videos-wrap__contrast-input')
const videoSettingsPanel = document.querySelector('.videos-wrap__video-settings')

interface IvideosSettings {
	contrast: number
	brightness: number
}

const videosSettings: IvideosSettings[] = []

interface IPageCenter {
	left: number
	top: number
}

let pageCenter: IPageCenter
if (document.documentElement) {
	pageCenter = {
		top: document.documentElement.clientHeight / 2,
		left: document.documentElement.clientWidth / 2
	}
}

const getCenterCoords = (el: HTMLElement) => ({
	top: el.getBoundingClientRect().top + el.offsetHeight / 2,
	left: el.getBoundingClientRect().left + el.offsetWidth / 2
})

videoContainers.forEach((item, index: number) => {
	const video = item.querySelector('video')

	const videoInfo = {
		brightness: 1,
		contrast: 1
	}

	function defineFilters() {
		if (contrastInput && brightnessInput) {
			videosSettings[index].contrast = Number(contrastInput.value) / 20
			videosSettings[index].brightness = Number(brightnessInput.value) / 20
		}
		;(<HTMLDivElement>item).style.filter = `brightness(${videosSettings[index].brightness}) contrast(${videosSettings[index].contrast})`
	}

	videosSettings.push(videoInfo)

	item.addEventListener('click', () => {
		const itemCenter = getCenterCoords(<HTMLElement>item)
		if (!item.classList.contains('videos-wrap__video-container--open')) {
			isAllButtonClicked = false

			if (video) video.muted = false

			if (document.documentElement) {
				;(<HTMLDivElement>item).style.transform = `translate(${-(itemCenter.left - pageCenter.left)}px, ${-(
					itemCenter.top - pageCenter.top
				)}px) scale(${document.documentElement.clientWidth / (<HTMLDivElement>item).offsetWidth})`
			}

			if (contrastInput && brightnessInput) {
				contrastInput.value = String(videosSettings[index].contrast * 20)
				brightnessInput.value = String(videosSettings[index].brightness * 20)
			}

			item.classList.remove('videos-wrap__video-container--overflow-hidden')
			item.classList.add('videos-wrap__video-container--open')

			if (contrastInput && brightnessInput && videoSettingsPanel) {
				contrastInput.addEventListener('input', defineFilters)
				brightnessInput.addEventListener('input', defineFilters)
				videoSettingsPanel.classList.remove('videos-wrap__video-settings--hidden')
			}
			setTimeout(() => {
				document.body.classList.add('video-open')
			}, timeForVideoToShow - 100)
			main(<HTMLVideoElement>video, index)

			if (allCamerasButton && video) {
				allCamerasButton.addEventListener('click', () => {
					isAllButtonClicked = true

					video.muted = true
					;(<HTMLDivElement>item).style.transform = 'none'

					if (videoSettingsPanel) {
						videoSettingsPanel.classList.add('videos-wrap__video-settings--hidden')
					}
					setTimeout(() => {
						item.classList.add('videos-wrap__video-container--overflow-hidden')
					}, timeForVideoToShow)

					if (contrastInput && brightnessInput) {
						contrastInput.removeEventListener('input', defineFilters)
						brightnessInput.removeEventListener('input', defineFilters)
					}

					item.classList.remove('videos-wrap__video-container--open')
					document.body.classList.remove('video-open')
				})
			}
		}
	})
})
