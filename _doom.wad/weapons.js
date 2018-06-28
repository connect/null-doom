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
        contains    : 0,
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
        thing       : 2005,
        contains    : 0,
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
                        
        },
        onPickup    : function(){
            
            return u_.msg.GOTCHAINSAW;
        }
    },
    
    pistol: {
        ammo        : 'bullets',
        contains    : 0,
        sprite      : 'PIS',
        cache       : 'ABCDE',
        offset_x    : 0,
        offset_y    : -50,
        fire        : 'ABCDE',
        flash       : 'A',
        sfx_fire    : s_.bullet,
        delay       : 0,
        cooldown    : 40,
        projectile  : 1001,
        onFire      : function(){
            
            if ( p_.ammo[ o_.weapons[ p_.weapon ].ammo ] < 1) return false; 
            
            var matrix = new THREE.Matrix4();
            var direction = i_.controls.getDirection( new THREE.Vector3() );            
                        
            matrix.makeRotationY( c_.random(-1,1) * Math.PI / 180 );
            direction.applyMatrix4(matrix);        
            
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
            r_.raycaster.ray.direction.copy( direction );
            r_.raycaster.far = 2048;
            
            var hits = r_.raycaster.intersectObjects( r_.obstacles );

            if (hits[0] != undefined) {
                
                var obj     = hits[0].object;
                var thing   = o_.things[ obj.type ];                
                var ammo    = o_.ammo[ o_.weapons[ p_.weapon ].ammo ];
                var damage  = c_.random( ammo.damageMin, ammo.damageMax);
                
                if (thing != undefined && obj.state != 'death' && obj.state != 'gibs'){
                    
                    //console.log('hit',thing.label)
                    
                    if (thing.class.indexOf('M') != -1){                        
                        
                        o_.hurtMonster(obj, damage);
                        
                    } else {
                        
                        o_.hurtObject(obj, damage);
                    }
                    
                } else {
                
                    // hit some level object, spawn sparkle
                    r_.spawnThing(1001, hits[0].point.x, hits[0].point.z, hits[0].point.y, 'death', 0);
                    
                }
            }
            
            p_.ammo[ o_.weapons[ p_.weapon ].ammo ] -= 1;

            return true;
        }
    },
    
    shotgun: {
        thing       : 2001,
        ammo        : 'shells',
        contains    : 8,
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
            
            if ( p_.ammo[ o_.weapons[ p_.weapon ].ammo ] < 1) return false;                
            
            var matrix = new THREE.Matrix4();
            var hits = [];
            var direction = i_.controls.getDirection( new THREE.Vector3() );
            var targets = {}; // target accumulator
            var damaged = {}; //damage accumulator
            
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
            r_.raycaster.far = 2048;
                        
            matrix.makeRotationY( -4 * Math.PI / 180 );
            direction.applyMatrix4(matrix);            
            
            for (var i = 0; i < 7; i++) {
                 
                matrix.makeRotationY( c_.random(0.2, 1.2) * Math.PI / 180 );
                //matrix.makeRotationX( c_.random(-0.2, 0.2)* Math.PI / 180 )
                direction.applyMatrix4(matrix);            
                r_.raycaster.ray.direction.copy( direction );                        
                hits.push( r_.raycaster.intersectObjects( r_.obstacles )[0] );
            }
            
            for (var h in hits) {
                
                if (hits[h] == undefined) continue;
                                
                var obj     = hits[h].object;
                var thing   = o_.things[ obj.type ];
                var ammo    = o_.ammo[ o_.weapons[ p_.weapon ].ammo ];
                var damage  = c_.random( ammo.damageMin, ammo.damageMax);
                
                if (thing != undefined) {
                
                    if (thing.class.indexOf('M') != -1) {
                        
                        targets[ obj.id ] = obj;
                        damaged[ obj.id ] = (damaged[ obj.id ] == undefined) ? damage : damaged[ obj.id ] + damage;
                        
                    } else {
                        
                        // hit other object
                        r_.spawnThing(1001, hits[h].point.x, hits[h].point.z, hits[h].point.y + c_.random(-2,2), 'death', 0);
                    }    
                
                } else {
                    
                    // hit wall
                    r_.spawnThing(1001, hits[h].point.x, hits[h].point.z, hits[h].point.y + c_.random(-2,2), 'death', 0);
                }
                
                if (h == hits.length-1) {
                    
                    // damage accumulated, apply damage
                    o_.hurtMonsters(targets, damaged);                    
                }
            }
            
            p_.ammo[ o_.weapons[ p_.weapon ].ammo ] -= 1;
            return true;
        },
        onPickup    : function(){
            
            return u_.msg.GOTSHOTGUN;
        }
    },
    
    chaingun: {
        thing       : 2002,
        ammo        : 'bullets',
        contains    : 20,
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
                        
            if ( p_.ammo[ o_.weapons[ p_.weapon ].ammo ] < 1) return false; 
            
            var matrix = new THREE.Matrix4();
            var direction = i_.controls.getDirection( new THREE.Vector3() );
            
            matrix.makeRotationY( c_.random(-5.5,5.5) * Math.PI / 180 );
            direction.applyMatrix4(matrix);
            matrix.makeRotationX( c_.random(-5.5,5.5) * Math.PI / 180 );
            direction.applyMatrix4(matrix);            
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
            r_.raycaster.ray.direction.copy( direction );
            r_.raycaster.far = 2048;

            var hits = r_.raycaster.intersectObjects( r_.obstacles );
            
            if (hits[0] != undefined) {
                                
                var obj     = hits[0].object;
                var thing   = o_.things[ obj.type ];                
                var ammo    = o_.ammo[ o_.weapons[ p_.weapon ].ammo ];
                var damage  = c_.random( ammo.damageMin, ammo.damageMax);
                
                if (thing != undefined && obj.state != 'death' && obj.state != 'gibs'){
                    
                    console.log('hit',thing.label)
                    
                    if (thing.class.indexOf('M') != -1){                        
                        
                        o_.hurtMonster(obj, damage);
                    }
                    
                } else {
                
                    // hit some level object, spawn sparkle
                    r_.spawnThing(1001, hits[0].point.x, hits[0].point.z, hits[0].point.y, 'death', 0);
                    
                }
            }
            p_.ammo[ o_.weapons[ p_.weapon ].ammo ] -= 1;
            return true;
        },
        onPickup    : function(){
            
            return u_.msg.GOTCHAINGUN;
        }
    },
    
    rocketlauncher: {
        thing       : 2003,
        ammo        : 'rockets',
        contains    : 2,
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
            if ( p_.ammo[ p_.weapon ] < 1) return false;
            
            p_.ammo[ p_.weapon ] -= 1;
            return true;
        },
        onPickup    : function(){
            
            return u_.msg.GOTLAUNCHER;
        }
    },
    
    plasmagun: {
        thing       : 2004,
        ammo        : 'cells',
        contains    : 40,
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
            if ( p_.ammo[ p_.weapon ] < 1) return false;
            
            p_.ammo[ p_.weapon ] -= 1;
            return true;
        },
        onPickup    : function(){
            
            return u_.msg.GOTPLASMA;
        }
    },
    
    bfg: {
        thing       : 2007,
        ammo        : 'cells',
        contains    : 0,
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
            if ( p_.ammo[ p_.weapon ] < 1) return false;
            
            p_.ammo[ p_.weapon ] -= 1;
            return true;
        },
        onPickup    : function(){
            
            return u_.msg.GOTBFG9000;
        }
    }
};
