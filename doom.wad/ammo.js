/* 
 * NULL Engine
 * 
 * @module DOOM/ammo
 * @author kod.connect
 */

o_.ammo = {
    
    bullets: {    
        capacity    : 200,
        damageMin   : 5,
        damageMax   : 15
    },

    shells: {
        capacity    : 50,
        damageMin   : 5,
        damageMax   : 15
    },

    rockets: {
        capacity    : 50,
        damageMin   : 20,
        damageMax   : 160
    },

    cells: {
        capacity    : 50,
        damageMin   : 5,
        damageMax   : 40
    },
    
    ////////////////////////////////////////////////////////////////////////////  

    clip: {
        ammotype    : 'bullets',
        capacity    : 10
    },

    boxofbullets: {
        ammotype    : 'bullets',
        capacity    : 50
    },

    shotgunshells: {
        ammotype    : 'shells',
        capacity    : 4
    },

    boxofshells: {
        ammotype    : 'shells',
        capacity    : 20
    },

    rocket: {
        ammotype    : 'rockets',
        capacity    : 1
    },

    boxofrockets: {
        ammotype    : 'rockets',
        capacity    : 5
    },

    energycell: {
        ammotype    : 'cells',
        capacity    : 20
    },

    energypack: {
        ammotype    : 'cells',
        capacity    : 100
    }
};