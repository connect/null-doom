/* 
 * NULL Engine
 * 
 * @module DOOM/objects
 * @author kod.connect
 */


o_.map.loaded = function(){
    
    // correct some textures
    
    var textures = [
        'CEIL',
        'FLAT',
        'FLOOR',
        'NUKAGE'
    ];
    
    for (var i in textures) {
    
        for (var j in r_.imgs) {
            
            if ( j.indexOf( textures[i] ) == 0) {
                
                var image = r_.imgs[ j ];

                image.wrapS = image.wrapT = THREE.RepeatWrapping; 
                image.repeat.set( 0.015, 0.015 );    
            }
        }
    }
};


// load maps
o_.map.add([
    'e1m1',
    //'e1m2',
    //'e1m3',
    //'e1m5'
]);

// load things database
core.include( cfg.mod +'/things.js' );

o_.postInit();
w_.loadNext();