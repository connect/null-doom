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
        'NUKAGE',
        'TLITE'
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
    
    
    c_.give('all') // cheat
};


// load maps
o_.map.add([
    'e1m1',
    //'e1m2',
    //'e1m3',
    //'e1m4',
    //'e1m5',
    //'e1m6',
    //'e1m7',
    //'e1m8',
    //'e3m3'
]);

o_.modules = [
    'ammo',
    'things', 
    'weapons'
];

for (var m in o_.modules) {

    console.log('....loading',cfg.mod +'/'+ o_.modules[m] +'.js')
    core.include( cfg.mod +'/'+ o_.modules[m] +'.js' );
}

o_.postInit();
w_.loadNext();