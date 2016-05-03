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
r_.floors   = [];
r_.ceilings = [];
r_.walls    = [];
r_.sprites  = [];
r_.mats     = {}; // material cachce
r_.imgs     = {}; // texture cache
r_.hud      = {};
r_.globaltimer = 0;
r_.direction= false;

r_.animate = function () {
    
    requestAnimationFrame( r_.animate );
    
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1];        
    
    var time = performance.now();
    var delta = ( time - r_.prevTime ) / 1000;              
    
    // camera bob
    var bobfactor = 0;
    
    if (r_.wpn.obj != null) {
    
        if (r_.wpn.status == 0) { // preparing

            var thisPos = r_.wpn.obj.position.y += 400.0 * delta;
            var stopPos = (scrHeight/-2) + (60 * r_.scale);


            if (thisPos <= stopPos) {

                r_.wpn.obj.position.set(0, thisPos, 5);

            } else {

                r_.wpn.obj.position.set(0, stopPos, 5);
                r_.wpn.status = 1;
            }

        } else if ( r_.wpn.status == -1) {

            var thisPos = r_.wpn.obj.position.y -= 400.0 * delta;
            var stopPos = (scrHeight/-2) + (60 * r_.scale);


            if (thisPos <= stopPos) {

                r_.wpn.obj.position.set(0, thisPos, 5);

            } else {

                r_.wpn.obj.position.set(0, stopPos, 5);
                r_.wpn.status = 1;
            }
        } 
        
    }
    
    // use/open action
    //
    if ( i_.act.use ){
        
        //console.log('..trying to use something')
        r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
        r_.raycaster.ray.direction.copy( i_.controls.getDirection( new THREE.Vector3() ) );
        var hits = r_.raycaster.intersectObjects( r_.walls );
        
        if (hits[0] != undefined)  {
           
            if (hits[0].object.linedef != undefined && hits[0].distance < 50) {
            
                var line = o_.map.linedef[ hits[0].object.linedef ];
                //var texture = 

                //console.log('....we hit',line)

                if (line.special == 1) {

                    //console.log('......open the door!');
                    c_.opendoor( o_.map.sidedef[ line.sideback ].sector );
                    
                } else {
                    
                    s_.play( s_.ugh );
                }
            }
        }
        
        i_.act.use = false;
    }
    
    // update specials
    //
    if ( o_.map.actions.length > 0){
        
        for (var a in o_.map.actions){
            
            var taction = o_.map.actions[a];
            
            // door opening
            //
            if (taction.special == 1) {              
                
                // raise walls
                //
                for (var i in taction.walls) {
                    
                    var twall = r_.walls[ taction.walls[i] ];
                    twall.position.y += 100 * delta;

                    if ( twall.position.y >= taction.height + (twall.geometry.parameters.height/2) -2 ) {
                        console.log('......door opened')
                        // stop the door, remove action
                        o_.map.actions.splice( a, 1 );
                    }
                }
                
                // raise ceiling
                //
                r_.ceilings[ taction.ceiling ].position.y += 100 * delta;                
            }
        }
    }

    //if ( i_.controls.enabled ) {             
        
        // Fire
        //
        if ( i_.act.attack && r_.wpn.obj != null) {
            //console.log(delta);
            //r_.wpn.obj.material = r_.mats.wpn[ Math.round(delta) % 4 ];
            s_.play('DSPISTOL.ogg');
            i_.act.attack = false;
            
            // test hit or mis
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
            r_.raycaster.ray.direction.copy( i_.controls.getDirection( new THREE.Vector3() ) );
            var hits = r_.raycaster.intersectObjects( r_.sprites );
            
            if (hits[0] != undefined) {
                                
                var thing = o_.things[ hits[0].object.type ];
                var obj   = hits[0].object;
                
                if (thing != undefined && obj.state != 'death' && obj.state != 'gibs'){
                    
                    console.log('hit',thing.label)
                    
                    if (thing.class.indexOf('M') != -1){                        
                        
                        // play death sound
                        if (typeof thing.sfx_death == 'object' && thing.sfx_death.length > 1) {
                            
                            s_.play( thing.sfx_death[ c_.random( 0, thing.sfx_death.length-1 ) ]);
                            
                        } else if (thing.sfx_death != undefined) {
                            
                            s_.play( thing.sfx_death );
                        }                                                
                        
                        // remove obstacle
                        if (thing.class.indexOf('O') != -1) {
                            
                            for (var i in r_.walls) {
                                
                                if (r_.walls[i].id == obj.id) {
                                    r_.walls.splice( i, 1);
                                    break;
                                }
                            }
                        }
                        
                        // put dying state
                        obj.state = 'death';
                        obj.frame = 0;
                        obj.angle = 0;
                    }
                }
            } else {
                
                console.log('mis!')
            }
        }
                        
        // test collisions against walls
        //
        
        var rotationMatrix = new THREE.Matrix4();
        //r_.direction = (r_.direction) ? r_.direction : new THREE.Vector3().copy( i_.controls.getDirection(new THREE.Vector3() ) );
        r_.direction = new THREE.Vector3().copy( i_.controls.getDirection(new THREE.Vector3() ) );
        r_.direction.y = 0;
        
        if ( i_.act.back ) {            
            rotationMatrix.makeRotationY( Math.PI );
        }
        
        if ( i_.act.left ) {            
            rotationMatrix.makeRotationY( 0.5 * Math.PI );
        }
        
        if ( i_.act.right ) {            
            rotationMatrix.makeRotationY( 1.5 * Math.PI );
        }
        
        r_.direction.applyMatrix4(rotationMatrix);
/*        
        // test collisions agains items
        //
        r_.raycaster.ray.origin.copy( i_.controls.getObject().position );        
        r_.raycaster.ray.origin.y -= (cfg.playerHeight/2);
        
        // direct ray
        r_.raycaster.ray.direction.copy( r_.direction );
        var hits  = r_.raycaster.intersectObjects( r_.sprites );
        
        // -30 ray
        rotationMatrix.makeRotationY( -30 * Math.PI / 180 );
        r_.direction.applyMatrix4(rotationMatrix);
        r_.raycaster.ray.direction.copy( r_.direction );
        var hits2 = r_.raycaster.intersectObjects( r_.sprites );
        
        // +30 ray
        rotationMatrix.makeRotationY( +60 * Math.PI / 180 ); // +30 to direct
        r_.direction.applyMatrix4(rotationMatrix);
        r_.raycaster.ray.direction.copy( r_.direction );
        var hits3 = r_.raycaster.intersectObjects( r_.sprites );
        
        // restore direction
        rotationMatrix.makeRotationY( -30 * Math.PI / 180 );
        r_.direction.applyMatrix4(rotationMatrix);
        
        if (hits.length > 0 || hits2.length > 0 || hits3.length > 0) {
            //console.log('--->', hits.length, hits2.length, hits3.length)    
        }   
        
        // merge raycasting results
        var pickups = hits.concat( hits2, hits3 );//.filter( filterUnique );        
        
        if (pickups.length > 0) {
              
            for (var p in pickups) {
                console.log('-->', o_.things[ pickups[p].object.type ].label, pickups[p].distance );

                if (pickups[p].distance < 100) {

                    var thing = o_.things[ pickups[p].object.type ];

                    if ( thing.class.indexOf('P') != -1 ){

                        var id = hits[h].object.id;

                        // pick up item
                        console.log("You've got "+thing.label+'!');

                        if (thing.sound == undefined) {

                            if (thing.class.indexOf('W') != -1) {
                                // weapon
                                s_.play( s_.getweapon );

                            } else {
                                s_.play( s_.getitem );
                            }
                        } 

                        // remove item from world
                        r_.scene.remove( hits[h].object );

                        for (var i in r_.sprites) {
                            if (r_.sprites[i].id == id) {
                                r_.sprites.splice( i, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
*/    
        // collisions with walls 2
        //
        r_.raycaster.ray.origin.copy( i_.controls.getObject().position);
        r_.raycaster.ray.origin.y -= (cfg.playerHeight/2);
        r_.raycaster.ray.direction.copy( r_.direction ); 
        var hits = r_.raycaster.intersectObjects( r_.walls );
        
        if (hits[0] != undefined)
        if (hits[0].distance < 20) {
            
            // pushback alittle                    
            if (i_.act.forward)     {
                i_.act.forward  = false;
                r_.velocity.z   = 21;
                
            } else if (i_.act.back ) {
            //} else {
                
                i_.act.back     = false;
                r_.velocity.z   = -21;
            }
            
            if (i_.act.left ) {
            //if ( r_.direction.x < 0) {
                i_.act.left     = false;
                r_.velocity.x   = 21;
                
            } else if (i_.act.right ) {
            //} else {
                i_.act.right    = false;
                r_.velocity.x   = -21;
                
            }  
            //r_.velocity = new THREE.Vector3(0,0,0);
            //console.log( r_.direction.x, r_.direction.z );
            r_.direction = false;
        }
        
           
    
        
        // change bobfactor while moving
        if ( i_.act.forward || i_.act.back || i_.act.left || i_.act.right) {
            
            bobfactor = Math.sin( time / 100 ) * 5;  
        }                
       
        // test collisions against floor
        //        
        r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
        r_.raycaster.ray.origin.y += 200;//cfg.playerHeight;
        r_.raycaster.ray.direction.set( 0, -1, 0 );
        
        var hits = r_.raycaster.intersectObjects( r_.floors );
        
        // @FIXME
        if (hits[0] != undefined) {
            
            // player weapon shading
            var tsector = o_.map.sector[ hits[0].object.sector ];
            var color   = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')');
            r_.wpn.obj.material.color = color;
            r_.wpn.obj.material.needsUpdate  = true;  
            
            if (hits[0].distance < cfg.playerHeight) {
                //console.log( hits[0].object)
                i_.controls.getObject().position.y = hits[0].object.position.y + cfg.playerHeight + bobfactor;
                
            } else if (hits[0].distance > cfg.playerHeight) {
                
                i_.controls.getObject().position.y = hits[0].object.position.y + cfg.playerHeight + bobfactor;
            }
        } else {
            
             //i_.controls.getObject().position.y = cfg.playerHeight;
        }
        
        var isOnObject = true; 

        r_.velocity.x -= r_.velocity.x * 5.0 * delta; // 5.0 = speed
        r_.velocity.z -= r_.velocity.z * 5.0 * delta;
        r_.velocity.y -= 9.8 * 150.0 * delta; // 9.8 = ?; 100.0 = mass       

        if ( i_.act.forward ) r_.velocity.z -= 1600.0 * delta;
        if ( i_.act.back )    r_.velocity.z += 1600.0 * delta;

        if ( i_.act.left )    r_.velocity.x -= 1600.0 * delta;
        if ( i_.act.right )   r_.velocity.x += 1600.0 * delta;

        if ( isOnObject === true ) {
            r_.velocity.y = Math.max( 0, r_.velocity.y );
            i_.act.jump = true;
        }

        //console.log( r_.velocity.x, r_.velocity.y, r_.velocity.z );

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
      
        r_.globaltimer = (r_.globaltimer * 100 * delta > 10) ? 0 : parseInt(r_.globaltimer)+1; 
        
        // update animated floors
        //
        if (r_.globaltimer == 0) {
            for (var i in r_.floors){

                var o = r_.floors[i];

                if ( o.frame != undefined && o.sprite != undefined) {
                                        
                    var animated  = r_.img.animated[ o.sprite ];
                    var nextFrame = ( animated[ o.frame + 1 ] != undefined ) ? o.frame + 1 : 0;
                    
                    o.frame = nextFrame;
                    o.material.map = r_.imgs[ o.sprite + animated[ nextFrame ] ];
                    o.material.needsUpdate = true;
                }
            };
        }
               
        // Update things
        //
        for (var i in r_.sprites){
            
            var o = r_.sprites[i];
            var tsector;
                        
            r_.raycaster.ray.origin.copy( o.position );
            r_.raycaster.ray.origin.y += 200;

            var hits = r_.raycaster.intersectObjects( r_.floors );

            if (hits[0] != undefined) {
                
                // update things position          
                tsector = o_.map.sector[ hits[0].object.sector ];
                o.position.y = hits[0].object.position.y + (o.material.map.image.height /2);//(o.geometry.parameters.height /2 ); 
                
                // update light source position
                if (o.light != undefined) {                    
                    o.light.position.y = o.position.y + (o.material.map.image.height /2);
                }
                
            } else {
                
                tsector = o_.map.sector[0];
            }
            
            // rotate things to allways face the player
            o.rotation.y = i_.controls.getObject().rotation._y;
            
            // update animation
            if (r_.globaltimer == 0) {
                
                var thing       = o_.things[ o.type ];                                       
                var color       = (o.light != undefined) ? new THREE.Color(0xffffff) : new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                
                if (thing.class.indexOf('M') != -1) { // monster
                    
                    var template    = o_.things[ thing.template ];
                    
                    if (template == undefined) {
                        console.log('..template not found for',thing.label)
                    }
                    
                    var sequence = template[ o.state ];
                    
                    if ( sequence[ o.frame + 1] == undefined ) { // last frame in sequence                                            
                        
                        // let it finally die
                        if ( o.state == 'death') {
                            
                            // remove sprite                            
                            r_.sprites.splice( i, 1 );
                            
                            // remove from scene
                            r_.scene.remove( o );

                            // spawn corpse
                            r_.spawnThing( thing.corpse, o.position.x, o.position.z );      
                            
                            break;
                            
                        } else {
                            
                            var nextFrame = 0;
                        } 
                        
                    } else {
                        
                        // there are some frames to show
                        
                        var nextFrame = o.frame + 1;                        
                    }                                                                        
                
                } else {
                    
                    var sequence    = thing.sequence;
                    var nextFrame   = ( sequence[ o.frame + 1] != undefined) ? o.frame + 1 : 0;                  

                }  
                
                var texture     = r_.imgs[ thing.sprite + sequence[ nextFrame ] + o.angle ];
                
                if (texture == undefined) {
                    
                    console.log('no texture', thing.sprite, o.state, nextFrame, o.angle);
                    
                } else {
                    
                    var oldtxtr   = r_.imgs[ thing.sprite + sequence[ o.frame ] + o.angle ];                    

                    o.scale.x               = texture.image.width / oldtxtr.image.width; 
                    o.scale.y               = texture.image.height / oldtxtr.image.height;
                    o.position.y            = o.position.y - (oldtxtr.image.height/2) + (texture.image.height/2);
                    o.frame                 = nextFrame;
                    o.material.map          = texture;
                    o.material.color        = color;
                    o.material.needsUpdate  = true;                                       
                }
            }                        
        }
    //}

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
        new THREE.SpriteMaterial({map: r_.imgs.PISGA0 }), 
    ];
    r_.wpn.obj = new THREE.Sprite( r_.mats.wpn[0] );                
    
    // pistol
    r_.wpn.obj.scale.set( 57 * scale , 62 * scale ,1);
    r_.wpn.obj.position.set(0, (scrHeight/-2) + (62 * scale) * -1  , 5); // (scrHeight/-2) + (60 * scale)          
    r_.wpn.status = 0;
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
        text: '50', prefix: 'STT', 
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
        text: '0%', prefix: 'STT', 
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
        text: '3', prefix: 'STG',
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
    
    // Ammo Info
    r_.drawText({
        text: '50', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.91)  ,
        z: (scrHeight/-2) + (scrHeight * 0.10)  
    });
    r_.drawText({
        text: '0', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.91)  ,
        z: (scrHeight/-2) + (scrHeight * 0.075)  
    });
    r_.drawText({
        text: '0', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.91)  ,
        z: (scrHeight/-2) + (scrHeight * 0.050)  
    });
    r_.drawText({
        text: '0', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.91)  ,
        z: (scrHeight/-2) + (scrHeight * 0.025)  
    });
    
    r_.drawText({
        text: '200', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.99)  ,
        z: (scrHeight/-2) + (scrHeight * 0.10)  
    });
    r_.drawText({
        text: '50', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.99)  ,
        z: (scrHeight/-2) + (scrHeight * 0.075)  
    });
    r_.drawText({
        text: '50', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.99)  ,
        z: (scrHeight/-2) + (scrHeight * 0.050)  
    });
    r_.drawText({
        text: '300', prefix: 'STYS',
        width: 4, height: 6, direction: 'rtl',
        x: (scrWidth/-2) + (scrWidth * 0.99)  ,
        z: (scrHeight/-2) + (scrHeight * 0.025)  
    });
    
    // Crosshair
    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.cross, transparent: true, opacity: 0.5});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(2 * scale, 2 * scale ,1);
    //sprite.position.set((scrWidth/-2) + (scrWidth * 0.385), (scrHeight/-2) + (32 * scale / 2) , 11);
    r_.objects.push(sprite);
    r_.hudScene.add(sprite);
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
    console.log('findFloor(',x,z);
    
    r_.raycaster2.ray.origin.set({ x: x, y: 100, z: z });

    var hits = r_.raycaster2.intersectObjects( r_.floors );
    
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
    
    t.cached = 0;
    
    t.load = function(o){
        var f;
        //console.log('r_.img.load()');
        
        o.type = (o.type != undefined) ? o.type : 'png';
        
        t.cached = 0;
        
        for (var i in o.files) {
            
            f = o.files[i];
            //console.log('load image:',f);
            
            // if animated texture loaded, cache other frames
            //
            var animated = t.animated[ f.match(/\D+/) ];
            
            if ( animated != undefined ) {                
                
                for (var j in animated) {
                    
                    console.log('......more cache', f.match(/\D+/)+ animated[j]);
                    var more = f.match(/\D+/)+ animated[j];
                    
                    r_.imgs[ more ] = new THREE.TextureLoader().load( cfg.mod+ "/gra/"+ more +"."+ o.type, function(texture){
                        
                        texture.magFilter = THREE.NearestFilter;
                        texture.minFilter = THREE.NearestFilter;
                    });
                }
            }
            
            r_.imgs[ f ] = new THREE.TextureLoader().load( cfg.mod+ "/gra/"+ f +"."+ o.type , function(texture){
                
                // complete                
                texture.magFilter = THREE.NearestFilter;
                //texture.minFilter = THREE.LinearMipMapLinearFilter;   
                texture.minFilter = THREE.NearestFilter;
                //texture.minFilter = THREE.NearestMipMapNearestFilter, 
                
                t.cached++;
                
                if (typeof o.success == 'function'){
                    
                    o.success(texture);
                }
            },function(e){
                
                // progress
            },function(e){
                
                // error
                console.log('Texture loading error:',e)
            });                  
        }
        
    };
    
    t.animated = {        
        NUKAGE : [1,2,3]
    };
    
    t.ignored = [
        '-'
    ];
};

// return picture from cache, or cache it
r_.pic = function(f, repeatX, repeatY, callback){    
    
    if (typeof repeatX == 'function') {
        
        callback = repeatX;
        repeatX  = 1;
        repeatY  = 1;
    }
    
    if ( r_.imgs[ f ] == undefined ) {
        
        r_.img.load({ 
            files: [ f ], 
            success: function(image){
                
                image.wrapS = image.wrapT = THREE.RepeatWrapping; 
                image.repeat.set( repeatX, repeatY );
                
                if (typeof callback == 'function'){

                    callback(image);
                } 
            } 
        });   
        
    } else {
    
        // already cached
        if (typeof callback == 'function'){

            callback(r_.imgs[ f ]);
        }            
    }        
};

r_.postInit = function() {
    console.log('r_.postInit()');
       
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

    //r_.light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 2 );
    r_.light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.5 );
    r_.light.position.set( 0, 0, 0 );
    r_.light.visible = true;
    r_.scene.add( r_.light );
     
    r_.renderer = new THREE.WebGLRenderer({ antialias:false });
    r_.renderer.setClearColor( 0xffffff );
    r_.renderer.setPixelRatio( window.devicePixelRatio );
    r_.renderer.setSize( scrWidth, scrHeight );
    r_.renderer.autoClear = false;
    //r_.renderer.gammaInput = true;
    //r_.renderer.gammaOutput = true;
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

// function based on
// https://github.com/substack/point-in-polygon/blob/master/index.js
// ray-casting algorithm based on
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
r_.inPoly = function(point, vs) {
    
    var x = point.x, y = point.y;
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

r_.mode = new function(){
    console.log('....r_.mode()');
    
    var t = this;
        
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

r_.spawnThing = function( type, x, z, y, state, frame ){  
        
    var thing = o_.things[ type ];
    var texture;
    var sequence;
    var template;
    var angle = 0;    
            
    if (thing == undefined) return; // skip if not found in db

    // define default frame    
    //
    if (thing.sequence[0] == '-') return; // skip special flag

    if (thing.class.indexOf('M') != -1) { // monster
        
        template = o_.things[ thing.template ];
        sequence = template.move;      
        frame    = (frame != undefined) ? frame : c_.random(0, sequence.length-1); // put random starting frame
        angle    = 1;
        
    } else {
        
        sequence = thing.sequence;
        frame    = (frame != undefined) ? frame : c_.random(0, thing.sequence.length-1); 
        angle    = 0;
        
    }    
    
    texture = r_.imgs[ thing.sprite + sequence[frame] + angle ];
    
    if (texture == undefined) {
        console.log('......texture not found', type, o_.things[ type ].label);
        return;
    }                
    
    var matPlane    = new THREE.MeshPhongMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
    var width       = texture.image.width;
    var height      = texture.image.height;
    var geoPlane    = new THREE.PlaneGeometry(width, height);
    var plane       = new THREE.Mesh( geoPlane, matPlane );    
    
    // spawn light sources
    if (thing.light != undefined) {
        
        console.log('..spawning light source', thing.label);
        plane.light = new THREE.PointLight( thing.light, 2, 50 );
        plane.light.position.set(x, 0, z);
        r_.scene.add( plane.light );
    }         
    
    plane.position.set( x, y || 0, z );
    plane.type  = type;
    plane.frame = frame;
    plane.angle = angle;
    plane.state = (state != undefined) ? state : 'move';

    if ( thing.class.indexOf('O') != -1 ) r_.walls.push(plane); // add obstacle

    r_.sprites.push(plane);        
    r_.scene.add(plane);
};

core.loadNext();