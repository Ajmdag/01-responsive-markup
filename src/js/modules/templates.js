const eventsObject = {
	events: [
		{
			type: 'info',
			title: 'Еженедельный отчет по расходам ресурсов',
			source: 'Сенсоры потребления',
			time: '19:00, Сегодня',
			description: 'Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.',
			icon: 'stats',
			data: {
				type: 'graph',
				values: [
					{
						electricity: [
							['1536883200', 115],
							['1536969600', 117],
							['1537056000', 117.2],
							['1537142400', 118],
							['1537228800', 120],
							['1537315200', 123],
							['1537401600', 129]
						]
					},
					{
						water: [
							['1536883200', 40],
							['1536969600', 40.2],
							['1537056000', 40.5],
							['1537142400', 41],
							['1537228800', 41.4],
							['1537315200', 41.9],
							['1537401600', 42.6]
						]
					},
					{
						gas: [
							['1536883200', 13],
							['1536969600', 13.2],
							['1537056000', 13.5],
							['1537142400', 13.7],
							['1537228800', 14],
							['1537315200', 14.2],
							['1537401600', 14.5]
						]
					}
				]
			},
			size: 'l'
		},
		{
			type: 'info',
			title: 'Дверь открыта',
			source: 'Сенсор входной двери',
			time: '18:50, Сегодня',
			description: null,
			icon: 'key',
			size: 's'
		},
		{
			type: 'info',
			title: 'Уборка закончена',
			source: 'Пылесос',
			time: '18:45, Сегодня',
			description: null,
			icon: 'robot-cleaner',
			size: 's'
		},
		{
			type: 'info',
			title: 'Новый пользователь',
			source: 'Роутер',
			time: '18:45, Сегодня',
			description: null,
			icon: 'router',
			size: 's'
		},
		{
			type: 'info',
			title: 'Изменен климатический режим',
			source: 'Сенсор микроклимата',
			time: '18:30, Сегодня',
			description: 'Установлен климатический режим «Фиджи»',
			icon: 'thermal',
			size: 'm',
			data: {
				temperature: 24,
				humidity: 80
			}
		},
		{
			type: 'critical',
			title: 'Невозможно включить кондиционер',
			source: 'Кондиционер',
			time: '18:21, Сегодня',
			description: 'В комнате открыто окно, закройте его и повторите попытку',
			icon: 'ac',
			size: 'm'
		},
		{
			type: 'info',
			title: 'Музыка включена',
			source: 'Яндекс.Станция',
			time: '18:16, Сегодня',
			description: 'Сейчас проигрывается:',
			icon: 'music',
			size: 'm',
			data: {
				albumcover: 'https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000',
				artist: 'Florence & The Machine',
				track: {
					name: 'Big God',
					length: '4:31'
				},
				volume: 80
			}
		},
		{
			type: 'info',
			title: 'Заканчивается молоко',
			source: 'Холодильник',
			time: '17:23, Сегодня',
			description: 'Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?',
			icon: 'fridge',
			size: 'm',
			data: {
				buttons: ['Да', 'Нет']
			}
		},
		{
			type: 'info',
			title: 'Зарядка завершена',
			source: 'Оконный сенсор',
			time: '16:22, Сегодня',
			description: 'Ура! Устройство «Оконный сенсор» снова в строю!',
			icon: 'battery',
			size: 's'
		},
		{
			type: 'critical',
			title: 'Пылесос застрял',
			source: 'Сенсор движения',
			time: '16:17, Сегодня',
			description: 'Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.',
			icon: 'cam',
			data: {
				image: 'get_it_from_mocks_:3.jpg'
			},
			size: 'l'
		},
		{
			type: 'info',
			title: 'Вода вскипела',
			source: 'Чайник',
			time: '16:20, Сегодня',
			description: null,
			icon: 'kettle',
			size: 's'
		}
	]
}

const smallTemplate = document.querySelector('.card-template--small')
const mediumTemplate = document.querySelector('.card-template--medium')
const largeTemplate = document.querySelector('.card-template--large')

const contentWrap = document.querySelector('.content-wrap')

for (let i = 0; i < eventsObject.events.length; i++) {
	const thisItem = eventsObject.events[i]

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
				largeDataImage = document.createElement('div')
				largeDataImage.classList.add('card__image-container')
				largeDataImage.innerHTML = `<img
				src="./assets/richdata.svg"
				class="card__image">`
			}

			if (thisItem.data.image) {
				largeDataImage = document.createElement('div')
				largeDataImage.classList.add('card__image-container')
				largeDataImage.setAttribute('id', 'hoover-container')
				largeDataImage.innerHTML = `<img
						class="card__image"
						id="hoover"
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
