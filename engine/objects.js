/*
 * NULL Engine
 * 
 * @module core/objects
 * @author kod.connect 
 */

o_.hurtMonster = function(obj, damage){  

    obj.hp -= damage;
    
    if ( obj.hp <= 0 && obj.state != 'death' && obj.state != 'gibbed') {

        o_.killMonster(obj);
        
    } else {        
        // monster in pain
        
        var thing = o_.things[ obj.type ];                
        
        // pain check
        if (c_.random(1, 255) <= thing.painchance ) {
            
            // pain sound
            if (obj.state != 'pain' && obj.state != 'death') {
                s_.play( thing.sfx_pain );
            }
        }
        
        obj.state = 'pain';
        obj.frame = 0;       
        
        // spawn blood
        r_.spawnThing( c_.random(1002,1004) , obj.position.x + c_.random(-5,5), obj.position.z+ c_.random(-5,5), obj.position.y+ c_.random(-5,5), 'death', 0);
    }
};

o_.hurtMonsters = function(targets, damage){
  
    for (var i in targets){
        
        o_.hurtMonster(targets[i], damage[i]);
    }
};

o_.killMonster = function(obj){
    
    if (obj.state == 'death' || obj.state == 'gibbed') return; // it's already dead        
    
    var thing = o_.things[ obj.type ];
    
    console.log('kill', thing.label, obj.id)
    
    // play death sound
    if (typeof thing.sfx_death == 'object' && thing.sfx_death.length > 1) {

        s_.play( thing.sfx_death[ c_.random( 0, thing.sfx_death.length-1 ) ]);

    } else if (thing.sfx_death != undefined) {

        s_.play( thing.sfx_death );
    }                                                

    // remove obstacle
    if (thing.class.indexOf('O') != -1) {

        for (var i in r_.obstacles) {

            if (r_.obstacles[i].id == obj.id) {
                r_.obstacles.splice( i, 1);
                break;
            }
        }
    }

    // drop loot
    o_.dropLoot(obj);

    // put dying state
    obj.state = 'death';
    obj.frame = 0;
    obj.angle = 0;
};

o_.map = new function(){   
    
    var t = this;
    
    t.current   = -1; // none
    t.list      = [];    
    t.thing     = [];
    t.vertex    = [];
    t.linedef   = [];
    t.sidedef   = [];
    t.sector    = [];    
    t.actions   = []; 
    
    t.add = function(o){
        console.log('....o_.map.add()')
        
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
                
                var img = t.sidedef[i][ textures[j] ].toUpperCase();
            
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
            
            if (thing == undefined || thing.sprite.indexOf('none') != -1 ) continue; // skip if no sprite or if not found in db               

            // remove '+' from sequence if other available
            if (thing.sequence.indexOf('+') != -1 && thing.sequence.length > 1) {
                thing.sequence = thing.sequence.replace('+','');
            }
            
            if (thing.class.indexOf('M') != -1) { // monster
                //console.log('......monster',thing.label)
                var template    = o_.things[ thing.template ];
                var actions     = [ 'attack', 'move', 'pain', 'death' ];
                var angle, cache;
                
                for (var j in actions) {
                    
                    angle = (actions[j] == 'death' || actions[j] == 'gibs') ? 0 : 1;                    
                    cache = thing[ actions[j] ] || template[ actions[j] ] || '';
                    
                    for (var c in cache){
                        
                        var img = thing.sprite + cache[c] + angle;
                        
                        if ( cachelist.indexOf(img) == -1) {

                            cachelist.push(img);
                        }
                    }
                }
                
            } else {                            

                // collect all frames
                for (var j in thing.sequence) {                                                                                

                    if (thing.sequence == '+') {

                        img = thing.sprite + 'A' + '1';
                    } else {

                        img = thing.sprite + thing.sequence[j] + '0';
                    }

                    if ( cachelist.indexOf(img) == -1) {

                        cachelist.push(img);
                    }
                }
            }
            
            // chache copse sprites if any
            if (thing.corpse != undefined) {
                
                var corpse   = o_.things[ thing.corpse ];
                var sequence = corpse.sequence;
                
                for (var j in sequence){
                    
                    cachelist.push( corpse.sprite + sequence[j] + '0');
                }
            }
        }
        
        // POV Weapon textures
        //
        for (var i in o_.weapons){
            
            if (i == 'default') continue;
            
            var weapon          = o_.weapons[i];
            var gun_suffix      = (weapon.weapon  != undefined) ? weapon.weapon  : o_.weapons.default.weapon;
            var flash_suffix    = (weapon.flasher != undefined) ? weapon.flasher : o_.weapons.default.flasher;
            var flash           = weapon.flash;
            var sprite          = weapon.sprite;
            var cache           = o_.weapons[i].cache;
            var projectile      = o_.things[ o_.weapons[i].projectile ];
            
            // cache weapon textures
            for (var j in cache){                
                
                var frame = cache[j];
                cachelist.push( sprite + gun_suffix + frame + '0' );
            }
            
            // cache flash textures
            for (var j in flash){                
                
                var frame = flash[j];
                cachelist.push( sprite + flash_suffix + frame + '0' );
            }
            
            // cache projectile textures
            if (projectile != undefined)
            for (var j in projectile.sequence){
                
                var frame = projectile.sequence[j];
                cachelist.push( projectile.sprite + frame + '0' );
            }
        }
        
        // Blood
        //
        for (var i in o_.weapons.default.bleed){
            
            console.log('......more cache', o_.weapons.default.blood + o_.weapons.default.bleed[i] + '0')
            cachelist.push( o_.weapons.default.blood + o_.weapons.default.bleed[i] + '0' );            
        }
        
        // Cache it all
        //
        for (var i in cachelist) {
            //console.log('....caching image',cachelist[i]);
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
    
    t.clear = function(callback){
        console.log('..clearing stage');
        
        r_.scene.remove( r_.skybox );
        
        // clear
        t.thing     = [];
        t.vertex    = [];
        t.linedef   = [];
        t.sidedef   = [];
        t.sector    = [];
        
        // clear scene
        for (var j in r_.objects){
            
            r_.scene.remove( r_.objects[j] );
            r_.objects[j].geometry.dispose();
            r_.objects[j].material.dispose();
            //r_.objects[j].texture.dispose();                        
        }
        r_.objects  = [];
        r_.walls    = [];
        r_.obstacles= [];
        r_.sprites  = [];
        r_.floors   = [];
        
        // clear hud
        for (var j in r_.hud.objects){
            
            r_.hudScene.remove( r_.hud.objects[j]);
        }
        r_.weapon.obj = null;
        r_.hud.objects = [];
        
        // clrar keys
        p_.keys     = {};
        p_.powerups = {};
        
        // clear cheats
        cfg.noclip  = false;
        
        // clear image cache
        for (var j in r_.imgs){
            
            r_.imgs[j].dispose();
        }
        
        callback();
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
    
    t.build = function(){
        var sides       = {};
        var lines       = {};
        var vertexes    = {};
        var floorheight = 0;
        
        var drawWalls   = 1;
        var drawNums    = 0;
        var drawFlats   = 1;
        var drawOnlySector = false;
        
        var matLine     = new THREE.LineBasicMaterial({ color: 0xff0000 });
        var matLineB    = new THREE.LineDashedMaterial({ color: 0x0000ff, dashSize: 4, gapSize: 2  });
        
        var matVert     = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        var geoVert     = new THREE.BoxGeometry( 3, 3, 3 );
        
        var matThing    = new THREE.MeshBasicMaterial({ color: 0x999900, wireframe: true });        

        for (var sectorIndex in t.sector) {
            
            if (drawOnlySector != false && sectorIndex != drawOnlySector) continue;                       
            
            var tsector  = t.sector[sectorIndex];
            lines        = { count: 0 };
            
            //console.log('....processing sector',sectorIndex);
            
            for (var i in t.sidedef){                           

                // get sides in sector
                if (t.sidedef[i].sector == sectorIndex) {
                    sides[i] = t.sidedef[i];

                    // look for lines to get vertexes
                    for (var j in t.linedef) {
                        
                        // this is front side for the line
                        if (t.linedef[j].sidefront == i) {
                            
                            //
                            // FRONAL SIDE
                            //

                            lines[j] = t.linedef[j];
                            lines.count++;
                            var v1 = t.vertex[ lines[j].v1 ];
                            var v2 = t.vertex[ lines[j].v2 ];                                                                              
                            
                            // upper sidefront texture
                            if ( sides[i].texturetop != '-' ) {      
                   
                                if ( t.sidedef[ t.linedef[j].sideback ] != undefined) 
                                    // ignore upper texture if both sectors have SKY ceiling texture
                                if ( !(tsector.textureceiling.indexOf('SKY') != -1 && t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].textureceiling.indexOf('SKY') != -1) ){  
                                    
                                    var texture     = r_.imgs[ sides[i].texturetop ];
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    //var color       = new THREE.Color( 0x00ff00 );
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ) *-1;                                 
                                    var wallHeight  = tsector.heightceiling - t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightceiling;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );
                                    
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, color: color });
                                    //var matWall     = (t.sidedef[ t.linedef[j].sideback ].uppertexture == '-') ? new THREE.MeshPhongMaterial({ map: texture, color: color, side: THREE.DoubleSide }) : new THREE.MeshPhongMaterial({ map: texture, color: color });
                                        
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
                                    if ( t.linedef[j].blocking ) r_.obstacles.push(wall);
                                    if (drawWalls) r_.scene.add(wall);
                                }
                            }
                            
                            // Middle sidefront texture                                                        
                            if ( sides[i].texturemiddle != '-' ) {                                                    
                                    
                                    var texture     = r_.imgs[ sides[i].texturemiddle ].clone(); 
                                    texture.wrapS   = THREE.RepeatWrapping;
                                    texture.repeat.x= -1;
                                    texture.needsUpdate = true;
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')');
                                    //var color       = new THREE.Color(0x00ff00);
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                    var wallHeight  = tsector.heightceiling - tsector.heightfloor+2;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );                            
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, color: color, transparent: true, alphaTest: 0.5, side: THREE.BackSide });
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
                                    if ( t.linedef[j].blocking ) r_.obstacles.push(wall);
                                    if (drawWalls) r_.scene.add(wall);
                            }
                            
                            // bottom sidefront texture
                            if ( sides[i].texturebottom != '-' ) {                            
                                
                                if ( t.sidedef[ t.linedef[j].sideback ] != undefined ) {
                                    
                                    var texture     = r_.imgs[ sides[i].texturebottom ];   
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    //var color       = new THREE.Color(0x00ff00);
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                    var wallHeight  = t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightfloor - tsector.heightfloor +1;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );                                                        
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, color: color, transparent: true, side: THREE.BackSide });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            
                                    
                                    wall.linedef = j;
                                    wall.sidedef = i;
                                    wall.rotateY( wallAngle );
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightfloor - (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );
                            
                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if ( t.linedef[j].blocking ) r_.obstacles.push(wall);
                                    if (drawWalls) r_.scene.add(wall);                                    
                                }
                            }
                            
                        } else if (t.linedef[j].sideback == i ) {             
                            
                            //
                            // BACK SIDE
                            //
                            
                            lines[j] = t.linedef[j];
                            lines.count++;
                            
                            var v1 = t.vertex[ lines[j].v1 ];
                            var v2 = t.vertex[ lines[j].v2 ];
                                
                            // upper sideback texture
                            if ( sides[i].texturetop != '-' ) {                            
    
                                if ( t.sidedef[ t.linedef[j].sidefront ] != undefined) {                                
                                    
                                    var texture     = r_.imgs[ sides[i].texturetop ];
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    //var color       = new THREE.Color( 0xff0000 );
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ) *-1;                                 
                                    var wallHeight  = tsector.heightceiling - t.sector[ t.sidedef[ t.linedef[j].sidefront ].sector ].heightceiling;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );
                                    
                                    var matWall     = (t.sidedef[ t.linedef[j].sidefront ].texturetop == '-') ? new THREE.MeshPhongMaterial({ map: texture, color: color, side: THREE.DoubleSide }) : new THREE.MeshPhongMaterial({ map: texture, color: color });
                                    
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            

                                    wall.linedef = j;
                                    wall.rotateY( wallAngle );                                
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        //t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightceiling + (wallHeight/2), 
                                        tsector.heightceiling - (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );

                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if ( t.linedef[j].blocking ) r_.obstacles.push(wall);
                                    if (drawWalls) r_.scene.add(wall);
                                }
                            }
                            
                            // texture sideback middle                                                        
                            if ( sides[i].texturemiddle != '-') {    
                                                                    
                                    var texture     = r_.imgs[ sides[i].texturemiddle ];
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')')
                                    //var color       = new THREE.Color( 0xff0000 );
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                    var wallHeight  = tsector.heightceiling - tsector.heightfloor;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );
                                    var matWall     = new THREE.MeshBasicMaterial({ map: texture, color: color, transparent: true, alphatest: 0.5 });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );   
                                    
                                    wall.linedef    = j;
                                    wall.rotateY( wallAngle );
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        tsector.heightfloor + (wallHeight/2), 
                                        (v1.y + v2.y)/2
                                    );
                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if ( t.linedef[j].blocking ) r_.obstacles.push(wall);
                                    if (drawWalls) r_.scene.add(wall);
                                    
                            }         
                            
                            
                            // bottom sideback texture                            
                            if ( sides[i].texturebottom != '-' ) {                            
                                
                                if ( t.sidedef[ t.linedef[j].sidefront ] != undefined ) {
                                    
                                    var texture     = r_.imgs[ sides[i].texturebottom ];   
                                    var color       = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')');                                    
                                    //var color       = new THREE.Color(0xff0000);
                                    var wallWidth   = Math.sqrt( Math.pow( v2.x - v1.x, 2) + Math.pow( v2.y - v1.y, 2) ); 
                                    var wallHeight  = t.sector[ t.sidedef[ t.linedef[j].sidefront ].sector ].heightfloor - tsector.heightfloor +1;
                                    var geoWall     = new THREE.PlaneGeometry( wallWidth, wallHeight );                                                        
                                    var matWall     = new THREE.MeshPhongMaterial({ map: texture, color: color, transparent: true  });
                                    var wallAngle   = Math.atan2(v2.y - v1.y, v2.x - v1.x);
                                    var wall        = new THREE.Mesh( geoWall, matWall );                            
                                    
                                    wall.linedef = j;
                                    wall.rotateY( wallAngle );
                                    wall.position.set( 
                                        (-v1.x -v2.x)/2, 
                                        //t.sector[ t.sidedef[ t.linedef[j].sideback ].sector ].heightfloor - (wallHeight/2),
                                        tsector.heightfloor + (wallHeight/2),
                                        (v1.y + v2.y)/2
                                    );
                            
                                    r_.objects.push(wall);
                                    r_.walls.push(wall);
                                    if ( t.linedef[j].blocking ) r_.obstacles.push(wall);
                                    if (drawWalls) r_.scene.add(wall);                                    
                                }
                            }
                            
                            
                        }
                    }
                }            
            }
            
            //
            // Build floor & ceiling polygon
            //
            if (drawFlats) {
                
                r_.drawFlats(lines, tsector, sectorIndex);
            }
             
        
        }
        
        //
        // Spawn Things
        //
        r_.spawnThings();
        
        r_.drawSkyBox();
    };    
    
    t.next = function(){        
        
        t.current = ( t.current < t.list.length -1 ) ? t.current + 1 : 0;         
        
        r_.freezeScreen(function(){
            t.clear(function(){
                 t.readUDMF( t.list[ t.current ] );
            });
        });     
    };
    
    // called after texture cache ready
    t.proceedLoading = function(){
        
        console.log('....proceed loading');
        
        t.build();              
        
        // remove initial back screen
        //r_.hudScene.remove( r_.back );      
        
        // draw hud
        r_.hud.draw();
        
        // music
        s_.playMusic('DM_'+ t.list[ t.current ].toUpperCase() +'.mp3');
        
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

                                value = Number( l[1] );

                            }
                                                     
                            obj[ option ] = value;
                        }
                    }
                    
                    // create udmf entity and push to proper array
                    o = Factory( type, obj );
                    
                    if (i == res.length-1 ){ // last
                                               
                        t.load();
                    }
                }
            });
    };
};

o_.postInit = function(o){
    
};

core.loadNext();