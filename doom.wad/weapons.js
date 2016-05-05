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
        fire        : 'BCDE',
        flash       : 'A',
        sfx_fire    : s_.bullet,
        delay       : 0,
        cooldown    : 30,
        hitwall     : {
            sprite  : 'PUFF',
            sequence: 'ABCD',
        },        
        hitflesh    : {
            sprite  : 'BLUD',
            sequence: 'ABC'
        },
        onFire      : {
            
        }
    },
    
    shotgun: {
        ammo        : 'shells',
        sprite      : 'SHT',
        cache       : 'ABCD',
        offset_x    : 0,
        offset_y    : -50,
        fire        : 'BCD',
        flash       : 'AB',
        sfx_fire    : s_.shotgun,
        delay       : 0,
        cooldown    : 90,
    },
    
    chaingun: {
        ammo        : 'bullets',
        sprite      : 'CHG',
        cache       : 'AB',
        offset_x    : 0,
        offset_y    : -150,
        fire        : 'B',
        flash       : 'AB',
        sfx_fire    : s_.bullet,
        delay       : 0,
        cooldown    : 7
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
        cooldown    : 50
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
        cooldown    : 7
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
        cooldown    : 85
    }
};
