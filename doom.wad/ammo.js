/* 
 * NULL Engine
 * 
 * @module DOOM/ammo
 * @author kod.connect
 */

o_.ammo = new function(){
    
    var t = this;
    
    t.onPickup = function(item){
        
        return t[item].message;
    };
    
    t.bullets = {    
        capacity    : 200,
        damageMin   : 5,
        damageMax   : 15
    };

    t.shells = {
        capacity    : 50,
        damageMin   : 5,
        damageMax   : 15
    };

    t.rockets = {
        capacity    : 50,
        damageMin   : 20,
        damageMax   : 160
    };

    t.cells = {
        capacity    : 50,
        damageMin   : 5,
        damageMax   : 40
    };
    
    ////////////////////////////////////////////////////////////////////////////  

    t.clip = {
        thing       : 2007,
        ammotype    : 'bullets',
        capacity    : 10,
        message     : u_.msg.GOTCLIP
    };

    t.boxofammo = {
        thing       : 2048,
        ammotype    : 'bullets',
        capacity    : 50,
        message     : u_.msg.GOTCLIPBOX
    };

    t.shotgunshells = {
        thing       : 2008,
        ammotype    : 'shells',
        capacity    : 4,
        message     : u_.msg.GOTSHELLS
    };

    t.boxofshells = {
        thing       : 2049,
        ammotype    : 'shells',
        capacity    : 20,
        message     : u_.msg.GOTSHELLBOX
    };

    t.rocket = {
        thing       : 2010,
        ammotype    : 'rockets',
        capacity    : 1,
        message     : u_.msg.GOTROCKET
    };

    t.boxofrockets = {
        thing       : 2046,
        ammotype    : 'rockets',
        capacity    : 5,
        message     : u_.msg.GOTROCKBOX
    };

    t.energycell = {
        thing       : 2047,
        ammotype    : 'cells',
        capacity    : 20,
        message     : u_.msg.GOTCELL
    };

    t.energypac = {
        thing       : 17,
        ammotype    : 'cells',
        capacity    : 100,
        message     : u_.msg.GOTCELLBOX
    }
};