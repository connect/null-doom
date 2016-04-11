/*
 * NULL Engine
 * 
 * @module  commands
 * @author  kod.connect
 * 
 */

// Random generator: from, to
c_.random = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

c_.nextmap = function(){
    console.log('c_.nextmap()');
    o_.map.next();
};

c_.zoomin = function(){
    r_.mode.next();
};

c_.zoomout = function(){
    r_.mode.prev();
};