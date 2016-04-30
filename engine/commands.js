/*
 * NULL Engine
 * 
 * @module  core/commands
 * @author  kod.connect
 */

c_.nextmap = function(){
    console.log('c_.nextmap()');
    o_.map.next();
};

c_.opendoor = function(sector){
    console.log('c_.opendoor(',sector,')');
    
    var backlines   = [];
    var frontlines  = [];
    var walls       = [];
    var ceiling     = [];
    var height      = 666;
                
    // collect lines    
    for (var i in o_.map.sidedef){
        
        var tside = o_.map.sidedef[i];
        
        if (tside.sector == sector){
            
            // get lines
            for (var j in o_.map.linedef){                                
                
                var tline = o_.map.linedef[j];
                
                if (tline.sideback == i ) {                    
                    
                    var heightceiling = o_.map.sector[ o_.map.sidedef[ tline.sidefront ].sector ].heightceiling;
                    // choose lowest
                    height = (height > heightceiling) ? heightceiling : height;
                    
                    backlines.push(j);
                    
                } else if ( tline.sidefront == i) {
                    
                    frontlines.push(j);
                    
                }
            }
        }
    }
    
    // find walls
    //
    for (var i in r_.walls) {

        for (var j in backlines){

            if ( r_.walls[i].linedef == backlines[j]){                                
                
                walls.push(i);

            } else if ( r_.walls[i].linedef == frontlines[j]){

                //resize frontwalls to fill gaps
                r_.walls[i].scale.y = height +2;
                r_.walls[i].position.y += (height/2);
            }
        }
    }

    // find ceiling
    //
    for (var i in r_.ceilings) {

        if (r_.ceilings[i].sector == sector){

            ceiling = i;
        }
    }
    
    o_.map.actions.push({ 
        special     : 1, 
        sector      : sector,
        ceiling     : ceiling,
        walls       : walls,
        height      : height 
    });
    s_.play( s_.opendoor );
};

// Random generator: from, to
c_.random = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

c_.zoomin = function(){
    r_.mode.next();
};

c_.zoomout = function(){
    r_.mode.prev();
};

c_.init = function(o){
    
};

c_.postInit = function(o){
    
};

core.loadNext();