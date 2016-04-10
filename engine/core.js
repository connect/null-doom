/**
 * NULL Engine
 * 
 * @module core 
 * @author kod.connect
 *
 */

var core = new function() {
    
    var t = this;
    
    t.modules = {
        c_ : 'commands',
        g_ : 'gameplay',
        i_ : 'input',
        o_ : 'objects',
        u_ : 'interface',
        r_ : 'render',
        s_ : 'sound'
    };
    
    t.include = function( f ) {
        $.getScript( f );
    };
    
    t.init = function(){
        
        t.include( cfg.mod +'/mod.js' );
    };
    
    window.onload = t.init;    
};

// load modules
for (var m in core.modules) {
    
    window[m] = {}; 
    core.include('engine/'+ core.modules[m] +'.js');
}
