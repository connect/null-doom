/*
 * NULL Engine
 * 
 * @module sound
 * @author kod.connect
 * 
 */

s_.init = function(){
    console.log('....s_.init()')
    
    $('body').prepend('<audio id="music" preload="auto" loop></audio>');
};
// init sound system
s_.init();

s_.items = {};

s_.load = function(o){
    
    if (typeof o == 'object' && o.length != undefined) {
        
        // array declaration
        for (var i in o) {
            s_.items.push(o[i]);
        }
    } else {
        // single file
        s_.items.push(o);
    }
};

s_.play = function(o){
    
    o = ( s_.items[ o ] != undefined ) ? s_.items[ o ] : o;
    
    $('<audio />')
        .attr('src', cfg.iwad +'/snd/'+ o )
        .attr('preload', 'auto')
        .on('ended', function() {            
            $(this).remove();
        })
        .trigger('play');    
};

s_.playMusic = function(o){
    
    o = ( s_.items[ o ] != undefined ) ? s_.items[ o ] : o;
    
    $('#music')
        .attr('src', cfg.iwad +'/snd/'+ o )
        .prop('volume', cfg.musicvolume )
        .trigger('play');    
};

s_.positInit = function(o){
    
    s_.volume = cfg.volume || 100;
};

core.loadNext();