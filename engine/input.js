/*
 * NULL Engine
 * 
 * @module  input
 * @author  kod.connect
 * 
 */

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}


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
        
        //console.log(u_.inmenu, $('#blocker').is(':visible'))
        
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

i_.pointerlockchange = function ( e ) {
    console.log('pointerlock change',e)    
    
    var element = document.body;

    console.log('--->',document.pointerLockElement,document.mozPointerLockElement,document.webkitPointerLockElement)

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
    
    document.addEventListener( 'keydown', i_.onKeyDown, false );
    document.addEventListener( 'keyup', i_.onKeyUp, false );
    
    
    // Hook pointer lock state change events
    
    document.addEventListener( 'pointerlockchange',         i_.pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange',      i_.pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange',   i_.pointerlockchange, false );

    document.addEventListener( 'pointerlockerror',          i_.pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror',       i_.pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror',    i_.pointerlockerror, false );
    
    // Ask the browser to lock the pointer        
    /*
    var element = document.body;
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock(); 
    */
    var e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', true, true, window, 0,300,300,300,300,false,false,false,false,0,null);
        document.getElementById('blocker').dispatchEvent(e);
};




