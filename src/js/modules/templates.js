const smallTemplate = document.querySelector('.card-template--small')
const mediumTemplate = document.querySelector('.card-template--medium')
const largeTemplate = document.querySelector('.card-template--large')

const contentWrap = document.querySelector('.content-wrap')

fetch('./js/data/events.json')
	.then((response) => response.json())
	.then((json) => {
		for (let i = 0; i < json.events.length; i++) {
			switch (json.events[i].size) {
				case 's':
					contentWrap.appendChild(smallTemplate.content.cloneNode(true))
					console.log('works1')
					break
				case 'm':
					contentWrap.appendChild(mediumTemplate.content.cloneNode(true))
					console.log('works2')
					break
				case 'l':
					contentWrap.appendChild(largeTemplate.content.cloneNode(true))
					console.log('works3')
					break
			}
			switch (json.events[i].source) {
				case 'Сенсоры потребления':
					console.log('works')
					break
				case 'Сенсор входной двери':
					break
				case 'Пылесос':
					break
				case 'Роутер':
					break
				case 'Сенсор микроклимата':
					break
				case 'Кондиционер':
					break
				case 'Яндекс.Станция':
					break
				case 'Холодильник':
					break
				case 'Оконный сенсор':
					break
				case 'Сенсор движения':
					break
				case 'Вода вскипела':
					break
				default:
			}
		}
	})
