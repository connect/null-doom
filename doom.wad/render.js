/*
 * NULL Engine
 * 
 * @module DOOM
 * @author kod.connect
 * 
 */

r_.modInit = function(){
    console.log('r_.modInit()');
    
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1];
 

    // initial screen
    var spriteMaterial = new THREE.SpriteMaterial({ map: r_.imgs.TITLEPIC });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set( scrWidth, scrHeight, 1);
    r_.hudScene.add(sprite);



    /*

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
    }
    */
};

// start render
r_.init();
r_.animate();