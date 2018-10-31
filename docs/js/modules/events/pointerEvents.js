"use strict";
var scaleValue = 1;
var brightnessValue = 1;
var prevDiff = -1;
var prevAngle = null;
var eventCache = new Array();
var elementInfo = {
    xMaxLimit: 0,
    yMaxLimit: 0,
    xMinLimit: 0,
    yMinLimit: 0,
    computedX: 0,
    computedY: 0,
    el: null,
    oldComputedX: 0,
    oldComputedY: 0,
    initialHeight: 0,
    initialWidth: 0,
    containerHeight: 0,
    containerWidth: 0,
    startedPointDownX: 0,
    startedPointDownY: 0
};
// Создаем объект для вспомогательных функций
var helpersFunctions = {
    getDistaneBetweenTwoDots: function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    },
    getAngle: function (x1, y1, x2, y2) {
        return (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI;
    },
    setComputedValuesViaLimits: function (computedX, computedY) {
        if (computedX > elementInfo.xMaxLimit)
            elementInfo.computedX = elementInfo.xMaxLimit;
        if (computedX < elementInfo.xMinLimit)
            elementInfo.computedX = elementInfo.xMinLimit;
        if (computedY < elementInfo.yMinLimit)
            elementInfo.computedY = elementInfo.yMinLimit;
        if (computedY > elementInfo.yMaxLimit)
            elementInfo.computedY = elementInfo.yMaxLimit;
    },
    setLimits: function () {
        if (elementInfo.el && elementInfo.el.parentNode) {
            var elParent = elementInfo.el.parentNode;
            elementInfo.yMaxLimit = (elementInfo.el.offsetHeight * scaleValue - elParent.offsetHeight) / 4;
            elementInfo.yMinLimit = -(elementInfo.el.offsetHeight * scaleValue - elParent.offsetHeight) / 4;
            elementInfo.xMaxLimit = (elementInfo.el.offsetWidth * scaleValue - elParent.offsetWidth) / 4;
            elementInfo.xMinLimit = -(elementInfo.el.offsetWidth * scaleValue - elParent.offsetWidth) / 4;
        }
    }
};
function init() {
    elementInfo.el = document.querySelector('#hoover');
    // Первичные значения
    elementInfo.oldComputedX = 0;
    elementInfo.oldComputedY = 0;
    elementInfo.computedX = 0;
    elementInfo.computedY = 0;
    elementInfo.yMaxLimit = 0;
    elementInfo.yMinLimit = 0;
    elementInfo.xMaxLimit = 0;
    elementInfo.xMinLimit = 0;
    if (elementInfo.el) {
        elementInfo.initialWidth = elementInfo.el.offsetWidth;
        elementInfo.initialHeight = elementInfo.el.offsetHeight;
    }
    if (elementInfo.el && elementInfo.el.parentNode) {
        var elParent = elementInfo.el.parentNode;
        elementInfo.containerHeight = elParent.offsetHeight;
        elementInfo.containerWidth = elParent.offsetHeight;
    }
    // Переопределяем события
    if (elementInfo.el) {
        elementInfo.el.onpointerdown = pointerDownHandler;
        elementInfo.el.onpointermove = pointerMoveHandler;
        elementInfo.el.onpointerup = pointerUpHandler;
        elementInfo.el.onpointercancel = pointerUpHandler;
        elementInfo.el.onpointerout = pointerUpHandler;
        elementInfo.el.onpointerleave = pointerUpHandler;
    }
}
function pointerDownHandler(event) {
    eventCache.push(event);
    // Запишем позицию курсора
    elementInfo.startedPointDownX = event.clientX;
    elementInfo.startedPointDownY = event.clientY;
}
function pointerMoveHandler(event) {
    for (var i = 0; i < eventCache.length; i++) {
        if (event.pointerId === eventCache[i].pointerId) {
            eventCache[i] = event;
            break;
        }
    }
    if (eventCache.length === 1) {
        elementInfo.computedX = event.clientX - elementInfo.startedPointDownX + elementInfo.oldComputedX;
        elementInfo.computedY = event.clientY - elementInfo.startedPointDownY + elementInfo.oldComputedY;
        helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY);
        event.target.style.transform = "scale(" + scaleValue + ") translate(" + elementInfo.computedX + "px, " + elementInfo.computedY + "px)";
    }
    if (eventCache.length === 2) {
        var x1 = eventCache[0].clientX;
        var y1 = eventCache[0].clientY;
        var x2 = eventCache[1].clientX;
        var y2 = eventCache[1].clientY;
        var curAngle = helpersFunctions.getAngle(x1, y1, x2, y2);
        if (prevAngle) {
            var increaseOn = 0.01;
            if (curAngle > prevAngle) {
                brightnessValue += increaseOn;
                elementInfo.el.style.filter = "brightness(" + brightnessValue + ")";
            }
            if (curAngle < prevAngle) {
                brightnessValue -= increaseOn;
                elementInfo.el.style.filter = "brightness(" + brightnessValue + ")";
            }
        }
        prevAngle = curAngle;
        var curDiff = Math.abs(eventCache[0].clientX - eventCache[1].clientX);
        if (prevDiff > 0) {
            var pinchDiff = curDiff - prevDiff;
            if (curDiff > prevDiff) {
                // ZOOM IN
                if (scaleValue >= 1)
                    scaleValue += pinchDiff / 100;
                if (scaleValue > 2)
                    scaleValue = 2;
                helpersFunctions.setLimits();
                helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY);
                elementInfo.el.style.transform = "scale(" + scaleValue + ") translate(" + elementInfo.computedX + "px, " + elementInfo.computedY + "px)";
            }
            if (curDiff < prevDiff) {
                // ZOOM OUT
                if (scaleValue >= 1)
                    scaleValue -= -pinchDiff / 100;
                if (scaleValue < 1)
                    scaleValue = 1;
                helpersFunctions.setLimits();
                helpersFunctions.setComputedValuesViaLimits(elementInfo.computedX, elementInfo.computedY);
                elementInfo.el.style.transform = "scale(" + scaleValue + ") translate(" + elementInfo.computedX + "px, " + elementInfo.computedY + "px)";
            }
        }
        prevDiff = curDiff;
    }
}
function pointerUpHandler(event) {
    elementInfo.oldComputedX = elementInfo.computedX;
    elementInfo.oldComputedY = elementInfo.computedY;
    removeEvent(event);
    if (eventCache.length < 2)
        prevDiff = -1;
}
function removeEvent(event) {
    for (var i = 0; i < eventCache.length; i++) {
        if (eventCache[i].pointerId == event.pointerId) {
            eventCache.splice(i, 1);
            break;
        }
    }
}
if ('ontouchstart' in document.documentElement) {
    document.body.onload = init();
}
