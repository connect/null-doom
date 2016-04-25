/* 
 * NULL Engine
 *
 * @module core/wad
 * @author kod.connect
 */

var w_ = new function(){
    
    var t    = this;
    var tmod = 0; 
   
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
        s_ : 'sound'
    };
    
    t.init = function(){
        console.log('....w_.init()');
        
        t.loadNext();
    };
    
    t.loadNext = function(){
        
        var m = module(tmod);

        if (m != -1) {

            console.log('..loading '+ cfg.mod +'/'+ t.modules[m] +'.js');
            core.include( cfg.mod +'/'+ t.modules[m] +'.js');        

            tmod++;
        }
    };
    
    t.init();
};


core.loadNext();
