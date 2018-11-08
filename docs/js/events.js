(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/events/templates');

require('./modules/events/pointerEvents');
},{"./modules/events/pointerEvents":2,"./modules/events/templates":3}],2:[function(require,module,exports){
let scaleValue = 1
let brightnessValue = 1
let prevDiff = -1
let prevAngle = null

const eventCache = []
const elementInfo = {}

function removeEvent(event) {
	for (let i = 0; i < eventCache.length; i += 1) {
		if (eventCache[i].pointerId === event.pointerId) {
			eventCache.splice(i, 1)
			break
		}
	}
}

function pointerUpHandler(event) {
	elementInfo.oldComputedX = elementInfo.computedX
	elementInfo.oldComputedY = elementInfo.computedY

	removeEvent(event)

	if (eventCache.length < 2) prevDiff = -1
}


// Создаем объект для вспомогательных функций
const helpersFunctions = {
	getDistaneBetweenTwoDots(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
	},

	getAngle(x1, y1, x2, y2) {
		return (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI
	},

	setComputedValuesViaLimits(computedX, computedY) {
		if (computedX > elementInfo.xMaxLimit) elementInfo.computedX = elementInfo.xMaxLimit
		if (computedX < elementInfo.xMinLimit) elementInfo.computedX = elementInfo.xMinLimit
		if (computedY < elementInfo.yMinLimit) elementInfo.computedY = elementInfo.yMinLimit
		if (computedY > elementInfo.yMaxLimit) elementInfo.computedY = elementInfo.yMaxLimit
	},

	setLimits() {
		elementInfo.yMaxLimit = (elementInfo.el.offsetHeight * scaleValue - elementInfo.el.parentNode.offsetHeight) / 4
		elementInfo.yMinLimit = -(elementInfo.el.offsetHeight * scaleValue - elementInfo.el.parentNode.offsetHeight) / 4
		elementInfo.xMaxLimit = (elementInfo.el.offsetWidth * scaleValue - elementInfo.el.parentNode.offsetWidth) / 4
		elementInfo.xMinLimit = -(elementInfo.el.offsetWidth * scaleValue - elementInfo.el.parentNode.offsetWidth) / 4
	}
}


function pointerDownHandler(event) {
	eventCache.push(event)

	// Запишем позицию курсора
	elementInfo.startedPointDownX = event.clientX
	elementInfo.startedPointDownY = event.clientY
}

function pointerMoveHandler(event) {
	for (let i = 0; i < eventCache.length; i += 1) {
		if (event.pointerId === eventCache[i].pointerId) {
			eventCache[i] = event
			break
		}
	}

	if (eventCache.length === 1) {
		elementInfo.computedX = event.clientX - elementInfo.startedPointDownX + elementInfo.oldComputedX
		elementInfo.computedY = event.clientY - elementInfo.startedPointDownY + elementInfo.oldComputedY

		helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY)

		event.target.style.transform = `scale(${scaleValue}) translate(${elementInfo.computedX}px, ${elementInfo.computedY}px)`
	}

	if (eventCache.length === 2) {
		const x1 = eventCache[0].clientX
		const y1 = eventCache[0].clientY
		const x2 = eventCache[1].clientX
		const y2 = eventCache[1].clientY

		const curAngle = helpersFunctions.getAngle(x1, y1, x2, y2)

		if (prevAngle) {
			const increaseOn = 0.01
			if (curAngle > prevAngle) {
				brightnessValue += increaseOn
				elementInfo.el.style.filter = `brightness(${brightnessValue})`
			}
			if (curAngle < prevAngle) {
				brightnessValue -= increaseOn
				elementInfo.el.style.filter = `brightness(${brightnessValue})`
			}
		}
		prevAngle = curAngle

		const curDiff = Math.abs(eventCache[0].clientX - eventCache[1].clientX)

		if (prevDiff > 0) {
			const pinchDiff = curDiff - prevDiff
			if (curDiff > prevDiff) {
				// ZOOM IN
				if (scaleValue >= 1) scaleValue += pinchDiff / 100
				if (scaleValue > 2) scaleValue = 2

				helpersFunctions.setLimits()
				helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY)

				elementInfo.el.style.transform = `scale(${scaleValue}) translate(${elementInfo.computedX}px, ${elementInfo.computedY}px)`
			}

			if (curDiff < prevDiff) {
				// ZOOM OUT
				if (scaleValue >= 1) scaleValue -= -pinchDiff / 100
				if (scaleValue < 1) scaleValue = 1

				helpersFunctions.setLimits()
				helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY)

				elementInfo.el.style.transform = `scale(${scaleValue}) translate(${elementInfo.computedX}px, ${elementInfo.computedY}px)`
			}
		}

		prevDiff = curDiff
	}
}

function init() {
	elementInfo.el = document.querySelector('#hoover')

	// Первичные значения
	elementInfo.oldComputedX = 0
	elementInfo.oldComputedY = 0

	elementInfo.computedX = 0
	elementInfo.computedY = 0

	elementInfo.yMaxLimit = 0
	elementInfo.yMinLimit = 0
	elementInfo.xMaxLimit = 0
	elementInfo.xMinLimit = 0

	elementInfo.initialWidth = elementInfo.el.offsetWidth
	elementInfo.initialHeight = elementInfo.el.offsetHeight

	elementInfo.containerHeight = elementInfo.el.parentNode.offsetHeight
	elementInfo.containerWidth = elementInfo.el.parentNode.offsetHeight

	// Переопределяем события
	elementInfo.el.onpointerdown = pointerDownHandler
	elementInfo.el.onpointermove = pointerMoveHandler
	elementInfo.el.onpointerup = pointerUpHandler
	elementInfo.el.onpointercancel = pointerUpHandler
	elementInfo.el.onpointerout = pointerUpHandler
	elementInfo.el.onpointerleave = pointerUpHandler
}

if ('ontouchstart' in document.documentElement) {
	document.body.onload = init()
}

},{}],3:[function(require,module,exports){
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

const contentWrap = document.querySelector('.events-wrap')

for (let i = 0; i < eventsObject.events.length; i += 1) {
	const thisItem = eventsObject.events[i]

	// Заполнение карточек содержимым
	switch (thisItem.size) {
		case 's':
			const smallClone = document.importNode(smallTemplate.content, true)
			smallClone.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
			smallClone.querySelector('.card__title').innerHTML = thisItem.title
			smallClone.querySelector('.card__source').innerHTML = thisItem.source
			smallClone.querySelector('.card__time').innerHTML = thisItem.time

			// Добавление карточки предупреждения
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

			// Добавление карточки предупреждения
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

			// Добавление карточки предупреждения
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
						touch-action="none"
						style="touch-action: none;"
						srcset="./assets/bitmap.png 768w,
						./assets/bitmap2x.png 1366w,
						./assets/bitmap3x.png 1920w"
						src="./assets/bitmap2x.png">`
			}

			largeClone.querySelector('.card__description').appendChild(largeDataImage)
			contentWrap.appendChild(largeClone)
			break
		default: console.error('Unexpected size of card');
	}
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV9iMzQ2Yzk0NS5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL2V2ZW50cy9wb2ludGVyRXZlbnRzLmpzIiwiL1VzZXJzL3VzZXIvUHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL21vZHVsZXMvZXZlbnRzL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy9ldmVudHMvdGVtcGxhdGVzJyk7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy9ldmVudHMvcG9pbnRlckV2ZW50cycpOyIsImxldCBzY2FsZVZhbHVlID0gMVxubGV0IGJyaWdodG5lc3NWYWx1ZSA9IDFcbmxldCBwcmV2RGlmZiA9IC0xXG5sZXQgcHJldkFuZ2xlID0gbnVsbFxuXG5jb25zdCBldmVudENhY2hlID0gW11cbmNvbnN0IGVsZW1lbnRJbmZvID0ge31cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnQoZXZlbnQpIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBldmVudENhY2hlLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0aWYgKGV2ZW50Q2FjaGVbaV0ucG9pbnRlcklkID09PSBldmVudC5wb2ludGVySWQpIHtcblx0XHRcdGV2ZW50Q2FjaGUuc3BsaWNlKGksIDEpXG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBwb2ludGVyVXBIYW5kbGVyKGV2ZW50KSB7XG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWCA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWFxuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFkgPSBlbGVtZW50SW5mby5jb21wdXRlZFlcblxuXHRyZW1vdmVFdmVudChldmVudClcblxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPCAyKSBwcmV2RGlmZiA9IC0xXG59XG5cblxuLy8g0KHQvtC30LTQsNC10Lwg0L7QsdGK0LXQutGCINC00LvRjyDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0YUg0YTRg9C90LrRhtC40LlcbmNvbnN0IGhlbHBlcnNGdW5jdGlvbnMgPSB7XG5cdGdldERpc3RhbmVCZXR3ZWVuVHdvRG90cyh4MSwgeTEsIHgyLCB5Mikge1xuXHRcdHJldHVybiBNYXRoLnNxcnQoKHgxIC0geDIpICoqIDIgKyAoeTEgLSB5MikgKiogMilcblx0fSxcblxuXHRnZXRBbmdsZSh4MSwgeTEsIHgyLCB5Mikge1xuXHRcdHJldHVybiAoTWF0aC5hdGFuMih5MSAtIHkyLCB4MSAtIHgyKSAqIDE4MCkgLyBNYXRoLlBJXG5cdH0sXG5cblx0c2V0Q29tcHV0ZWRWYWx1ZXNWaWFMaW1pdHMoY29tcHV0ZWRYLCBjb21wdXRlZFkpIHtcblx0XHRpZiAoY29tcHV0ZWRYID4gZWxlbWVudEluZm8ueE1heExpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFggPSBlbGVtZW50SW5mby54TWF4TGltaXRcblx0XHRpZiAoY29tcHV0ZWRYIDwgZWxlbWVudEluZm8ueE1pbkxpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFggPSBlbGVtZW50SW5mby54TWluTGltaXRcblx0XHRpZiAoY29tcHV0ZWRZIDwgZWxlbWVudEluZm8ueU1pbkxpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFkgPSBlbGVtZW50SW5mby55TWluTGltaXRcblx0XHRpZiAoY29tcHV0ZWRZID4gZWxlbWVudEluZm8ueU1heExpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFkgPSBlbGVtZW50SW5mby55TWF4TGltaXRcblx0fSxcblxuXHRzZXRMaW1pdHMoKSB7XG5cdFx0ZWxlbWVudEluZm8ueU1heExpbWl0ID0gKGVsZW1lbnRJbmZvLmVsLm9mZnNldEhlaWdodCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodCkgLyA0XG5cdFx0ZWxlbWVudEluZm8ueU1pbkxpbWl0ID0gLShlbGVtZW50SW5mby5lbC5vZmZzZXRIZWlnaHQgKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQpIC8gNFxuXHRcdGVsZW1lbnRJbmZvLnhNYXhMaW1pdCA9IChlbGVtZW50SW5mby5lbC5vZmZzZXRXaWR0aCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldFdpZHRoKSAvIDRcblx0XHRlbGVtZW50SW5mby54TWluTGltaXQgPSAtKGVsZW1lbnRJbmZvLmVsLm9mZnNldFdpZHRoICogc2NhbGVWYWx1ZSAtIGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0V2lkdGgpIC8gNFxuXHR9XG59XG5cblxuZnVuY3Rpb24gcG9pbnRlckRvd25IYW5kbGVyKGV2ZW50KSB7XG5cdGV2ZW50Q2FjaGUucHVzaChldmVudClcblxuXHQvLyDQl9Cw0L/QuNGI0LXQvCDQv9C+0LfQuNGG0LjRjiDQutGD0YDRgdC+0YDQsFxuXHRlbGVtZW50SW5mby5zdGFydGVkUG9pbnREb3duWCA9IGV2ZW50LmNsaWVudFhcblx0ZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blkgPSBldmVudC5jbGllbnRZXG59XG5cbmZ1bmN0aW9uIHBvaW50ZXJNb3ZlSGFuZGxlcihldmVudCkge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Q2FjaGUubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRpZiAoZXZlbnQucG9pbnRlcklkID09PSBldmVudENhY2hlW2ldLnBvaW50ZXJJZCkge1xuXHRcdFx0ZXZlbnRDYWNoZVtpXSA9IGV2ZW50XG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXG5cdGlmIChldmVudENhY2hlLmxlbmd0aCA9PT0gMSkge1xuXHRcdGVsZW1lbnRJbmZvLmNvbXB1dGVkWCA9IGV2ZW50LmNsaWVudFggLSBlbGVtZW50SW5mby5zdGFydGVkUG9pbnREb3duWCArIGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWFxuXHRcdGVsZW1lbnRJbmZvLmNvbXB1dGVkWSA9IGV2ZW50LmNsaWVudFkgLSBlbGVtZW50SW5mby5zdGFydGVkUG9pbnREb3duWSArIGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWVxuXG5cdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0cyhlbGVtZW50SW5mby5jb21wdXRlZFgsIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSlcblxuXHRcdGV2ZW50LnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtzY2FsZVZhbHVlfSkgdHJhbnNsYXRlKCR7ZWxlbWVudEluZm8uY29tcHV0ZWRYfXB4LCAke2VsZW1lbnRJbmZvLmNvbXB1dGVkWX1weClgXG5cdH1cblxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPT09IDIpIHtcblx0XHRjb25zdCB4MSA9IGV2ZW50Q2FjaGVbMF0uY2xpZW50WFxuXHRcdGNvbnN0IHkxID0gZXZlbnRDYWNoZVswXS5jbGllbnRZXG5cdFx0Y29uc3QgeDIgPSBldmVudENhY2hlWzFdLmNsaWVudFhcblx0XHRjb25zdCB5MiA9IGV2ZW50Q2FjaGVbMV0uY2xpZW50WVxuXG5cdFx0Y29uc3QgY3VyQW5nbGUgPSBoZWxwZXJzRnVuY3Rpb25zLmdldEFuZ2xlKHgxLCB5MSwgeDIsIHkyKVxuXG5cdFx0aWYgKHByZXZBbmdsZSkge1xuXHRcdFx0Y29uc3QgaW5jcmVhc2VPbiA9IDAuMDFcblx0XHRcdGlmIChjdXJBbmdsZSA+IHByZXZBbmdsZSkge1xuXHRcdFx0XHRicmlnaHRuZXNzVmFsdWUgKz0gaW5jcmVhc2VPblxuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS5maWx0ZXIgPSBgYnJpZ2h0bmVzcygke2JyaWdodG5lc3NWYWx1ZX0pYFxuXHRcdFx0fVxuXHRcdFx0aWYgKGN1ckFuZ2xlIDwgcHJldkFuZ2xlKSB7XG5cdFx0XHRcdGJyaWdodG5lc3NWYWx1ZSAtPSBpbmNyZWFzZU9uXG5cdFx0XHRcdGVsZW1lbnRJbmZvLmVsLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7YnJpZ2h0bmVzc1ZhbHVlfSlgXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHByZXZBbmdsZSA9IGN1ckFuZ2xlXG5cblx0XHRjb25zdCBjdXJEaWZmID0gTWF0aC5hYnMoZXZlbnRDYWNoZVswXS5jbGllbnRYIC0gZXZlbnRDYWNoZVsxXS5jbGllbnRYKVxuXG5cdFx0aWYgKHByZXZEaWZmID4gMCkge1xuXHRcdFx0Y29uc3QgcGluY2hEaWZmID0gY3VyRGlmZiAtIHByZXZEaWZmXG5cdFx0XHRpZiAoY3VyRGlmZiA+IHByZXZEaWZmKSB7XG5cdFx0XHRcdC8vIFpPT00gSU5cblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPj0gMSkgc2NhbGVWYWx1ZSArPSBwaW5jaERpZmYgLyAxMDBcblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPiAyKSBzY2FsZVZhbHVlID0gMlxuXG5cdFx0XHRcdGhlbHBlcnNGdW5jdGlvbnMuc2V0TGltaXRzKClcblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0cyhlbGVtZW50SW5mby5jb21wdXRlZFgsIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSlcblxuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtzY2FsZVZhbHVlfSkgdHJhbnNsYXRlKCR7ZWxlbWVudEluZm8uY29tcHV0ZWRYfXB4LCAke2VsZW1lbnRJbmZvLmNvbXB1dGVkWX1weClgXG5cdFx0XHR9XG5cblx0XHRcdGlmIChjdXJEaWZmIDwgcHJldkRpZmYpIHtcblx0XHRcdFx0Ly8gWk9PTSBPVVRcblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPj0gMSkgc2NhbGVWYWx1ZSAtPSAtcGluY2hEaWZmIC8gMTAwXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlIDwgMSkgc2NhbGVWYWx1ZSA9IDFcblxuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldExpbWl0cygpXG5cdFx0XHRcdGhlbHBlcnNGdW5jdGlvbnMuc2V0Q29tcHV0ZWRWYWx1ZXNWaWFMaW1pdHMoZWxlbWVudEluZm8uY29tcHV0ZWRYLCBlbGVtZW50SW5mby5jb21wdXRlZFkpXG5cblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGVWYWx1ZX0pIHRyYW5zbGF0ZSgke2VsZW1lbnRJbmZvLmNvbXB1dGVkWH1weCwgJHtlbGVtZW50SW5mby5jb21wdXRlZFl9cHgpYFxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByZXZEaWZmID0gY3VyRGlmZlxuXHR9XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cdGVsZW1lbnRJbmZvLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hvb3ZlcicpXG5cblx0Ly8g0J/QtdGA0LLQuNGH0L3Ri9C1INC30L3QsNGH0LXQvdC40Y9cblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYID0gMFxuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFkgPSAwXG5cblx0ZWxlbWVudEluZm8uY29tcHV0ZWRYID0gMFxuXHRlbGVtZW50SW5mby5jb21wdXRlZFkgPSAwXG5cblx0ZWxlbWVudEluZm8ueU1heExpbWl0ID0gMFxuXHRlbGVtZW50SW5mby55TWluTGltaXQgPSAwXG5cdGVsZW1lbnRJbmZvLnhNYXhMaW1pdCA9IDBcblx0ZWxlbWVudEluZm8ueE1pbkxpbWl0ID0gMFxuXG5cdGVsZW1lbnRJbmZvLmluaXRpYWxXaWR0aCA9IGVsZW1lbnRJbmZvLmVsLm9mZnNldFdpZHRoXG5cdGVsZW1lbnRJbmZvLmluaXRpYWxIZWlnaHQgPSBlbGVtZW50SW5mby5lbC5vZmZzZXRIZWlnaHRcblxuXHRlbGVtZW50SW5mby5jb250YWluZXJIZWlnaHQgPSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodFxuXHRlbGVtZW50SW5mby5jb250YWluZXJXaWR0aCA9IGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0XG5cblx0Ly8g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRgdC+0LHRi9GC0LjRj1xuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJkb3duID0gcG9pbnRlckRvd25IYW5kbGVyXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcm1vdmUgPSBwb2ludGVyTW92ZUhhbmRsZXJcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVydXAgPSBwb2ludGVyVXBIYW5kbGVyXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcmNhbmNlbCA9IHBvaW50ZXJVcEhhbmRsZXJcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVyb3V0ID0gcG9pbnRlclVwSGFuZGxlclxuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJsZWF2ZSA9IHBvaW50ZXJVcEhhbmRsZXJcbn1cblxuaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRkb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGluaXQoKVxufVxuIiwiY29uc3QgZXZlbnRzT2JqZWN0ID0ge1xuXHRldmVudHM6IFtcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CV0LbQtdC90LXQtNC10LvRjNC90YvQuSDQvtGC0YfQtdGCINC/0L4g0YDQsNGB0YXQvtC00LDQvCDRgNC10YHRg9GA0YHQvtCyJyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgNGLINC/0L7RgtGA0LXQsdC70LXQvdC40Y8nLFxuXHRcdFx0dGltZTogJzE5OjAwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Ci0LDQuiDQtNC10YDQttCw0YLRjCEg0JfQsCDQv9C+0YHQu9C10LTQvdGO0Y4g0L3QtdC00LXQu9GOINCy0Ysg0L/QvtGC0YDQsNGC0LjQu9C4INC90LAgMTAlINC80LXQvdGM0YjQtSDRgNC10YHRg9GA0YHQvtCyLCDRh9C10Lwg0L3QtdC00LXQu9C10Lkg0YDQsNC90LXQtS4nLFxuXHRcdFx0aWNvbjogJ3N0YXRzJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0dHlwZTogJ2dyYXBoJyxcblx0XHRcdFx0dmFsdWVzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZWxlY3RyaWNpdHk6IFtcblx0XHRcdFx0XHRcdFx0WycxNTM2ODgzMjAwJywgMTE1XSxcblx0XHRcdFx0XHRcdFx0WycxNTM2OTY5NjAwJywgMTE3XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MDU2MDAwJywgMTE3LjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcxNDI0MDAnLCAxMThdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcyMjg4MDAnLCAxMjBdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzczMTUyMDAnLCAxMjNdLFxuXHRcdFx0XHRcdFx0XHRbJzE1Mzc0MDE2MDAnLCAxMjldXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR3YXRlcjogW1xuXHRcdFx0XHRcdFx0XHRbJzE1MzY4ODMyMDAnLCA0MF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjk2OTYwMCcsIDQwLjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcwNTYwMDAnLCA0MC41XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MTQyNDAwJywgNDFdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcyMjg4MDAnLCA0MS40XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MzE1MjAwJywgNDEuOV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzQwMTYwMCcsIDQyLjZdXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRnYXM6IFtcblx0XHRcdFx0XHRcdFx0WycxNTM2ODgzMjAwJywgMTNdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzY5Njk2MDAnLCAxMy4yXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MDU2MDAwJywgMTMuNV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzE0MjQwMCcsIDEzLjddLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcyMjg4MDAnLCAxNF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzMxNTIwMCcsIDE0LjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1Mzc0MDE2MDAnLCAxNC41XVxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fSxcblx0XHRcdHNpemU6ICdsJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQlNCy0LXRgNGMINC+0YLQutGA0YvRgtCwJyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQstGF0L7QtNC90L7QuSDQtNCy0LXRgNC4Jyxcblx0XHRcdHRpbWU6ICcxODo1MCwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0XHRpY29uOiAna2V5Jyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQo9Cx0L7RgNC60LAg0LfQsNC60L7QvdGH0LXQvdCwJyxcblx0XHRcdHNvdXJjZTogJ9Cf0YvQu9C10YHQvtGBJyxcblx0XHRcdHRpbWU6ICcxODo0NSwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0XHRpY29uOiAncm9ib3QtY2xlYW5lcicsXG5cdFx0XHRzaXplOiAncydcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0J3QvtCy0YvQuSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxuXHRcdFx0c291cmNlOiAn0KDQvtGD0YLQtdGAJyxcblx0XHRcdHRpbWU6ICcxODo0NSwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0XHRpY29uOiAncm91dGVyJyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQmNC30LzQtdC90LXQvSDQutC70LjQvNCw0YLQuNGH0LXRgdC60LjQuSDRgNC10LbQuNC8Jyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQvNC40LrRgNC+0LrQu9C40LzQsNGC0LAnLFxuXHRcdFx0dGltZTogJzE4OjMwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Cj0YHRgtCw0L3QvtCy0LvQtdC9INC60LvQuNC80LDRgtC40YfQtdGB0LrQuNC5INGA0LXQttC40LwgwqvQpNC40LTQttC4wrsnLFxuXHRcdFx0aWNvbjogJ3RoZXJtYWwnLFxuXHRcdFx0c2l6ZTogJ20nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR0ZW1wZXJhdHVyZTogMjQsXG5cdFx0XHRcdGh1bWlkaXR5OiA4MFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2NyaXRpY2FsJyxcblx0XHRcdHRpdGxlOiAn0J3QtdCy0L7Qt9C80L7QttC90L4g0LLQutC70Y7Rh9C40YLRjCDQutC+0L3QtNC40YbQuNC+0L3QtdGAJyxcblx0XHRcdHNvdXJjZTogJ9Ca0L7QvdC00LjRhtC40L7QvdC10YAnLFxuXHRcdFx0dGltZTogJzE4OjIxLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9CSINC60L7QvNC90LDRgtC1INC+0YLQutGA0YvRgtC+INC+0LrQvdC+LCDQt9Cw0LrRgNC+0LnRgtC1INC10LPQviDQuCDQv9C+0LLRgtC+0YDQuNGC0LUg0L/QvtC/0YvRgtC60YMnLFxuXHRcdFx0aWNvbjogJ2FjJyxcblx0XHRcdHNpemU6ICdtJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQnNGD0LfRi9C60LAg0LLQutC70Y7Rh9C10L3QsCcsXG5cdFx0XHRzb3VyY2U6ICfQr9C90LTQtdC60YEu0KHRgtCw0L3RhtC40Y8nLFxuXHRcdFx0dGltZTogJzE4OjE2LCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Ch0LXQudGH0LDRgSDQv9GA0L7QuNCz0YDRi9Cy0LDQtdGC0YHRjzonLFxuXHRcdFx0aWNvbjogJ211c2ljJyxcblx0XHRcdHNpemU6ICdtJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0YWxidW1jb3ZlcjogJ2h0dHBzOi8vYXZhdGFycy55YW5kZXgubmV0L2dldC1tdXNpYy1jb250ZW50LzE5MzgyMy8xODIwYTQzZS5hLjU1MTcwNTYtMS9tMTAwMHgxMDAwJyxcblx0XHRcdFx0YXJ0aXN0OiAnRmxvcmVuY2UgJiBUaGUgTWFjaGluZScsXG5cdFx0XHRcdHRyYWNrOiB7XG5cdFx0XHRcdFx0bmFtZTogJ0JpZyBHb2QnLFxuXHRcdFx0XHRcdGxlbmd0aDogJzQ6MzEnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZvbHVtZTogODBcblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JfQsNC60LDQvdGH0LjQstCw0LXRgtGB0Y8g0LzQvtC70L7QutC+Jyxcblx0XHRcdHNvdXJjZTogJ9Cl0L7Qu9C+0LTQuNC70YzQvdC40LonLFxuXHRcdFx0dGltZTogJzE3OjIzLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Ca0LDQttC10YLRgdGPLCDQsiDRhdC+0LvQvtC00LjQu9GM0L3QuNC60LUg0LfQsNC60LDQvdGH0LjQstCw0LXRgtGB0Y8g0LzQvtC70L7QutC+LiDQktGLINGF0L7RgtC40YLQtSDQtNC+0LHQsNCy0LjRgtGMINC10LPQviDQsiDRgdC/0LjRgdC+0Log0L/QvtC60YPQv9C+0Lo/Jyxcblx0XHRcdGljb246ICdmcmlkZ2UnLFxuXHRcdFx0c2l6ZTogJ20nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRidXR0b25zOiBbJ9CU0LAnLCAn0J3QtdGCJ11cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JfQsNGA0Y/QtNC60LAg0LfQsNCy0LXRgNGI0LXQvdCwJyxcblx0XHRcdHNvdXJjZTogJ9Ce0LrQvtC90L3Ri9C5INGB0LXQvdGB0L7RgCcsXG5cdFx0XHR0aW1lOiAnMTY6MjIsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KPRgNCwISDQo9GB0YLRgNC+0LnRgdGC0LLQviDCq9Ce0LrQvtC90L3Ri9C5INGB0LXQvdGB0L7RgMK7INGB0L3QvtCy0LAg0LIg0YHRgtGA0L7RjiEnLFxuXHRcdFx0aWNvbjogJ2JhdHRlcnknLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnY3JpdGljYWwnLFxuXHRcdFx0dGl0bGU6ICfQn9GL0LvQtdGB0L7RgSDQt9Cw0YHRgtGA0Y/QuycsXG5cdFx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YAg0LTQstC40LbQtdC90LjRjycsXG5cdFx0XHR0aW1lOiAnMTY6MTcsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KDQvtCx0L7Qv9GL0LvQtdGB0L7RgSDQvdC1INGB0LzQvtCzINGB0LzQtdC90LjRgtGMINGB0LLQvtC1INC80LXRgdGC0L7Qv9C+0LvQvtC20LXQvdC40LUg0LIg0YLQtdGH0LXQvdC40LUg0L/QvtGB0LvQtdC00L3QuNGFIDMg0LzQuNC90YPRgi4g0J/QvtGF0L7QttC1LCDQtdC80YMg0L3Rg9C20L3QsCDQv9C+0LzQvtGJ0YwuJyxcblx0XHRcdGljb246ICdjYW0nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpbWFnZTogJ2dldF9pdF9mcm9tX21vY2tzXzozLmpwZydcblx0XHRcdH0sXG5cdFx0XHRzaXplOiAnbCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JLQvtC00LAg0LLRgdC60LjQv9C10LvQsCcsXG5cdFx0XHRzb3VyY2U6ICfQp9Cw0LnQvdC40LonLFxuXHRcdFx0dGltZTogJzE2OjIwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdrZXR0bGUnLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fVxuXHRdXG59XG5cbmNvbnN0IHNtYWxsVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tc21hbGwnKVxuY29uc3QgbWVkaXVtVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tbWVkaXVtJylcbmNvbnN0IGxhcmdlVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tbGFyZ2UnKVxuXG5jb25zdCBjb250ZW50V3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ldmVudHMtd3JhcCcpXG5cbmZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRzT2JqZWN0LmV2ZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuXHRjb25zdCB0aGlzSXRlbSA9IGV2ZW50c09iamVjdC5ldmVudHNbaV1cblxuXHQvLyDQl9Cw0L/QvtC70L3QtdC90LjQtSDQutCw0YDRgtC+0YfQtdC6INGB0L7QtNC10YDQttC40LzRi9C8XG5cdHN3aXRjaCAodGhpc0l0ZW0uc2l6ZSkge1xuXHRcdGNhc2UgJ3MnOlxuXHRcdFx0Y29uc3Qgc21hbGxDbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUoc21hbGxUZW1wbGF0ZS5jb250ZW50LCB0cnVlKVxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fbG9nbycpLnNyYyA9IGAuL2Fzc2V0cy8ke3RoaXNJdGVtLmljb259LnN2Z2Bcblx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpdGxlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGl0bGVcblx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3NvdXJjZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnNvdXJjZVxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGltZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpbWVcblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsJylcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7Qv9C40YHQsNC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnaGF2ZS1kZXNjcmlwdGlvbicpXG5cdFx0XHRcdGNvbnN0IHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRjb25zdCBzbWFsbERlc2NyaXB0aW9uUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoc21hbGxEZXNjcmlwdGlvblBhcmFncmFwaClcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvblBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgnLCAnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoLS1zbWFsbCcpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLXNtYWxsJylcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvblBhcmFncmFwaC5pbm5lckhUTUwgPSB0aGlzSXRlbS5kZXNjcmlwdGlvblxuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkJykuYXBwZW5kQ2hpbGQoc21hbGxEZXNjcmlwdGlvbkNvbnRhaW5lcilcblx0XHRcdH1cblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKHNtYWxsQ2xvbmUpXG5cdFx0XHRicmVha1xuXHRcdGNhc2UgJ20nOlxuXHRcdFx0Y29uc3QgbWVkaXVtQ2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lZGl1bVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fbG9nbycpLnNyYyA9IGAuL2Fzc2V0cy8ke3RoaXNJdGVtLmljb259LnN2Z2Bcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aXRsZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpdGxlXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGltZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpbWVcblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdoYXZlLWRlc2NyaXB0aW9uJylcblx0XHRcdFx0Y29uc3QgbWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRjb25zdCBtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaClcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tbWVkaXVtJylcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLW1lZGl1bScpXG5cdFx0XHRcdG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoLmlubmVySFRNTCA9IHRoaXNJdGVtLmRlc2NyaXB0aW9uXG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkJykuYXBwZW5kQ2hpbGQobWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhKSB7XG5cdFx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLnRlbXBlcmF0dXJlICYmIHRoaXNJdGVtLmRhdGEuaHVtaWRpdHkpIHtcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhQWlyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEnLCAnY2FyZF9fZGF0YS0tYWlyJylcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhVGVtcGVyYXR1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblx0XHRcdFx0XHRtZWRpdW1EYXRhVGVtcGVyYXR1cmUuaW5uZXJIVE1MID0gYNCi0LXQvNC/0LXRgNCw0YLRg9GA0LA6IDxiPiR7dGhpc0l0ZW0uZGF0YS50ZW1wZXJhdHVyZX0g0KE8Yj5gXG5cdFx0XHRcdFx0Y29uc3QgbWVkaXVtRGF0YUh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdFx0bWVkaXVtRGF0YUh1bWlkaXR5LmlubmVySFRNTCA9IGDQktC70LDQttC90L7RgdGC0Yw6IDxiPiR7dGhpc0l0ZW0uZGF0YS5odW1pZGl0eX0gJTxiPmBcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmFwcGVuZENoaWxkKG1lZGl1bURhdGFUZW1wZXJhdHVyZSlcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmFwcGVuZENoaWxkKG1lZGl1bURhdGFIdW1pZGl0eSlcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChtZWRpdW1EYXRhQWlyKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYnV0dG9ucykge1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdGJ1dHRvbnNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b25zLWNvbnRhaW5lcicpXG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uWWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRidXR0b25ZZXMuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b24nLCAnY2FyZF9fZGF0YS0tYnV0dG9uLXllcycpXG5cdFx0XHRcdFx0YnV0dG9uWWVzLmlubmVySFRNTCA9ICfQlNCwJ1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbk5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRidXR0b25Oby5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbicsICdjYXJkX19kYXRhLS1idXR0b24tbm8nKVxuXHRcdFx0XHRcdGJ1dHRvbk5vLmlubmVySFRNTCA9ICfQndC10YInXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25ZZXMpXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25Obylcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChidXR0b25zQ29udGFpbmVyKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYXJ0aXN0KSB7XG5cdFx0XHRcdFx0Y29uc3QgbXVzaWNQbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdG11c2ljUGxheWVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEtbXVzaWMtcGxheWVyJylcblx0XHRcdFx0XHRtdXNpY1BsYXllci5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRfX3BsYXllclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19oZWFkZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19sb2dvLWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke3RoaXNJdGVtLmRhdGEuYWxidW1jb3Zlcn1cIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fbG9nb1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNraW5mb1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJwbGF5ZXJfX25hbWVcIj4ke3RoaXNJdGVtLmRhdGEuYXJ0aXN0fSAtICR7dGhpc0l0ZW0uZGF0YS50cmFjay5uYW1lfTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNrXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNrbGluZVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInBsYXllcl9fdGltZVwiPiR7dGhpc0l0ZW0uZGF0YS50cmFjay5sZW5ndGh9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19jb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi9hc3NldHMvcHJldi5zdmdcIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fY29udHJvbCBwbGF5ZXJfX2NvbnRyb2wtLWxlZnRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4vYXNzZXRzL3ByZXYuc3ZnXCIgYWx0PVwiXCIgY2xhc3M9XCJwbGF5ZXJfX2NvbnRyb2wgcGxheWVyX19jb250cm9sLS1yaWdodFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3ZvbHVtZVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwicGxheWVyX192b2x1bWUtcGVyY2VudFwiPiR7dGhpc0l0ZW0uZGF0YS52b2x1bWV9ICU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+YFxuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKG11c2ljUGxheWVyKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChtZWRpdW1DbG9uZSlcblx0XHRcdGJyZWFrXG5cdFx0Y2FzZSAnbCc6XG5cdFx0XHRjb25zdCBsYXJnZUNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShsYXJnZVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gYC4vYXNzZXRzLyR7dGhpc0l0ZW0uaWNvbn0uc3ZnYFxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQutCw0YDRgtC+0YfQutC4INC/0YDQtdC00YPQv9GA0LXQttC00LXQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS50eXBlID09PSAnY3JpdGljYWwnKSB7XG5cdFx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwnKVxuXHRcdFx0fVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQvtC/0LjRgdCw0L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0uZGVzY3JpcHRpb24pIHtcblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdoYXZlLWRlc2NyaXB0aW9uJylcblx0XHRcdFx0Y29uc3QgbGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGNvbnN0IGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChsYXJnZURlc2NyaXB0aW9uUGFyYWdyYXBoKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaCcsICdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgtLWxhcmdlJylcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbicsICdjYXJkX19kZXNjcmlwdGlvbi0tbGFyZ2UnKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uUGFyYWdyYXBoLmlubmVySFRNTCA9IHRoaXNJdGVtLmRlc2NyaXB0aW9uXG5cdFx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmQnKS5hcHBlbmRDaGlsZChsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyKVxuXHRcdFx0fVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQutCw0YDRgtC40L3QutC4XG5cdFx0XHRsZXQgbGFyZ2VEYXRhSW1hZ2Vcblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLnR5cGUgPT09ICdncmFwaCcpIHtcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRsYXJnZURhdGFJbWFnZS5jbGFzc0xpc3QuYWRkKCdjYXJkX19pbWFnZS1jb250YWluZXInKVxuXHRcdFx0XHRsYXJnZURhdGFJbWFnZS5pbm5lckhUTUwgPSBgPGltZ1xuXHRcdFx0XHRzcmM9XCIuL2Fzc2V0cy9yaWNoZGF0YS5zdmdcIlxuXHRcdFx0XHRjbGFzcz1cImNhcmRfX2ltYWdlXCI+YFxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS5pbWFnZSkge1xuXHRcdFx0XHRsYXJnZURhdGFJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2ltYWdlLWNvbnRhaW5lcicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLnNldEF0dHJpYnV0ZSgnaWQnLCAnaG9vdmVyLWNvbnRhaW5lcicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmlubmVySFRNTCA9IGA8aW1nXG5cdFx0XHRcdFx0XHRjbGFzcz1cImNhcmRfX2ltYWdlXCJcblx0XHRcdFx0XHRcdGlkPVwiaG9vdmVyXCJcblx0XHRcdFx0XHRcdHRvdWNoLWFjdGlvbj1cIm5vbmVcIlxuXHRcdFx0XHRcdFx0c3R5bGU9XCJ0b3VjaC1hY3Rpb246IG5vbmU7XCJcblx0XHRcdFx0XHRcdHNyY3NldD1cIi4vYXNzZXRzL2JpdG1hcC5wbmcgNzY4dyxcblx0XHRcdFx0XHRcdC4vYXNzZXRzL2JpdG1hcDJ4LnBuZyAxMzY2dyxcblx0XHRcdFx0XHRcdC4vYXNzZXRzL2JpdG1hcDN4LnBuZyAxOTIwd1wiXG5cdFx0XHRcdFx0XHRzcmM9XCIuL2Fzc2V0cy9iaXRtYXAyeC5wbmdcIj5gXG5cdFx0XHR9XG5cblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2Rlc2NyaXB0aW9uJykuYXBwZW5kQ2hpbGQobGFyZ2VEYXRhSW1hZ2UpXG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChsYXJnZUNsb25lKVxuXHRcdFx0YnJlYWtcblx0XHRkZWZhdWx0OiBjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIHNpemUgb2YgY2FyZCcpO1xuXHR9XG59XG4iXX0=
