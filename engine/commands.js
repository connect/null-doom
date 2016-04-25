/*
 * NULL Engine
 * 
 * @module  core/commands
 * @author  kod.connect
 */

c_.nextmap = function(){
    console.log('c_.nextmap()');
    o_.map.next();
};

// Random generator: from, to
c_.random = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

c_.zoomin = function(){
    r_.mode.next();
};

c_.zoomout = function(){
    r_.mode.prev();
};

c_.init = function(o){
    
};

c_.postInit = function(o){
    
};

core.loadNext();