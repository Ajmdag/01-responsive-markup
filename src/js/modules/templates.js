const smallTemplate = document.querySelector('.card-template--small')
const mediumTemplate = document.querySelector('.card-template--medium')
const largeTemplate = document.querySelector('.card-template--large')

const contentWrap = document.querySelector('.content-wrap')

fetch('./js/data/events.json')
	.then((response) => response.json())
	.then((json) => {
		for (let i = 0; i < json.events.length; i++) {
			const thisItem = json.events[i]

			// Заполнение карточек содержимым
			switch (thisItem.size) {
				case 's':
					const smallClone = document.importNode(smallTemplate.content, true)
					smallClone.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
					smallClone.querySelector('.card__title').innerHTML = thisItem.title
					smallClone.querySelector('.card__source').innerHTML = thisItem.source
					smallClone.querySelector('.card__time').innerHTML = thisItem.time

					//Добавление карточки предупреждения
					if (thisItem.type === 'critical') {
						smallClone.querySelector('.card__header-wrap').classList.add('critical')
					}

					// Добавление описания
					if (thisItem.description) {
						smallClone.querySelector('.card__header-wrap').classList.add('have-description')
						const smallDescriptionContainer = document.createElement('div')
						const smallDescriptionParagraph = document.createElement('p')
						smallDescriptionContainer.appendChild(smallDescriptionParagraph)
						smallDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--small')
						smallDescriptionContainer.classList.add('card__description', 'card__description--small')
						smallDescriptionParagraph.innerHTML = thisItem.description
						smallClone.querySelector('.card').appendChild(smallDescriptionContainer)
					}
					contentWrap.appendChild(smallClone)
					break
				case 'm':
					const mediumClone = document.importNode(mediumTemplate.content, true)
					mediumClone.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
					mediumClone.querySelector('.card__title').innerHTML = thisItem.title
					mediumClone.querySelector('.card__source').innerHTML = thisItem.source
					mediumClone.querySelector('.card__time').innerHTML = thisItem.time

					//Добавление карточки предупреждения
					if (thisItem.type === 'critical') {
						mediumClone.querySelector('.card__header-wrap').classList.add('critical')
					}

					// Добавление описания
					if (thisItem.description) {
						mediumClone.querySelector('.card__header-wrap').classList.add('have-description')
						const mediumDescriptionContainer = document.createElement('div')
						const mediumDescriptionParagraph = document.createElement('p')
						mediumDescriptionContainer.appendChild(mediumDescriptionParagraph)
						mediumDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--medium')
						mediumDescriptionContainer.classList.add('card__description', 'card__description--medium')
						mediumDescriptionParagraph.innerHTML = thisItem.description
						mediumClone.querySelector('.card').appendChild(mediumDescriptionContainer)
					}

					if (thisItem.data) {
						if (thisItem.data.temperature && thisItem.data.humidity) {
							const mediumDataAir = document.createElement('div')
							mediumDataAir.classList.add('card__data', 'card__data--air')
							const mediumDataTemperature = document.createElement('p')
							mediumDataTemperature.innerHTML = `Температура: <b>${thisItem.data.temperature} С<b>`
							const mediumDataHumidity = document.createElement('p')
							mediumDataHumidity.innerHTML = `Влажность: <b>${thisItem.data.humidity} %<b>`
							mediumDataAir.appendChild(mediumDataTemperature)
							mediumDataAir.appendChild(mediumDataHumidity)
							mediumClone.querySelector('.card__description').appendChild(mediumDataAir)
						}

						if (thisItem.data.buttons) {
							const buttonsContainer = document.createElement('div')
							buttonsContainer.classList.add('card__data-buttons-container')
							const buttonYes = document.createElement('div')
							buttonYes.classList.add('card__data-button', 'card__data--button-yes')
							buttonYes.innerHTML = 'Да'
							const buttonNo = document.createElement('div')
							buttonNo.classList.add('card__data-button', 'card__data--button-no')
							buttonNo.innerHTML = 'Нет'
							buttonsContainer.appendChild(buttonYes)
							buttonsContainer.appendChild(buttonNo)
							mediumClone.querySelector('.card__description').appendChild(buttonsContainer)
						}

						if (thisItem.data.artist) {
							const musicPlayer = document.createElement('div')
							musicPlayer.classList.add('card__data-music-player')
							musicPlayer.innerHTML = `
								<div class="card__player">
									<div class="player">
										<div class="player__header">
											<div class="player__logo-container">
												<img src="${thisItem.data.albumcover}" alt="" class="player__logo">
											</div>
											<div class="player__trackinfo">
												<p class="player__name">${thisItem.data.artist} - ${thisItem.data.track.name}</p>
												<div class="player__track">
													<div class="player__trackline"></div>
													<p class="player__time">${thisItem.data.track.length}</p>
												</div>
											</div>
										</div>
										<div class="player__controls">
											<img src="./assets/prev.svg" alt="" class="player__control player__control--left">
											<img src="./assets/prev.svg" alt="" class="player__control player__control--right">
											<div class="player__volume"></div>
											<p class="player__volume-percent">${thisItem.data.volume} %</p>
										</div>
									</div>
								</div>`
							mediumClone.querySelector('.card__description').appendChild(musicPlayer)
						}
					}
					contentWrap.appendChild(mediumClone)
					break
				case 'l':
					const largeClone = document.importNode(largeTemplate.content, true)
					largeClone.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
					largeClone.querySelector('.card__title').innerHTML = thisItem.title
					largeClone.querySelector('.card__source').innerHTML = thisItem.source
					largeClone.querySelector('.card__time').innerHTML = thisItem.time

					//Добавление карточки предупреждения
					if (thisItem.type === 'critical') {
						largeClone.querySelector('.card__header-wrap').classList.add('critical')
					}

					// Добавление описания
					if (thisItem.description) {
						largeClone.querySelector('.card__header-wrap').classList.add('have-description')
						const largeDescriptionContainer = document.createElement('div')
						const largeDescriptionParagraph = document.createElement('p')
						largeDescriptionContainer.appendChild(largeDescriptionParagraph)
						largeDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--large')
						largeDescriptionContainer.classList.add('card__description', 'card__description--large')
						largeDescriptionParagraph.innerHTML = thisItem.description
						largeClone.querySelector('.card').appendChild(largeDescriptionContainer)
					}

					// Добавление картинки
					let largeDataImage
					if (thisItem.data.type === 'graph') {
						largeDataImage = document.createElement('img')
						largeDataImage.classList.add('card__image')
						largeDataImage.src = './assets/richdata.svg'
					}

					if (thisItem.data.image) {
						largeDataImage = document.createElement('div')
						largeDataImage.innerHTML = `<img
						class="card__image"
						srcset="./assets/bitmap.png 768w,
						./assets/bitmap2x.png 1366w,
						./assets/bitmap3x.png 1920w"
						src="./assets/bitmap2x.png">`
					}

					largeClone.querySelector('.card__description').appendChild(largeDataImage)
					contentWrap.appendChild(largeClone)
					break
			}
		}
	})
