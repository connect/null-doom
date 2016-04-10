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
var prevTime = performance.now();
var velocity = new THREE.Vector3();   

r_.imgs = {}; // texture cache

r_.img = new function(){
    var t = this;
    
    t.load = function(o){
        var f;
        console.log('r_.img.load()');
        
        for (var i in o.files) {
            f = o.files[i];
            
            r_.imgs[ f ] = THREE.ImageUtils.loadTexture(cfg.mod+ "/gra/"+ f +"."+ o.type);
            r_.imgs[ f ].magFilter = THREE.NearestFilter;
            r_.imgs[ f ].minFilter = THREE.LinearMipMapLinearFilter;   
        }
    };
};

r_.mode = new function(){
    var t = this;
    console.log('r_.mode()');
    
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
        var scrMode = val.split('x');
        console.log('r_.mode.set()');        
        
        // update render
        r_.camera.aspect = scrMode[0] / scrMode[1];
        r_.camera.updateProjectionMatrix();
        r_.renderer.setSize( scrMode[0], scrMode[1] );
        
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
    
    var raycaster;    
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1];
    r_.scale        = scrMode[0] / 320;
    
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

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    r_.scene.add( light );
 
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    r_.renderer = new THREE.WebGLRenderer({ antialias:true });
    r_.renderer.setClearColor( 0xffffff );
    r_.renderer.setPixelRatio( window.devicePixelRatio );
    r_.renderer.setSize( scrWidth, scrHeight );
    r_.renderer.autoClear = false;
    document.body.appendChild( r_.renderer.domElement );

    window.addEventListener( 'resize', r_.onWindowResize, false );
    i_.init();    
    r_.modInit();
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
    console.log('r_.hudDraw()')
return; /*
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
    }*/
}

r_.animate = function () {
    
    requestAnimationFrame( r_.animate );
/*
    if ( controlsEnabled ) {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );

        var isOnObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 5.0 * delta; // 5.0 = speed
        velocity.z -= velocity.z * 5.0 * delta;

        velocity.y -= 9.8 * 150.0 * delta; // 9.8 = ?; 100.0 = mass

        if ( i_.act.forward ) velocity.z -= 400.0 * delta;
        if ( i_.act.back ) velocity.z += 400.0 * delta;

        if ( i_.act.left ) velocity.x -= 400.0 * delta;
        if ( i_.act.right ) velocity.x += 400.0 * delta;

        if ( isOnObject === true ) {
                velocity.y = Math.max( 0, velocity.y );

                i_.act.jump = true;
        }

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

                velocity.y = 0;
                controls.getObject().position.y = 10;

                i_.act.jump = true;
        }

        prevTime = time;
    }
*/

    r_.render();
};