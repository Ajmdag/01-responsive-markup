const smallTemplate = document.querySelector('.card-template--small')
const mediumTemplate = document.querySelector('.card-template--medium')
const largeTemplate = document.querySelector('.card-template--large')

const contentWrap = document.querySelector('.content-wrap')

// const fillCardContent = size => {
// 	switch (size) {
// 		case 's':
// 			contentWrap.appendChild(smallTemplate.content.cloneNode(true))
// 			break
// 		case 'm':
// 			contentWrap.appendChild(mediumTemplate.content.cloneNode(true))
// 			break
// 		case 'l':
// 			contentWrap.appendChild(largeTemplate.content.cloneNode(true))
// 			break
// 	}
// }

fetch('./js/data/events.json')
	.then((response) => response.json())
	.then((json) => {
		for (let i = 0; i < json.events.length; i++) {
			const thisItem = json.events[i]
			switch (thisItem.size) {
				case 's':
					smallTemplate.content.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
					smallTemplate.content.querySelector('.card__title').innerHTML = thisItem.title
					smallTemplate.content.querySelector('.card__source').innerHTML = thisItem.source
					smallTemplate.content.querySelector('.card__time').innerHTML = thisItem.time
					contentWrap.appendChild(document.importNode(smallTemplate.content, true))
					break
				case 'm':
					mediumTemplate.content.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
					mediumTemplate.content.querySelector('.card__title').innerHTML = thisItem.title
					mediumTemplate.content.querySelector('.card__source').innerHTML = thisItem.source
					mediumTemplate.content.querySelector('.card__time').innerHTML = thisItem.time
					contentWrap.appendChild(document.importNode(mediumTemplate.content, true))
					break
				case 'l':
					largeTemplate.content.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
					largeTemplate.content.querySelector('.card__title').innerHTML = thisItem.title
					largeTemplate.content.querySelector('.card__source').innerHTML = thisItem.source
					largeTemplate.content.querySelector('.card__time').innerHTML = thisItem.time
					contentWrap.appendChild(document.importNode(largeTemplate.content, true))
					break
			}
		}
	})
