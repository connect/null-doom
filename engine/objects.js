o_.map = new function(){   
    
    var t = this;
    
    t.current   = -1; // none
    t.list      = [];
    
    t.data      = [];
    t.things    = [];
    t.vertexes  = [];
    t.linedefs  = [];
    t.sidedefs  = [];
    t.sectors   = [];
    
    t.add = function(o){
        console.log('o_.map.add()')
        if (typeof o == 'object' && o.length != undefined) {
            // array 
            for (var i in o){
                t.list.push(o[i]);
            }
        } else {
            // single
            t.list.push(o);
        }
        
    };
    
    t.load = function(){
        console.log('o_.map.load()')
        
        //
        // start map load sequence
        //        
        
        $('#blocker').hide();
        
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
        r_.hudScene.add(r_.wpn.obj);

        // STATUS
        //   

        var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STBAR});
        var sprite = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set(320 * scale, 32 * scale ,1);
        sprite.position.set(0, (scrHeight/-2) + (32 * scale / 2) , 10);
        r_.hudScene.add(sprite);
        
        // ARMS
        //
        
        var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STARMS});
        var sprite = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set(40 * scale, 32 * scale ,1);
        sprite.position.set((scrWidth/-2) + (scrWidth * 0.385), (scrHeight/-2) + (32 * scale / 2) , 11);
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
        r_.hudScene.add( r_.hud.face );
        
        // animate
        r_.animateFace = function(){            
            r_.hud.face.material = r_.mats.face[ c_.random(0,2) ];            
            window.setTimeout(r_.animateFace, c_.random(500, 5000));
        };
        r_.animateFace();

        // AMMO
        //
        r_.hudDraw({
            text: '150', prefix: 'STT', direction: 'rtl',
            x: (scrWidth/-2) + (scrWidth * 0.16),
            z: (scrHeight/-2) + (scrHeight * 0.09)    
        });

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

        material = new THREE.MeshBasicMaterial({ map: r_.imgs.WALL03_7 });
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(100, 100);

        mesh = new THREE.Mesh( geometry, material );
        r_.scene.add( mesh );

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
            r_.scene.add(mesh);
        };

        createSkySphere();


        //scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

        //
        // objects
        //

        geometry = new THREE.BoxGeometry( 20, 20, 20 );
        material = new THREE.MeshPhongMaterial({ map: r_.imgs.W28_5 });                                            
        material.map.repeat.set(1, 1);

        for ( var i = 0; i < 150; i ++ ) {
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
            //mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
            mesh.position.y = 10;
            mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
            r_.scene.add( mesh );
            r_.objects.push( mesh );
        }


        material = new THREE.MeshPhongMaterial({ map: r_.imgs.W94_1 });

        for ( var i = 0; i < 200; i ++ ) {
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
            //mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
            mesh.position.y = 30;
            mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
            r_.scene.add( mesh );
            r_.objects.push( mesh );
        }

        material = new THREE.MeshPhongMaterial({ map: r_.imgs.WALL05_2 });

        for (var i = -10; i < 10; i++){               
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = 20 * i;
            mesh.position.y = 10;
            mesh.position.z = 20;
            r_.scene.add( mesh );
            r_.objects.push( mesh );
        }
        
        // remove initial back screen
        r_.hudScene.remove( r_.back );      
        
        // music
        s_.playMusic('D_E1M8.mp3');

    };
    
    t.next = function(){        
        
        var i = ( t.current < t.list.length -1 ) ? t.current + 1 : 0;                
        
        t.current = i;
        t.load( t.list[i] );
    };
    
    t.readUDMF = function(f){
        // load file to memory
        //
        $.get( cfg.mod +'/maps/'+ f +'.udmf')
            .done(function(res){
                // parse file
                //

                // parse things
                //

                // parse vertexes
                //

                // parse linedefs
                //

                // parse sidedefs
                //

                // sectors
                //
            });
    };
};
