/* 
 * NULL Engine
 * 
 * @module DOOM/player
 * @author kod.connect
 */

$.extend(p_, {

    name        : 'Doomguy',
    health      : 100,
    armor       : 0,
    armortype   : 0,
    weapon      : 'pistol',
    weapons     : { 
        fist    : true,
        pistol  : true
    },
    ammo        : {
        bullets : 50
    },    
    keys        : {},
    powerups    : {},
    weaponSlots : [
        null,
        [ 'fist', 'chainsaw' ],
        'pistol',
        'shotgun',
        'chaingun',
        'rocketlauncher',
        'plasmagun',
        'bfg'
    ],
    hurt        : function(damage){
        
        p_.health      -= damage;
        r_.hud.smiling  = false;
        r_.hud.pain     = true;        
        r_.hud.update.face();
        s_.play( s_.playerpain );

        window.setTimeout(function(){ 

            r_.hud.pain     = false;
            r_.hud.update.face();            
            
        }, 2000);
    }
});

w_.loadNext();