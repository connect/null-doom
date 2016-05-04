/* 
 * NULL Engine
 * 
 * @module core/player
 * @author kod.connect
 */

p_.hasWeapon = function(wpn){
    
    return p_.weapons[ wpn ];
};

p_.switchWeapon = function(wpn){
    
    wpn = (wpn != undefined) ? wpn : p_.weapon; // default weapon
    
    if (p_.hasWeapon(wpn)) {
        
        p_.weapon       = wpn;
        r_.weapon.state = 'takedown';
    }
};

p_.switchWeaponSlot = function(slot){
    
    if (p_.weaponSlots[ slot ] == undefined) return;
        
    if (typeof p_.weaponSlots[ slot ] == 'string') {
        // simple slot
        
        if (p_.weaponSlots[ slot ] != p_.weapon) {
            
            p_.switchWeapon( p_.weaponSlots[ slot ] );
        }
        
    } else {    
        // array slot
                   
        var i = p_.weaponSlots[ slot ].indexOf( p_.weapon );

        if ( i == -1  ) {
            // if current weapon is not of this slot array, select first item
            p_.switchWeapon( p_.weaponSlots[ slot ][0] );

        } else {

            // find next item in this slot array
            i = (p_.weaponSlots[ slot ][i+1] != undefined) ? i + 1 : 0;
            p_.switchWeapon( p_.weaponSlots[ slot ][i] );
        }
        
    }            
}; 

p_.postInit = function(){
    
};

core.loadNext();