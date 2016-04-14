/*
 * NULL Engine
 *  
 * 
 * Thanks to http://www.html5rocks.com/en/tutorials/pointerlock/intro/
 * 
 * @module  render
 * @author  kod.connect
 * 
 * @TODO Refactor This File Content
 */


//var controlsEnabled = false;
r_.prevTime = performance.now();
r_.velocity = new THREE.Vector3();   
r_.objects  = [];
r_.mats = {}; // material cachce
r_.imgs = {}; // texture cache
r_.hud = {};

r_.img = new function(){
    var t = this;
    
    t.load = function(o){
        var f;
        console.log('r_.img.load()');
        
        
        for (var i in o.files) {
            f = o.files[i];
            
            r_.imgs[ f ] = new THREE.TextureLoader().load( cfg.mod+ "/gra/"+ f +"."+ o.type , function(texture){
                // complete
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;   
            },function(e){
                // progress
            },function(e){
                // error
                console.log('Texture loading error:',e)
            });            
        }
        
    };
};

r_.mode = new function(){
    var t = this;
    console.log('r_.mode()');
    
    t.list      = [ '640x480', '800x600', '1024x768', '1280x800' ];
    t.current   = cfg.screenmode;    
    r_.scale    = cfg.screenmode.split('x')[0] / 320;
    
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
        console.log('r_.mode.set()');
        
        var scrMode = val.split('x');
                       
        // update render
        r_.camera.aspect = scrMode[0] / scrMode[1];
        r_.camera.updateProjectionMatrix();
        r_.renderer.setSize( scrMode[0], scrMode[1] );
        r_.scale = scrMode[0] / 320;
        
        t.current = val;
    };
        
};

r_.render = function() {
    
    r_.renderer.clear();
    r_.renderer.render( r_.scene, r_.camera );
    r_.renderer.clearDepth();
    r_.renderer.render( r_.hudScene, r_.hudCamera );
};

r_.init = function() {
    console.log('r_.init()');
       
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1];
    
    //
    // Hud
    //
    r_.hudCamera = new THREE.OrthographicCamera(
        scrWidth  / -2, scrWidth  /  2,
        scrHeight /  2, scrHeight / -2, 
        -500, 1000 
    );
    r_.hudCamera.position.x = 0;
    r_.hudCamera.position.y = 0;
    r_.hudCamera.position.z = 0;

    r_.hudScene = new THREE.Scene();

    r_.camera = new THREE.PerspectiveCamera( 75, scrWidth /scrHeight, 1, 20000 );

    r_.scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    r_.light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    r_.light.position.set( 0.5, 1, 0.75 );
    r_.scene.add( r_.light );
 
    r_.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    r_.renderer = new THREE.WebGLRenderer({ antialias:true });
    r_.renderer.setClearColor( 0xffffff );
    r_.renderer.setPixelRatio( window.devicePixelRatio );
    r_.renderer.setSize( scrWidth, scrHeight );
    r_.renderer.autoClear = false;
    document.body.appendChild( r_.renderer.domElement );

    window.addEventListener( 'resize', r_.onWindowResize, false );
    
    i_.init();    
    r_.modInit();
    
    $('canvas').bind( 'click', function ( e ) {

        var element = document.body;

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {

            if (cfg.fullscreen) {

                var fullscreenchange = function ( e ) {

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

    });
};     

r_.onWindowResize = function () {

    //scrWidth = window.innerWidth;
    //scrHeight= window.innerHeight;
    //scale    = (scrWidth / scrHeight) * 2;

    //camera.aspect = scrWidth / scrHeight;
    //camera.updateProjectionMatrix();
    //renderer.setSize( scrWidth, scrHeight );
};

r_.hudDraw = function(o){
    console.log('r_.hudDraw()');

    var direction = o.direction || 'ltr';

    for (var i in o.text){
        var n = o.text[i];

        if (n == '%') {
            n = 'PRCNT';
        } else if (n == '-') {
            n = 'MINUS';
        } else if ( parseInt(n) >= 0 && parseInt(n) <= 9 ) {
            n = 'NUM'+ n;
        }

        var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs[ o.prefix + n ]});
        var sprite = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set( 14 * r_.scale, 16 * r_.scale, 1);

        if (direction == 'ltr') {

            sprite.position.set( o.x + (i * r_.scale * 14), o.z, 11);

        } else {

            sprite.position.set( o.x - ((o.text.length - i) * r_.scale * 14), o.z, 11);
        }
        r_.hudScene.add(sprite);
    }
};

r_.drawText = function(o){
    for (var i in o.text){
        var n = o.text[i];

        if (n == '%') {
            n = 'PRCNT';
        } else if (n == '-') {
            n = 'MINUS';
        } else if ( parseInt(n) >= 0 && parseInt(n) <= 9 ) {
            n = 'NUM'+ n;
        }

        var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs[ o.prefix + n ]});
        var sprite = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set( 14 * r_.scale, 16 * r_.scale, 1);

        if (direction == 'ltr') {

            sprite.position.set( o.x + (i * r_.scale * 14), o.z, 11);

        } else {

            sprite.position.set( o.x - ((o.text.length - i) * r_.scale * 14), o.z, 11);
        }
        r_.hudScene.add(sprite);
    }
};

r_.animate = function () {
    
    requestAnimationFrame( r_.animate );
    
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1];        
    
    var time = performance.now();
    var delta = ( time - r_.prevTime ) / 1000;
    
    if (r_.wpn.reading) {

        var thisPos = r_.wpn.obj.position.y += 400.0 * delta;
        var stopPos = (scrHeight/-2) + (60 * r_.scale);


        if (thisPos <= stopPos) {

            r_.wpn.obj.position.set(0, thisPos, 5);

        } else {

            r_.wpn.obj.position.set(0, stopPos, 5);
            r_.wpn.reading = false;
        }

    } else if ( i_.act.attack) {
        //console.log(delta);
        //r_.wpn.obj.material = r_.mats.wpn[ Math.round(delta) % 4 ];
    }

        

    if ( i_.controls.enabled ) {
        r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
        r_.raycaster.ray.origin.y -= 10;

        var intersections = r_.raycaster.intersectObjects( r_.objects );

        var isOnObject = intersections.length > 0;

        

        r_.velocity.x -= r_.velocity.x * 5.0 * delta; // 5.0 = speed
        r_.velocity.z -= r_.velocity.z * 5.0 * delta;
        r_.velocity.y -= 9.8 * 150.0 * delta; // 9.8 = ?; 100.0 = mass

        if ( i_.act.forward ) r_.velocity.z -= 400.0 * delta;
        if ( i_.act.back )    r_.velocity.z += 400.0 * delta;

        if ( i_.act.left )    r_.velocity.x -= 400.0 * delta;
        if ( i_.act.right )   r_.velocity.x += 400.0 * delta;

        if ( isOnObject === true ) {
            r_.velocity.y = Math.max( 0, r_.velocity.y );
            i_.act.jump = true;
        }

        i_.controls.getObject().translateX( r_.velocity.x * delta );
        i_.controls.getObject().translateY( r_.velocity.y * delta );
        i_.controls.getObject().translateZ( r_.velocity.z * delta );

        if ( i_.controls.getObject().position.y < 10 ) {

            r_.velocity.y = 0;
            i_.controls.getObject().position.y = 10;
            i_.act.jump = true;
        }       
    }

    r_.prevTime = time;
    r_.render();
};