/*
 * NULL Engine
 * 
 * @module  commands
 * @author  kod.connect
 * 
 */

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