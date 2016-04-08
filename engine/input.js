/*
 * NULL Engine
 * 
 * @module  input
 * @author  kod.connect
 * 
 */

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

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
    
    // menu navigations
    if (u_.inmenu) {
        
        // esc
        if (e.keyCode == 27) {
            $('#blocker').trigger('click');
        } 
        
        if (e.keyCode == 40) {
            u_.mnu.down();
        }
        
        if (e.keyCode == 38) {
            u_.mnu.up();
        }
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

i_.init = function(){
    console.log('i_.init()');
    
    i_.controls = new THREE.PointerLockControls( r_.camera );
    r_.scene.add( i_.controls.getObject() );
    
    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange',         i_.pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange',      i_.pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange',   i_.pointerlockchange, false );

    document.addEventListener( 'pointerlockerror',          i_.pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror',       i_.pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror',    i_.pointerlockerror, false );
};

i_.pointerlockchange = function ( e ) {
        
    var element = document.body;

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

        //controlsEnabled = true;
        i_.controls.enabled = true;

        $('#blocker').hide();

    } else {

        i_.controls.enabled = false;

        $('#blocker').show();
    }
};

i_.pointerlockerror = function ( e ) {

    $('#blocker').hide();
};


document.addEventListener( 'keydown', i_.onKeyDown, false );
document.addEventListener( 'keyup', i_.onKeyUp, false );