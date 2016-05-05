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
        offset_y    : 0,
        fire        : 'BCD',
        fireDelay   : 0,
        cooldown    : 0,
        onFire      : function(){
            
        }
    },
    
    chainsaw: {
        sprite      : 'SAW',
        cache       : 'ABCD',
        offset_x    : 0,
        offset_y    : 0,
        ready       : 'CD',
        fire        : 'AB',        
        fireDelay   : 0,
        cooldown    : 0,
        onFire      : function(){
            
        }
    },
    
    pistol: {
        ammo        : 'bullets',
        sprite      : 'PIS',
        cache       : 'ABCDE',
        offset_x    : 0,
        offset_y    : 0,
        fire        : 'BCDE',
        flash       : 'A',
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
        offset_y    : 0,
        fire        : 'BCD',
        flash       : 'AB'
    },
    
    chaingun: {
        ammo        : 'bullets',
        sprite      : 'CHG',
        cache       : 'AB',
        offset_x    : 0,
        offset_y    : -100,
        fire        : 'B',
        flash       : 'AB'
    },
    
    rocketlauncher: {
        ammo        : 'rockets',
        sprite      : 'MIS',
        cache       : 'AB',
        offset_x    : 0,
        offset_y    : -100,
        fire        : 'B',
        flash       : 'ABCD'
    },
    
    plasmagun: {
        ammo        : 'cells',
        sprite      : 'PLS',
        cache       : 'AB',
        offset_x    : 0,
        offset_y    : 0,
        fire        : 'B',
        flash       : 'AB'
    },
    
    bfg: {
        ammo        : 'cells',
        sprite      : 'BFG',
        cache       : 'ABC',
        offset_x    : 0,
        offset_y    : -100,
        fire        : 'BC',
        flash       : 'AB'
    }
};
