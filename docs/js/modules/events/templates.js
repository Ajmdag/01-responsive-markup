"use strict";
var eventsObject = {
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
};
var smallTemplate = document.querySelector('.card-template--small');
var mediumTemplate = document.querySelector('.card-template--medium');
var largeTemplate = document.querySelector('.card-template--large');
var contentWrap = document.querySelector('.events-wrap');
for (var i = 0; i < eventsObject.events.length; i++) {
    var thisItem = eventsObject.events[i];
    // Заполнение карточек содержимым
    switch (thisItem.size) {
        case 's':
            var smallClone = void 0;
            var smallCloneImage = void 0;
            if (smallTemplate) {
                smallClone = document.importNode(smallTemplate.content, true);
                smallCloneImage = smallClone.querySelector('.card__logo');
            }
            smallCloneImage.src = "./assets/" + thisItem.icon + ".svg";
            var smallCloneTitle = void 0;
            var smallCloneSource = void 0;
            var smallCloneTime = void 0;
            if (smallClone) {
                smallCloneTitle = smallClone.querySelector('.card__title');
                smallCloneSource = smallClone.querySelector('.card__source');
                smallCloneTime = smallClone.querySelector('.card__time');
            }
            smallCloneTitle.innerHTML = thisItem.title;
            smallCloneSource.innerHTML = thisItem.source;
            smallCloneTime.innerHTML = thisItem.time;
            // Добавление карточки предупреждения
            var smallCloneHeaderWrap = void 0;
            if (smallClone) {
                smallCloneHeaderWrap = smallClone.querySelector('.card__header-wrap');
            }
            if (thisItem.type === 'critical') {
                smallCloneHeaderWrap.classList.add('critical');
            }
            // Добавление описания
            if (thisItem.description) {
                smallCloneHeaderWrap.classList.add('have-description');
                var smallDescriptionContainer = document.createElement('div');
                var smallDescriptionParagraph = document.createElement('p');
                smallDescriptionContainer.appendChild(smallDescriptionParagraph);
                smallDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--small');
                smallDescriptionContainer.classList.add('card__description', 'card__description--small');
                smallDescriptionParagraph.innerHTML = thisItem.description;
                var smallCloneCard = void 0;
                if (smallClone) {
                    smallCloneCard = smallClone.querySelector('.card');
                }
                smallCloneCard.appendChild(smallDescriptionContainer);
            }
            if (contentWrap && smallClone) {
                contentWrap.appendChild(smallClone);
            }
            break;
        case 'm':
            var mediumClone = void 0;
            var mediumCloneImage = void 0;
            if (mediumTemplate) {
                mediumClone = document.importNode(mediumTemplate.content, true);
                mediumCloneImage = mediumClone.querySelector('.card__logo');
            }
            mediumCloneImage.src = "./assets/" + thisItem.icon + ".svg";
            var mediumCloneTitle = void 0;
            var mediumCloneSource = void 0;
            var mediumCloneTime = void 0;
            var mediumCloneHeaderWrap = void 0;
            if (mediumClone) {
                mediumCloneTitle = mediumClone.querySelector('.card__title');
                mediumCloneSource = mediumClone.querySelector('.card__source');
                mediumCloneTime = mediumClone.querySelector('.card__time');
                mediumCloneHeaderWrap = mediumClone.querySelector('.card__header-wrap');
            }
            mediumCloneTitle.innerHTML = thisItem.title;
            mediumCloneSource.innerHTML = thisItem.source;
            mediumCloneTime.innerHTML = thisItem.time;
            console.log('everything is fine');
            //Добавление карточки предупреждения
            if (thisItem.type === 'critical') {
                mediumCloneHeaderWrap.classList.add('critical');
            }
            // Добавление описания
            if (thisItem.description) {
                mediumCloneHeaderWrap.classList.add('have-description');
                var mediumDescriptionContainer = document.createElement('div');
                var mediumDescriptionParagraph = document.createElement('p');
                mediumDescriptionContainer.appendChild(mediumDescriptionParagraph);
                mediumDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--medium');
                mediumDescriptionContainer.classList.add('card__description', 'card__description--medium');
                mediumDescriptionParagraph.innerHTML = thisItem.description;
                var mediumCloneCard = void 0;
                if (mediumClone) {
                    mediumCloneCard = mediumClone.querySelector('.card');
                }
                mediumCloneCard.appendChild(mediumDescriptionContainer);
            }
            if (thisItem.data) {
                if (thisItem.data.temperature && thisItem.data.humidity) {
                    var mediumDataAir = document.createElement('div');
                    mediumDataAir.classList.add('card__data', 'card__data--air');
                    var mediumDataTemperature = document.createElement('p');
                    mediumDataTemperature.innerHTML = "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: <b>" + thisItem.data.temperature + " \u0421<b>";
                    var mediumDataHumidity = document.createElement('p');
                    mediumDataHumidity.innerHTML = "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C: <b>" + thisItem.data.humidity + " %<b>";
                    mediumDataAir.appendChild(mediumDataTemperature);
                    mediumDataAir.appendChild(mediumDataHumidity);
                    var mediumCloneCardDescription = void 0;
                    if (mediumClone) {
                        mediumCloneCardDescription = mediumClone.querySelector('.card__description');
                    }
                    mediumCloneCardDescription.appendChild(mediumDataAir);
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
                    var mediumCloneCardDescription = void 0;
                    if (mediumClone) {
                        mediumCloneCardDescription = mediumClone.querySelector('.card__description');
                    }
                    mediumCloneCardDescription.appendChild(buttonsContainer);
                }
                if (thisItem.data.artist && thisItem.data.track) {
                    var musicPlayer = document.createElement('div');
                    musicPlayer.classList.add('card__data-music-player');
                    musicPlayer.innerHTML = "\n\t\t\t\t\t\t\t\t<div class=\"card__player\">\n\t\t\t\t\t\t\t\t\t<div class=\"player\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"player__header\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"player__logo-container\">\n\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"" + thisItem.data.albumcover + "\" alt=\"\" class=\"player__logo\">\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"player__trackinfo\">\n\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"player__name\">" + thisItem.data.artist + " - " + thisItem.data.track.name + "</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"player__track\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"player__trackline\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"player__time\">" + thisItem.data.track.length + "</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"player__controls\">\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"./assets/prev.svg\" alt=\"\" class=\"player__control player__control--left\">\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"./assets/prev.svg\" alt=\"\" class=\"player__control player__control--right\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"player__volume\"></div>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"player__volume-percent\">" + thisItem.data.volume + " %</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>";
                    var mediumCloneCardDescription = void 0;
                    if (mediumClone) {
                        mediumCloneCardDescription = mediumClone.querySelector('.card__description');
                    }
                    mediumCloneCardDescription.appendChild(musicPlayer);
                }
            }
            if (contentWrap && mediumClone) {
                contentWrap.appendChild(mediumClone);
            }
            break;
        case 'l':
            var largeClone = void 0;
            if (largeTemplate) {
                largeClone = document.importNode(largeTemplate.content, true);
            }
            var largeCloneImage = void 0;
            if (largeClone) {
                largeCloneImage = largeClone.querySelector('.card__logo');
            }
            largeCloneImage.src = "./assets/" + thisItem.icon + ".svg";
            var largeCloneTitle = void 0;
            var largeCloneSource = void 0;
            var largeCloneTime = void 0;
            if (largeClone) {
                largeCloneTitle = largeClone.querySelector('.card__title');
                largeCloneSource = largeClone.querySelector('.card__source');
                largeCloneTime = largeClone.querySelector('.card__time');
            }
            largeCloneTitle.innerHTML = thisItem.title;
            largeCloneSource.innerHTML = thisItem.source;
            largeCloneTime.innerHTML = thisItem.time;
            //Добавление карточки предупреждения
            var largeCloneHeaderWrap = void 0;
            if (largeClone) {
                largeCloneHeaderWrap = largeClone.querySelector('.card__header-wrap');
            }
            if (thisItem.type === 'critical') {
                largeCloneHeaderWrap.classList.add('critical');
            }
            // Добавление описания
            if (thisItem.description) {
                largeCloneHeaderWrap.classList.add('have-description');
                var largeDescriptionContainer = document.createElement('div');
                var largeDescriptionParagraph = document.createElement('p');
                largeDescriptionContainer.appendChild(largeDescriptionParagraph);
                largeDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--large');
                largeDescriptionContainer.classList.add('card__description', 'card__description--large');
                largeDescriptionParagraph.innerHTML = thisItem.description;
                var largeCloneCard = void 0;
                if (largeClone) {
                    largeCloneCard = largeClone.querySelector('.card');
                }
                largeCloneCard.appendChild(largeDescriptionContainer);
            }
            // Добавление картинки
            var largeDataImage = void 0;
            if (thisItem.data) {
                if (thisItem.data.type === 'graph') {
                    largeDataImage = document.createElement('div');
                    largeDataImage.classList.add('card__image-container');
                    largeDataImage.innerHTML = "<img\n\t\t\t\t\tsrc=\"./assets/richdata.svg\"\n\t\t\t\t\tclass=\"card__image\">";
                }
                if (thisItem.data.image) {
                    largeDataImage = document.createElement('div');
                    largeDataImage.classList.add('card__image-container');
                    largeDataImage.setAttribute('id', 'hoover-container');
                    largeDataImage.innerHTML = "<img\n\t\t\t\t\t\t\tclass=\"card__image\"\n\t\t\t\t\t\t\tid=\"hoover\"\n\t\t\t\t\t\t\ttouch-action=\"none\"\n\t\t\t\t\t\t\tstyle=\"touch-action: none;\"\n\t\t\t\t\t\t\tsrcset=\"./assets/bitmap.png 768w,\n\t\t\t\t\t\t\t./assets/bitmap2x.png 1366w,\n\t\t\t\t\t\t\t./assets/bitmap3x.png 1920w\"\n\t\t\t\t\t\t\tsrc=\"./assets/bitmap2x.png\">";
                }
            }
            var largeCloneCardDescription = void 0;
            if (largeClone) {
                largeCloneCardDescription = largeClone.querySelector('.card__description');
            }
            largeCloneCardDescription.appendChild(largeDataImage);
            if (contentWrap && largeClone) {
                contentWrap.appendChild(largeClone);
            }
            break;
    }
}
