var Gesture = function(elem)
{
    this.element = elem;
    this.fingersNumber= 0;
    this.fingers=[];
    this.init= function(){
        var self = this;
        elem.addEventListener('touchstart', self.onTouchStart= function(e){
            self.fingersNumber++;
            self.gestureType=1;
            var finger = {
                startX: e.changedTouches[0].pageX,
                startY: e.changedTouches[0].pageY
            };
            self.fingers[e.changedTouches[0].identifier] = finger;

        },false);
        elem.addEventListener('touchmove', self.onTouchMove = function(e){
            for(var i =0; i < e.touches.length; i++){
                var touche = e.touches[i];
                if(!self.fingers[touche.identifier]){
                    self.fingers[touche.identifier] = {};
                    self.fingers[touche.identifier].startX= touche.pageX;
                    self.fingers[touche.identifier].startY= touche.pageY;
                }
                self.fingers[touche.identifier].stopX =touche.pageX;
                self.fingers[touche.identifier].stopY =touche.pageY;
            }
        },false);
        elem.addEventListener('touchend', self.onTouchStop = function(e){
            self.fingersNumber--;
            if(self.fingersNumber === 0){
                //gesture is ending
                var event = self.getRealEvent(e);
                self.createEvent(event);
                self.fingers = [];
            }
        },false);
    };
    this.init();
    this.getRealEvent = function(originalEvent){
        var self = this;
        var event = {};
        event.originalSrcElement = originalEvent.srcElement;
        event.fingers = self.fingers.length;
        switch( self.fingers.length ){
            case 1:
                var distX = self.fingers[0].startX-self.fingers[0].stopX;
                var distY = self.fingers[0].startY-self.fingers[0].stopY;
                if(Math.abs(distX)+Math.abs(distY)> 200){
                    event.eventName = 'swipe';
                    if( Math.abs(distX) > Math.abs(distY) ){
                        if(distX>0){
                            event.direction = 'left';
                        }else {
                            event.direction = 'right';
                        }
                    } else {
                        if(distY>0){
                            event.direction = 'top';
                        }else {
                            event.direction = 'bottom';
                        }
                    }
                } else {
                    event.eventName = 'tap';
                    event.direction = null;
                }
                break;
            case 2:
                var distX = self.fingers[0].startX-self.fingers[0].stopX;
                var distY = self.fingers[0].startY-self.fingers[0].stopY;
                var distX2 = self.fingers[1].startX-self.fingers[1].stopX;
                var distY2 = self.fingers[1].startY-self.fingers[1].stopY;
                if(Math.abs(distX)+Math.abs(distY) + Math.abs(distX2)+Math.abs(distY2)> 200){
                    if(distX*distX2> 0 || distY*distY2> 0){
                        //same direction fingers
                        event.eventName = 'swipe';
                        if( Math.abs(distX) > Math.abs(distY) ){
                            if(distX>0){
                                event.direction = 'left';
                            }else {
                                event.direction = 'right';
                            }
                        } else {
                            if(distY>0){
                                event.direction = 'top';
                            }else {
                                event.direction = 'bottom';
                            }
                        }
                    } else {
                        event.eventName = 'pinch';
                        var distanceBefore = self.distance(self.fingers[0].startX, self.fingers[0].startY,
                            self.fingers[1].startX, self.fingers[1].startY);
                        var distanceAfter = self.distance(self.fingers[0].stopX, self.fingers[0].stopY,
                            self.fingers[1].stopX, self.fingers[1].stopY)
                        if(distanceBefore > distanceAfter){
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
    this.distance = function(x1, y1, x2, y2){
        var sqr = function(a){
            return a*a;
        }
        return Math.sqrt(sqr(y2 - y1) + sqr(x2 - x1));
    };
    this.createEvent = function(realEvent){
        var event; // The custom event that will be created
        var self = this;
        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(realEvent.eventName, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = realEvent.eventName;
        }
        eventObjectKeys = Object.keys(realEvent);

        for(var i = 0; i < eventObjectKeys.length; i++){
            event[eventObjectKeys[i]]= realEvent[eventObjectKeys[i]];
        }
        if (document.createEvent) {
            self.element.dispatchEvent(event);
        } else {
            self.element.fireEvent("on" + event.eventType, event);
        }
    };
}