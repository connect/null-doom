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
        fire        : 'BCD',
        fireDelay   : 0,
        cooldown    : 0,
        onFire      : function(){
            
        }
    },
    
    pistol: {
        sprite      : 'PIS',
        cache       : 'ABCDE',
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
        sprite      : 'SHT',
        cache       : 'ABCD',
        fire        : 'BCD',
        flash       : 'AB'
    },
    
    chaingun: {
        sprite      : 'CHG',
        cache       : 'AB',
        fire        : 'B',
        flash       : 'AB'
    },
    
    rocketlauncher: {
        sprite      : 'MIS',
        cache       : 'AB',
        fire        : 'B',
        flash       : 'ABCD'
    },
    
    plasmagun: {
        sprite      : 'PLS',
        cache       : 'AB',
        fire        : 'B',
        flash       : 'AB'
    },
    
    bfg9000: {
        sprite      : 'BFG',
        cache       : 'ABC',
        fire        : 'BC',
        flash       : 'AB'
    }
};