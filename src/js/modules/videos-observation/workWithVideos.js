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
