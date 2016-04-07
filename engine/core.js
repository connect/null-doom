/**
 * NULL Engine
 * 
 * @module core 
 * @author kod.connect
 *
 */

///////////////////////////////////// CORE /////////////////////////////////////

var core = new function() {
    
    var t = this;
    
    t.include = function( f ) {
        $.getScript( f );
    };
    
    t.init = function(){
        
        t.include( cfg.mod +'/mod.js' );
        //t.include( 'engine/render.js' );
    };
    
};

window.onload = core.init;

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// ENGINE ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var c_ = {};    // Commands
var g_ = {};    // Game
var i_ = {};    // Input
var m_ = {};    // GUI
var o_ = {};    // Objects
var r_ = {};    // Render

/////////////////////////////////// COMMANDS ///////////////////////////////////

c_.zoomin = function(){
    r_.mode.next();
};

c_.zoomout = function(){
    r_.mode.prev();
};

//////////////////////////////////// INPUT /////////////////////////////////////
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

//////////////////////////////////// IMAGES ////////////////////////////////////

r_.img = new function(){
    var t = this;
    
    t.items = {};
    
    t.load = function(o){
        var f;
        
        for (var i in o.files) {
            f = o.files[i];
            
            t.items[ f ] = THREE.ImageUtils.loadTexture(cfg.mod+ "/gra/"+ f +"."+ o.type);
            t.items[ f ].magFilter = THREE.NearestFilter;
            t.items[ f ].minFilter = THREE.LinearMipMapLinearFilter;   
        }
    };
};

r_.mode = new function(){
    var t = this;
    
    t.current = cfg.screenmode;
    
    t.list = [ '640x480', '800x600', '1024x768', '1280x800' ];
    
    t.next = function(){
        // get index of current mode
        var i = t.list.indexOf( t.current );
        
        // check next mode
        if ( i < t.list.length-1 ) {
            // set next mode
            t.set( t.list[i+1] );
        } else {
            // set first mode
            t.set( t.list[0] );
        }
    };
    
    t.prev = function(){
        // get index of current mode
        var i = t.list.indexOf( t.current );
        
        // check prev mode
        if ( i > 0 ) {
            // set next mode
            t.set( t.list[i-1] );
        } else {
            // set last mode
            t.set( t.list[ t.list.length-1 ] );
        }
    };
    
    t.set = function( val ){
        t.current = val;
        
        // update render
        
        var scrMode     = val.split('x');
        r_.camera.aspect = scrMode[0] / scrMode[1];
        r_.camera.updateProjectionMatrix();
        r_.renderer.setSize( scrMode[0], scrMode[1] );
    };
        
};

///////////////////////////////////// GUI //////////////////////////////////////

m_.gui = {
        
};

m_.mnu = new function(){
    var t = this;
    
    t.items = {};
    
    t.init = function( o ){
        var item;
        
        // set background
        if (o.background)
        $('#blocker').prepend('<img class="background" src="'+ cfg.mod +'/gra/'+ o.background +'">');
        
        // set menu heading
        if (o.heading)
        $('#menu').prepend('<img class="heading" src="'+ cfg.mod +'/gra/'+ o.heading +'"><br/>');
        
        // add selector
        $('#menu').append('<img class="selector" ind="0" src="'+ cfg.mod +'/gra/'+ o.selector.img[0] +'">');
        t.selector = o.selector;
        
        // add items
        for (var i in o.items) {
            
            item = o.items[i];
            
            //t.items[i] = o.items[i]
            $('#menu').append('<img id="" src="'+ cfg.mod +'/gra/'+ item.img +'" /><br/>');
        }
        
        
    };
};

$('#blocker').bind( 'click', function ( event ) {

    $('#blocker').hide();
    var element = document.body;

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {

        if (cfg.fullscreen) {

            var fullscreenchange = function ( event ) {

                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                    element.requestPointerLock();
                }

            };

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    } else {

            element.requestPointerLock();

    }

} );

///////////////////////////////////// MAP //////////////////////////////////////

o_.map = {
    data : [],
    load : function(){

    }
};