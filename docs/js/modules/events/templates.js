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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91c2VyL1Byb2plY3RzLzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV9iMGZmYjFiMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV2ZW50c09iamVjdCA9IHtcblx0ZXZlbnRzOiBbe1xuXHRcdHR5cGU6ICdpbmZvJyxcblx0XHR0aXRsZTogJ9CV0LbQtdC90LXQtNC10LvRjNC90YvQuSDQvtGC0YfQtdGCINC/0L4g0YDQsNGB0YXQvtC00LDQvCDRgNC10YHRg9GA0YHQvtCyJyxcblx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YDRiyDQv9C+0YLRgNC10LHQu9C10L3QuNGPJyxcblx0XHR0aW1lOiAnMTk6MDAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogJ9Ci0LDQuiDQtNC10YDQttCw0YLRjCEg0JfQsCDQv9C+0YHQu9C10LTQvdGO0Y4g0L3QtdC00LXQu9GOINCy0Ysg0L/QvtGC0YDQsNGC0LjQu9C4INC90LAgMTAlINC80LXQvdGM0YjQtSDRgNC10YHRg9GA0YHQvtCyLCDRh9C10Lwg0L3QtdC00LXQu9C10Lkg0YDQsNC90LXQtS4nLFxuXHRcdGljb246ICdzdGF0cycsXG5cdFx0ZGF0YToge1xuXHRcdFx0dHlwZTogJ2dyYXBoJyxcblx0XHRcdHZhbHVlczogW3tcblx0XHRcdFx0ZWxlY3RyaWNpdHk6IFtbJzE1MzY4ODMyMDAnLCAxMTVdLCBbJzE1MzY5Njk2MDAnLCAxMTddLCBbJzE1MzcwNTYwMDAnLCAxMTcuMl0sIFsnMTUzNzE0MjQwMCcsIDExOF0sIFsnMTUzNzIyODgwMCcsIDEyMF0sIFsnMTUzNzMxNTIwMCcsIDEyM10sIFsnMTUzNzQwMTYwMCcsIDEyOV1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHdhdGVyOiBbWycxNTM2ODgzMjAwJywgNDBdLCBbJzE1MzY5Njk2MDAnLCA0MC4yXSwgWycxNTM3MDU2MDAwJywgNDAuNV0sIFsnMTUzNzE0MjQwMCcsIDQxXSwgWycxNTM3MjI4ODAwJywgNDEuNF0sIFsnMTUzNzMxNTIwMCcsIDQxLjldLCBbJzE1Mzc0MDE2MDAnLCA0Mi42XV1cblx0XHRcdH0sIHtcblx0XHRcdFx0Z2FzOiBbWycxNTM2ODgzMjAwJywgMTNdLCBbJzE1MzY5Njk2MDAnLCAxMy4yXSwgWycxNTM3MDU2MDAwJywgMTMuNV0sIFsnMTUzNzE0MjQwMCcsIDEzLjddLCBbJzE1MzcyMjg4MDAnLCAxNF0sIFsnMTUzNzMxNTIwMCcsIDE0LjJdLCBbJzE1Mzc0MDE2MDAnLCAxNC41XV1cblx0XHRcdH1dXG5cdFx0fSxcblx0XHRzaXplOiAnbCdcblx0fSwge1xuXHRcdHR5cGU6ICdpbmZvJyxcblx0XHR0aXRsZTogJ9CU0LLQtdGA0Ywg0L7RgtC60YDRi9GC0LAnLFxuXHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQstGF0L7QtNC90L7QuSDQtNCy0LXRgNC4Jyxcblx0XHR0aW1lOiAnMTg6NTAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRpY29uOiAna2V5Jyxcblx0XHRzaXplOiAncydcblx0fSwge1xuXHRcdHR5cGU6ICdpbmZvJyxcblx0XHR0aXRsZTogJ9Cj0LHQvtGA0LrQsCDQt9Cw0LrQvtC90YfQtdC90LAnLFxuXHRcdHNvdXJjZTogJ9Cf0YvQu9C10YHQvtGBJyxcblx0XHR0aW1lOiAnMTg6NDUsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRpY29uOiAncm9ib3QtY2xlYW5lcicsXG5cdFx0c2l6ZTogJ3MnXG5cdH0sIHtcblx0XHR0eXBlOiAnaW5mbycsXG5cdFx0dGl0bGU6ICfQndC+0LLRi9C5INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCcsXG5cdFx0c291cmNlOiAn0KDQvtGD0YLQtdGAJyxcblx0XHR0aW1lOiAnMTg6NDUsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRpY29uOiAncm91dGVyJyxcblx0XHRzaXplOiAncydcblx0fSwge1xuXHRcdHR5cGU6ICdpbmZvJyxcblx0XHR0aXRsZTogJ9CY0LfQvNC10L3QtdC9INC60LvQuNC80LDRgtC40YfQtdGB0LrQuNC5INGA0LXQttC40LwnLFxuXHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQvNC40LrRgNC+0LrQu9C40LzQsNGC0LAnLFxuXHRcdHRpbWU6ICcxODozMCwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdGRlc2NyaXB0aW9uOiAn0KPRgdGC0LDQvdC+0LLQu9C10L0g0LrQu9C40LzQsNGC0LjRh9C10YHQutC40Lkg0YDQtdC20LjQvCDCq9Ck0LjQtNC20LjCuycsXG5cdFx0aWNvbjogJ3RoZXJtYWwnLFxuXHRcdHNpemU6ICdtJyxcblx0XHRkYXRhOiB7XG5cdFx0XHR0ZW1wZXJhdHVyZTogMjQsXG5cdFx0XHRodW1pZGl0eTogODBcblx0XHR9XG5cdH0sIHtcblx0XHR0eXBlOiAnY3JpdGljYWwnLFxuXHRcdHRpdGxlOiAn0J3QtdCy0L7Qt9C80L7QttC90L4g0LLQutC70Y7Rh9C40YLRjCDQutC+0L3QtNC40YbQuNC+0L3QtdGAJyxcblx0XHRzb3VyY2U6ICfQmtC+0L3QtNC40YbQuNC+0L3QtdGAJyxcblx0XHR0aW1lOiAnMTg6MjEsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogJ9CSINC60L7QvNC90LDRgtC1INC+0YLQutGA0YvRgtC+INC+0LrQvdC+LCDQt9Cw0LrRgNC+0LnRgtC1INC10LPQviDQuCDQv9C+0LLRgtC+0YDQuNGC0LUg0L/QvtC/0YvRgtC60YMnLFxuXHRcdGljb246ICdhYycsXG5cdFx0c2l6ZTogJ20nXG5cdH0sIHtcblx0XHR0eXBlOiAnaW5mbycsXG5cdFx0dGl0bGU6ICfQnNGD0LfRi9C60LAg0LLQutC70Y7Rh9C10L3QsCcsXG5cdFx0c291cmNlOiAn0K/QvdC00LXQutGBLtCh0YLQsNC90YbQuNGPJyxcblx0XHR0aW1lOiAnMTg6MTYsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogJ9Ch0LXQudGH0LDRgSDQv9GA0L7QuNCz0YDRi9Cy0LDQtdGC0YHRjzonLFxuXHRcdGljb246ICdtdXNpYycsXG5cdFx0c2l6ZTogJ20nLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFsYnVtY292ZXI6ICdodHRwczovL2F2YXRhcnMueWFuZGV4Lm5ldC9nZXQtbXVzaWMtY29udGVudC8xOTM4MjMvMTgyMGE0M2UuYS41NTE3MDU2LTEvbTEwMDB4MTAwMCcsXG5cdFx0XHRhcnRpc3Q6ICdGbG9yZW5jZSAmIFRoZSBNYWNoaW5lJyxcblx0XHRcdHRyYWNrOiB7XG5cdFx0XHRcdG5hbWU6ICdCaWcgR29kJyxcblx0XHRcdFx0bGVuZ3RoOiAnNDozMSdcblx0XHRcdH0sXG5cdFx0XHR2b2x1bWU6IDgwXG5cdFx0fVxuXHR9LCB7XG5cdFx0dHlwZTogJ2luZm8nLFxuXHRcdHRpdGxlOiAn0JfQsNC60LDQvdGH0LjQstCw0LXRgtGB0Y8g0LzQvtC70L7QutC+Jyxcblx0XHRzb3VyY2U6ICfQpdC+0LvQvtC00LjQu9GM0L3QuNC6Jyxcblx0XHR0aW1lOiAnMTc6MjMsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogJ9Ca0LDQttC10YLRgdGPLCDQsiDRhdC+0LvQvtC00LjQu9GM0L3QuNC60LUg0LfQsNC60LDQvdGH0LjQstCw0LXRgtGB0Y8g0LzQvtC70L7QutC+LiDQktGLINGF0L7RgtC40YLQtSDQtNC+0LHQsNCy0LjRgtGMINC10LPQviDQsiDRgdC/0LjRgdC+0Log0L/QvtC60YPQv9C+0Lo/Jyxcblx0XHRpY29uOiAnZnJpZGdlJyxcblx0XHRzaXplOiAnbScsXG5cdFx0ZGF0YToge1xuXHRcdFx0YnV0dG9uczogWyfQlNCwJywgJ9Cd0LXRgiddXG5cdFx0fVxuXHR9LCB7XG5cdFx0dHlwZTogJ2luZm8nLFxuXHRcdHRpdGxlOiAn0JfQsNGA0Y/QtNC60LAg0LfQsNCy0LXRgNGI0LXQvdCwJyxcblx0XHRzb3VyY2U6ICfQntC60L7QvdC90YvQuSDRgdC10L3RgdC+0YAnLFxuXHRcdHRpbWU6ICcxNjoyMiwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdGRlc2NyaXB0aW9uOiAn0KPRgNCwISDQo9GB0YLRgNC+0LnRgdGC0LLQviDCq9Ce0LrQvtC90L3Ri9C5INGB0LXQvdGB0L7RgMK7INGB0L3QvtCy0LAg0LIg0YHRgtGA0L7RjiEnLFxuXHRcdGljb246ICdiYXR0ZXJ5Jyxcblx0XHRzaXplOiAncydcblx0fSwge1xuXHRcdHR5cGU6ICdjcml0aWNhbCcsXG5cdFx0dGl0bGU6ICfQn9GL0LvQtdGB0L7RgSDQt9Cw0YHRgtGA0Y/QuycsXG5cdFx0c291cmNlOiAn0KHQtdC90YHQvtGAINC00LLQuNC20LXQvdC40Y8nLFxuXHRcdHRpbWU6ICcxNjoxNywg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdGRlc2NyaXB0aW9uOiAn0KDQvtCx0L7Qv9GL0LvQtdGB0L7RgSDQvdC1INGB0LzQvtCzINGB0LzQtdC90LjRgtGMINGB0LLQvtC1INC80LXRgdGC0L7Qv9C+0LvQvtC20LXQvdC40LUg0LIg0YLQtdGH0LXQvdC40LUg0L/QvtGB0LvQtdC00L3QuNGFIDMg0LzQuNC90YPRgi4g0J/QvtGF0L7QttC1LCDQtdC80YMg0L3Rg9C20L3QsCDQv9C+0LzQvtGJ0YwuJyxcblx0XHRpY29uOiAnY2FtJyxcblx0XHRkYXRhOiB7XG5cdFx0XHRpbWFnZTogJ2dldF9pdF9mcm9tX21vY2tzXzozLmpwZydcblx0XHR9LFxuXHRcdHNpemU6ICdsJ1xuXHR9LCB7XG5cdFx0dHlwZTogJ2luZm8nLFxuXHRcdHRpdGxlOiAn0JLQvtC00LAg0LLRgdC60LjQv9C10LvQsCcsXG5cdFx0c291cmNlOiAn0KfQsNC50L3QuNC6Jyxcblx0XHR0aW1lOiAnMTY6MjAsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRpY29uOiAna2V0dGxlJyxcblx0XHRzaXplOiAncydcblx0fV1cbn07XG5cbnZhciBzbWFsbFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtdGVtcGxhdGUtLXNtYWxsJyk7XG52YXIgbWVkaXVtVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tbWVkaXVtJyk7XG52YXIgbGFyZ2VUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXRlbXBsYXRlLS1sYXJnZScpO1xuXG52YXIgY29udGVudFdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXZlbnRzLXdyYXAnKTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudHNPYmplY3QuZXZlbnRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdHZhciB0aGlzSXRlbSA9IGV2ZW50c09iamVjdC5ldmVudHNbaV07XG5cblx0Ly8g0JfQsNC/0L7Qu9C90LXQvdC40LUg0LrQsNGA0YLQvtGH0LXQuiDRgdC+0LTQtdGA0LbQuNC80YvQvFxuXHRzd2l0Y2ggKHRoaXNJdGVtLnNpemUpIHtcblx0XHRjYXNlICdzJzpcblx0XHRcdHZhciBzbWFsbENsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzbWFsbFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fbG9nbycpLnNyYyA9ICcuL2Fzc2V0cy8nICsgdGhpc0l0ZW0uaWNvbiArICcuc3ZnJztcblx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpdGxlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGl0bGU7XG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19zb3VyY2UnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS5zb3VyY2U7XG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZTtcblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC+0L/QuNGB0LDQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKTtcblx0XHRcdFx0dmFyIHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0dmFyIHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoc21hbGxEZXNjcmlwdGlvblBhcmFncmFwaCk7XG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25QYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaC0tc21hbGwnKTtcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbicsICdjYXJkX19kZXNjcmlwdGlvbi0tc21hbGwnKTtcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvblBhcmFncmFwaC5pbm5lckhUTUwgPSB0aGlzSXRlbS5kZXNjcmlwdGlvbjtcblx0XHRcdFx0c21hbGxDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIpO1xuXHRcdFx0fVxuXHRcdFx0Y29udGVudFdyYXAuYXBwZW5kQ2hpbGQoc21hbGxDbG9uZSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdtJzpcblx0XHRcdHZhciBtZWRpdW1DbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVkaXVtVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fbG9nbycpLnNyYyA9ICcuL2Fzc2V0cy8nICsgdGhpc0l0ZW0uaWNvbiArICcuc3ZnJztcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aXRsZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpdGxlO1xuXHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3NvdXJjZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnNvdXJjZTtcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aW1lJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0udGltZTtcblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faGVhZGVyLXdyYXAnKS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbCcpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQvtC/0LjRgdCw0L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0uZGVzY3JpcHRpb24pIHtcblx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnaGF2ZS1kZXNjcmlwdGlvbicpO1xuXHRcdFx0XHR2YXIgbWVkaXVtRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0dmFyIG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaCk7XG5cdFx0XHRcdG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uLXBhcmFncmFwaCcsICdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgtLW1lZGl1bScpO1xuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbicsICdjYXJkX19kZXNjcmlwdGlvbi0tbWVkaXVtJyk7XG5cdFx0XHRcdG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoLmlubmVySFRNTCA9IHRoaXNJdGVtLmRlc2NyaXB0aW9uO1xuXHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZCcpLmFwcGVuZENoaWxkKG1lZGl1bURlc2NyaXB0aW9uQ29udGFpbmVyKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEpIHtcblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEudGVtcGVyYXR1cmUgJiYgdGhpc0l0ZW0uZGF0YS5odW1pZGl0eSkge1xuXHRcdFx0XHRcdHZhciBtZWRpdW1EYXRhQWlyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdFx0bWVkaXVtRGF0YUFpci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhJywgJ2NhcmRfX2RhdGEtLWFpcicpO1xuXHRcdFx0XHRcdHZhciBtZWRpdW1EYXRhVGVtcGVyYXR1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0XHRcdFx0bWVkaXVtRGF0YVRlbXBlcmF0dXJlLmlubmVySFRNTCA9ICdcXHUwNDIyXFx1MDQzNVxcdTA0M0NcXHUwNDNGXFx1MDQzNVxcdTA0NDBcXHUwNDMwXFx1MDQ0MlxcdTA0NDNcXHUwNDQwXFx1MDQzMDogPGI+JyArIHRoaXNJdGVtLmRhdGEudGVtcGVyYXR1cmUgKyAnIFxcdTA0MjE8Yj4nO1xuXHRcdFx0XHRcdHZhciBtZWRpdW1EYXRhSHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0XHRcdFx0bWVkaXVtRGF0YUh1bWlkaXR5LmlubmVySFRNTCA9ICdcXHUwNDEyXFx1MDQzQlxcdTA0MzBcXHUwNDM2XFx1MDQzRFxcdTA0M0VcXHUwNDQxXFx1MDQ0MlxcdTA0NEM6IDxiPicgKyB0aGlzSXRlbS5kYXRhLmh1bWlkaXR5ICsgJyAlPGI+Jztcblx0XHRcdFx0XHRtZWRpdW1EYXRhQWlyLmFwcGVuZENoaWxkKG1lZGl1bURhdGFUZW1wZXJhdHVyZSk7XG5cdFx0XHRcdFx0bWVkaXVtRGF0YUFpci5hcHBlbmRDaGlsZChtZWRpdW1EYXRhSHVtaWRpdHkpO1xuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKG1lZGl1bURhdGFBaXIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuYnV0dG9ucykge1xuXHRcdFx0XHRcdHZhciBidXR0b25zQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbnMtY29udGFpbmVyJyk7XG5cdFx0XHRcdFx0dmFyIGJ1dHRvblllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRcdGJ1dHRvblllcy5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbicsICdjYXJkX19kYXRhLS1idXR0b24teWVzJyk7XG5cdFx0XHRcdFx0YnV0dG9uWWVzLmlubmVySFRNTCA9ICfQlNCwJztcblx0XHRcdFx0XHR2YXIgYnV0dG9uTm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0XHRidXR0b25Oby5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbicsICdjYXJkX19kYXRhLS1idXR0b24tbm8nKTtcblx0XHRcdFx0XHRidXR0b25Oby5pbm5lckhUTUwgPSAn0J3QtdGCJztcblx0XHRcdFx0XHRidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvblllcyk7XG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b25Obyk7XG5cdFx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2Rlc2NyaXB0aW9uJykuYXBwZW5kQ2hpbGQoYnV0dG9uc0NvbnRhaW5lcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS5hcnRpc3QpIHtcblx0XHRcdFx0XHR2YXIgbXVzaWNQbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0XHRtdXNpY1BsYXllci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLW11c2ljLXBsYXllcicpO1xuXHRcdFx0XHRcdG11c2ljUGxheWVyLmlubmVySFRNTCA9ICdcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2FyZF9fcGxheWVyXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cInBsYXllclwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2hlYWRlclwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2xvZ28tY29udGFpbmVyXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGltZyBzcmM9XCInICsgdGhpc0l0ZW0uZGF0YS5hbGJ1bWNvdmVyICsgJ1wiIGFsdD1cIlwiIGNsYXNzPVwicGxheWVyX19sb2dvXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tpbmZvXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHAgY2xhc3M9XCJwbGF5ZXJfX25hbWVcIj4nICsgdGhpc0l0ZW0uZGF0YS5hcnRpc3QgKyAnIC0gJyArIHRoaXNJdGVtLmRhdGEudHJhY2submFtZSArICc8L3A+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwicGxheWVyX190cmFja2xpbmVcIj48L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8cCBjbGFzcz1cInBsYXllcl9fdGltZVwiPicgKyB0aGlzSXRlbS5kYXRhLnRyYWNrLmxlbmd0aCArICc8L3A+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cInBsYXllcl9fY29udHJvbHNcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8aW1nIHNyYz1cIi4vYXNzZXRzL3ByZXYuc3ZnXCIgYWx0PVwiXCIgY2xhc3M9XCJwbGF5ZXJfX2NvbnRyb2wgcGxheWVyX19jb250cm9sLS1sZWZ0XCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9wcmV2LnN2Z1wiIGFsdD1cIlwiIGNsYXNzPVwicGxheWVyX19jb250cm9sIHBsYXllcl9fY29udHJvbC0tcmlnaHRcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwicGxheWVyX192b2x1bWVcIj48L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8cCBjbGFzcz1cInBsYXllcl9fdm9sdW1lLXBlcmNlbnRcIj4nICsgdGhpc0l0ZW0uZGF0YS52b2x1bWUgKyAnICU8L3A+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+Jztcblx0XHRcdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fZGVzY3JpcHRpb24nKS5hcHBlbmRDaGlsZChtdXNpY1BsYXllcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKG1lZGl1bUNsb25lKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2wnOlxuXHRcdFx0dmFyIGxhcmdlQ2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKGxhcmdlVGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19sb2dvJykuc3JjID0gJy4vYXNzZXRzLycgKyB0aGlzSXRlbS5pY29uICsgJy5zdmcnO1xuXHRcdFx0bGFyZ2VDbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aXRsZTtcblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3NvdXJjZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnNvdXJjZTtcblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpbWUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aW1lO1xuXG5cdFx0XHQvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQutCw0YDRgtC+0YfQutC4INC/0YDQtdC00YPQv9GA0LXQttC00LXQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS50eXBlID09PSAnY3JpdGljYWwnKSB7XG5cdFx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7Qv9C40YHQsNC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnaGF2ZS1kZXNjcmlwdGlvbicpO1xuXHRcdFx0XHR2YXIgbGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHR2YXIgbGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChsYXJnZURlc2NyaXB0aW9uUGFyYWdyYXBoKTtcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgnLCAnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoLS1sYXJnZScpO1xuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2Rlc2NyaXB0aW9uJywgJ2NhcmRfX2Rlc2NyaXB0aW9uLS1sYXJnZScpO1xuXHRcdFx0XHRsYXJnZURlc2NyaXB0aW9uUGFyYWdyYXBoLmlubmVySFRNTCA9IHRoaXNJdGVtLmRlc2NyaXB0aW9uO1xuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkJykuYXBwZW5kQ2hpbGQobGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lcik7XG5cdFx0XHR9XG5cblx0XHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC60LDRgNGC0LjQvdC60Lhcblx0XHRcdHZhciBsYXJnZURhdGFJbWFnZSA9IHZvaWQgMDtcblx0XHRcdGlmICh0aGlzSXRlbS5kYXRhLnR5cGUgPT09ICdncmFwaCcpIHtcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuY2xhc3NMaXN0LmFkZCgnY2FyZF9faW1hZ2UtY29udGFpbmVyJyk7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLmlubmVySFRNTCA9ICc8aW1nXFxuXFx0XFx0XFx0XFx0c3JjPVwiLi9hc3NldHMvcmljaGRhdGEuc3ZnXCJcXG5cXHRcXHRcXHRcXHRjbGFzcz1cImNhcmRfX2ltYWdlXCI+Jztcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuaW1hZ2UpIHtcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuY2xhc3NMaXN0LmFkZCgnY2FyZF9faW1hZ2UtY29udGFpbmVyJyk7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlLnNldEF0dHJpYnV0ZSgnaWQnLCAnaG9vdmVyLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRsYXJnZURhdGFJbWFnZS5pbm5lckhUTUwgPSAnPGltZ1xcblxcdFxcdFxcdFxcdFxcdFxcdGNsYXNzPVwiY2FyZF9faW1hZ2VcIlxcblxcdFxcdFxcdFxcdFxcdFxcdGlkPVwiaG9vdmVyXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0b3VjaC1hY3Rpb249XCJub25lXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRzdHlsZT1cInRvdWNoLWFjdGlvbjogbm9uZTtcIlxcblxcdFxcdFxcdFxcdFxcdFxcdHNyY3NldD1cIi4vYXNzZXRzL2JpdG1hcC5wbmcgNzY4dyxcXG5cXHRcXHRcXHRcXHRcXHRcXHQuL2Fzc2V0cy9iaXRtYXAyeC5wbmcgMTM2NncsXFxuXFx0XFx0XFx0XFx0XFx0XFx0Li9hc3NldHMvYml0bWFwM3gucG5nIDE5MjB3XCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRzcmM9XCIuL2Fzc2V0cy9iaXRtYXAyeC5wbmdcIj4nO1xuXHRcdFx0fVxuXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKGxhcmdlRGF0YUltYWdlKTtcblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKGxhcmdlQ2xvbmUpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1VuZXhwZWN0ZWQgc2l6ZSBvZiBjYXJkJyk7XG5cdH1cbn0iXX0=
