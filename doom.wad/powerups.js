/* 
 * NULL Engine
 * 
 * @module DOOM/powerups
 * @author kod.connect
 */

o_.powerups = {
    
    bluekeycard: {
        thing       : 5,
        onPickup    : function(){
            
            return u_.msg.GOTBLUECARD;
        }
    },
    yellowkeycard: {
        thing       : 6,
        onPickup    : function(){
            
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
        onPickup    : function(){
            
            return u_.msg.GOTREDCARD;
        }
    },
    redskullkey: {
        thing       : 38,
        onPickup    : function(){
            
            return u_.msg.GOTREDSKULL;
        }
    },
    yellowskullkey: {
        thing       : 39,
        onPickup    : function(){
            
            return u_.msg.GOTYELWSKUL;
        }
    },
    blueskullkey: {
        thing       : 40,
        onPickup    : function(){
            
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
            
            return u_.msg.GOTSTIM;
        }
    },
    medkit: {
        thing       : 2012,
        onPickup    : function(){
            
            return u_.msg.GOTMEDIKIT;
        }
    },
    soulsphere: {
        thing       : 2013,
        onPickup    : function(){
            
            return u_.msg.GOTSUPER;
        }
    },
    healthpotion: {
        thing       : 2014,
        onPickup    : function(){
            
            return u_.msg.GOTHTHBONUS;
        }
    },
    spiritualarmor: {
        thing       : 2015,
        onPickup    : function(){
            
            return u_.msg.GOTARMBONUS;
        }
    },
    greenarmor: {
        thing       : 2018,
        onPickup    : function(){
            
            return u_.msg.GOTARMOR;
        }
    },
    bluearmor: {
        thing       : 2019,
        onPickup    : function(){
            
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

