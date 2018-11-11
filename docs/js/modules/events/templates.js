(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var eventsObject = {
	events: [{
		type: 'info',
		title: 'Еженедельный отчет по расходам ресурсов',
		source: 'Сенсоры потребления',
		time: '19:00, Сегодня',
		description: 'Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.',
		icon: 'stats',
		data: {
			type: 'graph',
			values: [{
				electricity: [['1536883200', 115], ['1536969600', 117], ['1537056000', 117.2], ['1537142400', 118], ['1537228800', 120], ['1537315200', 123], ['1537401600', 129]]
			}, {
				water: [['1536883200', 40], ['1536969600', 40.2], ['1537056000', 40.5], ['1537142400', 41], ['1537228800', 41.4], ['1537315200', 41.9], ['1537401600', 42.6]]
			}, {
				gas: [['1536883200', 13], ['1536969600', 13.2], ['1537056000', 13.5], ['1537142400', 13.7], ['1537228800', 14], ['1537315200', 14.2], ['1537401600', 14.5]]
			}]
		},
		size: 'l'
	}, {
		type: 'info',
		title: 'Дверь открыта',
		source: 'Сенсор входной двери',
		time: '18:50, Сегодня',
		description: null,
		icon: 'key',
		size: 's'
	}, {
		type: 'info',
		title: 'Уборка закончена',
		source: 'Пылесос',
		time: '18:45, Сегодня',
		description: null,
		icon: 'robot-cleaner',
		size: 's'
	}, {
		type: 'info',
		title: 'Новый пользователь',
		source: 'Роутер',
		time: '18:45, Сегодня',
		description: null,
		icon: 'router',
		size: 's'
	}, {
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
	}, {
		type: 'critical',
		title: 'Невозможно включить кондиционер',
		source: 'Кондиционер',
		time: '18:21, Сегодня',
		description: 'В комнате открыто окно, закройте его и повторите попытку',
		icon: 'ac',
		size: 'm'
	}, {
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
	}, {
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
	}, {
		type: 'info',
		title: 'Зарядка завершена',
		source: 'Оконный сенсор',
		time: '16:22, Сегодня',
		description: 'Ура! Устройство «Оконный сенсор» снова в строю!',
		icon: 'battery',
		size: 's'
	}, {
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
	}, {
		type: 'info',
		title: 'Вода вскипела',
		source: 'Чайник',
		time: '16:20, Сегодня',
		description: null,
		icon: 'kettle',
		size: 's'
	}]
};

var smallTemplate = document.querySelector('.card-template--small');
var mediumTemplate = document.querySelector('.card-template--medium');
var largeTemplate = document.querySelector('.card-template--large');

var contentWrap = document.querySelector('.events-wrap');

for (var i = 0; i < eventsObject.events.length; i += 1) {
	var thisItem = eventsObject.events[i];

	// Заполнение карточек содержимым
	switch (thisItem.size) {
		case 's':
			var smallClone = document.importNode(smallTemplate.content, true);
			smallClone.querySelector('.card__logo').src = './assets/' + thisItem.icon + '.svg';
			smallClone.querySelector('.card__title').innerHTML = thisItem.title;
			smallClone.querySelector('.card__source').innerHTML = thisItem.source;
			smallClone.querySelector('.card__time').innerHTML = thisItem.time;

			// Добавление карточки предупреждения
			if (thisItem.type === 'critical') {
				smallClone.querySelector('.card__header-wrap').classList.add('critical');
			}

			// Добавление описания
			if (thisItem.description) {
				smallClone.querySelector('.card__header-wrap').classList.add('have-description');
				var smallDescriptionContainer = document.createElement('div');
				var smallDescriptionParagraph = document.createElement('p');
				smallDescriptionContainer.appendChild(smallDescriptionParagraph);
				smallDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--small');
				smallDescriptionContainer.classList.add('card__description', 'card__description--small');
				smallDescriptionParagraph.innerHTML = thisItem.description;
				smallClone.querySelector('.card').appendChild(smallDescriptionContainer);
			}
			contentWrap.appendChild(smallClone);
			break;
		case 'm':
			var mediumClone = document.importNode(mediumTemplate.content, true);
			mediumClone.querySelector('.card__logo').src = './assets/' + thisItem.icon + '.svg';
			mediumClone.querySelector('.card__title').innerHTML = thisItem.title;
			mediumClone.querySelector('.card__source').innerHTML = thisItem.source;
			mediumClone.querySelector('.card__time').innerHTML = thisItem.time;

			// Добавление карточки предупреждения
			if (thisItem.type === 'critical') {
				mediumClone.querySelector('.card__header-wrap').classList.add('critical');
			}

			// Добавление описания
			if (thisItem.description) {
				mediumClone.querySelector('.card__header-wrap').classList.add('have-description');
				var mediumDescriptionContainer = document.createElement('div');
				var mediumDescriptionParagraph = document.createElement('p');
				mediumDescriptionContainer.appendChild(mediumDescriptionParagraph);
				mediumDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--medium');
				mediumDescriptionContainer.classList.add('card__description', 'card__description--medium');
				mediumDescriptionParagraph.innerHTML = thisItem.description;
				mediumClone.querySelector('.card').appendChild(mediumDescriptionContainer);
			}

			if (thisItem.data) {
				if (thisItem.data.temperature && thisItem.data.humidity) {
					var mediumDataAir = document.createElement('div');
					mediumDataAir.classList.add('card__data', 'card__data--air');
					var mediumDataTemperature = document.createElement('p');
					mediumDataTemperature.innerHTML = '\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: <b>' + thisItem.data.temperature + ' \u0421<b>';
					var mediumDataHumidity = document.createElement('p');
					mediumDataHumidity.innerHTML = '\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C: <b>' + thisItem.data.humidity + ' %<b>';
					mediumDataAir.appendChild(mediumDataTemperature);
					mediumDataAir.appendChild(mediumDataHumidity);
					mediumClone.querySelector('.card__description').appendChild(mediumDataAir);
				}

				if (thisItem.data.buttons) {
					var buttonsContainer = document.createElement('div');
					buttonsContainer.classList.add('card__data-buttons-container');
					var buttonYes = document.createElement('div');
					buttonYes.classList.add('card__data-button', 'card__data--button-yes');
					buttonYes.innerHTML = 'Да';
					var buttonNo = document.createElement('div');
					buttonNo.classList.add('card__data-button', 'card__data--button-no');
					buttonNo.innerHTML = 'Нет';
					buttonsContainer.appendChild(buttonYes);
					buttonsContainer.appendChild(buttonNo);
					mediumClone.querySelector('.card__description').appendChild(buttonsContainer);
				}

				if (thisItem.data.artist) {
					var musicPlayer = document.createElement('div');
					musicPlayer.classList.add('card__data-music-player');
					musicPlayer.innerHTML = '\n\t\t\t\t\t\t\t\t<div class="card__player">\n\t\t\t\t\t\t\t\t\t<div class="player">\n\t\t\t\t\t\t\t\t\t\t<div class="player__header">\n\t\t\t\t\t\t\t\t\t\t\t<div class="player__logo-container">\n\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + thisItem.data.albumcover + '" alt="" class="player__logo">\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class="player__trackinfo">\n\t\t\t\t\t\t\t\t\t\t\t\t<p class="player__name">' + thisItem.data.artist + ' - ' + thisItem.data.track.name + '</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="player__track">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="player__trackline"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class="player__time">' + thisItem.data.track.length + '</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class="player__controls">\n\t\t\t\t\t\t\t\t\t\t\t<img src="./assets/prev.svg" alt="" class="player__control player__control--left">\n\t\t\t\t\t\t\t\t\t\t\t<img src="./assets/prev.svg" alt="" class="player__control player__control--right">\n\t\t\t\t\t\t\t\t\t\t\t<div class="player__volume"></div>\n\t\t\t\t\t\t\t\t\t\t\t<p class="player__volume-percent">' + thisItem.data.volume + ' %</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>';
					mediumClone.querySelector('.card__description').appendChild(musicPlayer);
				}
			}
			contentWrap.appendChild(mediumClone);
			break;
		case 'l':
			var largeClone = document.importNode(largeTemplate.content, true);
			largeClone.querySelector('.card__logo').src = './assets/' + thisItem.icon + '.svg';
			largeClone.querySelector('.card__title').innerHTML = thisItem.title;
			largeClone.querySelector('.card__source').innerHTML = thisItem.source;
			largeClone.querySelector('.card__time').innerHTML = thisItem.time;

			// Добавление карточки предупреждения
			if (thisItem.type === 'critical') {
				largeClone.querySelector('.card__header-wrap').classList.add('critical');
			}

			// Добавление описания
			if (thisItem.description) {
				largeClone.querySelector('.card__header-wrap').classList.add('have-description');
				var largeDescriptionContainer = document.createElement('div');
				var largeDescriptionParagraph = document.createElement('p');
				largeDescriptionContainer.appendChild(largeDescriptionParagraph);
				largeDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--large');
				largeDescriptionContainer.classList.add('card__description', 'card__description--large');
				largeDescriptionParagraph.innerHTML = thisItem.description;
				largeClone.querySelector('.card').appendChild(largeDescriptionContainer);
			}

			// Добавление картинки
			var largeDataImage = void 0;
			if (thisItem.data.type === 'graph') {
				largeDataImage = document.createElement('div');
				largeDataImage.classList.add('card__image-container');
				largeDataImage.innerHTML = '<img\n\t\t\t\tsrc="./assets/richdata.svg"\n\t\t\t\tclass="card__image">';
			}

			if (thisItem.data.image) {
				largeDataImage = document.createElement('div');
				largeDataImage.classList.add('card__image-container');
				largeDataImage.setAttribute('id', 'hoover-container');
				largeDataImage.innerHTML = '<img\n\t\t\t\t\t\tclass="card__image"\n\t\t\t\t\t\tid="hoover"\n\t\t\t\t\t\ttouch-action="none"\n\t\t\t\t\t\tstyle="touch-action: none;"\n\t\t\t\t\t\tsrcset="./assets/bitmap.png 768w,\n\t\t\t\t\t\t./assets/bitmap2x.png 1366w,\n\t\t\t\t\t\t./assets/bitmap3x.png 1920w"\n\t\t\t\t\t\tsrc="./assets/bitmap2x.png">';
			}

			largeClone.querySelector('.card__description').appendChild(largeDataImage);
			contentWrap.appendChild(largeClone);
			break;
		default:
			console.error('Unexpected size of card');
	}
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvMDEtcmVzcG9uc2l2ZS1tYXJrdXAvc3JjL2pzL2Zha2VfNzJlMjU3OTAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBldmVudHNPYmplY3QgPSB7XG5cdGV2ZW50czogW3tcblx0XHR0eXBlOiAnaW5mbycsXG5cdFx0dGl0bGU6ICfQldC20LXQvdC10LTQtdC70YzQvdGL0Lkg0L7RgtGH0LXRgiDQv9C+INGA0LDRgdGF0L7QtNCw0Lwg0YDQtdGB0YPRgNGB0L7QsicsXG5cdFx0c291cmNlOiAn0KHQtdC90YHQvtGA0Ysg0L/QvtGC0YDQtdCx0LvQtdC90LjRjycsXG5cdFx0dGltZTogJzE5OjAwLCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246ICfQotCw0Log0LTQtdGA0LbQsNGC0YwhINCX0LAg0L/QvtGB0LvQtdC00L3RjtGOINC90LXQtNC10LvRjiDQstGLINC/0L7RgtGA0LDRgtC40LvQuCDQvdCwIDEwJSDQvNC10L3RjNGI0LUg0YDQtdGB0YPRgNGB0L7Qsiwg0YfQtdC8INC90LXQtNC10LvQtdC5INGA0LDQvdC10LUuJyxcblx0XHRpY29uOiAnc3RhdHMnLFxuXHRcdGRhdGE6IHtcblx0XHRcdHR5cGU6ICdncmFwaCcsXG5cdFx0XHR2YWx1ZXM6IFt7XG5cdFx0XHRcdGVsZWN0cmljaXR5OiBbWycxNTM2ODgzMjAwJywgMTE1XSwgWycxNTM2OTY5NjAwJywgMTE3XSwgWycxNTM3MDU2MDAwJywgMTE3LjJdLCBbJzE1MzcxNDI0MDAnLCAxMThdLCBbJzE1MzcyMjg4MDAnLCAxMjBdLCBbJzE1MzczMTUyMDAnLCAxMjNdLCBbJzE1Mzc0MDE2MDAnLCAxMjldXVxuXHRcdFx0fSwge1xuXHRcdFx0XHR3YXRlcjogW1snMTUzNjg4MzIwMCcsIDQwXSwgWycxNTM2OTY5NjAwJywgNDAuMl0sIFsnMTUzNzA1NjAwMCcsIDQwLjVdLCBbJzE1MzcxNDI0MDAnLCA0MV0sIFsnMTUzNzIyODgwMCcsIDQxLjRdLCBbJzE1MzczMTUyMDAnLCA0MS45XSwgWycxNTM3NDAxNjAwJywgNDIuNl1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGdhczogW1snMTUzNjg4MzIwMCcsIDEzXSwgWycxNTM2OTY5NjAwJywgMTMuMl0sIFsnMTUzNzA1NjAwMCcsIDEzLjVdLCBbJzE1MzcxNDI0MDAnLCAxMy43XSwgWycxNTM3MjI4ODAwJywgMTRdLCBbJzE1MzczMTUyMDAnLCAxNC4yXSwgWycxNTM3NDAxNjAwJywgMTQuNV1dXG5cdFx0XHR9XVxuXHRcdH0sXG5cdFx0c2l6ZTogJ2wnXG5cdH0sIHtcblx0XHR0eXBlOiAnaW5mbycsXG5cdFx0dGl0bGU6ICfQlNCy0LXRgNGMINC+0YLQutGA0YvRgtCwJyxcblx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YAg0LLRhdC+0LTQvdC+0Lkg0LTQstC10YDQuCcsXG5cdFx0dGltZTogJzE4OjUwLCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0aWNvbjogJ2tleScsXG5cdFx0c2l6ZTogJ3MnXG5cdH0sIHtcblx0XHR0eXBlOiAnaW5mbycsXG5cdFx0dGl0bGU6ICfQo9Cx0L7RgNC60LAg0LfQsNC60L7QvdGH0LXQvdCwJyxcblx0XHRzb3VyY2U6ICfQn9GL0LvQtdGB0L7RgScsXG5cdFx0dGltZTogJzE4OjQ1LCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0aWNvbjogJ3JvYm90LWNsZWFuZXInLFxuXHRcdHNpemU6ICdzJ1xuXHR9LCB7XG5cdFx0dHlwZTogJ2luZm8nLFxuXHRcdHRpdGxlOiAn0J3QvtCy0YvQuSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxuXHRcdHNvdXJjZTogJ9Cg0L7Rg9GC0LXRgCcsXG5cdFx0dGltZTogJzE4OjQ1LCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0aWNvbjogJ3JvdXRlcicsXG5cdFx0c2l6ZTogJ3MnXG5cdH0sIHtcblx0XHR0eXBlOiAnaW5mbycsXG5cdFx0dGl0bGU6ICfQmNC30LzQtdC90LXQvSDQutC70LjQvNCw0YLQuNGH0LXRgdC60LjQuSDRgNC10LbQuNC8Jyxcblx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YAg0LzQuNC60YDQvtC60LvQuNC80LDRgtCwJyxcblx0XHR0aW1lOiAnMTg6MzAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogJ9Cj0YHRgtCw0L3QvtCy0LvQtdC9INC60LvQuNC80LDRgtC40YfQtdGB0LrQuNC5INGA0LXQttC40LwgwqvQpNC40LTQttC4wrsnLFxuXHRcdGljb246ICd0aGVybWFsJyxcblx0XHRzaXplOiAnbScsXG5cdFx0ZGF0YToge1xuXHRcdFx0dGVtcGVyYXR1cmU6IDI0LFxuXHRcdFx0aHVtaWRpdHk6IDgwXG5cdFx0fVxuXHR9LCB7XG5cdFx0dHlwZTogJ2NyaXRpY2FsJyxcblx0XHR0aXRsZTogJ9Cd0LXQstC+0LfQvNC+0LbQvdC+INCy0LrQu9GO0YfQuNGC0Ywg0LrQvtC90LTQuNGG0LjQvtC90LXRgCcsXG5cdFx0c291cmNlOiAn0JrQvtC90LTQuNGG0LjQvtC90LXRgCcsXG5cdFx0dGltZTogJzE4OjIxLCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246ICfQkiDQutC+0LzQvdCw0YLQtSDQvtGC0LrRgNGL0YLQviDQvtC60L3Qviwg0LfQsNC60YDQvtC50YLQtSDQtdCz0L4g0Lgg0L/QvtCy0YLQvtGA0LjRgtC1INC/0L7Qv9GL0YLQutGDJyxcblx0XHRpY29uOiAnYWMnLFxuXHRcdHNpemU6ICdtJ1xuXHR9LCB7XG5cdFx0dHlwZTogJ2luZm8nLFxuXHRcdHRpdGxlOiAn0JzRg9C30YvQutCwINCy0LrQu9GO0YfQtdC90LAnLFxuXHRcdHNvdXJjZTogJ9Cv0L3QtNC10LrRgS7QodGC0LDQvdGG0LjRjycsXG5cdFx0dGltZTogJzE4OjE2LCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246ICfQodC10LnRh9Cw0YEg0L/RgNC+0LjQs9GA0YvQstCw0LXRgtGB0Y86Jyxcblx0XHRpY29uOiAnbXVzaWMnLFxuXHRcdHNpemU6ICdtJyxcblx0XHRkYXRhOiB7XG5cdFx0XHRhbGJ1bWNvdmVyOiAnaHR0cHM6Ly9hdmF0YXJzLnlhbmRleC5uZXQvZ2V0LW11c2ljLWNvbnRlbnQvMTkzODIzLzE4MjBhNDNlLmEuNTUxNzA1Ni0xL20xMDAweDEwMDAnLFxuXHRcdFx0YXJ0aXN0OiAnRmxvcmVuY2UgJiBUaGUgTWFjaGluZScsXG5cdFx0XHR0cmFjazoge1xuXHRcdFx0XHRuYW1lOiAnQmlnIEdvZCcsXG5cdFx0XHRcdGxlbmd0aDogJzQ6MzEnXG5cdFx0XHR9LFxuXHRcdFx0dm9sdW1lOiA4MFxuXHRcdH1cblx0fSwge1xuXHRcdHR5cGU6ICdpbmZvJyxcblx0XHR0aXRsZTogJ9CX0LDQutCw0L3Rh9C40LLQsNC10YLRgdGPINC80L7Qu9C+0LrQvicsXG5cdFx0c291cmNlOiAn0KXQvtC70L7QtNC40LvRjNC90LjQuicsXG5cdFx0dGltZTogJzE3OjIzLCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246ICfQmtCw0LbQtdGC0YHRjywg0LIg0YXQvtC70L7QtNC40LvRjNC90LjQutC1INC30LDQutCw0L3Rh9C40LLQsNC10YLRgdGPINC80L7Qu9C+0LrQvi4g0JLRiyDRhdC+0YLQuNGC0LUg0LTQvtCx0LDQstC40YLRjCDQtdCz0L4g0LIg0YHQv9C40YHQvtC6INC/0L7QutGD0L/QvtC6PycsXG5cdFx0aWNvbjogJ2ZyaWRnZScsXG5cdFx0c2l6ZTogJ20nLFxuXHRcdGRhdGE6IHtcblx0XHRcdGJ1dHRvbnM6IFsn0JTQsCcsICfQndC10YInXVxuXHRcdH1cblx0fSwge1xuXHRcdHR5cGU6ICdpbmZvJyxcblx0XHR0aXRsZTogJ9CX0LDRgNGP0LTQutCwINC30LDQstC10YDRiNC10L3QsCcsXG5cdFx0c291cmNlOiAn0J7QutC+0L3QvdGL0Lkg0YHQtdC90YHQvtGAJyxcblx0XHR0aW1lOiAnMTY6MjIsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogJ9Cj0YDQsCEg0KPRgdGC0YDQvtC50YHRgtCy0L4gwqvQntC60L7QvdC90YvQuSDRgdC10L3RgdC+0YDCuyDRgdC90L7QstCwINCyINGB0YLRgNC+0Y4hJyxcblx0XHRpY29uOiAnYmF0dGVyeScsXG5cdFx0c2l6ZTogJ3MnXG5cdH0sIHtcblx0XHR0eXBlOiAnY3JpdGljYWwnLFxuXHRcdHRpdGxlOiAn0J/Ri9C70LXRgdC+0YEg0LfQsNGB0YLRgNGP0LsnLFxuXHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQtNCy0LjQttC10L3QuNGPJyxcblx0XHR0aW1lOiAnMTY6MTcsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogJ9Cg0L7QsdC+0L/Ri9C70LXRgdC+0YEg0L3QtSDRgdC80L7QsyDRgdC80LXQvdC40YLRjCDRgdCy0L7QtSDQvNC10YHRgtC+0L/QvtC70L7QttC10L3QuNC1INCyINGC0LXRh9C10L3QuNC1INC/0L7RgdC70LXQtNC90LjRhSAzINC80LjQvdGD0YIuINCf0L7RhdC+0LbQtSwg0LXQvNGDINC90YPQttC90LAg0L/QvtC80L7RidGMLicsXG5cdFx0aWNvbjogJ2NhbScsXG5cdFx0ZGF0YToge1xuXHRcdFx0aW1hZ2U6ICdnZXRfaXRfZnJvbV9tb2Nrc186My5qcGcnXG5cdFx0fSxcblx0XHRzaXplOiAnbCdcblx0fSwge1xuXHRcdHR5cGU6ICdpbmZvJyxcblx0XHR0aXRsZTogJ9CS0L7QtNCwINCy0YHQutC40L/QtdC70LAnLFxuXHRcdHNvdXJjZTogJ9Cn0LDQudC90LjQuicsXG5cdFx0dGltZTogJzE2OjIwLCDQodC10LPQvtC00L3RjycsXG5cdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0aWNvbjogJ2tldHRsZScsXG5cdFx0c2l6ZTogJ3MnXG5cdH1dXG59O1xuXG52YXIgc21hbGxUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1zbWFsbCcpO1xudmFyIG1lZGl1bVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtdGVtcGxhdGUtLW1lZGl1bScpO1xudmFyIGxhcmdlVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tbGFyZ2UnKTtcblxudmFyIGNvbnRlbnRXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cy13cmFwJyk7XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzT2JqZWN0LmV2ZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuXHR2YXIgdGhpc0l0ZW0gPSBldmVudHNPYmplY3QuZXZlbnRzW2ldO1xuXG5cdC8vINCX0LDQv9C+0LvQvdC10L3QuNC1INC60LDRgNGC0L7Rh9C10Log0YHQvtC00LXRgNC20LjQvNGL0Lxcblx0c3dpdGNoICh0aGlzSXRlbS5zaXplKSB7XG5cdFx0Y2FzZSAncyc6XG5cdFx0XHR2YXIgc21hbGxDbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUoc21hbGxUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2xvZ28nKS5zcmMgPSAnLi9hc3NldHMvJyArIHRoaXNJdGVtLmljb24gKyAnLnN2Zyc7XG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aXRsZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpdGxlO1xuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlO1xuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGltZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpbWU7XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0L7Rh9C60Lgg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLnR5cGUgPT09ICdjcml0aWNhbCcpIHtcblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQvtC/0LjRgdCw0L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0uZGVzY3JpcHRpb24pIHtcblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdoYXZlLWRlc2NyaXB0aW9uJyk7XG5cdFx0XHRcdHZhciBzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHZhciBzbWFsbERlc2NyaXB0aW9uUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGgpO1xuXHRcdFx0XHRzbWFsbERlc2NyaXB0aW9uUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaCcsICdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgtLXNtYWxsJyk7XG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLXNtYWxsJyk7XG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb247XG5cdFx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmQnKS5hcHBlbmRDaGlsZChzbWFsbERlc2NyaXB0aW9uQ29udGFpbmVyKTtcblx0XHRcdH1cblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKHNtYWxsQ2xvbmUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnbSc6XG5cdFx0XHR2YXIgbWVkaXVtQ2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lZGl1bVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2xvZ28nKS5zcmMgPSAnLi9hc3NldHMvJyArIHRoaXNJdGVtLmljb24gKyAnLnN2Zyc7XG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZTtcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19zb3VyY2UnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS5zb3VyY2U7XG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGltZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpbWU7XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0L7Rh9C60Lgg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLnR5cGUgPT09ICdjcml0aWNhbCcpIHtcblx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7Qv9C40YHQsNC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKTtcblx0XHRcdFx0dmFyIG1lZGl1bURlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHZhciBtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQobWVkaXVtRGVzY3JpcHRpb25QYXJhZ3JhcGgpO1xuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgnLCAnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoLS1tZWRpdW0nKTtcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLW1lZGl1bScpO1xuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaC5pbm5lckhUTUwgPSB0aGlzSXRlbS5kZXNjcmlwdGlvbjtcblx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmQnKS5hcHBlbmRDaGlsZChtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lcik7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhKSB7XG5cdFx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLnRlbXBlcmF0dXJlICYmIHRoaXNJdGVtLmRhdGEuaHVtaWRpdHkpIHtcblx0XHRcdFx0XHR2YXIgbWVkaXVtRGF0YUFpciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YScsICdjYXJkX19kYXRhLS1haXInKTtcblx0XHRcdFx0XHR2YXIgbWVkaXVtRGF0YVRlbXBlcmF0dXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdFx0XHRcdG1lZGl1bURhdGFUZW1wZXJhdHVyZS5pbm5lckhUTUwgPSAnXFx1MDQyMlxcdTA0MzVcXHUwNDNDXFx1MDQzRlxcdTA0MzVcXHUwNDQwXFx1MDQzMFxcdTA0NDJcXHUwNDQzXFx1MDQ0MFxcdTA0MzA6IDxiPicgKyB0aGlzSXRlbS5kYXRhLnRlbXBlcmF0dXJlICsgJyBcXHUwNDIxPGI+Jztcblx0XHRcdFx0XHR2YXIgbWVkaXVtRGF0YUh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdFx0XHRcdG1lZGl1bURhdGFIdW1pZGl0eS5pbm5lckhUTUwgPSAnXFx1MDQxMlxcdTA0M0JcXHUwNDMwXFx1MDQzNlxcdTA0M0RcXHUwNDNFXFx1MDQ0MVxcdTA0NDJcXHUwNDRDOiA8Yj4nICsgdGhpc0l0ZW0uZGF0YS5odW1pZGl0eSArICcgJTxiPic7XG5cdFx0XHRcdFx0bWVkaXVtRGF0YUFpci5hcHBlbmRDaGlsZChtZWRpdW1EYXRhVGVtcGVyYXR1cmUpO1xuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuYXBwZW5kQ2hpbGQobWVkaXVtRGF0YUh1bWlkaXR5KTtcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChtZWRpdW1EYXRhQWlyKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLmJ1dHRvbnMpIHtcblx0XHRcdFx0XHR2YXIgYnV0dG9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRcdGJ1dHRvbnNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b25zLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRcdHZhciBidXR0b25ZZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0XHRidXR0b25ZZXMuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b24nLCAnY2FyZF9fZGF0YS0tYnV0dG9uLXllcycpO1xuXHRcdFx0XHRcdGJ1dHRvblllcy5pbm5lckhUTUwgPSAn0JTQsCc7XG5cdFx0XHRcdFx0dmFyIGJ1dHRvbk5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdFx0YnV0dG9uTm8uY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1idXR0b24nLCAnY2FyZF9fZGF0YS0tYnV0dG9uLW5vJyk7XG5cdFx0XHRcdFx0YnV0dG9uTm8uaW5uZXJIVE1MID0gJ9Cd0LXRgic7XG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25ZZXMpO1xuXHRcdFx0XHRcdGJ1dHRvbnNDb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uTm8pO1xuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKGJ1dHRvbnNDb250YWluZXIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYXJ0aXN0KSB7XG5cdFx0XHRcdFx0dmFyIG11c2ljUGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdFx0bXVzaWNQbGF5ZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1tdXNpYy1wbGF5ZXInKTtcblx0XHRcdFx0XHRtdXNpY1BsYXllci5pbm5lckhUTUwgPSAnXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImNhcmRfX3BsYXllclwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJwbGF5ZXJcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwicGxheWVyX19oZWFkZXJcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwicGxheWVyX19sb2dvLWNvbnRhaW5lclwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxpbWcgc3JjPVwiJyArIHRoaXNJdGVtLmRhdGEuYWxidW1jb3ZlciArICdcIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fbG9nb1wiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNraW5mb1wiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxwIGNsYXNzPVwicGxheWVyX19uYW1lXCI+JyArIHRoaXNJdGVtLmRhdGEuYXJ0aXN0ICsgJyAtICcgKyB0aGlzSXRlbS5kYXRhLnRyYWNrLm5hbWUgKyAnPC9wPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX3RyYWNrXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tsaW5lXCI+PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHAgY2xhc3M9XCJwbGF5ZXJfX3RpbWVcIj4nICsgdGhpc0l0ZW0uZGF0YS50cmFjay5sZW5ndGggKyAnPC9wPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2NvbnRyb2xzXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9wcmV2LnN2Z1wiIGFsdD1cIlwiIGNsYXNzPVwicGxheWVyX19jb250cm9sIHBsYXllcl9fY29udHJvbC0tbGVmdFwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxpbWcgc3JjPVwiLi9hc3NldHMvcHJldi5zdmdcIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fY29udHJvbCBwbGF5ZXJfX2NvbnRyb2wtLXJpZ2h0XCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdm9sdW1lXCI+PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHAgY2xhc3M9XCJwbGF5ZXJfX3ZvbHVtZS1wZXJjZW50XCI+JyArIHRoaXNJdGVtLmRhdGEudm9sdW1lICsgJyAlPC9wPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2Pic7XG5cdFx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2Rlc2NyaXB0aW9uJykuYXBwZW5kQ2hpbGQobXVzaWNQbGF5ZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChtZWRpdW1DbG9uZSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdsJzpcblx0XHRcdHZhciBsYXJnZUNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShsYXJnZVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fbG9nbycpLnNyYyA9ICcuL2Fzc2V0cy8nICsgdGhpc0l0ZW0uaWNvbiArICcuc3ZnJztcblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpdGxlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGl0bGU7XG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19zb3VyY2UnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS5zb3VyY2U7XG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZTtcblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKTtcblx0XHRcdFx0dmFyIGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0dmFyIGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQobGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaCk7XG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tbGFyZ2UnKTtcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbicsICdjYXJkX19kZXNjcmlwdGlvbi0tbGFyZ2UnKTtcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaC5pbm5lckhUTUwgPSB0aGlzSXRlbS5kZXNjcmlwdGlvbjtcblx0XHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQutCw0YDRgtC40L3QutC4XG5cdFx0XHR2YXIgbGFyZ2VEYXRhSW1hZ2UgPSB2b2lkIDA7XG5cdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS50eXBlID09PSAnZ3JhcGgnKSB7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2ltYWdlLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRsYXJnZURhdGFJbWFnZS5pbm5lckhUTUwgPSAnPGltZ1xcblxcdFxcdFxcdFxcdHNyYz1cIi4vYXNzZXRzL3JpY2hkYXRhLnN2Z1wiXFxuXFx0XFx0XFx0XFx0Y2xhc3M9XCJjYXJkX19pbWFnZVwiPic7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLmltYWdlKSB7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2ltYWdlLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRsYXJnZURhdGFJbWFnZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2hvb3Zlci1jb250YWluZXInKTtcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuaW5uZXJIVE1MID0gJzxpbWdcXG5cXHRcXHRcXHRcXHRcXHRcXHRjbGFzcz1cImNhcmRfX2ltYWdlXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRpZD1cImhvb3ZlclwiXFxuXFx0XFx0XFx0XFx0XFx0XFx0dG91Y2gtYWN0aW9uPVwibm9uZVwiXFxuXFx0XFx0XFx0XFx0XFx0XFx0c3R5bGU9XCJ0b3VjaC1hY3Rpb246IG5vbmU7XCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRzcmNzZXQ9XCIuL2Fzc2V0cy9iaXRtYXAucG5nIDc2OHcsXFxuXFx0XFx0XFx0XFx0XFx0XFx0Li9hc3NldHMvYml0bWFwMngucG5nIDEzNjZ3LFxcblxcdFxcdFxcdFxcdFxcdFxcdC4vYXNzZXRzL2JpdG1hcDN4LnBuZyAxOTIwd1wiXFxuXFx0XFx0XFx0XFx0XFx0XFx0c3JjPVwiLi9hc3NldHMvYml0bWFwMngucG5nXCI+Jztcblx0XHRcdH1cblxuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChsYXJnZURhdGFJbWFnZSk7XG5cdFx0XHRjb250ZW50V3JhcC5hcHBlbmRDaGlsZChsYXJnZUNsb25lKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIHNpemUgb2YgY2FyZCcpO1xuXHR9XG59Il19
