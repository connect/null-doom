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
        ready       : 'A'
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
        cooldown    : 30,
        projectile  : 1001,
        hitflesh    : {
            sprite  : 'BLUD',
            sequence: 'ABC'
        },
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
                        obj.frame = -1;
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
