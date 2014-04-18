Gestur
======

Simple java-script library for gestures implementation


add gesture listeners to an element:
------------------------------------
```javascript
var myElement = document.getElementById('page');
new Gesture(myElement);
```

attach an event to my element:
------------------------------
```javascript
myElement.addEventListener('swipe', function(e){
    switch(e.direction){
        case 'left':
            //actions
            break;
        case 'right':
            //actions
            break;
    }
});
```

event list:
-----------
* swipe
* tap
* pinch

event object informations:
--------------------------
```javascript
event = {
    direction: string, //[left, right, top, bottom]
    fingers: int, //[1, 2, 3, 4, 5 ...]
    originalSrcElement: DOMelement
}
```