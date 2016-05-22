/* 
 * NULL Engine
 * 
 * @module DOOM/powerups
 * @author kod.connect
 */

o_.powerups = {
    
    bluekeycard: {
        thing       : 5,
        hudkey      : 'STKEYS0',
        onPickup    : function(){
            
            p_.keys.bluekeycard = true;
            
            return u_.msg.GOTBLUECARD;
        }
    },
    yellowkeycard: {
        thing       : 6,
        hudkey      : 'STKEYS1',
        onPickup    : function(){
            
            p_.keys.yellowkeycard = true;
            
            return u_.msg.GOTYELWCARD;
        }
    },
    backpack: {
        thing       : 8,
        onPickup    : function(){
            
            return u_.msg.GOTBACKPACK;
        }
    },
    redkeycard: {
        thing       : 13,
        hudkey      : 'STKEYS2',
        onPickup    : function(){
            
            p_.keys.redkeycard = true;
            
            return u_.msg.GOTREDCARD;
        }
    },
    redskullkey: {
        thing       : 38,
        hudkey      : 'STKEYS5',
        onPickup    : function(){
            
            p_.keys.redskullkey = true;
            
            return u_.msg.GOTREDSKULL;
        }
    },
    yellowskullkey: {
        thing       : 39,
        hudkey      : 'STKEYS4',
        onPickup    : function(){
            
            p_.keys.yellowskullkey = true;
            
            return u_.msg.GOTYELWSKUL;
        }
    },
    blueskullkey: {
        thing       : 40,
        hudkey      : 'STKEYS3',
        onPickup    : function(){
            
            p_.keys.blueskullkey = true;
            
            return u_.msg.GOTBLUESKUL;
        }
    },
    megasphere: {
        thing       : 84,
        onPickup    : function(){
            
            return u_.msg.GOTMSPHERE;
        }
    }, // doom II
    stimpack: {
        thing       : 2011,
        onPickup    : function(){
            
            if (p_.health < 90) {
                
                p_.health += 10;
                
            } else if (p_.health < 100) {
                
                p_.health = 100;
            }
            
            return u_.msg.GOTSTIM;
        }
    },
    medkit: {
        thing       : 2012,
        onPickup    : function(){
            
            if (p_.health < 75) {
                
                p_.health += 25;
                
            } else if (p_.health < 100) {
                
                p_.health = 100;
            }
            
            return u_.msg.GOTMEDIKIT;
        }
    },
    soulsphere: {
        thing       : 2013,
        onPickup    : function(){
            
            p_.health = 200;
            
            return u_.msg.GOTSUPER;
        }
    },
    healthpotion: {
        thing       : 2014,
        onPickup    : function(){
            
            if (p_.health < 200) { 
                
                p_.health += 1;
            }
            
            return u_.msg.GOTHTHBONUS;
        }
    },
    spiritualarmor: {
        thing       : 2015,
        onPickup    : function(){
            
            p_.armor += 1;
            
            return u_.msg.GOTARMBONUS;
        }
    },
    greenarmor: {
        thing       : 2018,
        onPickup    : function(){
            
            p_.armor        = 100;
            p_.armortype    = 1;
            
            return u_.msg.GOTARMOR;
        }
    },
    bluearmor: {
        thing       : 2019,
        onPickup    : function(){
            
            p_.armor        = 200;
            p_.armortype    = 2;
            
            return u_.msg.GOTMEGA;
        }
    },
    invulnerability: {
        thing       : 2022,
        onPickup    : function(){
            
            return u_.msg.GOTINVUL;
        }
    },
    berserk: {
        thing       : 2023,
        onPickup    : function(){
            
            return u_.msg.GOTBERSERK;
        }
    },
    invisibility: {
        thing       : 2024,
        onPickup    : function(){
            
            return u_.msg.GOTINVIS;
        }
    },
    radiationsuit: {
        thing       : 2025,
        onPickup    : function(){
            
            return u_.msg.GOTSUIT;
        }
    },
    computermap: {
        thing       : 2026,
        onPickup    : function(){
            
            return u_.msg.GOTMAP;
        }
    },
    lightamplificationvisor: {
        thing       : 2045,
        onPickup    : function(){
            
            return u_.msg.GOTVISOR;
        }
    }
};

