Gestur
======

Simple java-script library for gestures implementation


add gesture listeners to an element:
var myElement = document.getElementById('page');
new Gesture(myElement);

attach an event to my element:
myElement.addEventListener('swipe', function(e){
    switch(e.direction){
        case 'left':
            menu.navToNextUniverse();
            break;
        case 'right':
            menu.navToPrevUniverse();
            break;
    }
});

event list:
swipe
tap
pinch

event object informations:
{
    direction: string [left, right, top, bottom],
    fingers: int [1, 2, 3, 4, 5 ...],
    originalSrcElement: DOMelement
}
