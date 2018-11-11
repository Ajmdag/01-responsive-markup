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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL2Zha2VfZWZhY2E2NDQuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL2V2ZW50cy9wb2ludGVyRXZlbnRzLmpzIiwiL2hvbWUveXVyeS9wcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvbW9kdWxlcy9ldmVudHMvdGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9tb2R1bGVzL2V2ZW50cy90ZW1wbGF0ZXMnKTtcblxucmVxdWlyZSgnLi9tb2R1bGVzL2V2ZW50cy9wb2ludGVyRXZlbnRzJyk7IiwibGV0IHNjYWxlVmFsdWUgPSAxXG5sZXQgYnJpZ2h0bmVzc1ZhbHVlID0gMVxubGV0IHByZXZEaWZmID0gLTFcbmxldCBwcmV2QW5nbGUgPSBudWxsXG5cbmNvbnN0IGV2ZW50Q2FjaGUgPSBbXVxuY29uc3QgZWxlbWVudEluZm8gPSB7fVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudChldmVudCkge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Q2FjaGUubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRpZiAoZXZlbnRDYWNoZVtpXS5wb2ludGVySWQgPT09IGV2ZW50LnBvaW50ZXJJZCkge1xuXHRcdFx0ZXZlbnRDYWNoZS5zcGxpY2UoaSwgMSlcblx0XHRcdGJyZWFrXG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHBvaW50ZXJVcEhhbmRsZXIoZXZlbnQpIHtcblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYID0gZWxlbWVudEluZm8uY29tcHV0ZWRYXG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWSA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWVxuXG5cdHJlbW92ZUV2ZW50KGV2ZW50KVxuXG5cdGlmIChldmVudENhY2hlLmxlbmd0aCA8IDIpIHByZXZEaWZmID0gLTFcbn1cblxuXG4vLyDQodC+0LfQtNCw0LXQvCDQvtCx0YrQtdC60YIg0LTQu9GPINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDRhNGD0L3QutGG0LjQuVxuY29uc3QgaGVscGVyc0Z1bmN0aW9ucyA9IHtcblx0Z2V0RGlzdGFuZUJldHdlZW5Ud29Eb3RzKHgxLCB5MSwgeDIsIHkyKSB7XG5cdFx0cmV0dXJuIE1hdGguc3FydCgoeDEgLSB4MikgKiogMiArICh5MSAtIHkyKSAqKiAyKVxuXHR9LFxuXG5cdGdldEFuZ2xlKHgxLCB5MSwgeDIsIHkyKSB7XG5cdFx0cmV0dXJuIChNYXRoLmF0YW4yKHkxIC0geTIsIHgxIC0geDIpICogMTgwKSAvIE1hdGguUElcblx0fSxcblxuXHRzZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0cyhjb21wdXRlZFgsIGNvbXB1dGVkWSkge1xuXHRcdGlmIChjb21wdXRlZFggPiBlbGVtZW50SW5mby54TWF4TGltaXQpIGVsZW1lbnRJbmZvLmNvbXB1dGVkWCA9IGVsZW1lbnRJbmZvLnhNYXhMaW1pdFxuXHRcdGlmIChjb21wdXRlZFggPCBlbGVtZW50SW5mby54TWluTGltaXQpIGVsZW1lbnRJbmZvLmNvbXB1dGVkWCA9IGVsZW1lbnRJbmZvLnhNaW5MaW1pdFxuXHRcdGlmIChjb21wdXRlZFkgPCBlbGVtZW50SW5mby55TWluTGltaXQpIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSA9IGVsZW1lbnRJbmZvLnlNaW5MaW1pdFxuXHRcdGlmIChjb21wdXRlZFkgPiBlbGVtZW50SW5mby55TWF4TGltaXQpIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSA9IGVsZW1lbnRJbmZvLnlNYXhMaW1pdFxuXHR9LFxuXG5cdHNldExpbWl0cygpIHtcblx0XHRlbGVtZW50SW5mby55TWF4TGltaXQgPSAoZWxlbWVudEluZm8uZWwub2Zmc2V0SGVpZ2h0ICogc2NhbGVWYWx1ZSAtIGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0KSAvIDRcblx0XHRlbGVtZW50SW5mby55TWluTGltaXQgPSAtKGVsZW1lbnRJbmZvLmVsLm9mZnNldEhlaWdodCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodCkgLyA0XG5cdFx0ZWxlbWVudEluZm8ueE1heExpbWl0ID0gKGVsZW1lbnRJbmZvLmVsLm9mZnNldFdpZHRoICogc2NhbGVWYWx1ZSAtIGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0V2lkdGgpIC8gNFxuXHRcdGVsZW1lbnRJbmZvLnhNaW5MaW1pdCA9IC0oZWxlbWVudEluZm8uZWwub2Zmc2V0V2lkdGggKiBzY2FsZVZhbHVlIC0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRXaWR0aCkgLyA0XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBwb2ludGVyRG93bkhhbmRsZXIoZXZlbnQpIHtcblx0ZXZlbnRDYWNoZS5wdXNoKGV2ZW50KVxuXG5cdC8vINCX0LDQv9C40YjQtdC8INC/0L7Qt9C40YbQuNGOINC60YPRgNGB0L7RgNCwXG5cdGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25YID0gZXZlbnQuY2xpZW50WFxuXHRlbGVtZW50SW5mby5zdGFydGVkUG9pbnREb3duWSA9IGV2ZW50LmNsaWVudFlcbn1cblxuZnVuY3Rpb24gcG9pbnRlck1vdmVIYW5kbGVyKGV2ZW50KSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRDYWNoZS5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGlmIChldmVudC5wb2ludGVySWQgPT09IGV2ZW50Q2FjaGVbaV0ucG9pbnRlcklkKSB7XG5cdFx0XHRldmVudENhY2hlW2ldID0gZXZlbnRcblx0XHRcdGJyZWFrXG5cdFx0fVxuXHR9XG5cblx0aWYgKGV2ZW50Q2FjaGUubGVuZ3RoID09PSAxKSB7XG5cdFx0ZWxlbWVudEluZm8uY29tcHV0ZWRYID0gZXZlbnQuY2xpZW50WCAtIGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25YICsgZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYXG5cdFx0ZWxlbWVudEluZm8uY29tcHV0ZWRZID0gZXZlbnQuY2xpZW50WSAtIGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25ZICsgZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZXG5cblx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGVsZW1lbnRJbmZvLmNvbXB1dGVkWCwgZWxlbWVudEluZm8uY29tcHV0ZWRZKVxuXG5cdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlVmFsdWV9KSB0cmFuc2xhdGUoJHtlbGVtZW50SW5mby5jb21wdXRlZFh9cHgsICR7ZWxlbWVudEluZm8uY29tcHV0ZWRZfXB4KWBcblx0fVxuXG5cdGlmIChldmVudENhY2hlLmxlbmd0aCA9PT0gMikge1xuXHRcdGNvbnN0IHgxID0gZXZlbnRDYWNoZVswXS5jbGllbnRYXG5cdFx0Y29uc3QgeTEgPSBldmVudENhY2hlWzBdLmNsaWVudFlcblx0XHRjb25zdCB4MiA9IGV2ZW50Q2FjaGVbMV0uY2xpZW50WFxuXHRcdGNvbnN0IHkyID0gZXZlbnRDYWNoZVsxXS5jbGllbnRZXG5cblx0XHRjb25zdCBjdXJBbmdsZSA9IGhlbHBlcnNGdW5jdGlvbnMuZ2V0QW5nbGUoeDEsIHkxLCB4MiwgeTIpXG5cblx0XHRpZiAocHJldkFuZ2xlKSB7XG5cdFx0XHRjb25zdCBpbmNyZWFzZU9uID0gMC4wMVxuXHRcdFx0aWYgKGN1ckFuZ2xlID4gcHJldkFuZ2xlKSB7XG5cdFx0XHRcdGJyaWdodG5lc3NWYWx1ZSArPSBpbmNyZWFzZU9uXG5cdFx0XHRcdGVsZW1lbnRJbmZvLmVsLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7YnJpZ2h0bmVzc1ZhbHVlfSlgXG5cdFx0XHR9XG5cdFx0XHRpZiAoY3VyQW5nbGUgPCBwcmV2QW5nbGUpIHtcblx0XHRcdFx0YnJpZ2h0bmVzc1ZhbHVlIC09IGluY3JlYXNlT25cblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHticmlnaHRuZXNzVmFsdWV9KWBcblx0XHRcdH1cblx0XHR9XG5cdFx0cHJldkFuZ2xlID0gY3VyQW5nbGVcblxuXHRcdGNvbnN0IGN1ckRpZmYgPSBNYXRoLmFicyhldmVudENhY2hlWzBdLmNsaWVudFggLSBldmVudENhY2hlWzFdLmNsaWVudFgpXG5cblx0XHRpZiAocHJldkRpZmYgPiAwKSB7XG5cdFx0XHRjb25zdCBwaW5jaERpZmYgPSBjdXJEaWZmIC0gcHJldkRpZmZcblx0XHRcdGlmIChjdXJEaWZmID4gcHJldkRpZmYpIHtcblx0XHRcdFx0Ly8gWk9PTSBJTlxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA+PSAxKSBzY2FsZVZhbHVlICs9IHBpbmNoRGlmZiAvIDEwMFxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA+IDIpIHNjYWxlVmFsdWUgPSAyXG5cblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRMaW1pdHMoKVxuXHRcdFx0XHRoZWxwZXJzRnVuY3Rpb25zLnNldENvbXB1dGVkVmFsdWVzVmlhTGltaXRzKGVsZW1lbnRJbmZvLmNvbXB1dGVkWCwgZWxlbWVudEluZm8uY29tcHV0ZWRZKVxuXG5cdFx0XHRcdGVsZW1lbnRJbmZvLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlVmFsdWV9KSB0cmFuc2xhdGUoJHtlbGVtZW50SW5mby5jb21wdXRlZFh9cHgsICR7ZWxlbWVudEluZm8uY29tcHV0ZWRZfXB4KWBcblx0XHRcdH1cblxuXHRcdFx0aWYgKGN1ckRpZmYgPCBwcmV2RGlmZikge1xuXHRcdFx0XHQvLyBaT09NIE9VVFxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA+PSAxKSBzY2FsZVZhbHVlIC09IC1waW5jaERpZmYgLyAxMDBcblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPCAxKSBzY2FsZVZhbHVlID0gMVxuXG5cdFx0XHRcdGhlbHBlcnNGdW5jdGlvbnMuc2V0TGltaXRzKClcblx0XHRcdFx0aGVscGVyc0Z1bmN0aW9ucy5zZXRDb21wdXRlZFZhbHVlc1ZpYUxpbWl0cyhlbGVtZW50SW5mby5jb21wdXRlZFgsIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSlcblxuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtzY2FsZVZhbHVlfSkgdHJhbnNsYXRlKCR7ZWxlbWVudEluZm8uY29tcHV0ZWRYfXB4LCAke2VsZW1lbnRJbmZvLmNvbXB1dGVkWX1weClgXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJldkRpZmYgPSBjdXJEaWZmXG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcblx0ZWxlbWVudEluZm8uZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaG9vdmVyJylcblxuXHQvLyDQn9C10YDQstC40YfQvdGL0LUg0LfQvdCw0YfQtdC90LjRj1xuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFggPSAwXG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWSA9IDBcblxuXHRlbGVtZW50SW5mby5jb21wdXRlZFggPSAwXG5cdGVsZW1lbnRJbmZvLmNvbXB1dGVkWSA9IDBcblxuXHRlbGVtZW50SW5mby55TWF4TGltaXQgPSAwXG5cdGVsZW1lbnRJbmZvLnlNaW5MaW1pdCA9IDBcblx0ZWxlbWVudEluZm8ueE1heExpbWl0ID0gMFxuXHRlbGVtZW50SW5mby54TWluTGltaXQgPSAwXG5cblx0ZWxlbWVudEluZm8uaW5pdGlhbFdpZHRoID0gZWxlbWVudEluZm8uZWwub2Zmc2V0V2lkdGhcblx0ZWxlbWVudEluZm8uaW5pdGlhbEhlaWdodCA9IGVsZW1lbnRJbmZvLmVsLm9mZnNldEhlaWdodFxuXG5cdGVsZW1lbnRJbmZvLmNvbnRhaW5lckhlaWdodCA9IGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0XG5cdGVsZW1lbnRJbmZvLmNvbnRhaW5lcldpZHRoID0gZWxlbWVudEluZm8uZWwucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHRcblxuXHQvLyDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdC8INGB0L7QsdGL0YLQuNGPXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcmRvd24gPSBwb2ludGVyRG93bkhhbmRsZXJcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVybW92ZSA9IHBvaW50ZXJNb3ZlSGFuZGxlclxuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJ1cCA9IHBvaW50ZXJVcEhhbmRsZXJcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVyY2FuY2VsID0gcG9pbnRlclVwSGFuZGxlclxuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJvdXQgPSBwb2ludGVyVXBIYW5kbGVyXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcmxlYXZlID0gcG9pbnRlclVwSGFuZGxlclxufVxuXG5pZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG5cdGRvY3VtZW50LmJvZHkub25sb2FkID0gaW5pdCgpXG59XG4iLCJjb25zdCBldmVudHNPYmplY3QgPSB7XG5cdGV2ZW50czogW1xuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JXQttC10L3QtdC00LXQu9GM0L3Ri9C5INC+0YLRh9C10YIg0L/QviDRgNCw0YHRhdC+0LTQsNC8INGA0LXRgdGD0YDRgdC+0LInLFxuXHRcdFx0c291cmNlOiAn0KHQtdC90YHQvtGA0Ysg0L/QvtGC0YDQtdCx0LvQtdC90LjRjycsXG5cdFx0XHR0aW1lOiAnMTk6MDAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KLQsNC6INC00LXRgNC20LDRgtGMISDQl9CwINC/0L7RgdC70LXQtNC90Y7RjiDQvdC10LTQtdC70Y4g0LLRiyDQv9C+0YLRgNCw0YLQuNC70Lgg0L3QsCAxMCUg0LzQtdC90YzRiNC1INGA0LXRgdGD0YDRgdC+0LIsINGH0LXQvCDQvdC10LTQtdC70LXQuSDRgNCw0L3QtdC1LicsXG5cdFx0XHRpY29uOiAnc3RhdHMnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR0eXBlOiAnZ3JhcGgnLFxuXHRcdFx0XHR2YWx1ZXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRlbGVjdHJpY2l0eTogW1xuXHRcdFx0XHRcdFx0XHRbJzE1MzY4ODMyMDAnLCAxMTVdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzY5Njk2MDAnLCAxMTddLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcwNTYwMDAnLCAxMTcuMl0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzE0MjQwMCcsIDExOF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzIyODgwMCcsIDEyMF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzMxNTIwMCcsIDEyM10sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzQwMTYwMCcsIDEyOV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHdhdGVyOiBbXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjg4MzIwMCcsIDQwXSxcblx0XHRcdFx0XHRcdFx0WycxNTM2OTY5NjAwJywgNDAuMl0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzA1NjAwMCcsIDQwLjVdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcxNDI0MDAnLCA0MV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzIyODgwMCcsIDQxLjRdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzczMTUyMDAnLCA0MS45XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3NDAxNjAwJywgNDIuNl1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGdhczogW1xuXHRcdFx0XHRcdFx0XHRbJzE1MzY4ODMyMDAnLCAxM10sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjk2OTYwMCcsIDEzLjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcwNTYwMDAnLCAxMy41XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MTQyNDAwJywgMTMuN10sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzIyODgwMCcsIDE0XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MzE1MjAwJywgMTQuMl0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzQwMTYwMCcsIDE0LjVdXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0c2l6ZTogJ2wnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CU0LLQtdGA0Ywg0L7RgtC60YDRi9GC0LAnLFxuXHRcdFx0c291cmNlOiAn0KHQtdC90YHQvtGAINCy0YXQvtC00L3QvtC5INC00LLQtdGA0LgnLFxuXHRcdFx0dGltZTogJzE4OjUwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdrZXknLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9Cj0LHQvtGA0LrQsCDQt9Cw0LrQvtC90YfQtdC90LAnLFxuXHRcdFx0c291cmNlOiAn0J/Ri9C70LXRgdC+0YEnLFxuXHRcdFx0dGltZTogJzE4OjQ1LCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdyb2JvdC1jbGVhbmVyJyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQndC+0LLRi9C5INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCcsXG5cdFx0XHRzb3VyY2U6ICfQoNC+0YPRgtC10YAnLFxuXHRcdFx0dGltZTogJzE4OjQ1LCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdyb3V0ZXInLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CY0LfQvNC10L3QtdC9INC60LvQuNC80LDRgtC40YfQtdGB0LrQuNC5INGA0LXQttC40LwnLFxuXHRcdFx0c291cmNlOiAn0KHQtdC90YHQvtGAINC80LjQutGA0L7QutC70LjQvNCw0YLQsCcsXG5cdFx0XHR0aW1lOiAnMTg6MzAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KPRgdGC0LDQvdC+0LLQu9C10L0g0LrQu9C40LzQsNGC0LjRh9C10YHQutC40Lkg0YDQtdC20LjQvCDCq9Ck0LjQtNC20LjCuycsXG5cdFx0XHRpY29uOiAndGhlcm1hbCcsXG5cdFx0XHRzaXplOiAnbScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHRlbXBlcmF0dXJlOiAyNCxcblx0XHRcdFx0aHVtaWRpdHk6IDgwXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnY3JpdGljYWwnLFxuXHRcdFx0dGl0bGU6ICfQndC10LLQvtC30LzQvtC20L3QviDQstC60LvRjtGH0LjRgtGMINC60L7QvdC00LjRhtC40L7QvdC10YAnLFxuXHRcdFx0c291cmNlOiAn0JrQvtC90LTQuNGG0LjQvtC90LXRgCcsXG5cdFx0XHR0aW1lOiAnMTg6MjEsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0JIg0LrQvtC80L3QsNGC0LUg0L7RgtC60YDRi9GC0L4g0L7QutC90L4sINC30LDQutGA0L7QudGC0LUg0LXQs9C+INC4INC/0L7QstGC0L7RgNC40YLQtSDQv9C+0L/Ri9GC0LrRgycsXG5cdFx0XHRpY29uOiAnYWMnLFxuXHRcdFx0c2l6ZTogJ20nXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9Cc0YPQt9GL0LrQsCDQstC60LvRjtGH0LXQvdCwJyxcblx0XHRcdHNvdXJjZTogJ9Cv0L3QtNC10LrRgS7QodGC0LDQvdGG0LjRjycsXG5cdFx0XHR0aW1lOiAnMTg6MTYsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KHQtdC50YfQsNGBINC/0YDQvtC40LPRgNGL0LLQsNC10YLRgdGPOicsXG5cdFx0XHRpY29uOiAnbXVzaWMnLFxuXHRcdFx0c2l6ZTogJ20nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhbGJ1bWNvdmVyOiAnaHR0cHM6Ly9hdmF0YXJzLnlhbmRleC5uZXQvZ2V0LW11c2ljLWNvbnRlbnQvMTkzODIzLzE4MjBhNDNlLmEuNTUxNzA1Ni0xL20xMDAweDEwMDAnLFxuXHRcdFx0XHRhcnRpc3Q6ICdGbG9yZW5jZSAmIFRoZSBNYWNoaW5lJyxcblx0XHRcdFx0dHJhY2s6IHtcblx0XHRcdFx0XHRuYW1lOiAnQmlnIEdvZCcsXG5cdFx0XHRcdFx0bGVuZ3RoOiAnNDozMSdcblx0XHRcdFx0fSxcblx0XHRcdFx0dm9sdW1lOiA4MFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQl9Cw0LrQsNC90YfQuNCy0LDQtdGC0YHRjyDQvNC+0LvQvtC60L4nLFxuXHRcdFx0c291cmNlOiAn0KXQvtC70L7QtNC40LvRjNC90LjQuicsXG5cdFx0XHR0aW1lOiAnMTc6MjMsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0JrQsNC20LXRgtGB0Y8sINCyINGF0L7Qu9C+0LTQuNC70YzQvdC40LrQtSDQt9Cw0LrQsNC90YfQuNCy0LDQtdGC0YHRjyDQvNC+0LvQvtC60L4uINCS0Ysg0YXQvtGC0LjRgtC1INC00L7QsdCw0LLQuNGC0Ywg0LXQs9C+INCyINGB0L/QuNGB0L7QuiDQv9C+0LrRg9C/0L7Quj8nLFxuXHRcdFx0aWNvbjogJ2ZyaWRnZScsXG5cdFx0XHRzaXplOiAnbScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGJ1dHRvbnM6IFsn0JTQsCcsICfQndC10YInXVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQl9Cw0YDRj9C00LrQsCDQt9Cw0LLQtdGA0YjQtdC90LAnLFxuXHRcdFx0c291cmNlOiAn0J7QutC+0L3QvdGL0Lkg0YHQtdC90YHQvtGAJyxcblx0XHRcdHRpbWU6ICcxNjoyMiwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQo9GA0LAhINCj0YHRgtGA0L7QudGB0YLQstC+IMKr0J7QutC+0L3QvdGL0Lkg0YHQtdC90YHQvtGAwrsg0YHQvdC+0LLQsCDQsiDRgdGC0YDQvtGOIScsXG5cdFx0XHRpY29uOiAnYmF0dGVyeScsXG5cdFx0XHRzaXplOiAncydcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdjcml0aWNhbCcsXG5cdFx0XHR0aXRsZTogJ9Cf0YvQu9C10YHQvtGBINC30LDRgdGC0YDRj9C7Jyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQtNCy0LjQttC10L3QuNGPJyxcblx0XHRcdHRpbWU6ICcxNjoxNywg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQoNC+0LHQvtC/0YvQu9C10YHQvtGBINC90LUg0YHQvNC+0LMg0YHQvNC10L3QuNGC0Ywg0YHQstC+0LUg0LzQtdGB0YLQvtC/0L7Qu9C+0LbQtdC90LjQtSDQsiDRgtC10YfQtdC90LjQtSDQv9C+0YHQu9C10LTQvdC40YUgMyDQvNC40L3Rg9GCLiDQn9C+0YXQvtC20LUsINC10LzRgyDQvdGD0LbQvdCwINC/0L7QvNC+0YnRjC4nLFxuXHRcdFx0aWNvbjogJ2NhbScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGltYWdlOiAnZ2V0X2l0X2Zyb21fbW9ja3NfOjMuanBnJ1xuXHRcdFx0fSxcblx0XHRcdHNpemU6ICdsJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQktC+0LTQsCDQstGB0LrQuNC/0LXQu9CwJyxcblx0XHRcdHNvdXJjZTogJ9Cn0LDQudC90LjQuicsXG5cdFx0XHR0aW1lOiAnMTY6MjAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBudWxsLFxuXHRcdFx0aWNvbjogJ2tldHRsZScsXG5cdFx0XHRzaXplOiAncydcblx0XHR9XG5cdF1cbn1cblxuY29uc3Qgc21hbGxUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1zbWFsbCcpXG5jb25zdCBtZWRpdW1UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1tZWRpdW0nKVxuY29uc3QgbGFyZ2VUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1sYXJnZScpXG5cbmNvbnN0IGNvbnRlbnRXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cy13cmFwJylcblxuZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHNPYmplY3QuZXZlbnRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdGNvbnN0IHRoaXNJdGVtID0gZXZlbnRzT2JqZWN0LmV2ZW50c1tpXVxuXG5cdC8vINCX0LDQv9C+0LvQvdC10L3QuNC1INC60LDRgNGC0L7Rh9C10Log0YHQvtC00LXRgNC20LjQvNGL0Lxcblx0c3dpdGNoICh0aGlzSXRlbS5zaXplKSB7XG5cdFx0Y2FzZSAncyc6XG5cdFx0XHRjb25zdCBzbWFsbENsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzbWFsbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gYC4vYXNzZXRzLyR7dGhpc0l0ZW0uaWNvbn0uc3ZnYFxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQutCw0YDRgtC+0YfQutC4INC/0YDQtdC00YPQv9GA0LXQttC00LXQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS50eXBlID09PSAnY3JpdGljYWwnKSB7XG5cdFx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwnKVxuXHRcdFx0fVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQvtC/0LjRgdCw0L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0uZGVzY3JpcHRpb24pIHtcblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdoYXZlLWRlc2NyaXB0aW9uJylcblx0XHRcdFx0Y29uc3Qgc21hbGxEZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGNvbnN0IHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzbWFsbERlc2NyaXB0aW9uUGFyYWdyYXBoKVxuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaCcsICdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgtLXNtYWxsJylcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbicsICdjYXJkX19kZXNjcmlwdGlvbi0tc21hbGwnKVxuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uUGFyYWdyYXBoLmlubmVySFRNTCA9IHRoaXNJdGVtLmRlc2NyaXB0aW9uXG5cdFx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmQnKS5hcHBlbmRDaGlsZChzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyKVxuXHRcdFx0fVxuXHRcdFx0Y29udGVudFdyYXAuYXBwZW5kQ2hpbGQoc21hbGxDbG9uZSlcblx0XHRcdGJyZWFrXG5cdFx0Y2FzZSAnbSc6XG5cdFx0XHRjb25zdCBtZWRpdW1DbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVkaXVtVGVtcGxhdGUuY29udGVudCwgdHJ1ZSlcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gYC4vYXNzZXRzLyR7dGhpc0l0ZW0uaWNvbn0uc3ZnYFxuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpdGxlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGl0bGVcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19zb3VyY2UnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS5zb3VyY2Vcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQutCw0YDRgtC+0YfQutC4INC/0YDQtdC00YPQv9GA0LXQttC00LXQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS50eXBlID09PSAnY3JpdGljYWwnKSB7XG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsJylcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7Qv9C40YHQsNC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKVxuXHRcdFx0XHRjb25zdCBtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGNvbnN0IG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdG1lZGl1bURlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoKVxuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgnLCAnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoLS1tZWRpdW0nKVxuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbicsICdjYXJkX19kZXNjcmlwdGlvbi0tbWVkaXVtJylcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb25cblx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmQnKS5hcHBlbmRDaGlsZChtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lcilcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEpIHtcblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEudGVtcGVyYXR1cmUgJiYgdGhpc0l0ZW0uZGF0YS5odW1pZGl0eSkge1xuXHRcdFx0XHRcdGNvbnN0IG1lZGl1bURhdGFBaXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YScsICdjYXJkX19kYXRhLS1haXInKVxuXHRcdFx0XHRcdGNvbnN0IG1lZGl1bURhdGFUZW1wZXJhdHVyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRcdG1lZGl1bURhdGFUZW1wZXJhdHVyZS5pbm5lckhUTUwgPSBg0KLQtdC80L/QtdGA0LDRgtGD0YDQsDogPGI+JHt0aGlzSXRlbS5kYXRhLnRlbXBlcmF0dXJlfSDQoTxiPmBcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhSHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblx0XHRcdFx0XHRtZWRpdW1EYXRhSHVtaWRpdHkuaW5uZXJIVE1MID0gYNCS0LvQsNC20L3QvtGB0YLRjDogPGI+JHt0aGlzSXRlbS5kYXRhLmh1bWlkaXR5fSAlPGI+YFxuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuYXBwZW5kQ2hpbGQobWVkaXVtRGF0YVRlbXBlcmF0dXJlKVxuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuYXBwZW5kQ2hpbGQobWVkaXVtRGF0YUh1bWlkaXR5KVxuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKG1lZGl1bURhdGFBaXIpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS5idXR0b25zKSB7XG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbnMtY29udGFpbmVyJylcblx0XHRcdFx0XHRjb25zdCBidXR0b25ZZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdGJ1dHRvblllcy5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbicsICdjYXJkX19kYXRhLS1idXR0b24teWVzJylcblx0XHRcdFx0XHRidXR0b25ZZXMuaW5uZXJIVE1MID0gJ9CU0LAnXG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uTm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdGJ1dHRvbk5vLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEtYnV0dG9uJywgJ2NhcmRfX2RhdGEtLWJ1dHRvbi1ubycpXG5cdFx0XHRcdFx0YnV0dG9uTm8uaW5uZXJIVE1MID0gJ9Cd0LXRgidcblx0XHRcdFx0XHRidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvblllcylcblx0XHRcdFx0XHRidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbk5vKVxuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKGJ1dHRvbnNDb250YWluZXIpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS5hcnRpc3QpIHtcblx0XHRcdFx0XHRjb25zdCBtdXNpY1BsYXllciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdFx0bXVzaWNQbGF5ZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1tdXNpYy1wbGF5ZXInKVxuXHRcdFx0XHRcdG11c2ljUGxheWVyLmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZF9fcGxheWVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2hlYWRlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2xvZ28tY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7dGhpc0l0ZW0uZGF0YS5hbGJ1bWNvdmVyfVwiIGFsdD1cIlwiIGNsYXNzPVwicGxheWVyX19sb2dvXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tpbmZvXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInBsYXllcl9fbmFtZVwiPiR7dGhpc0l0ZW0uZGF0YS5hcnRpc3R9IC0gJHt0aGlzSXRlbS5kYXRhLnRyYWNrLm5hbWV9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tsaW5lXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwicGxheWVyX190aW1lXCI+JHt0aGlzSXRlbS5kYXRhLnRyYWNrLmxlbmd0aH08L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2NvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9wcmV2LnN2Z1wiIGFsdD1cIlwiIGNsYXNzPVwicGxheWVyX19jb250cm9sIHBsYXllcl9fY29udHJvbC0tbGVmdFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi9hc3NldHMvcHJldi5zdmdcIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fY29udHJvbCBwbGF5ZXJfX2NvbnRyb2wtLXJpZ2h0XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdm9sdW1lXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJwbGF5ZXJfX3ZvbHVtZS1wZXJjZW50XCI+JHt0aGlzSXRlbS5kYXRhLnZvbHVtZX0gJTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5gXG5cdFx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2Rlc2NyaXB0aW9uJykuYXBwZW5kQ2hpbGQobXVzaWNQbGF5ZXIpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKG1lZGl1bUNsb25lKVxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdsJzpcblx0XHRcdGNvbnN0IGxhcmdlQ2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKGxhcmdlVGVtcGxhdGUuY29udGVudCwgdHJ1ZSlcblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2xvZ28nKS5zcmMgPSBgLi9hc3NldHMvJHt0aGlzSXRlbS5pY29ufS5zdmdgXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aXRsZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpdGxlXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19zb3VyY2UnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS5zb3VyY2Vcblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpbWUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aW1lXG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0L7Rh9C60Lgg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLnR5cGUgPT09ICdjcml0aWNhbCcpIHtcblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKVxuXHRcdFx0XHRjb25zdCBsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0Y29uc3QgbGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGgpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tbGFyZ2UnKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLS1sYXJnZScpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb25cblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0LjQvdC60Lhcblx0XHRcdGxldCBsYXJnZURhdGFJbWFnZVxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEudHlwZSA9PT0gJ2dyYXBoJykge1xuXHRcdFx0XHRsYXJnZURhdGFJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2ltYWdlLWNvbnRhaW5lcicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmlubmVySFRNTCA9IGA8aW1nXG5cdFx0XHRcdHNyYz1cIi4vYXNzZXRzL3JpY2hkYXRhLnN2Z1wiXG5cdFx0XHRcdGNsYXNzPVwiY2FyZF9faW1hZ2VcIj5gXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLmltYWdlKSB7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuY2xhc3NMaXN0LmFkZCgnY2FyZF9faW1hZ2UtY29udGFpbmVyJylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2Uuc2V0QXR0cmlidXRlKCdpZCcsICdob292ZXItY29udGFpbmVyJylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuaW5uZXJIVE1MID0gYDxpbWdcblx0XHRcdFx0XHRcdGNsYXNzPVwiY2FyZF9faW1hZ2VcIlxuXHRcdFx0XHRcdFx0aWQ9XCJob292ZXJcIlxuXHRcdFx0XHRcdFx0dG91Y2gtYWN0aW9uPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRzdHlsZT1cInRvdWNoLWFjdGlvbjogbm9uZTtcIlxuXHRcdFx0XHRcdFx0c3Jjc2V0PVwiLi9hc3NldHMvYml0bWFwLnBuZyA3Njh3LFxuXHRcdFx0XHRcdFx0Li9hc3NldHMvYml0bWFwMngucG5nIDEzNjZ3LFxuXHRcdFx0XHRcdFx0Li9hc3NldHMvYml0bWFwM3gucG5nIDE5MjB3XCJcblx0XHRcdFx0XHRcdHNyYz1cIi4vYXNzZXRzL2JpdG1hcDJ4LnBuZ1wiPmBcblx0XHRcdH1cblxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChsYXJnZURhdGFJbWFnZSlcblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKGxhcmdlQ2xvbmUpXG5cdFx0XHRicmVha1xuXHRcdGRlZmF1bHQ6IGNvbnNvbGUuZXJyb3IoJ1VuZXhwZWN0ZWQgc2l6ZSBvZiBjYXJkJyk7XG5cdH1cbn1cbiJdfQ==
