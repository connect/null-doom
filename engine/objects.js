o_.map = new function(){   
    
    var t = this;
    
    t.current   = -1; // none
    t.list      = [];    
    
    t.data      = [];
    t.thing     = [];
    t.vertex    = [];
    t.linedef   = [];
    t.sidedef   = [];
    t.sector    = [];    
    t.actions   = []; 
    
    t.add = function(o){
        console.log('o_.map.add()')
        if (typeof o == 'object' && o.length != undefined) {
            // array 
            for (var i in o){
                t.list.push(o[i]);
            }
        } else {
            // single
            t.list.push(o);
        }
        
    };    
    
    t.cacheTextures = function(){
        
        var cachelist = [];
        
        //
        // collect list of textures to cache
        //
        
        // Wall textures
        //
        for (var i in t.sidedef) {
            
            var textures = [ 'texturetop', 'texturemiddle', 'texturebottom' ];
                        
            for (var j in textures) {
                
                var img = t.sidedef[i][ textures[j] ];
            
                if ( img != '-' && img != undefined && cachelist.indexOf(img) == -1) {

                    cachelist.push( img );
                }
            }
        }
        
        // Flat textures
        //
        for (var i in t.sector){
            
            var textures = [ 'texturefloor', 'textureceiling' ];
            
            for (var j in textures) {
                
                var img = t.sector[i][ textures[j] ];
                         
                if ( img != '-' && img != undefined && cachelist.indexOf(img) == -1) {

                    cachelist.push( img );
                }
            }
        }
        
        // Thing textures
        //
        for (var i in t.thing){
            
            var thing = o_.things[ t.thing[i].type ];
            var img;
            
            if (thing == undefined) continue; // skip if not found in db   
            
            if (thing.sprite == 'none') continue; // skip if no sprite

            // remove '+' from sequence if other available
            if (thing.sequence.indexOf('+') != -1 && thing.sequence.length > 1) {
                thing.sequence = thing.sequence.replace('+','');
            }
            
            thing.sequence = (thing.class.indexOf('M') != -1) ? 'ABCD' : thing.sequence;
            
            // collect all frames
            for (var j in thing.sequence) {                                                                                
            
                if (thing.class.indexOf('M') != -1  ) {
                                        
                    img = thing.sprite + thing.sequence[j] + '1';
                    
                } else if (thing.sequence == '+') {
                    
                    img = thing.sprite + 'A' + '1';
                } else {
                    
                    img = thing.sprite + thing.sequence[j] + '0';
                }
                
                if ( cachelist.indexOf(img) == -1) {
                    
                    cachelist.push(img);
                }
            }
        }
        
        // Cache it
        //
        for (var i in cachelist) {
            
            r_.img.load({
                files: [ cachelist[i] ],
                success: function(texture){
                                                
                    if (r_.img.cached == cachelist.length){
                        console.log('....textures cached');

                        // all textures should be cached at this point
                        t.proceedLoading();
                    }
                }
            });
        }
    };
    
    t.createStartSpot = function(){
        
    };
    
    t.getSector = function(x,y){
        /*
        for (var i in t.sector){
            
            // get vertices of sector
            for (var j in t.linedef) {
                
                if ( t.linedef[j].sidefront > 0 )
                
                if (t.linedef.s)
                
            }
            
            
            if ( r_.inPoly([x,y], ) ) {
                return i;
            }
        }
        */
        return false;
    };
    
    t.load = function(){
        // consider all necessary data is already in arrays after .readUDMF()
        
        $('#blocker').hide();
        
        t.cacheTextures();                                        
    };
    
    t.loadSectors = function(){
        // get special lights
        
        
        for (var s in t.sector) {
            
        }
    };
    
    t.loadSprites = function(){
        
    };
    
    t.loadTest = function(){
        var sides = {};
        var lines = {};
        var vertexes = {};
        var floorheight = 0;
        
        var drawWalls = 1;
        var drawNums  = 0;
        var drawFlats = 1;
        var drawOnlySector = false;
        
        var matLine = new THREE.LineBasicMaterial({ color: 0xff0000 });
        var matLineB = new THREE.LineDashedMaterial({ color: 0x0000ff, dashSize: 4, gapSize: 2  });
        
        var matVert = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        var geoVert = new THREE.BoxGeometry( 3, 3, 3 );
        
        var matThing = new THREE.MeshBasicMaterial({ color: 0x999900, wireframe: true });        

        for (var s in t.sector) {
            
            if (drawOnlySector != false && s != drawOnlySector) continue;                       
            
            var tsector  = t.sector[s];
            lines        = { count: 0 };
            
            //console.log('....processing sector',s);
            
            for (var i in t.sidedef){                           

                // get sides in sector
                if (t.sidedef[i].sector == s) {
                    sides[i] = t.sidedef[i];

                    // look for lines to get vertexes
                    for (var j in t.linedef) {
                        
                        // this is front side for the line
                        if (t.linedef[j].sidefront == i) {

                            lines[j] = t.linedef[j];
                            lines.count++;
                            var v1 = t.vertex[ lines[j].v1 ];
                            var v2 = t.vertex[ lines[j].v2 ];

                            // get vertexes
                            //vertexes[ lines[j].v1 ] = t.vertex[ lines[j].v1 ];
                            //vertexes[ lines[j].v2 ] = t.vertex[ lines[j].v2 ];
                            
                            /*
                            //add hline
                            var geoLine = new THREE.Geometry();
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v1 ].x, tsector.heightfloor, t.vertex[ lines[j].v1 ].y) );
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v2 ].x, tsector.heightfloor, t.vertex[ lines[j].v2 ].y) );        
                            var line = new THREE.Line( geoLine, matLine );      
                            r_.objects.push(line);
                            r_.scene.add(line);
                            
                            //add hline2
                            var geoLine = new THREE.Geometry();
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v1 ].x, tsector.heightceiling, t.vertex[ lines[j].v1 ].y) );
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v2 ].x, tsector.heightceiling, t.vertex[ lines[j].v2 ].y) );        
                            var line = new THREE.Line( geoLine, matLine );                            
                            r_.objects.push(line);
                            r_.scene.add(line);
                                                      
                            // add vertex1
                            var vert = new THREE.Mesh( geoVert, matVert );
                            vert.position.set(-t.vertex[ lines[j].v1 ].x, tsector.heightfloor, t.vertex[ lines[j].v1 ].y);
                            r_.objects.push(vert);
                            r_.scene.add(vert);
                            
                            //add vline
                            var geoLine = new THREE.Geometry();
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v1 ].x, tsector.heightfloor, t.vertex[ lines[j].v1 ].y) );
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v1 ].x, tsector.heightceiling, t.vertex[ lines[j].v1 ].y) );        
                            var line = new THREE.Line( geoLine, matLine );    
                            r_.objects.push(line);
                            r_.scene.add(line);
                            
                            // add vertex2
                            var vert = new THREE.Mesh( geoVert, matVert );
                            vert.position.set(-t.vertex[ lines[j].v2 ].x, tsector.heightfloor, t.vertex[ lines[j].v2 ].y);
                            r_.objects.push(vert);
                            r_.scene.add(vert);       
                            
                            //add vline
                            var geoLine = new THREE.Geometry();
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v2 ].x, tsector.heightfloor, t.vertex[ lines[j].v2 ].y) );
                            geoLine.vertices.push( new THREE.Vector3(-t.vertex[ lines[j].v2 ].x, tsector.heightceiling, t.vertex[ lines[j].v2 ].y) );        
                            var line = new THREE.Line( geoLine, matLine );
                            r_.objects.push(line);
                            r_.scene.add(line);
                            */
                           
                            
                            // upper texture
                            if ( sides[i].texturetop != '-' ) {                                                                      
                                //console.log('front', tsector.textureceiling, 'back',t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].textureceiling)
                                if ( t.sidedef[ t.linedef[j].sideback ] != undefined) {
                                //if ( tsector.textureceiling.indexOf('SKY') != -1 || t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].textureceiling.indexOf('SKY') != -1){  
                                    
                                    var texture     = r_.imgs[ sides[i].texturetop ];
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ) *-1;                                 
                                    var wallHeight  = tsector.heightceiling - t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightceiling;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, color: color });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            

                                    wall.linedef = j;
                                    wall.rotateY( wallAngle );                                
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightceiling + (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );

                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if (drawWalls) r_.scene.add(wall);
                                }
                            }
                            
                            // Middle texture                                                        
                            if ( sides[i].texturemiddle != '-' ) {                                                    
                                    
                                    var texture     = r_.imgs[ sides[i].texturemiddle ]; 
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                    var wallHeight  = tsector.heightceiling - tsector.heightfloor+2;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );                            
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, color: color, transparent: true, side: THREE.DoubleSide, alphaTest: 0.5 });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            
                                    
                                    wall.linedef = j;
                                    wall.rotateY( wallAngle );
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        tsector.heightfloor + (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );
                            
                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if (drawWalls) r_.scene.add(wall);
                            }
                            
                            // bottom texture
                            if ( sides[i].texturebottom != '-' ) {                            
                                
                                if ( t.sidedef[ t.linedef[j].sideback ] != undefined ) {
                                    
                                    var texture     = r_.imgs[ sides[i].texturebottom ];   
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                    var wallHeight  = t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightfloor - tsector.heightfloor +1;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );                                                        
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, color: color, transparent: true, side: THREE.BackSide });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            
                                    
                                    wall.linedef = j;
                                    wall.rotateY( wallAngle );
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightfloor - (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );
                            
                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if (drawWalls) r_.scene.add(wall);                                    
                                }
                            }
                            
                        } else if (t.linedef[j].sideback == i ) {                             
                            
                            lines[j] = t.linedef[j];
                            lines.count++;
                            
                            var v1 = t.vertex[ lines[j].v1 ];
                            var v2 = t.vertex[ lines[j].v2 ];
                            /*                            
                            // upper texture
                            if ( sides[i].texturetop != '-' ) {                            
                                
                                var wallWidth = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                var wallHeight = tsector.heightceiling - tsector.heightfloor;
                                var geoWall = new THREE.PlaneGeometry( wallWidth, wallHeight );                                                        
                                var matWall = new THREE.MeshBasicMaterial({ map: r_.pic( sides[i].texturetop ), transparent: true, side: THREE.DoubleSide });
                                var wallAngle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                var wall = new THREE.Mesh( geoWall, matWall );                            
                                wall.rotateY( wallAngle );
                                wall.position.set( 
                                    (-v1.x -v2.x)/2, 
                                    tsector.heightceiling + (wallHeight/2), 
                                    (v1.y + v2.y)/2
                                );
                                r_.objects.push(wall);
                                r_.scene.add(wall);
                                
                                
                                if ( t.sidedef[ t.linedef[j].sideback ] != undefined) {                                
                                    
                                    var texture     = r_.imgs[ sides[i].texturetop ];
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ) *-1;                                 
                                    var wallHeight  = tsector.heightceiling - t.sector[ t.sidedef[ t.linedef[j].sidefront ].sector ].heightceiling;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, color: color });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            

                                    wall.linedef = j;
                                    wall.rotateY( wallAngle );                                
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightceiling + (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );

                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if (drawWalls) r_.scene.add(wall);
                                }
                            }
                            
                            // texture middle                                                        
                            if ( sides[i].texturemiddle != '-') {        
                                
                                var wallWidth = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                var wallHeight = tsector.heightceiling - tsector.heightfloor;
                                var geoWall = new THREE.PlaneGeometry( wallWidth, wallHeight );
                                var matWall = new THREE.MeshBasicMaterial({ map: r_.pic( sides[i].texturemiddle ), transparent: true });
                                var wallAngle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                var wall = new THREE.Mesh( geoWall, matWall );                            
                                wall.rotateY( wallAngle );
                                wall.position.set( 
                                    (-v1.x -v2.x)/2, 
                                    tsector.heightfloor + (wallHeight/2), 
                                    (v1.y + v2.y)/2
                                );
                                r_.objects.push(wall);
                                r_.scene.add(wall);
                            } else {
                                //var matWall = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.1 });
                            }         
                            
                            // bottom texture
                            if ( sides[i].texturebottom != '-' ) {                            
                                
                                var wallWidth = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                var wallHeight = tsector.heightceiling - tsector.heightfloor;
                                var geoWall = new THREE.PlaneGeometry( wallWidth, wallHeight );                                                        
                                var matWall = new THREE.MeshBasicMaterial({ map: r_.pic( sides[i].texturebottom ), transparent: true, side: THREE.DoubleSide });
                                var wallAngle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                var wall = new THREE.Mesh( geoWall, matWall );                            
                                wall.rotateY( wallAngle );
                                wall.position.set( 
                                    (-v1.x -v2.x)/2, 
                                    tsector.heightfloor - (wallHeight/2), 
                                    (v1.y + v2.y)/2
                                );
                                r_.objects.push(wall);
                                r_.scene.add(wall);
                            }
                            
                            if ( sides[i].texturebottom != '-' ) {                            
                                
                                if ( t.sidedef[ t.linedef[j].sidefront ] != undefined ) {
                                    
                                    var texture     = r_.imgs[ sides[i].texturebottom ];   
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                    var wallHeight  = t.sector[ t.sidedef[ t.linedef[j].sidefront ].sector ].heightfloor - tsector.heightfloor +1;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );                                                        
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, color: color, transparent: true, side: THREE.BackSide });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            
                                    
                                    wall.linedef = j;
                                    wall.rotateY( wallAngle );
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightfloor - (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );
                            
                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if (drawWalls) r_.scene.add(wall);                                    
                                }
                            }
                            */
                        }
                    }
                }            
            }
            
            //
            // Build floor & ceiling polygon
            //
            if (drawFlats) {
            
                //console.log('....build floor & ceiling polygon');

                var linesKnown  = [];
                var shapes      = []; // <array>
                var tshape      = [];
                var jshapes     = []; // list of shapes to be joined
                var holes       = {};
                var cycle       = 0; // cycle count control

                while (lines.count > linesKnown.length){ // +1 for lines.count itself  ?              

                    //for every line
                    for (var l in lines){

                        // skip known lines and counter
                        if ( linesKnown.indexOf(l) != -1 || l == 'count') continue; 

                        // get line vertexes
                        var v1 = t.vertex[ lines[l].v1 ];
                        var v2 = t.vertex[ lines[l].v2 ];                    

                        // are there any shape yet?
                        if (shapes.length == 0){

                            //console.log('......first shape');
                            //console.log('......line',l,'belongs to shape 0')

                            // create first one
                            shapes.push([
                                new THREE.Vector2( v1.x, v1.y ),
                                new THREE.Vector2( v2.x, v2.y )
                            ]);

                            // remember the line
                            linesKnown.push(l);
                            //break;

                        } else {

                            // there are some shapes already
                            // find one is not complete
                            for (var sh in shapes){

                                tshape      = shapes[sh];

                                var firstv  = tshape[0]; // first shape vertes
                                var lastv   = tshape[ tshape.length-1 ]; // last shape vertex

                                // if shape not complete
                                if ( firstv.x != lastv.x || firstv.y != lastv.y ){

                                    // compare this line vertexes to last shape vertex
                                    var fv1 = ( lastv.x == v1.x && lastv.y == v1.y ) ? true : false;
                                    var fv2 = ( lastv.x == v2.x && lastv.y == v2.y ) ? true : false;

                                    if ( fv1 || fv2 ){

                                        //console.log('......line',l,'belongs to shape',s)

                                        if ( fv1 ){

                                            tshape.push( new THREE.Vector2( v2.x, v2.y ) );

                                        } else {

                                            tshape.push( new THREE.Vector2( v1.x, v1.y ) );
                                        }

                                        // last vertex could be changed at this point 
                                        lastv   = tshape[ tshape.length-1 ];

                                        if ( firstv.x == lastv.x && firstv.y == lastv.y ) {

                                            //console.log('......shape '+ s +' is complete');
                                        } 

                                        // remember the line
                                        linesKnown.push(l);
                                    }

                                    break; // don't proceed to next shape until this one is finished
                                }
                            }

                            // if all known shapes are complete, but line still
                            // not recognized, add new shape
                            if ( firstv.x == lastv.x && firstv.y == lastv.y && linesKnown.indexOf(l) == -1) {

                                //console.log('......new shape', shapes.length);

                                shapes.push([
                                    new THREE.Vector2( v1.x, v1.y ),
                                    new THREE.Vector2( v2.x, v2.y )
                                ]);    

                                // remember the line
                                linesKnown.push(l);

                            }
                        }
                    }
                    //console.log('......linesKnown:',linesKnown.length,'/',lines.count);
                    cycle++;
                    if (cycle > 50) break; // infinite loop protection
                }

                //console.log('....shapes found:',shapes);

                // Detect holes
                //
                //console.log('....detect holes in polygons');

                for (var sh in shapes){

                    // ignore broken shapes
                    if (shapes[sh].length < 3) continue;
                    
                    var inside = false;                                        

                    // compare every shape pair
                    for (var j in shapes){

                        // don't compare to itself
                        if (sh == j) continue;

                        // pick vertex from shapes[s] and compare it to shapes[j] 
                        v1 = shapes[sh][0];

                        // compare vertex to shape
                        inside = r_.inPoly( v1, shapes[j]);

                        //console.log('inPoly():',inside)
                        if ( inside ) {

                            //console.log('......hole found')

                            // shapes[s] is a hole for shapes[j]
                            // populate holes[j] array with it
                            if ( holes[j] == undefined ) {

                                holes[j] = [ shapes[sh] ];

                            } else {

                                holes[j].push( shapes[sh] );
                            }
                        }
                    }

                    // if shape is not a hole add it to join list
                    if (!inside) {

                        jshapes.push( shapes[sh] );
                    }
                }

                // console.log('....holes found:',holes);

                // build final shape
                //
                var jshape = [];

                for (var sh in jshapes){

                    tshape = new THREE.Shape( shapes[sh] );

                    for (var h in holes[sh]) {

                        //console.log('......pushing hole',holes[s][h],'to','shape',s)
                        tshape.holes.push( new THREE.Shape( holes[sh][h].reverse() ) );
                    }

                    jshape.push( tshape ); 
                }

                // draw floor polygon
                //
                var geoPoly = new THREE.ShapeGeometry( jshape );    
                
                var image = r_.imgs[ tsector.texturefloor ];                
                var color = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                var floor = new THREE.Mesh(  
                    geoPoly, 
                    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: image, color: color }) 
                );                        

                floor.rotation.set( Math.PI/2, Math.PI, 0  );
                floor.position.y = tsector.heightfloor;     
                floor.sector     = s;
                
                if (r_.img.animated[ tsector.texturefloor.match(/\D+/)[0] ] != undefined) {                    
                    floor.frame  = tsector.texturefloor.match(/\d+/)[0];
                    floor.sprite = tsector.texturefloor.match(/\D+/)[0];
                }
                
                r_.objects.push(floor);
                r_.floors.push(floor);
                r_.scene.add(floor);


                // draw ceiling polygon
                //
                if (tsector.textureceiling.indexOf('SKY') == -1) {
                    
                    var image = r_.imgs[ tsector.textureceiling ];
                    var color = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                    var ceiling = new THREE.Mesh(  geoPoly, 
                        new THREE.MeshPhongMaterial({ side: THREE.BackSide, map: image, color: color  }) 
                    );               
                    
                    ceiling.rotation.set(Math.PI/2, Math.PI, 0);
                    ceiling.position.y = tsector.heightceiling;
                    ceiling.sector     = s;
                    
                    r_.objects.push(ceiling);
                    r_.ceilings.push(ceiling);
                    r_.scene.add(ceiling);
                }

            }
        
        }
        
        //
        // Spawn Things
        //
        console.log('....spawning things');
        for (i in t.thing) {
            
            var o = t.thing[i];
            
            if (o.dm) continue; // skip multiplayer things
            
            //floorheight = r_.findFloor( -o.x, o.y );
            //floorheight = (floorheight != false) ? floorheight.object.position.y : 0;
            floorheight = 0;
            
            if (o.type == 1) { // setup start spot
                
                i_.controls.getObject().position.set( -o.x, floorheight + cfg.playerHeight, o.y );
                i_.controls.getObject().rotation.set(0, (o.angle + 90) * Math.PI / 180 , 0 );
                
            } else if ( o_.things[ o.type ] != undefined ) {

                // known thing
                r_.spawnThing( o.type, -o.x, o.y );
                  
            } else {
                
                // add thing placeholder for rest
                var thing = new THREE.Mesh( geoVert, matThing );
                thing.position.set(-o.x, floorheight+3, o.y);  
                r_.objects.push(thing);
                r_.scene.add(thing);
            }
        }
        
        createSkyBox = function(){

            function createMaterial( path, repeat, color ) {
                
                if (path != undefined) {
                    var texture = THREE.ImageUtils.loadTexture(path);
                    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

                    if (repeat != undefined){
                        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
                        material.map.repeat.set(repeat, repeat);
                    }
                } else if ( color != undefined){
                    
                    var material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) })
                }
                
                
                return material; 
            }

            // Load the skybox images and create list of materials
            var materials = [
                createMaterial( 'doom.wad/gra/SKY1.png' ), // right
                createMaterial( 'doom.wad/gra/SKY1.png' ), // left
                createMaterial( undefined, undefined, 'rgb(190,190,190)' ), // top
                createMaterial( 'doom.wad/gra/F_SKY1.png' ), // bottom
                createMaterial( 'doom.wad/gra/SKY1.png' ), // back
                createMaterial( 'doom.wad/gra/SKY1.png' )  // front
            ];

            // Create a large cube
            var mesh = new THREE.Mesh( 
                new THREE.BoxGeometry( 10000, 8000, 10000, 1, 1, 1 ), 
                new THREE.MeshFaceMaterial( materials ) 
            );

            mesh.position.copy( i_.controls.getObject().position );
            mesh.position.y += 2000;

            // Set the x scale to be -1, this will turn the cube inside out
            mesh.scale.set(-1,1,1);
            r_.scene.add( mesh );  
            
            //r_.scene.fog = new THREE.Fog( 0xcccccc, 5000, 7000 );
        };
        createSkyBox();
    };    
    
    t.loadWalls = function(){
        var sides = [];
        var lines = [];
        
        // First mark each sidedef with the sector it belongs to
        for (var s in t.sector){
            
            if ( t.sector[s].id ) {
                
            }            
        }
       
        // DEBUG
        var sec = t.sector[0];
        for (var i in t.sidedef){
            if (t.sidedef[i].sector == sec.id) {
                sides.push(i);
            }
        }
        for (i in sides ){            
                
        }
        
        
        // Now copy wall properties to their matching sidedefs
        
        
        // Set line properties that Doom doesn't store per-sidedef
        
        
        // Finish setting sector properties that depend on walls
        
        
    };
    
    t.loadDISABLED = function(){
        console.log('o_.map.load()')
        
        //
        // start map load sequence
        //        
        
        $('#blocker').hide();
        
        var scrMode     = r_.mode.current.split('x');
        var scrWidth    = scrMode[0];
        var scrHeight   = scrMode[1];
        var scale       = r_.scale;
        
        var mesh, geometry, material;

        // WEAPON
        //       
        r_.mats.wpn = [ 
            new THREE.SpriteMaterial({map: r_.imgs.SHTGA0}), 
            new THREE.SpriteMaterial({map: r_.imgs.SHTGB0}),
            new THREE.SpriteMaterial({map: r_.imgs.SHTGC0}),
            new THREE.SpriteMaterial({map: r_.imgs.SHTGD0})
        ];
        r_.wpn.obj = new THREE.Sprite(r_.mats.wpn[0]);            
        r_.wpn.obj.scale.set( 79 * scale , 60 * scale ,1);
        r_.wpn.obj.position.set(0, (scrHeight/-2) + (60 * scale) * -1  , 5); // (scrHeight/-2) + (60 * scale)   
        r_.wpn.reading = true;
        r_.hudScene.add(r_.wpn.obj);

        // STATUS
        //   

        var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STBAR});
        var sprite = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set(320 * scale, 32 * scale ,1);
        sprite.position.set(0, (scrHeight/-2) + (32 * scale / 2) , 10);
        r_.hudScene.add(sprite);
        
        // ARMS
        //
        
        var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STARMS});
        var sprite = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set(40 * scale, 32 * scale ,1);
        sprite.position.set((scrWidth/-2) + (scrWidth * 0.385), (scrHeight/-2) + (32 * scale / 2) , 11);
        r_.hudScene.add(sprite);

        // FACE
        //                     
        
        r_.mats.face = [ 
            new THREE.SpriteMaterial({map: r_.imgs.STFST00}), 
            new THREE.SpriteMaterial({map: r_.imgs.STFST01}),
            new THREE.SpriteMaterial({map: r_.imgs.STFST02})
        ];
        r_.hud.face = new THREE.Sprite(r_.mats.face[0]);
        r_.hud.face.scale.set( 24 * scale, 29 * scale, 1);
        r_.hud.face.position.set( 0, (scrHeight/-2) + (29 * scale / 2), 11);
        r_.hudScene.add( r_.hud.face );
        
        // animate
        r_.animateFace = function(){            
            r_.hud.face.material = r_.mats.face[ c_.random(0,2) ];            
            window.setTimeout(r_.animateFace, c_.random(500, 5000));
        };
        r_.animateFace();

        // AMMO
        //
        r_.drawText({            
            text: '150', prefix: 'STT', 
            width: 14, height: 16, direction: 'rtl',
            x: (scrWidth/-2) + (scrWidth * 0.16),
            z: (scrHeight/-2) + (scrHeight * 0.09)    
        });

        // HEALTH
        //
        r_.drawText({
            text: '100%', prefix: 'STT', 
            width: 14, height: 16, direction: 'rtl',
            x: (scrWidth/-2) + (scrWidth * 0.345),
            z: (scrHeight/-2) + (scrHeight * 0.09)    
        });

        // ARMOR
        //
        r_.drawText({
            text: '150%', prefix: 'STT', 
            width:14, height:16, direction: 'rtl',
            x: (scrWidth/-2) + (scrWidth * 0.755)  ,
            z: (scrHeight/-2) + (scrHeight * 0.09)  
        });
        
        // Arms numbers
        //
        r_.drawText({
            text: '2', prefix: 'STYS',
            width: 4, height: 6, direction: 'ltr',
            x: (scrWidth/-2) + (scrWidth * 0.348)  ,
            z: (scrHeight/-2) + (scrHeight * 0.105)  
        });
        r_.drawText({
            text: '3', prefix: 'STYS',
            width: 4, height: 6, direction: 'ltr',
            x: (scrWidth/-2) + (scrWidth * 0.39)  ,
            z: (scrHeight/-2) + (scrHeight * 0.105)  
        });
        r_.drawText({
            text: '4', prefix: 'STG',
            width: 4, height: 6, direction: 'ltr',
            x: (scrWidth/-2) + (scrWidth * 0.425)  ,
            z: (scrHeight/-2) + (scrHeight * 0.105)  
        });
        r_.drawText({
            text: '5', prefix: 'STG',
            width: 4, height: 6, direction: 'ltr',
            x: (scrWidth/-2) + (scrWidth * 0.348)  ,
            z: (scrHeight/-2) + (scrHeight * 0.065)  
        });
        r_.drawText({
            text: '6', prefix: 'STG',
            width: 4, height: 6, direction: 'ltr',
            x: (scrWidth/-2) + (scrWidth * 0.39)  ,
            z: (scrHeight/-2) + (scrHeight * 0.065)  
        });
        r_.drawText({
            text: '7', prefix: 'STG',
            width: 4, height: 6, direction: 'ltr',
            x: (scrWidth/-2) + (scrWidth * 0.425)  ,
            z: (scrHeight/-2) + (scrHeight * 0.065)  
        });
        

        //
        // floor
        //
        geometry = new THREE.PlaneGeometry( 1000, 1000, 100, 100 );
        geometry.rotateX( - Math.PI / 2 );

        material = new THREE.MeshBasicMaterial({ map: r_.imgs.WALL03_7 });
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(100, 100);

        mesh = new THREE.Mesh( geometry, material );
        r_.scene.add( mesh );

        //
        // SKYBOX/FOG
        //

        createSkyBox = function(){

            function createMaterial( path ) {
                var texture = THREE.ImageUtils.loadTexture(path);
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

                return material; 
            }

            // Load the skybox images and create list of materials
            var materials = [
                createMaterial( 'doom.wad/gra/SKY1.png' ), // right
                createMaterial( 'doom.wad/gra/SKY1.png' ), // left
                createMaterial( 'doom.wad/gra/SKY1.png' ), // top
                createMaterial( 'doom.wad/gra/F_SKY1.png' ), // bottom
                createMaterial( 'doom.wad/gra/SKY1.png' ), // back
                createMaterial( 'doom.wad/gra/SKY1.png' )  // front
            ];

            // Create a large cube
            var mesh = new THREE.Mesh( 
                new THREE.BoxGeometry( 1000, 1000, 1000, 1, 1, 1 ), 
                new THREE.MeshFaceMaterial( materials ) 
            );

            // Set the x scale to be -1, this will turn the cube inside out
            mesh.scale.set(-1,1,1);
            scene.add( mesh );  
        };

        createSkySphere = function(){                                

            var material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('doom.wad/gra/SKY4.png'),
                side: THREE.BackSide
            });

            var geometry = new THREE.SphereGeometry( 500, 32, 32, 0, 6.3, 0, 1.5 );

            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.y = -100;
            r_.scene.add(mesh);
        };

        //createSkySphere();


        //scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

        //
        // objects
        //

        geometry = new THREE.BoxGeometry( 20, 20, 20 );
        material = new THREE.MeshPhongMaterial({ map: r_.imgs.W28_5 });                                            
        material.map.repeat.set(1, 1);

        for ( var i = 0; i < 150; i ++ ) {
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
            //mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
            mesh.position.y = 10;
            mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
            r_.scene.add( mesh );
            r_.objects.push( mesh );
        }


        material = new THREE.MeshPhongMaterial({ map: r_.imgs.W94_1 });

        for ( var i = 0; i < 200; i ++ ) {
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
            //mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
            mesh.position.y = 30;
            mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
            r_.scene.add( mesh );
            r_.objects.push( mesh );
        }

        material = new THREE.MeshPhongMaterial({ map: r_.imgs.WALL05_2 });

        for (var i = -10; i < 10; i++){               
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = 20 * i;
            mesh.position.y = 10;
            mesh.position.z = 20;
            r_.scene.add( mesh );
            r_.objects.push( mesh );
        }
        
        // remove initial back screen
        r_.hudScene.remove( r_.back );      
        
        // music
        s_.playMusic('D_E1M1.mp3');

    };
    
    t.next = function(){        
        
        var i = ( t.current < t.list.length -1 ) ? t.current + 1 : 0;                
        
        // clear
        t.thing     = [];
        t.vertex    = [];
        t.linedef   = [];
        t.sidedef   = [];
        t.sector    = [];
        
        // clear scene
        for (var j in r_.objects){
            r_.scene.remove( r_.objects[j] );
        }
        r_.objects  = [];
        r_.walls    = [];
        r_.sprites  = [];
        r_.floors   = [];
        
        t.current = i;
        t.readUDMF( t.list[i] );
    };
    
    // called after texture cache ready
    t.proceedLoading = function(){
        
        console.log('....proceed loading');
        
        t.loadTest();
        
        // load sectors
        //t.loadSectors();
        
        // load walls
        //t.loadWalls();
        
        // load sprites
        //t.loadSprites();
        
        // create start spot
        //t.createStartSpot();         
        
        // remove initial back screen
        r_.hudScene.remove( r_.back );      
        
        // draw hud
        r_.drawHud();
        
        // music
        s_.playMusic('D_E1M1.mp3');
        
        o_.map.loaded();
    };
    
    t.readUDMF = function(f){
        // Structures
        //
        
        var Factory = function(type, o){
            
            var f = this;
            
            if ( type.length == 0 || t[ type ] == undefined ) return false;
       
            f.linedef = {
                id              : t.linedef.length, // <integer>; // ID of line. Interpreted as tag or scripting id.
                                                    // Default = -1. *** see below.
                v1              : null,     // <integer>; // Index of first vertex. No valid default.
                v2              : null,     // <integer>; // Index of second vertex. No valid default.
                blocking        : false,    // <bool>; // true = line blocks things.
                blockmonsters   : false,    // <bool>; // true = line blocks monsters.
                twosided        : false,    // <bool>; // true = line is 2S.
                dontpegtop      : false,    // <bool>; // true = upper texture unpegged.
                dontpegbottom   : false,    // <bool>; // true = lower texture unpegged.
                secret          : false,    // <bool>; // true = drawn as 1S on map.
                blocksound      : false,    // <bool>; // true = blocks sound.
                dontdraw        : false,    // <bool>; // true = line never drawn on map.
                mapped          : false,    // <bool>; // true = always appears on map.
                comment         : ''        // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
       
            f.sidedef = {
                offsetx         : 0,        // <integer>; // X Offset. Default = 0.
                offsety         : 0,        // <integer>; // Y Offset. Default = 0.
                texturetop      : '-',      // <string>; // Upper texture. Default = "-".
                texturebottom   : '-',      // <string>; // Lower texture. Default = "-".
                texturemiddle   : '-',      // <string>; // Middle texture. Default = "-".
                sector          : null,     // <integer>; // Sector index. No valid default.
                comment         : ''        // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
      
            f.vertex  = {
                x               : null,     // <float>; // X coordinate. No valid default.
                y               : null      // <float>; // Y coordinate. No valid default.
            };
        
            f.sector  = {
                heightfloor     : 0,        // <integer>; // Floor height. Default = 0.
                heightceiling   : 0,        // <integer>; // Ceiling height. Default = 0.
                texturefloor    : '',       // <string>; // Floor flat. No valid default.
                textureceiling  : '',       // <string>; // Ceiling flat. No valid default.
                lightlevel      : 160,      // <integer>; // Light level. Default = 160.
                special         : 0,        // <integer>; // Sector special. Default = 0.
                id              : t.sector.length, // <integer>; // Sector tag/id. Default = 0.
                comment         : ''        // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
        
            f.thing   = {
                id            : t.thing.length, // <integer>; // Thing ID. Default = 0.
                x             : null,       // <float>; // X coordinate. No valid default.
                y             : null,       // <float>; // Y coordinate. No valid default.
                height        : null,       // <float>; // Z height relative to floor. Default = 0.
                                            // (Relative to ceiling for SPAWNCEILING items).
                angle         : null,       // <integer>; // Map angle of thing in degrees. Default = 0 (East).
                type          : null,       // <integer>; // DoomedNum. No valid default.
                skill1        : false,      // <bool>; // true = in skill 1.
                skill2        : false,      // <bool>; // true = in skill 2.
                skill3        : false,      // <bool>; // true = in skill 3.
                skill4        : false,      // <bool>; // true = in skill 4.
                skill5        : false,      // <bool>; // true = in skill 5.
                ambush        : false,      // <bool>; // true = thing is deaf.
                single        : false,      // <bool>; // true = in SP mode.
                dm            : false,      // <bool>; // true = in DM mode.
                coop          : false,      // <bool>; // true = in Coop.
                friend        : false,      // <bool>; // true = MBF friend.
                comment       : ''          // <string>; // A comment. Implementors should attach no special
                                            // semantic meaning to this field.
            };
        
            var obj = $.extend( f[ type ], o );

            t[ type ].push( obj );

            return obj;                
        };
        
        // load file to memory, then call .load()
        //
        $.get( cfg.mod +'/maps/'+ f +'.udmf')
            .done(function(res){
                
                var obj, o, l, type, namespace, option, value;
        
                res = res.split('}');
                
                // parse file line by line
                //                                
                for (var i in res) {
                    // convert to js object
                    //
                    o = res[i]
                            .replace('\n{',';')
                            .replace(/\s/g,'')
                            .replace(/\n/g,'')
                            .replace(/=/g,':')                         
                            .split(';');
                    
                    if (i == 0) {
                        // get namespace
                        namespace = o.shift();
                    }
                    
                    type = o.shift();
                    type = type.substring(0, type.indexOf('//') ).trim();
                    
                    obj = {};
                    
                    for (var j in o) {
                        if ( o[j].length > 0 ) {

                            l = o[j].split(':');

                            option  = l[0].trim();
                            
                            if (isNaN(Number( l[1] ))) {
                                
                                value = l[1].replace(/\"/g,'');
                                
                                if (value == "true") {
                                    value = true;
                                } else if (value == "false"){
                                    value = false;
                                }
                            } else {
                                //if ( option == 'x') {
                                //    value = Number( l[1] ) / 1.5;
                                //} else {
                                    value = Number( l[1] );
                                //}
                            }
                                                     
                            obj[ option ] = value;
                        }
                    }
                    // create udmf entity and push to proper array
                    o = Factory( type, obj );
                    
                    if (i == res.length-1 ){
                        // last
                        
                        t.load();
                    }
                }
            });
    };
};

o_.postInit = function(o){
    
};

core.loadNext();