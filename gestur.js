var Gesture = function (elem) {
    'use strict';
    this.element = elem;
    this.fingers = {};
    this.init = function () {
        var self = this;
        elem.addEventListener('touchstart', self.onTouchStart = function (e) {
            self.gestureType = 1;
            var finger = {
                startX: e.changedTouches[0].pageX,
                startY: e.changedTouches[0].pageY
            };
            self.fingers[e.changedTouches[0].identifier] = finger;
        }, false);
        elem.addEventListener('touchmove', self.onTouchMove = function (e) {
            for (var i = 0; i < e.touches.length; i++) {
                var touche = e.touches[i];
                if (!self.fingers[touche.identifier]) {
                    self.fingers[touche.identifier] = {};
                    self.fingers[touche.identifier].startX = touche.pageX;
                    self.fingers[touche.identifier].startY = touche.pageY;
                }
                self.fingers[touche.identifier].stopX = touche.pageX;
                self.fingers[touche.identifier].stopY = touche.pageY;
            }
        }, false);
        elem.addEventListener('touchend', self.onTouchStop = function (e) {
            if (e.touches.length === 0) {
                //gesture is ending
                var event = self.getRealEvent(e);
                self.createEvent(event);
                self.fingers = {};
            }
        }, false);
    };
    this.init();
    this.getRealEvent = function (originalEvent) {
        var self = this;
        var event = {};
        var distX;
        var distY;
        var distX2;
        var distY2;
        event.originalSrcElement = originalEvent.srcElement;
        var fingerKey = Object.keys(self.fingers);
        event.fingers = fingerKey.length;
        switch (event.fingers) {
            case 1:
                distX = self.fingers[fingerKey[0]].startX - self.fingers[fingerKey[0]].stopX;
                distY = self.fingers[fingerKey[0]].startY - self.fingers[fingerKey[0]].stopY;
                if (Math.abs(distX) + Math.abs(distY) > 200) {
                    event.eventName = 'swipe';
                    if (Math.abs(distX) > Math.abs(distY)) {
                        if (distX > 0) {
                            event.direction = 'left';
                        } else {
                            event.direction = 'right';
                        }
                    } else {
                        if (distY > 0) {
                            event.direction = 'top';
                        } else {
                            event.direction = 'bottom';
                        }
                    }
                } else {
                    event.eventName = 'tap';
                    event.direction = null;
                }
                break;
            case 2:
                distX = self.fingers[fingerKey[0]].startX - self.fingers[fingerKey[0]].stopX;
                distY = self.fingers[fingerKey[0]].startY - self.fingers[fingerKey[0]].stopY;
                distX2 = self.fingers[fingerKey[1]].startX - self.fingers[fingerKey[1]].stopX;
                distY2 = self.fingers[fingerKey[1]].startY - self.fingers[fingerKey[1]].stopY;
                if (Math.abs(distX) + Math.abs(distY) + Math.abs(distX2) + Math.abs(distY2) > 200) {
                    if (distX * distX2 > 0 || distY * distY2 > 0) {
                        //same direction fingers
                        event.eventName = 'swipe';
                        if (Math.abs(distX) > Math.abs(distY)) {
                            if (distX > 0) {
                                event.direction = 'left';
                            } else {
                                event.direction = 'right';
                            }
                        } else {
                            if (distY > 0) {
                                event.direction = 'top';
                            } else {
                                event.direction = 'bottom';
                            }
                        }
                    } else {
                        event.eventName = 'pinch';
                        var distanceBefore = self.distance(self.fingers[fingerKey[0]].startX, self.fingers[fingerKey[0]].startY,
                            self.fingers[fingerKey[1]].startX, self.fingers[fingerKey[1]].startY);
                        var distanceAfter = self.distance(self.fingers[fingerKey[0]].stopX, self.fingers[fingerKey[0]].stopY,
                            self.fingers[fingerKey[1]].stopX, self.fingers[fingerKey[1]].stopY);
                        if (distanceBefore > distanceAfter) {
                            event.direction = 'out';
                        } else {
                            event.direction = 'in';
                        }
                    }
                } else {
                    event.eventName = 'tap';
                    event.direction = null;
                }
                break;
        }
        return event;
    };
    this.distance = function (x1, y1, x2, y2) {
        var sqr = function (a) {
            return a * a;
        };
        return Math.sqrt(sqr(y2 - y1) + sqr(x2 - x1));
    };
    this.createEvent = function (realEvent) {
        var event;
        var self = this;
        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(realEvent.eventName, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = realEvent.eventName;
        }
        var eventObjectKeys = Object.keys(realEvent);

        for (var i = 0; i < eventObjectKeys.length; i++) {
            event[eventObjectKeys[i]] = realEvent[eventObjectKeys[i]];
        }
        if (document.createEvent) {
            self.element.dispatchEvent(event);
        } else {
            self.element.fireEvent("on" + event.eventType, event);
        }
    };
};
