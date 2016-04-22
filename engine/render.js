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
r_.floors = [];
r_.mats = {}; // material cachce
r_.imgs = {}; // texture cache
r_.hud = {};

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
        r_.raycaster.ray.origin.y += 200;//cfg.playerHeight;

        var hits = r_.raycaster.intersectObjects( r_.floors );
        
        if (hits[0] != undefined) {
            if (hits[0].distance < cfg.playerHeight) {
                //console.log( hits[0].object)
                i_.controls.getObject().position.y = hits[0].object.position.y + cfg.playerHeight;
            } else if (hits[0].distance > cfg.playerHeight) {
                i_.controls.getObject().position.y = hits[0].object.position.y + cfg.playerHeight;
            }
        } else {
             //i_.controls.getObject().position.y = cfg.playerHeight;
        }
        
        var isOnObject = true; 

        r_.velocity.x -= r_.velocity.x * 5.0 * delta; // 5.0 = speed
        r_.velocity.z -= r_.velocity.z * 5.0 * delta;
        r_.velocity.y -= 9.8 * 150.0 * delta; // 9.8 = ?; 100.0 = mass

        if ( i_.act.forward ) r_.velocity.z -= 1600.0 * delta; // @FIXME: 400 * delta
        if ( i_.act.back )    r_.velocity.z += 1600.0 * delta;

        if ( i_.act.left )    r_.velocity.x -= 1600.0 * delta;
        if ( i_.act.right )   r_.velocity.x += 1600.0 * delta;

        if ( isOnObject === true ) {
            r_.velocity.y = Math.max( 0, r_.velocity.y );
            i_.act.jump = true;
        }

        i_.controls.getObject().translateX( r_.velocity.x * delta );
        i_.controls.getObject().translateY( r_.velocity.y * delta );
        i_.controls.getObject().translateZ( r_.velocity.z * delta );

        /*
        if ( i_.controls.getObject().position.y < cfg.playerHeight ) {

            r_.velocity.y = 0;
            i_.controls.getObject().position.y = cfg.playerHeight;
            i_.act.jump = true;
        } 
        */
    }

    r_.prevTime = time;
    r_.render();
};

r_.drawHud = function(){
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1];
    var scale       = r_.scale;
    var mesh, geometry, material;

    // WEAPON
    //       
    r_.mats.wpn = [ 
        new THREE.SpriteMaterial({map: r_.imgs.SHTGA0}), 
        new THREE.SpriteMaterial({map: r_.imgs.SHTGB0}),
        new THREE.SpriteMaterial({map: r_.imgs.SHTGC0}),
        new THREE.SpriteMaterial({map: r_.imgs.SHTGD0})
    ];
    r_.wpn.obj = new THREE.Sprite(r_.mats.wpn[0]);            
    r_.wpn.obj.scale.set( 79 * scale , 60 * scale ,1);
    r_.wpn.obj.position.set(0, (scrHeight/-2) + (60 * scale) * -1  , 5); // (scrHeight/-2) + (60 * scale)   
    r_.wpn.reading = true;
    r_.objects.push(r_.wpn.obj);
    r_.hudScene.add(r_.wpn.obj);

    // STATUS
    //   

    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STBAR});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(320 * scale, 32 * scale ,1);
    sprite.position.set(0, (scrHeight/-2) + (32 * scale / 2) , 10);
    r_.objects.push(sprite);
    r_.hudScene.add(sprite);

    // ARMS
    //

    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STARMS});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(40 * scale, 32 * scale ,1);
    sprite.position.set((scrWidth/-2) + (scrWidth * 0.385), (scrHeight/-2) + (32 * scale / 2) , 11);
    r_.objects.push(sprite);
    r_.hudScene.add(sprite);

    // FACE
    //                     

    r_.mats.face = [ 
        new THREE.SpriteMaterial({map: r_.imgs.STFST00}), 
        new THREE.SpriteMaterial({map: r_.imgs.STFST01}),
        new THREE.SpriteMaterial({map: r_.imgs.STFST02})
    ];
    r_.hud.face = new THREE.Sprite(r_.mats.face[0]);
    r_.hud.face.scale.set( 24 * scale, 29 * scale, 1);
    r_.hud.face.position.set( 0, (scrHeight/-2) + (29 * scale / 2), 11);
    r_.objects.push( r_.hud.face );
    r_.hudScene.add( r_.hud.face );

    // animate
    r_.animateFace = function(){            
        r_.hud.face.material = r_.mats.face[ c_.random(0,2) ];            
        window.setTimeout(r_.animateFace, c_.random(500, 5000));
    };
    r_.animateFace();

    // AMMO
    //
    r_.drawText({            
        text: '150', prefix: 'STT', 
        width: 14, height: 16, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.16),
        z: (scrHeight/-2) + (scrHeight * 0.09)    
    });

    // HEALTH
    //
    r_.drawText({
        text: '100%', prefix: 'STT', 
        width: 14, height: 16, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.345),
        z: (scrHeight/-2) + (scrHeight * 0.09)    
    });

    // ARMOR
    //
    r_.drawText({
        text: '150%', prefix: 'STT', 
        width:14, height:16, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.755)  ,
        z: (scrHeight/-2) + (scrHeight * 0.09)  
    });

    // Arms numbers
    //
    r_.drawText({
        text: '2', prefix: 'STYS',
        width: 4, height: 6, direction: 'ltr',
        x: (scrWidth/-2) + (scrWidth * 0.348)  ,
        z: (scrHeight/-2) + (scrHeight * 0.105)  
    });
    r_.drawText({
        text: '3', prefix: 'STYS',
        width: 4, height: 6, direction: 'ltr',
        x: (scrWidth/-2) + (scrWidth * 0.39)  ,
        z: (scrHeight/-2) + (scrHeight * 0.105)  
    });
    r_.drawText({
        text: '4', prefix: 'STG',
        width: 4, height: 6, direction: 'ltr',
        x: (scrWidth/-2) + (scrWidth * 0.425)  ,
        z: (scrHeight/-2) + (scrHeight * 0.105)  
    });
    r_.drawText({
        text: '5', prefix: 'STG',
        width: 4, height: 6, direction: 'ltr',
        x: (scrWidth/-2) + (scrWidth * 0.348)  ,
        z: (scrHeight/-2) + (scrHeight * 0.065)  
    });
    r_.drawText({
        text: '6', prefix: 'STG',
        width: 4, height: 6, direction: 'ltr',
        x: (scrWidth/-2) + (scrWidth * 0.39)  ,
        z: (scrHeight/-2) + (scrHeight * 0.065)  
    });
    r_.drawText({
        text: '7', prefix: 'STG',
        width: 4, height: 6, direction: 'ltr',
        x: (scrWidth/-2) + (scrWidth * 0.425)  ,
        z: (scrHeight/-2) + (scrHeight * 0.065)  
    });
};

r_.drawText = function(o){
    var w = o.width;
    var h = o.height;
    
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
        sprite.scale.set( w * r_.scale, h * r_.scale, 1);

        if (o.direction == 'ltr') {

            sprite.position.set( o.x + (i * r_.scale * w), o.z, 12);

        } else {

            sprite.position.set( o.x - ((o.text.length - i) * r_.scale * w), o.z, 12);
        }
        r_.hudScene.add(sprite);
    }
};

r_.findFloor = function(x,z){
    
    r_.raycaster.ray.origin.set({ x: x, y: 200, z: z });

    var hits = r_.raycaster.intersectObjects( r_.floors );
    
    if (hits[0] != undefined) {
        console.log('floor found:',x,z)
        return hits[0];
        
    } else {
        //console.log('no floor:',x,z);
        return false;
    }
};

r_.img = new function(){
    var t = this;
    
    t.load = function(o, success){
        var f;
        //console.log('r_.img.load()');
        
        o.type = (o.type != undefined) ? o.type : 'png';
        
        for (var i in o.files) {
            f = o.files[i];
            console.log('load image:',f);
            
            r_.imgs[ f ] = new THREE.TextureLoader().load( cfg.mod+ "/gra/"+ f +"."+ o.type , function(texture){
                // complete
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;      
                
                if (typeof success == 'function'){
                    
                    success(texture);
                }
                
            },function(e){
                // progress
            },function(e){
                // error
                console.log('Texture loading error:',e)
            });            
        }
        
    };
    
    t.ignored = [
        '-'
    ];
};

// return picture from cache, or cache it
r_.pic = function(f){
    
    if ( r_.imgs[ f ] == undefined )
    {
        r_.img.load({ files: [ f ] });
    }
    
    return r_.imgs[ f ];
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

    r_.renderer = new THREE.WebGLRenderer({ antialias:false });
    r_.renderer.setClearColor( 0xffffff );
    r_.renderer.setPixelRatio( window.devicePixelRatio );
    r_.renderer.setSize( scrWidth, scrHeight );
    r_.renderer.autoClear = false;
    document.body.appendChild( r_.renderer.domElement );

    window.addEventListener( 'resize', r_.onWindowResize, false );
    
    r_.raycaster = new THREE.Raycaster();
    r_.raycaster.ray.direction.set( 0, -1, 0 );
    
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

r_.inPoly = function(point, vs) {
    // function based on
    // https://github.com/substack/point-in-polygon/blob/master/index.js
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
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

r_.onWindowResize = function () {

    //scrWidth = window.innerWidth;
    //scrHeight= window.innerHeight;
    //scale    = (scrWidth / scrHeight) * 2;

    //camera.aspect = scrWidth / scrHeight;
    //camera.updateProjectionMatrix();
    //renderer.setSize( scrWidth, scrHeight );
};

r_.render = function() {
    
    r_.renderer.clear();
    r_.renderer.render( r_.scene, r_.camera );
    r_.renderer.clearDepth();
    r_.renderer.render( r_.hudScene, r_.hudCamera );
};

r_.spawnNumber = function (n,x,y,z){
     
    var step = 16 * r_.scale/4 + 3;
    
    for (var i in n) {
        var matSprite = new THREE.SpriteMaterial({ map: r_.imgs[ 'STTNUM'+ n[i] ] });
        var sprite = new THREE.Sprite( matSprite );
        sprite.scale.set( 14 * r_.scale/4, 16 * r_.scale/4, 1);
        sprite.position.set( x , y + (i * step) + (16 * r_.scale/4) , z );
        r_.scene.add(sprite);
    }
};