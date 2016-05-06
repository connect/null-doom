/**
 * NULL Engine
 * 
 * @module DOOM/weapons
 * @author kod.connect
 */

o_.weapons = {
        
    default: {
        weapon      : 'G',      // gun suffix: sprite + weapon + state + 0
        flasher     : 'F',
        ready       : 'A',
        blood       : 'BLUD',
        bleed       : 'ABC'
    },
    
    fist: {        
        sprite      : 'PUN',
        cache       : 'ABCD',
        offset_x    : 0,
        offset_y    : -50,
        fire        : 'BCD',
        sfx_fire    : s_.fist,
        delay       : 0,
        cooldown    : 40,        
        onFire      : function(){
            
        }
    },
    
    chainsaw: {
        sprite      : 'SAW',
        cache       : 'ABCD',
        offset_x    : 0,
        offset_y    : -50,
        ready       : 'CD',
        fire        : 'AB',        
        sfx_fire    : s_.chainsaw,
        delay       : 0,
        cooldown    : 60,
        onFire      : function(){
            
        }
    },
    
    pistol: {
        ammo        : 'bullets',
        sprite      : 'PIS',
        cache       : 'ABCDE',
        offset_x    : 0,
        offset_y    : -50,
        fire        : 'ABCDEA',
        flash       : 'A',
        sfx_fire    : s_.bullet,
        delay       : 0,
        cooldown    : 40,
        projectile  : 1001,
        onFire      : function(){
            
            var matrix = new THREE.Matrix4();
            var direction = i_.controls.getDirection( new THREE.Vector3() );            
                        
            matrix.makeRotationY( c_.random(-1,1) * Math.PI / 180 );
            direction.applyMatrix4(matrix);            
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
            r_.raycaster.ray.direction.copy( direction );
            var hits = r_.raycaster.intersectObjects( r_.objects );
            
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
                    
                } else {
                
                    // hit some level object, spawn sparkle
                    r_.spawnThing(1001, hits[0].point.x, hits[0].point.z, hits[0].point.y, 'death', 0);
                    
                }
            }
        }
    },
    
    shotgun: {
        ammo        : 'shells',
        sprite      : 'SHT',
        cache       : 'ABCD',
        offset_x    : 0,
        offset_y    : -50,
        fire        : 'ABCDCA',
        flash       : 'AB',
        sfx_fire    : s_.shotgun,
        delay       : 0,
        cooldown    : 90,
        onFire      : function(){
            
            var matrix = new THREE.Matrix4();
            var hits = [];
            var direction = i_.controls.getDirection( new THREE.Vector3() );
            
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
                        
            matrix.makeRotationY( -4 * Math.PI / 180 );
            direction.applyMatrix4(matrix);            
            
            for (var i = 0; i < 7; i++) {
                 
                matrix.makeRotationY( c_.random(0.2, 1.2) * Math.PI / 180 );
                //matrix.makeRotationX( c_.random(-0.2, 0.2)* Math.PI / 180 )
                direction.applyMatrix4(matrix);            
                r_.raycaster.ray.direction.copy( direction );                        
                hits.push( r_.raycaster.intersectObjects( r_.objects )[0] );
            }
            
            for (var h in hits) {
                                
                var thing = o_.things[ hits[h].object.type ];
                var obj   = hits[h].object;
                
                if (thing != undefined) {
                    
                    if (thing.class.indexOf('M') != -1) {           
                        
                        if ( obj.state != 'death' && obj.state != 'gibs') {                                    
                            
                            console.log('hit',thing.label)         

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
                        
                       // r_.spawnThing(c_.random(1002,1004), hits[h].point.x, hits[h].point.z, hits[h].point.y, 'death', 0);
                        
                    } else {
                        
                        // hit some level object, spawn sparkle
                        // make sparkle a bit closer to player
                        var closerX = (hits[h].point.x + i_.controls.getObject().position.x) - 2;
                        var closerZ = (hits[h].point.z + i_.controls.getObject().position.z) - 2;
                        r_.spawnThing(1001, hits[h].point.x, hits[h].point.z, hits[h].point.y + c_.random(-2,2), 'death', 0);
                    }
                    
                } else {
                
                    // hit some level object, spawn sparkle
                    // make sparkle a bit closer to player
                    var closerX = (hits[h].point.x + i_.controls.getObject().position.x) - 2;
                    var closerZ = (hits[h].point.z + i_.controls.getObject().position.z) - 2;
                    r_.spawnThing(1001, hits[h].point.x, hits[h].point.z, hits[h].point.y + c_.random(-2,2), 'death', 0);
                    
                }
            }
            
        }
    },
    
    chaingun: {
        ammo        : 'bullets',
        sprite      : 'CHG',
        cache       : 'AB',
        offset_x    : 0,
        offset_y    : -150,
        fire        : 'AB',
        flash       : 'AB',
        sfx_fire    : s_.bullet,
        delay       : 0,
        cooldown    : 7,
        onFire      : function(){
            
            // test hit or mis
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
            r_.raycaster.ray.direction.copy( i_.controls.getDirection( new THREE.Vector3() ) );
            var hits = r_.raycaster.intersectObjects( r_.objects );
            
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
                    
                } else {
                
                    // hit some level object, spawn sparkle
                    r_.spawnThing(1001, hits[0].point.x, hits[0].point.z, hits[0].point.y, 'death', 0);
                    
                }
            }
            
        }
    },
    
    rocketlauncher: {
        ammo        : 'rockets',
        sprite      : 'MIS',
        cache       : 'AB',
        offset_x    : 0,
        offset_y    : -150,
        fire        : 'B',
        flash       : 'ABCD',               
        sfx_fire    : s_.rlauncher,
        delay       : 0,
        cooldown    : 50,
        onFire      : function(){
            
        }
    },
    
    plasmagun: {
        ammo        : 'cells',
        sprite      : 'PLS',
        cache       : 'AB',
        offset_x    : 0,
        offset_y    : -50,
        fire        : 'B',
        flash       : 'AB',
        sfx_fire    : s_.plasma,
        delay       : 0,
        cooldown    : 7,
        onFire      : function(){
            
        }
    },
    
    bfg: {
        ammo        : 'cells',
        sprite      : 'BFG',
        cache       : 'ABC',
        offset_x    : 0,
        offset_y    : -100,
        fire        : 'BC',
        flash       : 'AB',
        sfx_fire    : s_.bfg,
        delay       : 0,
        cooldown    : 85,
        onFire      : function(){
            
        }
    }
};
