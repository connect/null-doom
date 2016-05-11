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
    
    // falloff
    r_.drawFalloff();
    
    // @FIXME debug only, remove later
    c_.give('all'); // cheat
    
    c_.noclip();
};


// load maps
o_.map.add([
    'e1m1',
    'e1m2',
    'e1m3',
    //'e1m4',
    'e1m5',
    'e1m6',
    'e1m7',
    'e1m8',
    'e3m3'
]);

o_.dropLoot = function(o){
  
    var thing = o_.things[ o.type ];
    
    if (thing.drop != undefined){
        
        // calculate closer coords
        var dX = o.position.x + (i_.controls.getObject().position.x - o.position.x) * 0.05;
        var dZ = o.position.z + (i_.controls.getObject().position.z - o.position.z) * 0.05;
        
        r_.spawnThing(thing.drop, dX, dZ, o.position.y );
    }
};

o_.useAction = function(){
  
    //console.log('..trying to use something')
    r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
    r_.raycaster.ray.direction.copy( i_.controls.getDirection( new THREE.Vector3() ) );
    r_.raycaster.far = 50;
    var hits = r_.raycaster.intersectObjects( r_.walls );

    if (hits[0] != undefined)  {

        if (hits[0].object.linedef != undefined && hits[0].distance < 50) {

            var line = o_.map.linedef[ hits[0].object.linedef ];
            //var texture = 

            //console.log('....we hit',line)

            if (line.special == 1) { // door

                //console.log('......open the door!');
                c_.opendoor( o_.map.sidedef[ line.sideback ].sector );

            } else if (line.special == 11) { // end of level switch

                s_.play( s_.menuback );
                c_.nextmap();                        

            } else {

                s_.play( s_.ugh );
            }
        }
    }
};

o_.modules = [
    'ammo',
    'things', 
    'weapons',
    'powerups'
];

for (var m in o_.modules) {

    console.log('....loading',cfg.mod +'/'+ o_.modules[m] +'.js')
    core.include( cfg.mod +'/'+ o_.modules[m] +'.js' );
}

o_.postInit();
w_.loadNext();