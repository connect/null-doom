/**
 * NULL Engine
 * 
 * @module core 
 * @author kod.connect
 *
 */

var core = new function() {
    
    var t    = this;
    var tmod = 0; // current loading mod at loading stage
    
    var module = function(n){
        var c = 0;
        
        for (var i in t.modules) {
            if (c == n) return i;
            c++;
        }
        
        return -1;
    };
    
    t.modules = {
        c_ : 'commands',
        g_ : 'gameplay',
        i_ : 'input',
        o_ : 'objects',
        u_ : 'interface',
        r_ : 'render',
        s_ : 'sound',
        w_ : 'wad'
    };
    
    t.include = function( f, callback ) {
        
        $.getScript( f )
        .done(function( script, textStatus ) {
            
            if (typeof callback == 'function'){
                callback();
            }
        })
        .fail(function( jqxhr, settings, exception ) {
            console.log(jqxhr, exception );
        });
            
    };
    
    t.init = function(){
        console.log('....core.init()');        
        
        t.loadNext();
    };
    
    t.loadNext = function(){
   
        var m = module(tmod);
        
        if (m != -1) {
        
            window[m] = {}; 
            console.log('..loading engine/'+ core.modules[m] +'.js');
            core.include('engine/'+ core.modules[m] +'.js');
            
            tmod++;
        }
    };  
    
    window.onload = t.init;    
};