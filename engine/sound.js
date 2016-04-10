/*
 * NULL Engine
 * 
 * @module sound
 * @author kod.connect
 * 
 */

s_.init = function(){
    $('body').prepend('<audio id="sound" preload="auto"></audio>');
};
// init sound system
s_.init();

s_.items = [];

s_.load = function(o){
    
    if (typeof o == 'object' && o.length != undefined) {
        // array declaration
        for (var i in o) {
            //$('#sound').append('<source src="'+ cfg.mod +'/snd/'+ i +'.'+ o[i] +'" type="audio/'+ o[i] +'">');
            s_.items.push(o[i]);
        }
    } else {
        // single file
        s_.items.push(o);
    }
};

s_.play = function(o){
    $('#sound')
        .attr('src', cfg.mod +'/snd/'+ o )
        .trigger('play');    
};
