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
    if (u_.inmenu()) {
        
        switch (e.keyCode) {
                    
            case 27: // esc
                    u_.menu.back();
                break;
            
            case 40: // down
                    u_.menu.down();           
                break;
            
            case 38: // up
                    u_.menu.up();
                break;
            
            case 13: // enter
                    u_.menu.select();            
                break;
        }        
                
    } else {
        
        switch (e.keyCode) {
            
            case 27: // esc
                    u_.openmenu('root');
                break;
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

i_.onClick = function(e){
    
    if (!u_.inmenu()) {
        var action = i_.bindlist[ 'mouse'+ e.which ];
        
        if (action[0] == '+' || action[0] == '-') {
        
            var cmd = action.substring(1);
        
            if (action[0] == '+'){
                i_.act[ cmd ] = true;
            }
       
        } else {
        
            i_.act[ action ] = true;
        }        
    }
    e.preventDefault();
    return false;
}

i_.pointerlockchange = function ( e ) {
    //console.log('pointerlock change',e);
    
    var element = document.body;

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

        //controlsEnabled = true;
        i_.controls.enabled = true;
        $('#blocker').hide();

    } else {

        i_.controls.enabled = false;              
        u_.openmenu('root');
    }
};

i_.pointerlockerror = function ( e ) {
    console.log(e)
   // $('#blocker').hide();
};

i_.init = function(){
    console.log('i_.init()');
    
    i_.controls = new THREE.PointerLockControls( r_.camera );
    r_.scene.add( i_.controls.getObject() );
    
    document.addEventListener( 'keydown',     i_.onKeyDown, false );
    document.addEventListener( 'keyup',       i_.onKeyUp,   false );
    document.addEventListener( 'click',       i_.onClick,   false );
    document.addEventListener( 'contextmenu', i_.onClick,   false );
    
    // Hook pointer lock state change events
    //
    document.addEventListener( 'pointerlockchange',         i_.pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange',      i_.pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange',   i_.pointerlockchange, false );

    document.addEventListener( 'pointerlockerror',          i_.pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror',       i_.pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror',    i_.pointerlockerror, false );
        
};




