/*
 * NULL Engine
 * 
 * @module  input
 * @author  kod.connect
 * 
 */

i_ = {
    bindlist        : {}
};

i_.act = {
    forward         : false,
    back            : false,
    left            : false,
    right           : false,
    jump            : false
};

i_.bind = function(key, act){
    
    // if object declaration
    if (typeof key == 'object' && key.length == undefined) {
        
        for (var k in key) {

            i_.bindlist[ k ] = key[k];                    
        }
        
    } else {
           
        i_.bindlist[key] = act;
    }
};

i_.onKeyDown = function(e){    
    var action = i_.bindlist[ e.keyCode ] || '';
    var cmd;
    
    if (action[0] == '+' || action[0] == '-') {
        
        cmd = action.substring(1);
        
        if (action[0] == '+'){
            i_.act[ cmd ] = true;
            
            // disable opposite actions
            switch (cmd){
                
                case 'forward':
                    i_.act.back      = false; break;
                    
                case 'back':
                    i_.act.forward   = false; break;
                    
                case 'left':
                    i_.act.right     = false; break;
                    
                case 'right':
                    i_.act.left      = false; break;
                    
                case 'jump':
                    i_.act.crouch    = false; break;
                    
                case 'crouch':
                    i_.act.jump      = false; break;
            }
        }
       
    } else {
        
        if ( i_.act[ action ] != undefined && action != '') {
            
            i_.act[ action ] = true;   
        }
    }
    
    // call action
    if ( typeof c_[ action ] == 'function' ) {
        c_[ action ]();
    }
    
    // prevend page scrolling with space
    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        return false;
    }
};

i_.onKeyUp = function(e){
    var action = i_.bindlist[ e.keyCode ] || '';
    var cmd;
    
    if (action[0] == '+' || action[0] == '-') {
        
        cmd = action.substring(1);
        
        if (action[0] == '+'){
            i_.act[ cmd ] = false;
        }
       
    } else {
        
        // i.act[ action ] = false;

    }
};


document.addEventListener( 'keydown', i_.onKeyDown, false );
document.addEventListener( 'keyup', i_.onKeyUp, false );