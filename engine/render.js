/*
* NULL Engine
* 
* 
* Thanks to http://www.html5rocks.com/en/tutorials/pointerlock/intro/
* 
* @module  render
* @author  kod.connect
* 
*/

var hudCamera, scene, hudScene;
var geometry, material, mesh;
var controls;

var scrMode     = r_.mode.current.split('x');
var scrWidth    = scrMode[0];
var scrHeight   = scrMode[1];
var scale       = scrMode[0] / 320;

var objects = [];

var raycaster;

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controlsEnabled = true;
            controls.enabled = true;

            $('#blocker').hide();

        } else {

            controls.enabled = false;

            $('#blocker').show();
        }
    };

    var pointerlockerror = function ( event ) {

        $('#blocker').hide();
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

} else {

    $('#menu').html('Your browser doesn\'t seem to support Pointer Lock API');
}


var controlsEnabled = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();    


r_.render = function() {
    r_.renderer.clear();
    r_.renderer.render( scene, r_.camera );
    r_.renderer.clearDepth();
    r_.renderer.render( hudScene, hudCamera );
};

r_.init = function() {
    //
    // Hud
    //
    hudCamera = new THREE.OrthographicCamera(
        scrWidth  / -2, scrWidth  /  2,
        scrHeight /  2, scrHeight / -2, 
        -500, 1000 
    );
    hudCamera.position.x = 0;
    hudCamera.position.y = 0;
    hudCamera.position.z = 0;

    hudScene = new THREE.Scene();


    // WEAPON
    //       
    var spriteMaterial = new THREE.SpriteMaterial({map: r_.img.items.SHTGA0});
    r_.wpn = new THREE.Sprite(spriteMaterial);            
    r_.wpn.scale.set( 79 * scale , 60 * scale ,1);
    r_.wpn.position.set(0, (scrHeight/-2) + (60 * scale), 5);         
    hudScene.add(r_.wpn);

    // STATUS
    //   

    var spriteMaterial = new THREE.SpriteMaterial({map: r_.img.items.STBAR});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(320 * scale, 32 * scale ,1);
    sprite.position.set(0, (scrHeight/-2) + (32 * scale / 2) , 10);
    hudScene.add(sprite);

    // FACE
    //     
    var spriteMaterial = new THREE.SpriteMaterial({map: r_.img.items.STFST00});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set( 24 * scale, 29 * scale, 1);
    sprite.position.set( 0, (scrHeight/-2) + (29 * scale / 2), 11);
    hudScene.add(sprite);

    // HEALTH
    //
    r_.hudDraw({
        text: '100%', prefix: 'STT', direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.345),
        z: (scrHeight/-2) + (scrHeight * 0.09)    
    });

    // ARMOR
    //
    r_.hudDraw({
        text: '150%', prefix: 'STT', direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.755)  ,
        z: (scrHeight/-2) + (scrHeight * 0.09)  
    });

    r_.camera = new THREE.PerspectiveCamera( 75, scrWidth /scrHeight, 1, 20000 );

    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0xffffff, 0, 750 );


    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    controls = new THREE.PointerLockControls( r_.camera );
    scene.add( controls.getObject() );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    //
    // floor
    //
    geometry = new THREE.PlaneGeometry( 1000, 1000, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );

    material = new THREE.MeshBasicMaterial({ map: r_.img.items.WALL03_7 });
    material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
    material.map.repeat.set(100, 100);

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    //
    // SKYBOX/FOG
    //

    createSkyBox = function(){

        function createMaterial( path ) {
            var texture = THREE.ImageUtils.loadTexture(path);
            var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

            return material; 
        }

        // Load the skybox images and create list of materials
        var materials = [
            createMaterial( 'doom.wad/gra/SKY4.png' ), // right
            createMaterial( 'doom.wad/gra/SKY4.png' ), // left
            createMaterial( 'doom.wad/gra/SKY4.png' ), // top
            createMaterial( 'doom.wad/gra/F_SKY1.png' ), // bottom
            createMaterial( 'doom.wad/gra/SKY4.png' ), // back
            createMaterial( 'doom.wad/gra/SKY4.png' )  // front
        ];

        // Create a large cube
        var mesh = new THREE.Mesh( 
            new THREE.BoxGeometry( 1000, 1000, 1000, 1, 1, 1 ), 
            new THREE.MeshFaceMaterial( materials ) 
        );

        // Set the x scale to be -1, this will turn the cube inside out
        mesh.scale.set(-1,1,1);
        scene.add( mesh );  
    };

    createSkySphere = function(){                                

        var material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('doom.wad/gra/SKY4.png'),
            side: THREE.BackSide
        });

        var geometry = new THREE.SphereGeometry( 500, 32, 32, 0, 6.3, 0, 1.5 );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.y = -100;
        scene.add(mesh);
    };

    createSkySphere();


    //scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

    //
    // objects
    //

    geometry = new THREE.BoxGeometry( 20, 20, 20 );
    material = new THREE.MeshPhongMaterial({ map: r_.img.items.W28_5 });                                            
    material.map.repeat.set(1, 1);

    for ( var i = 0; i < 30; i ++ ) {
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
        //mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
        mesh.position.y = 10;
        mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
        scene.add( mesh );
        objects.push( mesh );
    }


    material = new THREE.MeshPhongMaterial({ map: r_.img.items.W94_1 });

    for ( var i = 0; i < 200; i ++ ) {
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
        //mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
        mesh.position.y = 30;
        mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
        scene.add( mesh );
        objects.push( mesh );
    }

    material = new THREE.MeshPhongMaterial({ map: r_.img.items.WALL05_2 });

    for (var i = -10; i < 10; i++){               
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = 20 * i;
        mesh.position.y = 10;
        mesh.position.z = 20;
        scene.add( mesh );
        objects.push( mesh );

        /*
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = 20 * 20;
        mesh.position.y = 10;
        mesh.position.z = 20 * i;
        scene.add( mesh );
        objects.push( mesh );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = 20;
        mesh.position.y = 10;
        mesh.position.z = 20 * i;
        scene.add( mesh );
        objects.push( mesh );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = 20 * i;
        mesh.position.y = 10;
        mesh.position.z = 20 * 20;
        scene.add( mesh );
        objects.push( mesh );
        */
    }

    //

    r_.renderer = new THREE.WebGLRenderer({antialias:true});
    r_.renderer.setClearColor( 0xffffff );
    r_.renderer.setPixelRatio( window.devicePixelRatio );
    r_.renderer.setSize( scrWidth, scrHeight );
    r_.renderer.autoClear = false;
    document.body.appendChild( r_.renderer.domElement );

    //

    window.addEventListener( 'resize', r_.onWindowResize, false );
    
    r.animate();
};     

r_.onWindowResize = function () {

        //scrWidth = window.innerWidth;
        //scrHeight= window.innerHeight;
        //scale    = (scrWidth / scrHeight) * 2;

        //camera.aspect = scrWidth / scrHeight;
        //camera.updateProjectionMatrix();
        //renderer.setSize( scrWidth, scrHeight );

}

r_.hudDraw = function(o){

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

        var spriteMaterial = new THREE.SpriteMaterial({map: r_.img.items[ o.prefix + n ]});
        var sprite = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set( 14 * scale, 16 * scale, 1);

        if (direction == 'ltr') {

            sprite.position.set( o.x + (i * scale * 14), o.z, 11);

        } else {

            sprite.position.set( o.x - ((o.text.length - i) * scale * 14), o.z, 11);
        }
        hudScene.add(sprite);
    }
}

r_.animate = function () {

    requestAnimationFrame( r_.animate );

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

    //renderer.render( scene, camera );
    r_.render();
};