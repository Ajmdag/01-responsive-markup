(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/templates');

require('./modules/pointerEvents');
},{"./modules/pointerEvents":2,"./modules/templates":3}],2:[function(require,module,exports){
let scaleValue = 1
let brightnessValue = 1
const eventCache = new Array()
let prevDiff = -1
let prevAngle = null

const elementInfo = new Object()

//dev
const blue = document.querySelector('ul.blue')
const blueList = blue.querySelectorAll('li')
//dev

// Создаем класс для вспомогательных функций
const helpersFunctions = {
	getCoords(elem) {
		const box = elem.getBoundingClientRect()

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		}
	},

	getDistaneBetweenTwoDots(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
	},

	checkLimits(computedX, computedY) {
		if (computedX < 0) elementInfo.computedX = 0
		if (computedY < 0) elementInfo.computedY = 0
		if (computedX > elementInfo.xLimit) elementInfo.computedX = elementInfo.xLimit
		if (computedY > elementInfo.yLimit) elementInfo.computedY = elementInfo.yLimit
	},

	getLimits() {
		elementInfo.yLimit = (elementInfo.el.offsetHeight * scaleValue - elementInfo.el.parentNode.offsetHeight) / 2
		elementInfo.xLimit = (elementInfo.el.offsetWidth * scaleValue - elementInfo.el.parentNode.offsetWidth) / 2
	},

	getAngle(x1, y1, x2, y2) {
		return (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI
	}
}

function init() {
	elementInfo.el = document.querySelector('#hoover')

	// Начальное смещение картинки
	elementInfo.oldComputedX = 0
	elementInfo.oldComputedY = 0

	// Переопределяем события
	elementInfo.el.onpointerdown = pointerDownHandler
	elementInfo.el.onpointermove = pointerMoveHandler
	elementInfo.el.onpointerup = pointerupHandler
	elementInfo.el.onpointercancel = pointerupHandler
	elementInfo.el.onpointerout = pointerupHandler
	elementInfo.el.onpointerleave = pointerupHandler

	elementInfo.initialWidth = elementInfo.el.offsetWidth
	elementInfo.initialHeight = elementInfo.el.offsetHeight
}

function pointerDownHandler(event) {
	eventCache.push(event)

	log('pointerDown', event)

	elementInfo.shiftX = event.pageX - helpersFunctions.getCoords(elementInfo.el).left
	elementInfo.shiftY = event.pageY - helpersFunctions.getCoords(elementInfo.el).top
	elementInfo.elLeftOffset = elementInfo.el.getBoundingClientRect().left
	elementInfo.elTopOffset = elementInfo.el.getBoundingClientRect().top
	elementInfo.startedPointDownX = event.clientX
	elementInfo.startedPointDownY = event.clientY
}

function pointerMoveHandler(event) {
	log('pointerMove', event)
	for (var i = 0; i < eventCache.length; i++) {
		if (event.pointerId == eventCache[i].pointerId) {
			eventCache[i] = event
			break
		}
	}

	elementInfo.statedPointMoveX = event.clientX
	elementInfo.statedPointMoveY = event.clientY

	if (eventCache.length === 1) {
		// if (!elementInfo.oldComputedX && !elementInfo.oldComputedY) {
		elementInfo.computedX = event.clientX - elementInfo.startedPointDownX + elementInfo.oldComputedX
		elementInfo.computedY = event.clientY - elementInfo.startedPointDownY + elementInfo.oldComputedY
		blueList[1].innerHTML = elementInfo.computedX
		blueList[2].innerHTML = elementInfo.computedY
		blueList[3].innerHTML = elementInfo.oldComputedX
		blueList[4].innerHTML = elementInfo.oldComputedY
		blueList[5].innerHTML = `startedPointDownY ${elementInfo.startedPointDownY}`
		blueList[6].innerHTML = `event.clientY ${event.clientY}`

		helpersFunctions.getLimits()
		blueList[7].innerHTML = `elementInfo.yLimit ${elementInfo.yLimit}`
		blueList[8].innerHTML = `elementInfo.xLimit ${elementInfo.xLimit}`
		helpersFunctions.checkLimits(elementInfo.computedX, elementInfo.computedY)

		// if (computedX < 0) computedX = 0
		// if (computedY < 0) computedY = 0
		// if (computedX >= elementInfo.width) computedX = elementInfo.width
		// if (computedY >= elementInfo.height) computedY = elementInfo.height
		// if (scaleValue === 1) {
		// 	computedX = 0
		// 	computedY = 0
		// }
		event.target.style.transform = `scale(${scaleValue}) translate(${elementInfo.computedX}px, ${elementInfo.computedY}px)`
		// 	} else {
		// 		let computedX = event.clientX - elementInfo.statedPointMoveX
		// 		let computedY = event.clientY - elementInfo.statedPointMoveY
		// 		event.target.style.transform = `scale(${scaleValue}) translate(${computedX}px, ${computedY}px)`
		// 	}
		// 	blueList[4].innerHTML = `computedX ${computedX.toFixed(2)}`
		// 	blueList[5].innerHTML = `computedY ${computedY.toFixed(2)}`
		// 	blueList[8].innerHTML = `event.clientX ${event.clientX.toFixed(2)}`
		// 	blueList[9].innerHTML = `elementInfo.shiftX ${elementInfo.shiftX.toFixed(2)}`
		// 	blueList[10].innerHTML = `elementInfo.elLeftOffset ${elementInfo.elLeftOffset.toFixed(2)}`
		// }
		// elementInfo.oldComputedX = elementInfo.computedX
		// elementInfo.oldComputedY = elementInfo.computedY
	}

	if (eventCache.length == 2) {
		// let curId = event.pointerId
		// let curObj = eventCache.filter((item) => item.pointerId === curId)[0]

		// curObj.clientX = event.clientX
		// curObj.clientY = event.clientY

		let x1 = eventCache[0].clientX
		let y1 = eventCache[0].clientY
		let x2 = eventCache[1].clientX
		let y2 = eventCache[1].clientY

		helpersFunctions.getLimits()
		// blueList[6].innerHTML = `x1 - ${x1}`
		// blueList[7].innerHTML = `x2 - ${x2}`
		// blueList[1].innerHTML = `y1 - ${y1}`
		// blueList[3].innerHTML = `y2 - ${y2}`

		let curAngle = helpersFunctions.getAngle(x1, y1, x2, y2)
		blueList[3].innerHTML = `curangle === ${curAngle}`
		blueList[4].innerHTML = `prevangle === ${prevAngle}`

		if (prevAngle) {
			let increaseOn = 0.01
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

		let curDiff = Math.abs(eventCache[0].clientX - eventCache[1].clientX)

		if (prevDiff > 0) {
			// blueList[0].innerHTML = `scaleValue - ${scaleValue}`
			// blueList[1].innerHTML = `curDiff - ${curDiff}`
			// blueList[2].innerHTML = `prevDiff - ${prevDiff}`
			// blueList[3].innerHTML = `curDiff - prevDiff - ${(curDiff - prevDiff).toString()}`

			if (curDiff > prevDiff) {
				// ZOOM IN
				if (scaleValue >= 1) scaleValue += 0.05
				if (scaleValue > 3) scaleValue = 3
				log('Pinch moving OUT -> Zoom in', event)
				elementInfo.el.style.transform = `scale(${scaleValue}) translate(${elementInfo.computedX}px, ${elementInfo.computedY}px)`
			}

			if (curDiff < prevDiff) {
				// ZOOM OUT
				if (scaleValue >= 1) scaleValue -= 0.05
				if (scaleValue < 1) scaleValue = 1

				log('Pinch moving IN -> Zoom out', event)
				elementInfo.el.style.transform = `scale(${scaleValue}) translate(${elementInfo.computedX}px, ${elementInfo.computedY}px)`
			}
		}

		prevDiff = curDiff
	}
}

function pointerupHandler(ev) {
	elementInfo.oldComputedX = elementInfo.computedX
	elementInfo.oldComputedY = elementInfo.computedY

	log(ev.type, ev)
	// Remove this pointer from the cache and reset the target's
	// background and border
	removevent(ev)
	// ev.target.style.border = '1px solid black'

	// If the number of pointers down is less than two then reset diff tracker
	if (eventCache.length < 2) prevDiff = -1
}

// hoover.addEventListener('pointerdown', (event) => {
// 	pointerStatus[event.pointerId] = event
// 	console.log('da')

// 	hoover.addEventListener('pointerup', () => {
// 		delete pointerStatus[event.pointerId]
// 		console.log('deletes')
// 		console.log(pointerStatus)
// 	})

// 	// if (pointerStatus.pointerId[2]) {
// 	// }
// })

function removevent(ev) {
	// Remove this event from the target's cache
	for (let i = 0; i < eventCache.length; i++) {
		if (eventCache[i].pointerId == ev.pointerId) {
			eventCache.splice(i, 1)
			break
		}
	}
}

// Log events flag
let logEvents = false

// Logging/debugging functions
function enableLog(ev) {
	logEvents = logEvents ? false : true
}

function log(prefix, ev) {
	if (!logEvents) return
	let o = document.getElementsByTagName('output')[0]
	let s = prefix + ': pointerID = ' + ev.pointerId + ' ; pointerType = ' + ev.pointerType + ' ; isPrimary = ' + ev.isPrimary
	o.innerHTML += s + ' '
}

function clearLog(event) {
	let o = document.getElementsByTagName('output')[0]
	o.innerHTML = ''
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzL3NocmktMjAxOC8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV9kZjVlNDBmMi5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL3BvaW50ZXJFdmVudHMuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzL3NocmktMjAxOC8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvbW9kdWxlcy90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy90ZW1wbGF0ZXMnKTtcblxucmVxdWlyZSgnLi9tb2R1bGVzL3BvaW50ZXJFdmVudHMnKTsiLCJsZXQgc2NhbGVWYWx1ZSA9IDFcbmxldCBicmlnaHRuZXNzVmFsdWUgPSAxXG5jb25zdCBldmVudENhY2hlID0gbmV3IEFycmF5KClcbmxldCBwcmV2RGlmZiA9IC0xXG5sZXQgcHJldkFuZ2xlID0gbnVsbFxuXG5jb25zdCBlbGVtZW50SW5mbyA9IG5ldyBPYmplY3QoKVxuXG4vL2RldlxuY29uc3QgYmx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3VsLmJsdWUnKVxuY29uc3QgYmx1ZUxpc3QgPSBibHVlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylcbi8vZGV2XG5cbi8vINCh0L7Qt9C00LDQtdC8INC60LvQsNGB0YEg0LTQu9GPINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvRhSDRhNGD0L3QutGG0LjQuVxuY29uc3QgaGVscGVyc0Z1bmN0aW9ucyA9IHtcblx0Z2V0Q29vcmRzKGVsZW0pIHtcblx0XHRjb25zdCBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsXG5cdFx0XHRsZWZ0OiBib3gubGVmdCArIHBhZ2VYT2Zmc2V0XG5cdFx0fVxuXHR9LFxuXG5cdGdldERpc3RhbmVCZXR3ZWVuVHdvRG90cyh4MSwgeTEsIHgyLCB5Mikge1xuXHRcdHJldHVybiBNYXRoLnNxcnQoKHgxIC0geDIpICoqIDIgKyAoeTEgLSB5MikgKiogMilcblx0fSxcblxuXHRjaGVja0xpbWl0cyhjb21wdXRlZFgsIGNvbXB1dGVkWSkge1xuXHRcdGlmIChjb21wdXRlZFggPCAwKSBlbGVtZW50SW5mby5jb21wdXRlZFggPSAwXG5cdFx0aWYgKGNvbXB1dGVkWSA8IDApIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSA9IDBcblx0XHRpZiAoY29tcHV0ZWRYID4gZWxlbWVudEluZm8ueExpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFggPSBlbGVtZW50SW5mby54TGltaXRcblx0XHRpZiAoY29tcHV0ZWRZID4gZWxlbWVudEluZm8ueUxpbWl0KSBlbGVtZW50SW5mby5jb21wdXRlZFkgPSBlbGVtZW50SW5mby55TGltaXRcblx0fSxcblxuXHRnZXRMaW1pdHMoKSB7XG5cdFx0ZWxlbWVudEluZm8ueUxpbWl0ID0gKGVsZW1lbnRJbmZvLmVsLm9mZnNldEhlaWdodCAqIHNjYWxlVmFsdWUgLSBlbGVtZW50SW5mby5lbC5wYXJlbnROb2RlLm9mZnNldEhlaWdodCkgLyAyXG5cdFx0ZWxlbWVudEluZm8ueExpbWl0ID0gKGVsZW1lbnRJbmZvLmVsLm9mZnNldFdpZHRoICogc2NhbGVWYWx1ZSAtIGVsZW1lbnRJbmZvLmVsLnBhcmVudE5vZGUub2Zmc2V0V2lkdGgpIC8gMlxuXHR9LFxuXG5cdGdldEFuZ2xlKHgxLCB5MSwgeDIsIHkyKSB7XG5cdFx0cmV0dXJuIChNYXRoLmF0YW4yKHkxIC0geTIsIHgxIC0geDIpICogMTgwKSAvIE1hdGguUElcblx0fVxufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuXHRlbGVtZW50SW5mby5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNob292ZXInKVxuXG5cdC8vINCd0LDRh9Cw0LvRjNC90L7QtSDRgdC80LXRidC10L3QuNC1INC60LDRgNGC0LjQvdC60Lhcblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYID0gMFxuXHRlbGVtZW50SW5mby5vbGRDb21wdXRlZFkgPSAwXG5cblx0Ly8g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRgdC+0LHRi9GC0LjRj1xuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJkb3duID0gcG9pbnRlckRvd25IYW5kbGVyXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcm1vdmUgPSBwb2ludGVyTW92ZUhhbmRsZXJcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVydXAgPSBwb2ludGVydXBIYW5kbGVyXG5cdGVsZW1lbnRJbmZvLmVsLm9ucG9pbnRlcmNhbmNlbCA9IHBvaW50ZXJ1cEhhbmRsZXJcblx0ZWxlbWVudEluZm8uZWwub25wb2ludGVyb3V0ID0gcG9pbnRlcnVwSGFuZGxlclxuXHRlbGVtZW50SW5mby5lbC5vbnBvaW50ZXJsZWF2ZSA9IHBvaW50ZXJ1cEhhbmRsZXJcblxuXHRlbGVtZW50SW5mby5pbml0aWFsV2lkdGggPSBlbGVtZW50SW5mby5lbC5vZmZzZXRXaWR0aFxuXHRlbGVtZW50SW5mby5pbml0aWFsSGVpZ2h0ID0gZWxlbWVudEluZm8uZWwub2Zmc2V0SGVpZ2h0XG59XG5cbmZ1bmN0aW9uIHBvaW50ZXJEb3duSGFuZGxlcihldmVudCkge1xuXHRldmVudENhY2hlLnB1c2goZXZlbnQpXG5cblx0bG9nKCdwb2ludGVyRG93bicsIGV2ZW50KVxuXG5cdGVsZW1lbnRJbmZvLnNoaWZ0WCA9IGV2ZW50LnBhZ2VYIC0gaGVscGVyc0Z1bmN0aW9ucy5nZXRDb29yZHMoZWxlbWVudEluZm8uZWwpLmxlZnRcblx0ZWxlbWVudEluZm8uc2hpZnRZID0gZXZlbnQucGFnZVkgLSBoZWxwZXJzRnVuY3Rpb25zLmdldENvb3JkcyhlbGVtZW50SW5mby5lbCkudG9wXG5cdGVsZW1lbnRJbmZvLmVsTGVmdE9mZnNldCA9IGVsZW1lbnRJbmZvLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0ZWxlbWVudEluZm8uZWxUb3BPZmZzZXQgPSBlbGVtZW50SW5mby5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3Bcblx0ZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93blggPSBldmVudC5jbGllbnRYXG5cdGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25ZID0gZXZlbnQuY2xpZW50WVxufVxuXG5mdW5jdGlvbiBwb2ludGVyTW92ZUhhbmRsZXIoZXZlbnQpIHtcblx0bG9nKCdwb2ludGVyTW92ZScsIGV2ZW50KVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50Q2FjaGUubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoZXZlbnQucG9pbnRlcklkID09IGV2ZW50Q2FjaGVbaV0ucG9pbnRlcklkKSB7XG5cdFx0XHRldmVudENhY2hlW2ldID0gZXZlbnRcblx0XHRcdGJyZWFrXG5cdFx0fVxuXHR9XG5cblx0ZWxlbWVudEluZm8uc3RhdGVkUG9pbnRNb3ZlWCA9IGV2ZW50LmNsaWVudFhcblx0ZWxlbWVudEluZm8uc3RhdGVkUG9pbnRNb3ZlWSA9IGV2ZW50LmNsaWVudFlcblxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPT09IDEpIHtcblx0XHQvLyBpZiAoIWVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWCAmJiAhZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZKSB7XG5cdFx0ZWxlbWVudEluZm8uY29tcHV0ZWRYID0gZXZlbnQuY2xpZW50WCAtIGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25YICsgZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYXG5cdFx0ZWxlbWVudEluZm8uY29tcHV0ZWRZID0gZXZlbnQuY2xpZW50WSAtIGVsZW1lbnRJbmZvLnN0YXJ0ZWRQb2ludERvd25ZICsgZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZXG5cdFx0Ymx1ZUxpc3RbMV0uaW5uZXJIVE1MID0gZWxlbWVudEluZm8uY29tcHV0ZWRYXG5cdFx0Ymx1ZUxpc3RbMl0uaW5uZXJIVE1MID0gZWxlbWVudEluZm8uY29tcHV0ZWRZXG5cdFx0Ymx1ZUxpc3RbM10uaW5uZXJIVE1MID0gZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYXG5cdFx0Ymx1ZUxpc3RbNF0uaW5uZXJIVE1MID0gZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRZXG5cdFx0Ymx1ZUxpc3RbNV0uaW5uZXJIVE1MID0gYHN0YXJ0ZWRQb2ludERvd25ZICR7ZWxlbWVudEluZm8uc3RhcnRlZFBvaW50RG93bll9YFxuXHRcdGJsdWVMaXN0WzZdLmlubmVySFRNTCA9IGBldmVudC5jbGllbnRZICR7ZXZlbnQuY2xpZW50WX1gXG5cblx0XHRoZWxwZXJzRnVuY3Rpb25zLmdldExpbWl0cygpXG5cdFx0Ymx1ZUxpc3RbN10uaW5uZXJIVE1MID0gYGVsZW1lbnRJbmZvLnlMaW1pdCAke2VsZW1lbnRJbmZvLnlMaW1pdH1gXG5cdFx0Ymx1ZUxpc3RbOF0uaW5uZXJIVE1MID0gYGVsZW1lbnRJbmZvLnhMaW1pdCAke2VsZW1lbnRJbmZvLnhMaW1pdH1gXG5cdFx0aGVscGVyc0Z1bmN0aW9ucy5jaGVja0xpbWl0cyhlbGVtZW50SW5mby5jb21wdXRlZFgsIGVsZW1lbnRJbmZvLmNvbXB1dGVkWSlcblxuXHRcdC8vIGlmIChjb21wdXRlZFggPCAwKSBjb21wdXRlZFggPSAwXG5cdFx0Ly8gaWYgKGNvbXB1dGVkWSA8IDApIGNvbXB1dGVkWSA9IDBcblx0XHQvLyBpZiAoY29tcHV0ZWRYID49IGVsZW1lbnRJbmZvLndpZHRoKSBjb21wdXRlZFggPSBlbGVtZW50SW5mby53aWR0aFxuXHRcdC8vIGlmIChjb21wdXRlZFkgPj0gZWxlbWVudEluZm8uaGVpZ2h0KSBjb21wdXRlZFkgPSBlbGVtZW50SW5mby5oZWlnaHRcblx0XHQvLyBpZiAoc2NhbGVWYWx1ZSA9PT0gMSkge1xuXHRcdC8vIFx0Y29tcHV0ZWRYID0gMFxuXHRcdC8vIFx0Y29tcHV0ZWRZID0gMFxuXHRcdC8vIH1cblx0XHRldmVudC50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGVWYWx1ZX0pIHRyYW5zbGF0ZSgke2VsZW1lbnRJbmZvLmNvbXB1dGVkWH1weCwgJHtlbGVtZW50SW5mby5jb21wdXRlZFl9cHgpYFxuXHRcdC8vIFx0fSBlbHNlIHtcblx0XHQvLyBcdFx0bGV0IGNvbXB1dGVkWCA9IGV2ZW50LmNsaWVudFggLSBlbGVtZW50SW5mby5zdGF0ZWRQb2ludE1vdmVYXG5cdFx0Ly8gXHRcdGxldCBjb21wdXRlZFkgPSBldmVudC5jbGllbnRZIC0gZWxlbWVudEluZm8uc3RhdGVkUG9pbnRNb3ZlWVxuXHRcdC8vIFx0XHRldmVudC50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGVWYWx1ZX0pIHRyYW5zbGF0ZSgke2NvbXB1dGVkWH1weCwgJHtjb21wdXRlZFl9cHgpYFxuXHRcdC8vIFx0fVxuXHRcdC8vIFx0Ymx1ZUxpc3RbNF0uaW5uZXJIVE1MID0gYGNvbXB1dGVkWCAke2NvbXB1dGVkWC50b0ZpeGVkKDIpfWBcblx0XHQvLyBcdGJsdWVMaXN0WzVdLmlubmVySFRNTCA9IGBjb21wdXRlZFkgJHtjb21wdXRlZFkudG9GaXhlZCgyKX1gXG5cdFx0Ly8gXHRibHVlTGlzdFs4XS5pbm5lckhUTUwgPSBgZXZlbnQuY2xpZW50WCAke2V2ZW50LmNsaWVudFgudG9GaXhlZCgyKX1gXG5cdFx0Ly8gXHRibHVlTGlzdFs5XS5pbm5lckhUTUwgPSBgZWxlbWVudEluZm8uc2hpZnRYICR7ZWxlbWVudEluZm8uc2hpZnRYLnRvRml4ZWQoMil9YFxuXHRcdC8vIFx0Ymx1ZUxpc3RbMTBdLmlubmVySFRNTCA9IGBlbGVtZW50SW5mby5lbExlZnRPZmZzZXQgJHtlbGVtZW50SW5mby5lbExlZnRPZmZzZXQudG9GaXhlZCgyKX1gXG5cdFx0Ly8gfVxuXHRcdC8vIGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWCA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWFxuXHRcdC8vIGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWSA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWVxuXHR9XG5cblx0aWYgKGV2ZW50Q2FjaGUubGVuZ3RoID09IDIpIHtcblx0XHQvLyBsZXQgY3VySWQgPSBldmVudC5wb2ludGVySWRcblx0XHQvLyBsZXQgY3VyT2JqID0gZXZlbnRDYWNoZS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ucG9pbnRlcklkID09PSBjdXJJZClbMF1cblxuXHRcdC8vIGN1ck9iai5jbGllbnRYID0gZXZlbnQuY2xpZW50WFxuXHRcdC8vIGN1ck9iai5jbGllbnRZID0gZXZlbnQuY2xpZW50WVxuXG5cdFx0bGV0IHgxID0gZXZlbnRDYWNoZVswXS5jbGllbnRYXG5cdFx0bGV0IHkxID0gZXZlbnRDYWNoZVswXS5jbGllbnRZXG5cdFx0bGV0IHgyID0gZXZlbnRDYWNoZVsxXS5jbGllbnRYXG5cdFx0bGV0IHkyID0gZXZlbnRDYWNoZVsxXS5jbGllbnRZXG5cblx0XHRoZWxwZXJzRnVuY3Rpb25zLmdldExpbWl0cygpXG5cdFx0Ly8gYmx1ZUxpc3RbNl0uaW5uZXJIVE1MID0gYHgxIC0gJHt4MX1gXG5cdFx0Ly8gYmx1ZUxpc3RbN10uaW5uZXJIVE1MID0gYHgyIC0gJHt4Mn1gXG5cdFx0Ly8gYmx1ZUxpc3RbMV0uaW5uZXJIVE1MID0gYHkxIC0gJHt5MX1gXG5cdFx0Ly8gYmx1ZUxpc3RbM10uaW5uZXJIVE1MID0gYHkyIC0gJHt5Mn1gXG5cblx0XHRsZXQgY3VyQW5nbGUgPSBoZWxwZXJzRnVuY3Rpb25zLmdldEFuZ2xlKHgxLCB5MSwgeDIsIHkyKVxuXHRcdGJsdWVMaXN0WzNdLmlubmVySFRNTCA9IGBjdXJhbmdsZSA9PT0gJHtjdXJBbmdsZX1gXG5cdFx0Ymx1ZUxpc3RbNF0uaW5uZXJIVE1MID0gYHByZXZhbmdsZSA9PT0gJHtwcmV2QW5nbGV9YFxuXG5cdFx0aWYgKHByZXZBbmdsZSkge1xuXHRcdFx0bGV0IGluY3JlYXNlT24gPSAwLjAxXG5cdFx0XHRpZiAoY3VyQW5nbGUgPiBwcmV2QW5nbGUpIHtcblx0XHRcdFx0YnJpZ2h0bmVzc1ZhbHVlICs9IGluY3JlYXNlT25cblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHticmlnaHRuZXNzVmFsdWV9KWBcblx0XHRcdH1cblx0XHRcdGlmIChjdXJBbmdsZSA8IHByZXZBbmdsZSkge1xuXHRcdFx0XHRicmlnaHRuZXNzVmFsdWUgLT0gaW5jcmVhc2VPblxuXHRcdFx0XHRlbGVtZW50SW5mby5lbC5zdHlsZS5maWx0ZXIgPSBgYnJpZ2h0bmVzcygke2JyaWdodG5lc3NWYWx1ZX0pYFxuXHRcdFx0fVxuXHRcdH1cblx0XHRwcmV2QW5nbGUgPSBjdXJBbmdsZVxuXG5cdFx0bGV0IGN1ckRpZmYgPSBNYXRoLmFicyhldmVudENhY2hlWzBdLmNsaWVudFggLSBldmVudENhY2hlWzFdLmNsaWVudFgpXG5cblx0XHRpZiAocHJldkRpZmYgPiAwKSB7XG5cdFx0XHQvLyBibHVlTGlzdFswXS5pbm5lckhUTUwgPSBgc2NhbGVWYWx1ZSAtICR7c2NhbGVWYWx1ZX1gXG5cdFx0XHQvLyBibHVlTGlzdFsxXS5pbm5lckhUTUwgPSBgY3VyRGlmZiAtICR7Y3VyRGlmZn1gXG5cdFx0XHQvLyBibHVlTGlzdFsyXS5pbm5lckhUTUwgPSBgcHJldkRpZmYgLSAke3ByZXZEaWZmfWBcblx0XHRcdC8vIGJsdWVMaXN0WzNdLmlubmVySFRNTCA9IGBjdXJEaWZmIC0gcHJldkRpZmYgLSAkeyhjdXJEaWZmIC0gcHJldkRpZmYpLnRvU3RyaW5nKCl9YFxuXG5cdFx0XHRpZiAoY3VyRGlmZiA+IHByZXZEaWZmKSB7XG5cdFx0XHRcdC8vIFpPT00gSU5cblx0XHRcdFx0aWYgKHNjYWxlVmFsdWUgPj0gMSkgc2NhbGVWYWx1ZSArPSAwLjA1XG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID4gMykgc2NhbGVWYWx1ZSA9IDNcblx0XHRcdFx0bG9nKCdQaW5jaCBtb3ZpbmcgT1VUIC0+IFpvb20gaW4nLCBldmVudClcblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGVWYWx1ZX0pIHRyYW5zbGF0ZSgke2VsZW1lbnRJbmZvLmNvbXB1dGVkWH1weCwgJHtlbGVtZW50SW5mby5jb21wdXRlZFl9cHgpYFxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY3VyRGlmZiA8IHByZXZEaWZmKSB7XG5cdFx0XHRcdC8vIFpPT00gT1VUXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID49IDEpIHNjYWxlVmFsdWUgLT0gMC4wNVxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA8IDEpIHNjYWxlVmFsdWUgPSAxXG5cblx0XHRcdFx0bG9nKCdQaW5jaCBtb3ZpbmcgSU4gLT4gWm9vbSBvdXQnLCBldmVudClcblx0XHRcdFx0ZWxlbWVudEluZm8uZWwuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGVWYWx1ZX0pIHRyYW5zbGF0ZSgke2VsZW1lbnRJbmZvLmNvbXB1dGVkWH1weCwgJHtlbGVtZW50SW5mby5jb21wdXRlZFl9cHgpYFxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByZXZEaWZmID0gY3VyRGlmZlxuXHR9XG59XG5cbmZ1bmN0aW9uIHBvaW50ZXJ1cEhhbmRsZXIoZXYpIHtcblx0ZWxlbWVudEluZm8ub2xkQ29tcHV0ZWRYID0gZWxlbWVudEluZm8uY29tcHV0ZWRYXG5cdGVsZW1lbnRJbmZvLm9sZENvbXB1dGVkWSA9IGVsZW1lbnRJbmZvLmNvbXB1dGVkWVxuXG5cdGxvZyhldi50eXBlLCBldilcblx0Ly8gUmVtb3ZlIHRoaXMgcG9pbnRlciBmcm9tIHRoZSBjYWNoZSBhbmQgcmVzZXQgdGhlIHRhcmdldCdzXG5cdC8vIGJhY2tncm91bmQgYW5kIGJvcmRlclxuXHRyZW1vdmV2ZW50KGV2KVxuXHQvLyBldi50YXJnZXQuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCBibGFjaydcblxuXHQvLyBJZiB0aGUgbnVtYmVyIG9mIHBvaW50ZXJzIGRvd24gaXMgbGVzcyB0aGFuIHR3byB0aGVuIHJlc2V0IGRpZmYgdHJhY2tlclxuXHRpZiAoZXZlbnRDYWNoZS5sZW5ndGggPCAyKSBwcmV2RGlmZiA9IC0xXG59XG5cbi8vIGhvb3Zlci5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIChldmVudCkgPT4ge1xuLy8gXHRwb2ludGVyU3RhdHVzW2V2ZW50LnBvaW50ZXJJZF0gPSBldmVudFxuLy8gXHRjb25zb2xlLmxvZygnZGEnKVxuXG4vLyBcdGhvb3Zlci5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCAoKSA9PiB7XG4vLyBcdFx0ZGVsZXRlIHBvaW50ZXJTdGF0dXNbZXZlbnQucG9pbnRlcklkXVxuLy8gXHRcdGNvbnNvbGUubG9nKCdkZWxldGVzJylcbi8vIFx0XHRjb25zb2xlLmxvZyhwb2ludGVyU3RhdHVzKVxuLy8gXHR9KVxuXG4vLyBcdC8vIGlmIChwb2ludGVyU3RhdHVzLnBvaW50ZXJJZFsyXSkge1xuLy8gXHQvLyB9XG4vLyB9KVxuXG5mdW5jdGlvbiByZW1vdmV2ZW50KGV2KSB7XG5cdC8vIFJlbW92ZSB0aGlzIGV2ZW50IGZyb20gdGhlIHRhcmdldCdzIGNhY2hlXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRDYWNoZS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChldmVudENhY2hlW2ldLnBvaW50ZXJJZCA9PSBldi5wb2ludGVySWQpIHtcblx0XHRcdGV2ZW50Q2FjaGUuc3BsaWNlKGksIDEpXG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxufVxuXG4vLyBMb2cgZXZlbnRzIGZsYWdcbmxldCBsb2dFdmVudHMgPSBmYWxzZVxuXG4vLyBMb2dnaW5nL2RlYnVnZ2luZyBmdW5jdGlvbnNcbmZ1bmN0aW9uIGVuYWJsZUxvZyhldikge1xuXHRsb2dFdmVudHMgPSBsb2dFdmVudHMgPyBmYWxzZSA6IHRydWVcbn1cblxuZnVuY3Rpb24gbG9nKHByZWZpeCwgZXYpIHtcblx0aWYgKCFsb2dFdmVudHMpIHJldHVyblxuXHRsZXQgbyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdvdXRwdXQnKVswXVxuXHRsZXQgcyA9IHByZWZpeCArICc6IHBvaW50ZXJJRCA9ICcgKyBldi5wb2ludGVySWQgKyAnIDsgcG9pbnRlclR5cGUgPSAnICsgZXYucG9pbnRlclR5cGUgKyAnIDsgaXNQcmltYXJ5ID0gJyArIGV2LmlzUHJpbWFyeVxuXHRvLmlubmVySFRNTCArPSBzICsgJyAnXG59XG5cbmZ1bmN0aW9uIGNsZWFyTG9nKGV2ZW50KSB7XG5cdGxldCBvID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ291dHB1dCcpWzBdXG5cdG8uaW5uZXJIVE1MID0gJydcbn1cbmlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcblx0ZG9jdW1lbnQuYm9keS5vbmxvYWQgPSBpbml0KClcbn1cbiIsImNvbnN0IGV2ZW50c09iamVjdCA9IHtcblx0ZXZlbnRzOiBbXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQldC20LXQvdC10LTQtdC70YzQvdGL0Lkg0L7RgtGH0LXRgiDQv9C+INGA0LDRgdGF0L7QtNCw0Lwg0YDQtdGB0YPRgNGB0L7QsicsXG5cdFx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YDRiyDQv9C+0YLRgNC10LHQu9C10L3QuNGPJyxcblx0XHRcdHRpbWU6ICcxOTowMCwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQotCw0Log0LTQtdGA0LbQsNGC0YwhINCX0LAg0L/QvtGB0LvQtdC00L3RjtGOINC90LXQtNC10LvRjiDQstGLINC/0L7RgtGA0LDRgtC40LvQuCDQvdCwIDEwJSDQvNC10L3RjNGI0LUg0YDQtdGB0YPRgNGB0L7Qsiwg0YfQtdC8INC90LXQtNC10LvQtdC5INGA0LDQvdC10LUuJyxcblx0XHRcdGljb246ICdzdGF0cycsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHR5cGU6ICdncmFwaCcsXG5cdFx0XHRcdHZhbHVlczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGVsZWN0cmljaXR5OiBbXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjg4MzIwMCcsIDExNV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjk2OTYwMCcsIDExN10sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzA1NjAwMCcsIDExNy4yXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MTQyNDAwJywgMTE4XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MjI4ODAwJywgMTIwXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MzE1MjAwJywgMTIzXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3NDAxNjAwJywgMTI5XVxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0d2F0ZXI6IFtcblx0XHRcdFx0XHRcdFx0WycxNTM2ODgzMjAwJywgNDBdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzY5Njk2MDAnLCA0MC4yXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MDU2MDAwJywgNDAuNV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzE0MjQwMCcsIDQxXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MjI4ODAwJywgNDEuNF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzMxNTIwMCcsIDQxLjldLFxuXHRcdFx0XHRcdFx0XHRbJzE1Mzc0MDE2MDAnLCA0Mi42XVxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Z2FzOiBbXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjg4MzIwMCcsIDEzXSxcblx0XHRcdFx0XHRcdFx0WycxNTM2OTY5NjAwJywgMTMuMl0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzA1NjAwMCcsIDEzLjVdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcxNDI0MDAnLCAxMy43XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MjI4ODAwJywgMTRdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzczMTUyMDAnLCAxNC4yXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3NDAxNjAwJywgMTQuNV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHRzaXplOiAnbCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JTQstC10YDRjCDQvtGC0LrRgNGL0YLQsCcsXG5cdFx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YAg0LLRhdC+0LTQvdC+0Lkg0LTQstC10YDQuCcsXG5cdFx0XHR0aW1lOiAnMTg6NTAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBudWxsLFxuXHRcdFx0aWNvbjogJ2tleScsXG5cdFx0XHRzaXplOiAncydcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0KPQsdC+0YDQutCwINC30LDQutC+0L3Rh9C10L3QsCcsXG5cdFx0XHRzb3VyY2U6ICfQn9GL0LvQtdGB0L7RgScsXG5cdFx0XHR0aW1lOiAnMTg6NDUsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBudWxsLFxuXHRcdFx0aWNvbjogJ3JvYm90LWNsZWFuZXInLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9Cd0L7QstGL0Lkg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMJyxcblx0XHRcdHNvdXJjZTogJ9Cg0L7Rg9GC0LXRgCcsXG5cdFx0XHR0aW1lOiAnMTg6NDUsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiBudWxsLFxuXHRcdFx0aWNvbjogJ3JvdXRlcicsXG5cdFx0XHRzaXplOiAncydcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JjQt9C80LXQvdC10L0g0LrQu9C40LzQsNGC0LjRh9C10YHQutC40Lkg0YDQtdC20LjQvCcsXG5cdFx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YAg0LzQuNC60YDQvtC60LvQuNC80LDRgtCwJyxcblx0XHRcdHRpbWU6ICcxODozMCwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQo9GB0YLQsNC90L7QstC70LXQvSDQutC70LjQvNCw0YLQuNGH0LXRgdC60LjQuSDRgNC10LbQuNC8IMKr0KTQuNC00LbQuMK7Jyxcblx0XHRcdGljb246ICd0aGVybWFsJyxcblx0XHRcdHNpemU6ICdtJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0dGVtcGVyYXR1cmU6IDI0LFxuXHRcdFx0XHRodW1pZGl0eTogODBcblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdjcml0aWNhbCcsXG5cdFx0XHR0aXRsZTogJ9Cd0LXQstC+0LfQvNC+0LbQvdC+INCy0LrQu9GO0YfQuNGC0Ywg0LrQvtC90LTQuNGG0LjQvtC90LXRgCcsXG5cdFx0XHRzb3VyY2U6ICfQmtC+0L3QtNC40YbQuNC+0L3QtdGAJyxcblx0XHRcdHRpbWU6ICcxODoyMSwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQkiDQutC+0LzQvdCw0YLQtSDQvtGC0LrRgNGL0YLQviDQvtC60L3Qviwg0LfQsNC60YDQvtC50YLQtSDQtdCz0L4g0Lgg0L/QvtCy0YLQvtGA0LjRgtC1INC/0L7Qv9GL0YLQutGDJyxcblx0XHRcdGljb246ICdhYycsXG5cdFx0XHRzaXplOiAnbSdcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JzRg9C30YvQutCwINCy0LrQu9GO0YfQtdC90LAnLFxuXHRcdFx0c291cmNlOiAn0K/QvdC00LXQutGBLtCh0YLQsNC90YbQuNGPJyxcblx0XHRcdHRpbWU6ICcxODoxNiwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQodC10LnRh9Cw0YEg0L/RgNC+0LjQs9GA0YvQstCw0LXRgtGB0Y86Jyxcblx0XHRcdGljb246ICdtdXNpYycsXG5cdFx0XHRzaXplOiAnbScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGFsYnVtY292ZXI6ICdodHRwczovL2F2YXRhcnMueWFuZGV4Lm5ldC9nZXQtbXVzaWMtY29udGVudC8xOTM4MjMvMTgyMGE0M2UuYS41NTE3MDU2LTEvbTEwMDB4MTAwMCcsXG5cdFx0XHRcdGFydGlzdDogJ0Zsb3JlbmNlICYgVGhlIE1hY2hpbmUnLFxuXHRcdFx0XHR0cmFjazoge1xuXHRcdFx0XHRcdG5hbWU6ICdCaWcgR29kJyxcblx0XHRcdFx0XHRsZW5ndGg6ICc0OjMxJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2b2x1bWU6IDgwXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CX0LDQutCw0L3Rh9C40LLQsNC10YLRgdGPINC80L7Qu9C+0LrQvicsXG5cdFx0XHRzb3VyY2U6ICfQpdC+0LvQvtC00LjQu9GM0L3QuNC6Jyxcblx0XHRcdHRpbWU6ICcxNzoyMywg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICfQmtCw0LbQtdGC0YHRjywg0LIg0YXQvtC70L7QtNC40LvRjNC90LjQutC1INC30LDQutCw0L3Rh9C40LLQsNC10YLRgdGPINC80L7Qu9C+0LrQvi4g0JLRiyDRhdC+0YLQuNGC0LUg0LTQvtCx0LDQstC40YLRjCDQtdCz0L4g0LIg0YHQv9C40YHQvtC6INC/0L7QutGD0L/QvtC6PycsXG5cdFx0XHRpY29uOiAnZnJpZGdlJyxcblx0XHRcdHNpemU6ICdtJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0YnV0dG9uczogWyfQlNCwJywgJ9Cd0LXRgiddXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CX0LDRgNGP0LTQutCwINC30LDQstC10YDRiNC10L3QsCcsXG5cdFx0XHRzb3VyY2U6ICfQntC60L7QvdC90YvQuSDRgdC10L3RgdC+0YAnLFxuXHRcdFx0dGltZTogJzE2OjIyLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Cj0YDQsCEg0KPRgdGC0YDQvtC50YHRgtCy0L4gwqvQntC60L7QvdC90YvQuSDRgdC10L3RgdC+0YDCuyDRgdC90L7QstCwINCyINGB0YLRgNC+0Y4hJyxcblx0XHRcdGljb246ICdiYXR0ZXJ5Jyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2NyaXRpY2FsJyxcblx0XHRcdHRpdGxlOiAn0J/Ri9C70LXRgdC+0YEg0LfQsNGB0YLRgNGP0LsnLFxuXHRcdFx0c291cmNlOiAn0KHQtdC90YHQvtGAINC00LLQuNC20LXQvdC40Y8nLFxuXHRcdFx0dGltZTogJzE2OjE3LCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Cg0L7QsdC+0L/Ri9C70LXRgdC+0YEg0L3QtSDRgdC80L7QsyDRgdC80LXQvdC40YLRjCDRgdCy0L7QtSDQvNC10YHRgtC+0L/QvtC70L7QttC10L3QuNC1INCyINGC0LXRh9C10L3QuNC1INC/0L7RgdC70LXQtNC90LjRhSAzINC80LjQvdGD0YIuINCf0L7RhdC+0LbQtSwg0LXQvNGDINC90YPQttC90LAg0L/QvtC80L7RidGMLicsXG5cdFx0XHRpY29uOiAnY2FtJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0aW1hZ2U6ICdnZXRfaXRfZnJvbV9tb2Nrc186My5qcGcnXG5cdFx0XHR9LFxuXHRcdFx0c2l6ZTogJ2wnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CS0L7QtNCwINCy0YHQutC40L/QtdC70LAnLFxuXHRcdFx0c291cmNlOiAn0KfQsNC50L3QuNC6Jyxcblx0XHRcdHRpbWU6ICcxNjoyMCwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0XHRpY29uOiAna2V0dGxlJyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH1cblx0XVxufVxuXG5jb25zdCBzbWFsbFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtdGVtcGxhdGUtLXNtYWxsJylcbmNvbnN0IG1lZGl1bVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtdGVtcGxhdGUtLW1lZGl1bScpXG5jb25zdCBsYXJnZVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtdGVtcGxhdGUtLWxhcmdlJylcblxuY29uc3QgY29udGVudFdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC13cmFwJylcblxuZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHNPYmplY3QuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdGNvbnN0IHRoaXNJdGVtID0gZXZlbnRzT2JqZWN0LmV2ZW50c1tpXVxuXG5cdC8vINCX0LDQv9C+0LvQvdC10L3QuNC1INC60LDRgNGC0L7Rh9C10Log0YHQvtC00LXRgNC20LjQvNGL0Lxcblx0c3dpdGNoICh0aGlzSXRlbS5zaXplKSB7XG5cdFx0Y2FzZSAncyc6XG5cdFx0XHRjb25zdCBzbWFsbENsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzbWFsbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gYC4vYXNzZXRzLyR7dGhpc0l0ZW0uaWNvbn0uc3ZnYFxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZVxuXG5cdFx0XHQvL9CU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0L7Rh9C60Lgg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLnR5cGUgPT09ICdjcml0aWNhbCcpIHtcblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKVxuXHRcdFx0XHRjb25zdCBzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0Y29uc3Qgc21hbGxEZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGgpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tc21hbGwnKVxuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLS1zbWFsbCcpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb25cblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChzbWFsbENsb25lKVxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdtJzpcblx0XHRcdGNvbnN0IG1lZGl1bUNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZWRpdW1UZW1wbGF0ZS5jb250ZW50LCB0cnVlKVxuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2xvZ28nKS5zcmMgPSBgLi9hc3NldHMvJHt0aGlzSXRlbS5pY29ufS5zdmdgXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3NvdXJjZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnNvdXJjZVxuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpbWUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aW1lXG5cblx0XHRcdC8v0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdoYXZlLWRlc2NyaXB0aW9uJylcblx0XHRcdFx0Y29uc3QgbWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRjb25zdCBtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaClcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tbWVkaXVtJylcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLW1lZGl1bScpXG5cdFx0XHRcdG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoLmlubmVySFRNTCA9IHRoaXNJdGVtLmRlc2NyaXB0aW9uXG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkJykuYXBwZW5kQ2hpbGQobWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhKSB7XG5cdFx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLnRlbXBlcmF0dXJlICYmIHRoaXNJdGVtLmRhdGEuaHVtaWRpdHkpIHtcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhQWlyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEnLCAnY2FyZF9fZGF0YS0tYWlyJylcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhVGVtcGVyYXR1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblx0XHRcdFx0XHRtZWRpdW1EYXRhVGVtcGVyYXR1cmUuaW5uZXJIVE1MID0gYNCi0LXQvNC/0LXRgNCw0YLRg9GA0LA6IDxiPiR7dGhpc0l0ZW0uZGF0YS50ZW1wZXJhdHVyZX0g0KE8Yj5gXG5cdFx0XHRcdFx0Y29uc3QgbWVkaXVtRGF0YUh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdFx0bWVkaXVtRGF0YUh1bWlkaXR5LmlubmVySFRNTCA9IGDQktC70LDQttC90L7RgdGC0Yw6IDxiPiR7dGhpc0l0ZW0uZGF0YS5odW1pZGl0eX0gJTxiPmBcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmFwcGVuZENoaWxkKG1lZGl1bURhdGFUZW1wZXJhdHVyZSlcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmFwcGVuZENoaWxkKG1lZGl1bURhdGFIdW1pZGl0eSlcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChtZWRpdW1EYXRhQWlyKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYnV0dG9ucykge1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdGJ1dHRvbnNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b25zLWNvbnRhaW5lcicpXG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uWWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRidXR0b25ZZXMuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b24nLCAnY2FyZF9fZGF0YS0tYnV0dG9uLXllcycpXG5cdFx0XHRcdFx0YnV0dG9uWWVzLmlubmVySFRNTCA9ICfQlNCwJ1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbk5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRidXR0b25Oby5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbicsICdjYXJkX19kYXRhLS1idXR0b24tbm8nKVxuXHRcdFx0XHRcdGJ1dHRvbk5vLmlubmVySFRNTCA9ICfQndC10YInXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25ZZXMpXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25Obylcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChidXR0b25zQ29udGFpbmVyKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYXJ0aXN0KSB7XG5cdFx0XHRcdFx0Y29uc3QgbXVzaWNQbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdG11c2ljUGxheWVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEtbXVzaWMtcGxheWVyJylcblx0XHRcdFx0XHRtdXNpY1BsYXllci5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRfX3BsYXllclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19oZWFkZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19sb2dvLWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIke3RoaXNJdGVtLmRhdGEuYWxidW1jb3Zlcn1cIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fbG9nb1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNraW5mb1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJwbGF5ZXJfX25hbWVcIj4ke3RoaXNJdGVtLmRhdGEuYXJ0aXN0fSAtICR7dGhpc0l0ZW0uZGF0YS50cmFjay5uYW1lfTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNrXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNrbGluZVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInBsYXllcl9fdGltZVwiPiR7dGhpc0l0ZW0uZGF0YS50cmFjay5sZW5ndGh9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX19jb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi9hc3NldHMvcHJldi5zdmdcIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fY29udHJvbCBwbGF5ZXJfX2NvbnRyb2wtLWxlZnRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4vYXNzZXRzL3ByZXYuc3ZnXCIgYWx0PVwiXCIgY2xhc3M9XCJwbGF5ZXJfX2NvbnRyb2wgcGxheWVyX19jb250cm9sLS1yaWdodFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3ZvbHVtZVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwicGxheWVyX192b2x1bWUtcGVyY2VudFwiPiR7dGhpc0l0ZW0uZGF0YS52b2x1bWV9ICU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+YFxuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKG11c2ljUGxheWVyKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChtZWRpdW1DbG9uZSlcblx0XHRcdGJyZWFrXG5cdFx0Y2FzZSAnbCc6XG5cdFx0XHRjb25zdCBsYXJnZUNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShsYXJnZVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gYC4vYXNzZXRzLyR7dGhpc0l0ZW0uaWNvbn0uc3ZnYFxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZVxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZVxuXG5cdFx0XHQvL9CU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0L7Rh9C60Lgg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLnR5cGUgPT09ICdjcml0aWNhbCcpIHtcblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKVxuXHRcdFx0XHRjb25zdCBsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0Y29uc3QgbGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGgpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tbGFyZ2UnKVxuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLS1sYXJnZScpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb25cblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIpXG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0LjQvdC60Lhcblx0XHRcdGxldCBsYXJnZURhdGFJbWFnZVxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEudHlwZSA9PT0gJ2dyYXBoJykge1xuXHRcdFx0XHRsYXJnZURhdGFJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2ltYWdlLWNvbnRhaW5lcicpXG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmlubmVySFRNTCA9IGA8aW1nXG5cdFx0XHRcdHNyYz1cIi4vYXNzZXRzL3JpY2hkYXRhLnN2Z1wiXG5cdFx0XHRcdGNsYXNzPVwiY2FyZF9faW1hZ2VcIj5gXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLmltYWdlKSB7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuY2xhc3NMaXN0LmFkZCgnY2FyZF9faW1hZ2UtY29udGFpbmVyJylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2Uuc2V0QXR0cmlidXRlKCdpZCcsICdob292ZXItY29udGFpbmVyJylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuaW5uZXJIVE1MID0gYDxpbWdcblx0XHRcdFx0XHRcdGNsYXNzPVwiY2FyZF9faW1hZ2VcIlxuXHRcdFx0XHRcdFx0aWQ9XCJob292ZXJcIlxuXHRcdFx0XHRcdFx0c3Jjc2V0PVwiLi9hc3NldHMvYml0bWFwLnBuZyA3Njh3LFxuXHRcdFx0XHRcdFx0Li9hc3NldHMvYml0bWFwMngucG5nIDEzNjZ3LFxuXHRcdFx0XHRcdFx0Li9hc3NldHMvYml0bWFwM3gucG5nIDE5MjB3XCJcblx0XHRcdFx0XHRcdHNyYz1cIi4vYXNzZXRzL2JpdG1hcDJ4LnBuZ1wiPmBcblx0XHRcdH1cblxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChsYXJnZURhdGFJbWFnZSlcblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKGxhcmdlQ2xvbmUpXG5cdFx0XHRicmVha1xuXHR9XG59XG4iXX0=
