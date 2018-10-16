(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/events/templates');

require('./modules/events/pointerEvents');
},{"./modules/events/pointerEvents":2,"./modules/events/templates":3}],2:[function(require,module,exports){
let scaleValue = 1
let brightnessValue = 1
let prevDiff = -1
let prevAngle = null

const eventCache = new Array()
const elementInfo = new Object()

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

function pointerDownHandler(event) {
	eventCache.push(event)

	// Запишем позицию курсора
	elementInfo.startedPointDownX = event.clientX
	elementInfo.startedPointDownY = event.clientY
}

function pointerMoveHandler(event) {
	for (var i = 0; i < eventCache.length; i++) {
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

function pointerUpHandler(event) {
	elementInfo.oldComputedX = elementInfo.computedX
	elementInfo.oldComputedY = elementInfo.computedY

	removeEvent(event)

	if (eventCache.length < 2) prevDiff = -1
}

function removeEvent(event) {
	for (let i = 0; i < eventCache.length; i++) {
		if (eventCache[i].pointerId == event.pointerId) {
			eventCache.splice(i, 1)
			break
		}
	}
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
	}
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzL3NocmktMjAxOC8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV8xZmY5MWYyYS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL2V2ZW50cy9wb2ludGVyRXZlbnRzLmpzIiwiL2hvbWUveXVyeS9wcm9qZWN0cy9zaHJpLTIwMTgvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL21vZHVsZXMvZXZlbnRzL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy9ldmVudHMvdGVtcGxhdGVzJyk7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy9ldmVudHMvcG9pbnRlckV2ZW50cycpOyIsImxldCBzY2FsZVZhbHVlID0gMVxubGV0IGJyaWdodG5lc3NWYWx1ZSA9IDFcbmxldCBwcmV2RGlmZiA9IC0xXG5sZXQgcHJldkFuZ2xlID0gbnVsbFxuXG5jb25zdCBldmVudENhY2hlID0gbmV3IEFycmF5KClcbmNvbnN0IGVsZW1lbnRJbmZvID0gbmV3IE9iamVjdCgpXG5cbi8vINCh0L7Qt9C00LDQtdC8INC+0LHRitC10LrRgiDQtNC70Y8g0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9GFINGE0YPQvdC60YbQuNC5XG5jb25zdCBoZWxwZXJzRnVuY3Rpb25zID0ge1xuXHRnZXREaXN0YW5lQmV0d2VlblR3b0RvdHMoeDEsIHkxLCB4MiwgeTIpIHtcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCh4MSAtIHgyKSAqKiAyICsgKHkxIC0geTIpICoqIDIpXG5cdH0sXG5cblx0Z2V0QW5nbGUoeDEsIHkxLCB4MiwgeTIpIHtcblx0XHRyZXR1cm4gKE1hdGguYXRhbjIoeTEgLSB5MiwgeDEgLSB4MikgKiAxODApIC8gTWF0aC5QSVxuXHR9LFxuXG5cdHNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGNvbXB1dGVkWCwgY29tcHV0ZWRZKSB7XG5cdFx0aWYgKGNvbXB1dGVkWCA+IGVsZW1lbnRJbmZvLnhNYXhMaW1pdCkgZWxlbWVudEluZm8uY29tcHV0ZWRYID0gZWxlbWVudEluZm8ueE1heExpbWl0XG5cdFx0aWYgKGNvbXB1dGVkWCA8IGVsZW1lbnRJbmZvLnhNaW5MaW1pdCkgZWxlbWVudEluZm8uY29tcHV0ZWRYID0gZWxlbWVudEluZm8ueE1pbkxpbWl0XG5cdFx0aWYgKGNvbXB1dGVkWSA8IGVsZW1lbnRJbmZvLnlNaW5MaW1pdCkgZWxlbWVudEluZm8uY29tcHV0ZWRZID0gZWxlbWVudEluZm8ueU1pbkxpbWl0XG5cdFx0aWYgKGNvbXB1dGVkWSA+IGVsZW1lbnRJbmZvLnlNYXhMaW1pdCkgZWxlbWVudEluZm8uY29tcHV0ZWRZID0gZWxlbWVudEluZm8ueU1heExpbWl0XG5cdH0sXG5cblx0c2V0TGltaXRzKCkge1xuXHRcdGVsZW1lbnRJbmZvLnlNYXhMaW1pdCA9IChlbGVtZW50SW5mby5lbC5vZmZzZXRIZWlnaHQgKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQpIC8gNFxuXHRcdGVsZW1lbnRJbmZvLnlNaW5MaW1pdCA9IC0oZWxlbWVudEluZm8uZWwub2Zmc2V0SGVpZ2h0ICogc2NhbGVWYWx1ZSAtIGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0KSAvIDRcblx0XHRlbGVtZW50SW5mby54TWF4TGltaXQgPSAoZWxlbWVudEluZm8uZWwub2Zmc2V0V2lkdGggKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRXaWR0aCkgLyA0XG5cdFx0ZWxlbWVudEluZm8ueE1pbkxpbWl0ID0gLShlbGVtZW50SW5mby5lbC5vZmZzZXRXaWR0aCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldFdpZHRoKSAvIDRcblx0fVxufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuXHRlbGVtZW50SW5mby5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNob292ZXInKVxuXG5cdC8vINCf0LXRgNCy0LjRh9C90YvQtSDQt9C90LDRh9C10L3QuNGPXG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWCA9IDBcblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZID0gMFxuXG5cdGVsZW1lbnRJbmZvLmNvbXB1dGVkWCA9IDBcblx0ZWxlbWVudEluZm8uY29tcHV0ZWRZID0gMFxuXG5cdGVsZW1lbnRJbmZvLnlNYXhMaW1pdCA9IDBcblx0ZWxlbWVudEluZm8ueU1pbkxpbWl0ID0gMFxuXHRlbGVtZW50SW5mby54TWF4TGltaXQgPSAwXG5cdGVsZW1lbnRJbmZvLnhNaW5MaW1pdCA9IDBcblxuXHRlbGVtZW50SW5mby5pbml0aWFsV2lkdGggPSBlbGVtZW50SW5mby5lbC5vZmZzZXRXaWR0aFxuXHRlbGVtZW50SW5mby5pbml0aWFsSGVpZ2h0ID0gZWxlbWVudEluZm8uZWwub2Zmc2V0SGVpZ2h0XG5cblx0ZWxlbWVudEluZm8uY29udGFpbmVySGVpZ2h0ID0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHRcblx0ZWxlbWVudEluZm8uY29udGFpbmVyV2lkdGggPSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodFxuXG5cdC8vINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10Lwg0YHQvtCx0YvRgtC40Y9cblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVyZG93biA9IHBvaW50ZXJEb3duSGFuZGxlclxuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJtb3ZlID0gcG9pbnRlck1vdmVIYW5kbGVyXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcnVwID0gcG9pbnRlclVwSGFuZGxlclxuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJjYW5jZWwgPSBwb2ludGVyVXBIYW5kbGVyXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcm91dCA9IHBvaW50ZXJVcEhhbmRsZXJcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVybGVhdmUgPSBwb2ludGVyVXBIYW5kbGVyXG59XG5cbmZ1bmN0aW9uIHBvaW50ZXJEb3duSGFuZGxlcihldmVudCkge1xuXHRldmVudENhY2hlLnB1c2goZXZlbnQpXG5cblx0Ly8g0JfQsNC/0LjRiNC10Lwg0L/QvtC30LjRhtC40Y4g0LrRg9GA0YHQvtGA0LBcblx0ZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blggPSBldmVudC5jbGllbnRYXG5cdGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25ZID0gZXZlbnQuY2xpZW50WVxufVxuXG5mdW5jdGlvbiBwb2ludGVyTW92ZUhhbmRsZXIoZXZlbnQpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBldmVudENhY2hlLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKGV2ZW50LnBvaW50ZXJJZCA9PT0gZXZlbnRDYWNoZVtpXS5wb2ludGVySWQpIHtcblx0XHRcdGV2ZW50Q2FjaGVbaV0gPSBldmVudFxuXHRcdFx0YnJlYWtcblx0XHR9XG5cdH1cblxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPT09IDEpIHtcblx0XHRlbGVtZW50SW5mby5jb21wdXRlZFggPSBldmVudC5jbGllbnRYIC0gZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blggKyBlbGVtZW50SW5mby5vbGRDb21wdXRlZFhcblx0XHRlbGVtZW50SW5mby5jb21wdXRlZFkgPSBldmVudC5jbGllbnRZIC0gZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blkgKyBlbGVtZW50SW5mby5vbGRDb21wdXRlZFlcblxuXHRcdGhlbHBlcnNGdW5jdGlvbnMuc2V0Q29tcHV0ZWRWYWx1ZXNWaWFMaW1pdHMoZWxlbWVudEluZm8uY29tcHV0ZWRYLCBlbGVtZW50SW5mby5jb21wdXRlZFkpXG5cblx0XHRldmVudC50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGVWYWx1ZX0pIHRyYW5zbGF0ZSgke2VsZW1lbnRJbmZvLmNvbXB1dGVkWH1weCwgJHtlbGVtZW50SW5mby5jb21wdXRlZFl9cHgpYFxuXHR9XG5cblx0aWYgKGV2ZW50Q2FjaGUubGVuZ3RoID09PSAyKSB7XG5cdFx0Y29uc3QgeDEgPSBldmVudENhY2hlWzBdLmNsaWVudFhcblx0XHRjb25zdCB5MSA9IGV2ZW50Q2FjaGVbMF0uY2xpZW50WVxuXHRcdGNvbnN0IHgyID0gZXZlbnRDYWNoZVsxXS5jbGllbnRYXG5cdFx0Y29uc3QgeTIgPSBldmVudENhY2hlWzFdLmNsaWVudFlcblxuXHRcdGNvbnN0IGN1ckFuZ2xlID0gaGVscGVyc0Z1bmN0aW9ucy5nZXRBbmdsZSh4MSwgeTEsIHgyLCB5MilcblxuXHRcdGlmIChwcmV2QW5nbGUpIHtcblx0XHRcdGNvbnN0IGluY3JlYXNlT24gPSAwLjAxXG5cdFx0XHRpZiAoY3VyQW5nbGUgPiBwcmV2QW5nbGUpIHtcblx0XHRcdFx0YnJpZ2h0bmVzc1ZhbHVlICs9IGluY3JlYXNlT25cblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHticmlnaHRuZXNzVmFsdWV9KWBcblx0XHRcdH1cblx0XHRcdGlmIChjdXJBbmdsZSA8IHByZXZBbmdsZSkge1xuXHRcdFx0XHRicmlnaHRuZXNzVmFsdWUgLT0gaW5jcmVhc2VPblxuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS5maWx0ZXIgPSBgYnJpZ2h0bmVzcygke2JyaWdodG5lc3NWYWx1ZX0pYFxuXHRcdFx0fVxuXHRcdH1cblx0XHRwcmV2QW5nbGUgPSBjdXJBbmdsZVxuXG5cdFx0Y29uc3QgY3VyRGlmZiA9IE1hdGguYWJzKGV2ZW50Q2FjaGVbMF0uY2xpZW50WCAtIGV2ZW50Q2FjaGVbMV0uY2xpZW50WClcblxuXHRcdGlmIChwcmV2RGlmZiA+IDApIHtcblx0XHRcdGNvbnN0IHBpbmNoRGlmZiA9IGN1ckRpZmYgLSBwcmV2RGlmZlxuXHRcdFx0aWYgKGN1ckRpZmYgPiBwcmV2RGlmZikge1xuXHRcdFx0XHQvLyBaT09NIElOXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID49IDEpIHNjYWxlVmFsdWUgKz0gcGluY2hEaWZmIC8gMTAwXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID4gMikgc2NhbGVWYWx1ZSA9IDJcblxuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldExpbWl0cygpXG5cdFx0XHRcdGhlbHBlcnNGdW5jdGlvbnMuc2V0Q29tcHV0ZWRWYWx1ZXNWaWFMaW1pdHMoZWxlbWVudEluZm8uY29tcHV0ZWRYLCBlbGVtZW50SW5mby5jb21wdXRlZFkpXG5cblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGVWYWx1ZX0pIHRyYW5zbGF0ZSgke2VsZW1lbnRJbmZvLmNvbXB1dGVkWH1weCwgJHtlbGVtZW50SW5mby5jb21wdXRlZFl9cHgpYFxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY3VyRGlmZiA8IHByZXZEaWZmKSB7XG5cdFx0XHRcdC8vIFpPT00gT1VUXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID49IDEpIHNjYWxlVmFsdWUgLT0gLXBpbmNoRGlmZiAvIDEwMFxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA8IDEpIHNjYWxlVmFsdWUgPSAxXG5cblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRMaW1pdHMoKVxuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGVsZW1lbnRJbmZvLmNvbXB1dGVkWCwgZWxlbWVudEluZm8uY29tcHV0ZWRZKVxuXG5cdFx0XHRcdGVsZW1lbnRJbmZvLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlVmFsdWV9KSB0cmFuc2xhdGUoJHtlbGVtZW50SW5mby5jb21wdXRlZFh9cHgsICR7ZWxlbWVudEluZm8uY29tcHV0ZWRZfXB4KWBcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcmV2RGlmZiA9IGN1ckRpZmZcblx0fVxufVxuXG5mdW5jdGlvbiBwb2ludGVyVXBIYW5kbGVyKGV2ZW50KSB7XG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWCA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWFxuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFkgPSBlbGVtZW50SW5mby5jb21wdXRlZFlcblxuXHRyZW1vdmVFdmVudChldmVudClcblxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPCAyKSBwcmV2RGlmZiA9IC0xXG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50KGV2ZW50KSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRDYWNoZS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChldmVudENhY2hlW2ldLnBvaW50ZXJJZCA9PSBldmVudC5wb2ludGVySWQpIHtcblx0XHRcdGV2ZW50Q2FjaGUuc3BsaWNlKGksIDEpXG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxufVxuXG5pZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG5cdGRvY3VtZW50LmJvZHkub25sb2FkID0gaW5pdCgpXG59XG4iLCJjb25zdCBldmVudHNPYmplY3QgPSB7XG5cdGV2ZW50czogW1xuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JXQttC10L3QtdC00LXQu9GM0L3Ri9C5INC+0YLRh9C10YIg0L/QviDRgNCw0YHRhdC+0LTQsNC8INGA0LXRgdGD0YDRgdC+0LInLFxuXHRcdFx0c291cmNlOiAn0KHQtdC90YHQvtGA0Ysg0L/QvtGC0YDQtdCx0LvQtdC90LjRjycsXG5cdFx0XHR0aW1lOiAnMTk6MDAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KLQsNC6INC00LXRgNC20LDRgtGMISDQl9CwINC/0L7RgdC70LXQtNC90Y7RjiDQvdC10LTQtdC70Y4g0LLRiyDQv9C+0YLRgNCw0YLQuNC70Lgg0L3QsCAxMCUg0LzQtdC90YzRiNC1INGA0LXRgdGD0YDRgdC+0LIsINGH0LXQvCDQvdC10LTQtdC70LXQuSDRgNCw0L3QtdC1LicsXG5cdFx0XHRpY29uOiAnc3RhdHMnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR0eXBlOiAnZ3JhcGgnLFxuXHRcdFx0XHR2YWx1ZXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRlbGVjdHJpY2l0eTogW1xuXHRcdFx0XHRcdFx0XHRbJzE1MzY4ODMyMDAnLCAxMTVdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzY5Njk2MDAnLCAxMTddLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcwNTYwMDAnLCAxMTcuMl0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzE0MjQwMCcsIDExOF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzIyODgwMCcsIDEyMF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzMxNTIwMCcsIDEyM10sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzQwMTYwMCcsIDEyOV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHdhdGVyOiBbXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjg4MzIwMCcsIDQwXSxcblx0XHRcdFx0XHRcdFx0WycxNTM2OTY5NjAwJywgNDAuMl0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzA1NjAwMCcsIDQwLjVdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcxNDI0MDAnLCA0MV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzIyODgwMCcsIDQxLjRdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzczMTUyMDAnLCA0MS45XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3NDAxNjAwJywgNDIuNl1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGdhczogW1xuXHRcdFx0XHRcdFx0XHRbJzE1MzY4ODMyMDAnLCAxM10sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjk2OTYwMCcsIDEzLjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcwNTYwMDAnLCAxMy41XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MTQyNDAwJywgMTMuN10sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzIyODgwMCcsIDE0XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MzE1MjAwJywgMTQuMl0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzQwMTYwMCcsIDE0LjVdXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0c2l6ZTogJ2wnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CU0LLQtdGA0Ywg0L7RgtC60YDRi9GC0LAnLFxuXHRcdFx0c291cmNlOiAn0KHQtdC90YHQvtGAINCy0YXQvtC00L3QvtC5INC00LLQtdGA0LgnLFxuXHRcdFx0dGltZTogJzE4OjUwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdrZXknLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9Cj0LHQvtGA0LrQsCDQt9Cw0LrQvtC90YfQtdC90LAnLFxuXHRcdFx0c291cmNlOiAn0J/Ri9C70LXRgdC+0YEnLFxuXHRcdFx0dGltZTogJzE4OjQ1LCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdyb2JvdC1jbGVhbmVyJyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQndC+0LLRi9C5INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCcsXG5cdFx0XHRzb3VyY2U6ICfQoNC+0YPRgtC10YAnLFxuXHRcdFx0dGltZTogJzE4OjQ1LCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdyb3V0ZXInLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CY0LfQvNC10L3QtdC9INC60LvQuNC80LDRgtC40YfQtdGB0LrQuNC5INGA0LXQttC40LwnLFxuXHRcdFx0c291cmNlOiAn0KHQtdC90YHQvtGAINC80LjQutGA0L7QutC70LjQvNCw0YLQsCcsXG5cdFx0XHR0aW1lOiAnMTg6MzAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KPRgdGC0LDQvdC+0LLQu9C10L0g0LrQu9C40LzQsNGC0LjRh9C10YHQutC40Lkg0YDQtdC20LjQvCDCq9Ck0LjQtNC20LjCuycsXG5cdFx0XHRpY29uOiAndGhlcm1hbCcsXG5cdFx0XHRzaXplOiAnbScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHRlbXBlcmF0dXJlOiAyNCxcblx0XHRcdFx0aHVtaWRpdHk6IDgwXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnY3JpdGljYWwnLFxuXHRcdFx0dGl0bGU6ICfQndC10LLQvtC30LzQvtC20L3QviDQstC60LvRjtGH0LjRgtGMINC60L7QvdC00LjRhtC40L7QvdC10YAnLFxuXHRcdFx0c291cmNlOiAn0JrQvtC90LTQuNGG0LjQvtC90LXRgCcsXG5cdFx0XHR0aW1lOiAnMTg6MjEsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0JIg0LrQvtC80L3QsNGC0LUg0L7RgtC60YDRi9GC0L4g0L7QutC90L4sINC30LDQutGA0L7QudGC0LUg0LXQs9C+INC4INC/0L7QstGC0L7RgNC40YLQtSDQv9C+0L/Ri9GC0LrRgycsXG5cdFx0XHRpY29uOiAnYWMnLFxuXHRcdFx0c2l6ZTogJ20nXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9Cc0YPQt9GL0LrQsCDQstC60LvRjtGH0LXQvdCwJyxcblx0XHRcdHNvdXJjZTogJ9Cv0L3QtNC10LrRgS7QodGC0LDQvdGG0LjRjycsXG5cdFx0XHR0aW1lOiAnMTg6MTYsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KHQtdC50YfQsNGBINC/0YDQvtC40LPRgNGL0LLQsNC10YLRgdGPOicsXG5cdFx0XHRpY29uOiAnbXVzaWMnLFxuXHRcdFx0c2l6ZTogJ20nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhbGJ1bWNvdmVyOiAnaHR0cHM6Ly9hdmF0YXJzLnlhbmRleC5uZXQvZ2V0LW11c2ljLWNvbnRlbnQvMTkzODIzLzE4MjBhNDNlLmEuNTUxNzA1Ni0xL20xMDAweDEwMDAnLFxuXHRcdFx0XHRhcnRpc3Q6ICdGbG9yZW5jZSAmIFRoZSBNYWNoaW5lJyxcblx0XHRcdFx0dHJhY2s6IHtcblx0XHRcdFx0XHRuYW1lOiAnQmlnIEdvZCcsXG5cdFx0XHRcdFx0bGVuZ3RoOiAnNDozMSdcblx0XHRcdFx0fSxcblx0XHRcdFx0dm9sdW1lOiA4MFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQl9Cw0LrQsNC90YfQuNCy0LDQtdGC0YHRjyDQvNC+0LvQvtC60L4nLFxuXHRcdFx0c291cmNlOiAn0KXQvtC70L7QtNC40LvRjNC90LjQuicsXG5cdFx0XHR0aW1lOiAnMTc6MjMsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0JrQsNC20LXRgtGB0Y8sINCyINGF0L7Qu9C+0LTQuNC70YzQvdC40LrQtSDQt9Cw0LrQsNC90YfQuNCy0LDQtdGC0YHRjyDQvNC+0LvQvtC60L4uINCS0Ysg0YXQvtGC0LjRgtC1INC00L7QsdCw0LLQuNGC0Ywg0LXQs9C+INCyINGB0L/QuNGB0L7QuiDQv9C+0LrRg9C/0L7Quj8nLFxuXHRcdFx0aWNvbjogJ2ZyaWRnZScsXG5cdFx0XHRzaXplOiAnbScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGJ1dHRvbnM6IFsn0JTQsCcsICfQndC10YInXVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQl9Cw0YDRj9C00LrQsCDQt9Cw0LLQtdGA0YjQtdC90LAnLFxuXHRcdFx0c291cmNlOiAn0J7QutC+0L3QvdGL0Lkg0YHQtdC90YHQvtGAJyxcblx0XHRcdHRpbWU6ICcxNjoyMiwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQo9GA0LAhINCj0YHRgtGA0L7QudGB0YLQstC+IMKr0J7QutC+0L3QvdGL0Lkg0YHQtdC90YHQvtGAwrsg0YHQvdC+0LLQsCDQsiDRgdGC0YDQvtGOIScsXG5cdFx0XHRpY29uOiAnYmF0dGVyeScsXG5cdFx0XHRzaXplOiAncydcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdjcml0aWNhbCcsXG5cdFx0XHR0aXRsZTogJ9Cf0YvQu9C10YHQvtGBINC30LDRgdGC0YDRj9C7Jyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQtNCy0LjQttC10L3QuNGPJyxcblx0XHRcdHRpbWU6ICcxNjoxNywg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQoNC+0LHQvtC/0YvQu9C10YHQvtGBINC90LUg0YHQvNC+0LMg0YHQvNC10L3QuNGC0Ywg0YHQstC+0LUg0LzQtdGB0YLQvtC/0L7Qu9C+0LbQtdC90LjQtSDQsiDRgtC10YfQtdC90LjQtSDQv9C+0YHQu9C10LTQvdC40YUgMyDQvNC40L3Rg9GCLiDQn9C+0YXQvtC20LUsINC10LzRgyDQvdGD0LbQvdCwINC/0L7QvNC+0YnRjC4nLFxuXHRcdFx0aWNvbjogJ2NhbScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGltYWdlOiAnZ2V0X2l0X2Zyb21fbW9ja3NfOjMuanBnJ1xuXHRcdFx0fSxcblx0XHRcdHNpemU6ICdsJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQktC+0LTQsCDQstGB0LrQuNC/0LXQu9CwJyxcblx0XHRcdHNvdXJjZTogJ9Cn0LDQudC90LjQuicsXG5cdFx0XHR0aW1lOiAnMTY6MjAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBudWxsLFxuXHRcdFx0aWNvbjogJ2tldHRsZScsXG5cdFx0XHRzaXplOiAncydcblx0XHR9XG5cdF1cbn1cblxuY29uc3Qgc21hbGxUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1zbWFsbCcpXG5jb25zdCBtZWRpdW1UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1tZWRpdW0nKVxuY29uc3QgbGFyZ2VUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1sYXJnZScpXG5cbmNvbnN0IGNvbnRlbnRXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cy13cmFwJylcblxuZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHNPYmplY3QuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdGNvbnN0IHRoaXNJdGVtID0gZXZlbnRzT2JqZWN0LmV2ZW50c1tpXVxuXG5cdC8vINCX0LDQv9C+0LvQvdC10L3QuNC1INC60LDRgNGC0L7Rh9C10Log0YHQvtC00LXRgNC20LjQvNGL0Lxcblx0c3dpdGNoICh0aGlzSXRlbS5zaXplKSB7XG5cdFx0Y2FzZSAncyc6XG5cdFx0XHRjb25zdCBzbWFsbENsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzbWFsbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gYC4vYXNzZXRzLyR7dGhpc0l0ZW0uaWNvbn0uc3ZnYFxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZVxuXG5cdFx0XHQvL9CU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0L7Rh9C60Lgg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLnR5cGUgPT09ICdjcml0aWNhbCcpIHtcblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKVxuXHRcdFx0XHRjb25zdCBzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0Y29uc3Qgc21hbGxEZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGgpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tc21hbGwnKVxuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLS1zbWFsbCcpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb25cblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChzbWFsbENsb25lKVxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdtJzpcblx0XHRcdGNvbnN0IG1lZGl1bUNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZWRpdW1UZW1wbGF0ZS5jb250ZW50LCB0cnVlKVxuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2xvZ28nKS5zcmMgPSBgLi9hc3NldHMvJHt0aGlzSXRlbS5pY29ufS5zdmdgXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3NvdXJjZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnNvdXJjZVxuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpbWUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aW1lXG5cblx0XHRcdC8v0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdoYXZlLWRlc2NyaXB0aW9uJylcblx0XHRcdFx0Y29uc3QgbWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRjb25zdCBtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaClcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tbWVkaXVtJylcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLW1lZGl1bScpXG5cdFx0XHRcdG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoLmlubmVySFRNTCA9IHRoaXNJdGVtLmRlc2NyaXB0aW9uXG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkJykuYXBwZW5kQ2hpbGQobWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhKSB7XG5cdFx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLnRlbXBlcmF0dXJlICYmIHRoaXNJdGVtLmRhdGEuaHVtaWRpdHkpIHtcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhQWlyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEnLCAnY2FyZF9fZGF0YS0tYWlyJylcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhVGVtcGVyYXR1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblx0XHRcdFx0XHRtZWRpdW1EYXRhVGVtcGVyYXR1cmUuaW5uZXJIVE1MID0gYNCi0LXQvNC/0LXRgNCw0YLRg9GA0LA6IDxiPiR7dGhpc0l0ZW0uZGF0YS50ZW1wZXJhdHVyZX0g0KE8Yj5gXG5cdFx0XHRcdFx0Y29uc3QgbWVkaXVtRGF0YUh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdFx0bWVkaXVtRGF0YUh1bWlkaXR5LmlubmVySFRNTCA9IGDQktC70LDQttC90L7RgdGC0Yw6IDxiPiR7dGhpc0l0ZW0uZGF0YS5odW1pZGl0eX0gJTxiPmBcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmFwcGVuZENoaWxkKG1lZGl1bURhdGFUZW1wZXJhdHVyZSlcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmFwcGVuZENoaWxkKG1lZGl1bURhdGFIdW1pZGl0eSlcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChtZWRpdW1EYXRhQWlyKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYnV0dG9ucykge1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdGJ1dHRvbnNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b25zLWNvbnRhaW5lcicpXG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uWWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRidXR0b25ZZXMuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b24nLCAnY2FyZF9fZGF0YS0tYnV0dG9uLXllcycpXG5cdFx0XHRcdFx0YnV0dG9uWWVzLmlubmVySFRNTCA9ICfQlNCwJ1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbk5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRidXR0b25Oby5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbicsICdjYXJkX19kYXRhLS1idXR0b24tbm8nKVxuXHRcdFx0XHRcdGJ1dHRvbk5vLmlubmVySFRNTCA9ICfQndC10YInXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25ZZXMpXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25Obylcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChidXR0b25zQ29udGFpbmVyKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYXJ0aXN0KSB7XG5cdFx0XHRcdFx0Y29uc3QgbXVzaWNQbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdG11c2ljUGxheWVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEtbXVzaWMtcGxheWVyJylcblx0XHRcdFx0XHRtdXNpY1BsYXllci5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRfX3BsYXllclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19oZWFkZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19sb2dvLWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke3RoaXNJdGVtLmRhdGEuYWxidW1jb3Zlcn1cIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fbG9nb1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNraW5mb1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJwbGF5ZXJfX25hbWVcIj4ke3RoaXNJdGVtLmRhdGEuYXJ0aXN0fSAtICR7dGhpc0l0ZW0uZGF0YS50cmFjay5uYW1lfTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNrXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNrbGluZVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInBsYXllcl9fdGltZVwiPiR7dGhpc0l0ZW0uZGF0YS50cmFjay5sZW5ndGh9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19jb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi9hc3NldHMvcHJldi5zdmdcIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fY29udHJvbCBwbGF5ZXJfX2NvbnRyb2wtLWxlZnRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4vYXNzZXRzL3ByZXYuc3ZnXCIgYWx0PVwiXCIgY2xhc3M9XCJwbGF5ZXJfX2NvbnRyb2wgcGxheWVyX19jb250cm9sLS1yaWdodFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3ZvbHVtZVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwicGxheWVyX192b2x1bWUtcGVyY2VudFwiPiR7dGhpc0l0ZW0uZGF0YS52b2x1bWV9ICU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+YFxuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKG11c2ljUGxheWVyKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChtZWRpdW1DbG9uZSlcblx0XHRcdGJyZWFrXG5cdFx0Y2FzZSAnbCc6XG5cdFx0XHRjb25zdCBsYXJnZUNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShsYXJnZVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gYC4vYXNzZXRzLyR7dGhpc0l0ZW0uaWNvbn0uc3ZnYFxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZVxuXG5cdFx0XHQvL9CU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0L7Rh9C60Lgg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLnR5cGUgPT09ICdjcml0aWNhbCcpIHtcblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKVxuXHRcdFx0XHRjb25zdCBsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0Y29uc3QgbGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGgpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tbGFyZ2UnKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLS1sYXJnZScpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb25cblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0LjQvdC60Lhcblx0XHRcdGxldCBsYXJnZURhdGFJbWFnZVxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEudHlwZSA9PT0gJ2dyYXBoJykge1xuXHRcdFx0XHRsYXJnZURhdGFJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2ltYWdlLWNvbnRhaW5lcicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmlubmVySFRNTCA9IGA8aW1nXG5cdFx0XHRcdHNyYz1cIi4vYXNzZXRzL3JpY2hkYXRhLnN2Z1wiXG5cdFx0XHRcdGNsYXNzPVwiY2FyZF9faW1hZ2VcIj5gXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLmltYWdlKSB7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuY2xhc3NMaXN0LmFkZCgnY2FyZF9faW1hZ2UtY29udGFpbmVyJylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2Uuc2V0QXR0cmlidXRlKCdpZCcsICdob292ZXItY29udGFpbmVyJylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuaW5uZXJIVE1MID0gYDxpbWdcblx0XHRcdFx0XHRcdGNsYXNzPVwiY2FyZF9faW1hZ2VcIlxuXHRcdFx0XHRcdFx0aWQ9XCJob292ZXJcIlxuXHRcdFx0XHRcdFx0dG91Y2gtYWN0aW9uPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRzdHlsZT1cInRvdWNoLWFjdGlvbjogbm9uZTtcIlxuXHRcdFx0XHRcdFx0c3Jjc2V0PVwiLi9hc3NldHMvYml0bWFwLnBuZyA3Njh3LFxuXHRcdFx0XHRcdFx0Li9hc3NldHMvYml0bWFwMngucG5nIDEzNjZ3LFxuXHRcdFx0XHRcdFx0Li9hc3NldHMvYml0bWFwM3gucG5nIDE5MjB3XCJcblx0XHRcdFx0XHRcdHNyYz1cIi4vYXNzZXRzL2JpdG1hcDJ4LnBuZ1wiPmBcblx0XHRcdH1cblxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChsYXJnZURhdGFJbWFnZSlcblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKGxhcmdlQ2xvbmUpXG5cdFx0XHRicmVha1xuXHR9XG59XG4iXX0=
