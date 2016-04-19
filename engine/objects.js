o_.map = new function(){   
    
    var t = this;
    
    t.current   = -1; // none
    t.list      = [];
    
    t.data      = [];
    t.thing     = [];
    t.vertex    = [];
    t.linedef   = [];
    t.sidedef   = [];
    t.sector    = [];
    
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
    
    t.createStartSpot = function(){
        
    };
    
    t.load = function(){
        // consider all necessary data is already in arrays after .readUDMF()
        
        $('#blocker').hide();
        
        var scrMode     = r_.mode.current.split('x');
        var scrWidth    = scrMode[0];
        var scrHeight   = scrMode[1];
        var scale       = r_.scale;
        
        var mesh, geometry, material;
        
        t.loadTest();
        
        // load sectors
        t.loadSectors();
        
        // load walls
        t.loadWalls();
        
        // load sprites
        t.loadSprites();
        
        // create start spot
        t.createStartSpot();         
        
        // remove initial back screen
        r_.hudScene.remove( r_.back );      
        
        // music
        s_.playMusic('D_E1M8.mp3');
        
    };
    
    t.loadSectors = function(){
        // get special lights
        
        
        for (var s in t.sector) {
            
        }
    };
    
    t.loadSprites = function(){
        
    };
    
    // draw sector 0
    t.loadTest = function(){
        var sides = {};
        var lines = {};
        var sec = t.sector[0];

        for (var i in t.sidedef){           
        
            // get sides
            if (t.sidedef[i].sector == sec.id) {
                sides[i] = t.sidedef[i];
                
                for (var j in t.linedef) {
                    
                    if (t.linedef[j].sidefront == i) {
                        
                        lines[j] = t.linedef[j];
                    }
                }
            }            
        }             
            
        console.log('sides',sides)
        console.log('lines',lines)
    };
    
    t.loadWalls = function(){
        var sides = [];
        var lines = [];
        
        // First mark each sidedef with the sector it belongs to
        for (var s in t.sector){
            
            if ( t.sector[s].id ) {
                
            }            
        }
       
        // DEBUG
        var sec = t.sector[0];
        for (var i in t.sidedef){
            if (t.sidedef[i].sector == sec.id) {
                sides.push(i);
            }
        }
        for (i in sides ){            
            var geometry = new THREE.PlaneGeometry( 1000, 1000, 100, 100 );
            geometry.rotateX( - Math.PI / 2 );

            var material = new THREE.MeshBasicMaterial({ map: r_.imgs.WALL03_7 });
            material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
            material.map.repeat.set(100, 100);

            var mesh = new THREE.Mesh( geometry, material );
            r_.scene.add( mesh );        
        }
        
        
        // Now copy wall properties to their matching sidedefs
        
        
        // Set line properties that Doom doesn't store per-sidedef
        
        
        // Finish setting sector properties that depend on walls
        
        
    };
    
    t.loadDISABLED = function(){
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
        t.readUDMF( t.list[i] );
    };
    
    t.readUDMF = function(f){
        // Structures
        //
        
        var Factory = function(type, o){
            
            var f = this;
            
            if ( type.length == 0 || t[ type ] == undefined ) return false;
       
            f.linedef = {
                id              : t.linedef.length, // <integer>; // ID of line. Interpreted as tag or scripting id.
                                                    // Default = -1. *** see below.
                v1              : null,     // <integer>; // Index of first vertex. No valid default.
                v2              : null,     // <integer>; // Index of second vertex. No valid default.
                blocking        : false,    // <bool>; // true = line blocks things.
                blockmonsters   : false,    // <bool>; // true = line blocks monsters.
                twosided        : false,    // <bool>; // true = line is 2S.
                dontpegtop      : false,    // <bool>; // true = upper texture unpegged.
                dontpegbottom   : false,    // <bool>; // true = lower texture unpegged.
                secret          : false,    // <bool>; // true = drawn as 1S on map.
                blocksound      : false,    // <bool>; // true = blocks sound.
                dontdraw        : false,    // <bool>; // true = line never drawn on map.
                mapped          : false,    // <bool>; // true = always appears on map.
                comment         : ''        // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
       
            f.sidedef = {
                offsetx         : 0,        // <integer>; // X Offset. Default = 0.
                offsety         : 0,        // <integer>; // Y Offset. Default = 0.
                texturetop      : '-',      // <string>; // Upper texture. Default = "-".
                texturebottom   : '-',      // <string>; // Lower texture. Default = "-".
                texturemiddle   : '-',      // <string>; // Middle texture. Default = "-".
                sector          : null,     // <integer>; // Sector index. No valid default.
                comment         : ''        // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
      
            f.vertex  = {
                x               : null,     // <float>; // X coordinate. No valid default.
                y               : null      // <float>; // Y coordinate. No valid default.
            };
        
            f.sector  = {
                heightfloor     : 0,        // <integer>; // Floor height. Default = 0.
                heightceiling   : 0,        // <integer>; // Ceiling height. Default = 0.
                texturefloor    : '',       // <string>; // Floor flat. No valid default.
                textureceiling  : '',       // <string>; // Ceiling flat. No valid default.
                lightlevel      : 160,      // <integer>; // Light level. Default = 160.
                special         : 0,        // <integer>; // Sector special. Default = 0.
                id              : t.sector.length, // <integer>; // Sector tag/id. Default = 0.
                comment         : ''        // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
        
            f.thing   = {
                id            : t.thing.length, // <integer>; // Thing ID. Default = 0.
                x             : null,       // <float>; // X coordinate. No valid default.
                y             : null,       // <float>; // Y coordinate. No valid default.
                height        : null,       // <float>; // Z height relative to floor. Default = 0.
                                            // (Relative to ceiling for SPAWNCEILING items).
                angle         : null,       // <integer>; // Map angle of thing in degrees. Default = 0 (East).
                type          : null,       // <integer>; // DoomedNum. No valid default.
                skill1        : false,      // <bool>; // true = in skill 1.
                skill2        : false,      // <bool>; // true = in skill 2.
                skill3        : false,      // <bool>; // true = in skill 3.
                skill4        : false,      // <bool>; // true = in skill 4.
                skill5        : false,      // <bool>; // true = in skill 5.
                ambush        : false,      // <bool>; // true = thing is deaf.
                single        : false,      // <bool>; // true = in SP mode.
                dm            : false,      // <bool>; // true = in DM mode.
                coop          : false,      // <bool>; // true = in Coop.
                friend        : false,      // <bool>; // true = MBF friend.
                comment       : ''          // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
        
            var obj = $.extend( f[ type ], o );

            t[ type ].push( obj );

            return obj;                
        };
        
        // load file to memory, then call .load()
        //
        $.get( cfg.mod +'/maps/'+ f +'.udmf')
            .done(function(res){
                
                var obj, o, l, type, namespace, option, value;
        
                res = res.split('}');
                
                // parse file line by line
                //                                
                for (var i in res) {
                    // convert to js object
                    //
                    o = res[i]
                            .replace('\n{',';')
                            .replace(/\s/g,'')
                            .replace(/\n/g,'')
                            .replace(/=/g,':')                         
                            .split(';');
                    
                    if (i == 0) {
                        // get namespace
                        namespace = o.shift();
                    }
                    
                    type = o.shift();
                    type = type.substring(0, type.indexOf('//') ).trim();
                    
                    obj = {};
                    
                    for (var j in o) {
                        if ( o[j].length > 0 ) {

                            l = o[j].split(':');

                            option  = l[0].trim();
                            
                            if (isNaN(Number( l[1] ))) {
                                
                                value = l[1].replace(/\"/g,'');
                                
                                if (value == "true") {
                                    value = true;
                                } else if (value == "false"){
                                    value = false;
                                }
                            } else {
                                
                                value = Number( l[1] );
                            }
                                                     
                            obj[ option ] = value;
                        }
                    }
                    // create udmf entity and push to proper array
                    o = Factory( type, obj );
                    
                    if (i == res.length-1 ){
                        // last
                        
                        t.load();
                    }
                }
            });
    };
};
