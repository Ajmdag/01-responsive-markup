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
