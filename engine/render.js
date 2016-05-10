/*
 * NULL Engine
 *  
 * 
 * Thanks to http://www.html5rocks.com/en/tutorials/pointerlock/intro/
 * 
 * @module  core/render
 * @author  kod.connect
 */


//var controlsEnabled = false;
r_.prevTime     = performance.now();
r_.velocity     = new THREE.Vector3();   
r_.objects      = [];
r_.floors       = [];
r_.ceilings     = [];
r_.walls        = [];
r_.sprites      = [];
r_.mats         = {}; // material cachce
r_.imgs         = {}; // texture cache
r_.globaltimer  = 0;
r_.direction    = false;
r_.frustum      = new THREE.Frustum();
r_.width        = -1;
r_.height       = -1;
r_.msgs         = []; // message buffer

r_.animate = function () {
    
    requestAnimationFrame( r_.animate );
                
    var time        = performance.now();
    var delta       = ( time - r_.prevTime ) / 1000; 
    
    //if (delta < 0.06) return; // do not refresh too fast
    
    r_.stats.update();
    
    r_.bobfactor    = r_.bobfactor  || 0; // camera bob
    r_.weapon.sin   = r_.weapon.sin || 0; // weapon bob
    r_.weapon.cos   = r_.weapon.cos || 0;
     
    r_.frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( r_.camera.projectionMatrix, r_.camera.matrixWorldInverse ) );
    
    // hide objects that out of frustum
    for (var i in r_.objects){
        r_.objects[i].visible = r_.frustum.intersectsObject( r_.objects[i] );
    }
    
    // Animate POV weapon 
    //
    r_.drawWeapon(delta);
    
    // update specials
    //
    r_.updateSpecials(delta);

    if ( i_.controls.enabled ) { 
        
        // change bobfactor while moving
        if ( i_.act.forward || i_.act.back || i_.act.left || i_.act.right) {

            r_.bobfactor  = Math.sin( time / 100 ) * 5;
            r_.weapon.sin = Math.sin( time / 300 ) * 50;
            r_.weapon.cos = Math.cos( time / 300 ) ;
        } 
        
        // use/open action
        //
        if ( i_.act.use ){

            //console.log('..trying to use something')
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
            r_.raycaster.ray.direction.copy( i_.controls.getDirection( new THREE.Vector3() ) );
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
                        
                        c_.nextmap();
                        s_.play( s_.menuback );
                        
                    } else {

                        s_.play( s_.ugh );
                    }
                }
            }

            i_.act.use = false;
        }
        
        // Fire
        //
        
        if ( i_.act.attack && r_.weapon.state == 'ready') {
            
            r_.weapon.state = 'delay';
            //console.log('->FIRE: delay');
        }
        
        if ( !i_.act.attack && r_.weapon.state == 'delay') {
            
            // cancel delay
            r_.weapon.state = 'ready';
            //console.log('FIRE: ready');
        }        
        
        if ( i_.act.attack && r_.weapon.state == 'delay') {
            
            if (r_.weapon.delay > o_.weapons[ p_.weapon ].delay ){
                
                r_.weapon.state = 'fire';
                r_.weapon.delay = 0;
                r_.weapon.frame = 0;
                //console.log('FIRE: fire');
                
            } else {
                
                r_.weapon.delay += 100 * delta;
                //console.log('weapon.delay:',r_.weapon.delay )
            }
        };
        
        if ( r_.weapon.state == 'cooldown'){
            
            if (r_.weapon.cooldown > o_.weapons[ p_.weapon ].cooldown ){
                
                r_.weapon.state = 'ready';
                r_.weapon.cooldown = 0;
                //console.log('FIRE: ready');
            } else {
                r_.weapon.cooldown += 100 * delta;
            }
        }
        
        if ( i_.act.attack && r_.weapon.state == 'fire') {

            s_.play( o_.weapons[ p_.weapon ].sfx_fire );
            
            o_.weapons[ p_.weapon ].onFire();
                       
            r_.weapon.state = 'cooldown';
            //console.log('FIRE: cooldown');
        }
                        
        // test collisions against walls
        //
        
        var matrix = new THREE.Matrix4();
        var hits   = [];
        //r_.direction = (r_.direction) ? r_.direction : new THREE.Vector3().copy( i_.controls.getDirection(new THREE.Vector3() ) );
        r_.direction = new THREE.Vector3().copy( i_.controls.getDirection(new THREE.Vector3() ) );        
        
        if ( i_.act.back ) {            
            matrix.makeRotationY( Math.PI );
        }
        
        if ( i_.act.left ) {            
            matrix.makeRotationY( 0.5 * Math.PI );
        }
        
        if ( i_.act.right ) {            
            matrix.makeRotationY( 1.5 * Math.PI );
        }
        
        r_.direction.applyMatrix4(matrix);
        
        // test collisions agains items
        //
        r_.raycaster.ray.origin.copy( i_.controls.getObject().position );        
        r_.raycaster.ray.origin.y -= (cfg.playerHeight/2) - 2;
        r_.raycaster.far           = 100;
        
        // cast 5 rays
        
        // direct ray
        r_.raycaster.ray.direction.copy( r_.direction );
        hits.push( r_.raycaster.intersectObjects( r_.sprites )[0] );
        
        // -10 ray
        matrix.makeRotationY( -10 * Math.PI / 180 );
        r_.direction.applyMatrix4(matrix);
        r_.raycaster.ray.direction.copy( r_.direction );
        hits.push( r_.raycaster.intersectObjects( r_.sprites )[0] );
        
        // +5 ray
        matrix.makeRotationY( 20 * Math.PI / 180 ); // +10 to direct
        r_.direction.applyMatrix4(matrix);
        r_.raycaster.ray.direction.copy( r_.direction );
        hits.push( r_.raycaster.intersectObjects( r_.sprites )[0] );
        
        // restore direction
        matrix.makeRotationY( -10 * Math.PI / 180 );
        r_.direction.applyMatrix4(matrix);
        
        // merge raycasting results
        var pickups = [];
        
        for (var h in hits) {
            
            var found = false;     
            
            if (hits[h] == undefined) continue;
            
            for (var p in pickups){
                
                if (pickups[p].object.id == hits[h].object.id) {
                    found = true;
                    break;
                } 
            }
            
            if ( !found ) {
                //console.log('pickup sort',pickups,hits[h])
                pickups.push(hits[h]);
            }
        }
                
        for (var p in pickups) {

            if (pickups[p].distance < 100) {

                var thing = o_.things[ pickups[p].object.type ];

                if ( thing.class.indexOf('P') != -1 ){

                    var id = pickups[p].object.id;

                    // pick up item
                    r_.drawMessage( u_.msg.got_.replace('%item%', thing.label) );
                    
                    console.log('pickup',thing.label,p)

                    if (thing.sound == undefined) {

                        if (thing.class.indexOf('W') != -1) {
                            // weapon
                            s_.play( s_.getweapon );

                        } else {
                            s_.play( s_.getitem );
                        }
                    } 

                    // remove item from world
                    r_.scene.remove( pickups[p].object );

                    for (var i in r_.sprites) {
                        
                        if (r_.sprites[i].id == id) {
                            
                            r_.sprites.splice( i, 1);
                            break;
                        }
                    }
                }
            }
        }
             
   
        // collisions with walls 2
        //
        if (!cfg.noclip) {
            
            r_.raycaster.ray.origin.copy( i_.controls.getObject().position);
            r_.raycaster.ray.origin.y -= (cfg.playerHeight/2);
            r_.raycaster.ray.direction.copy( r_.direction ); 
            r_.raycaster.far           = 25;
            var hits = r_.raycaster.intersectObjects( r_.walls );

            if (hits[0] != undefined)
            if (hits[0].distance < 20) {

                // pushback alittle                    
                if (i_.act.forward)     {
                    i_.act.forward  = false;
                    r_.velocity.z   = 21;

                } else if (i_.act.back ) {
                //} else {

                    i_.act.back     = false;
                    r_.velocity.z   = -21;
                }

                if (i_.act.left ) {
                //if ( r_.direction.x < 0) {
                    i_.act.left     = false;
                    r_.velocity.x   = 21;

                } else if (i_.act.right ) {
                //} else {
                    i_.act.right    = false;
                    r_.velocity.x   = -21;

                }  
                //r_.velocity = new THREE.Vector3(0,0,0);
                //console.log( r_.direction.x, r_.direction.z );
                r_.direction = false;
            }
        }
                  
                      

        // test collisions against floor
        //        
        r_.raycaster.ray.origin.copy( i_.controls.getObject().position );
        r_.raycaster.ray.origin.y += 200;//cfg.playerHeight;
        r_.raycaster.ray.direction.set( 0, -1, 0 );
        r_.raycaster.far           = 900;

        var hits = r_.raycaster.intersectObjects( r_.floors );

        // @FIXME
        if (hits[0] != undefined) {

            // player weapon shading
            var tsector = o_.map.sector[ hits[0].object.sector ];
            var color   = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')');
            r_.weapon.obj.material.color = color;
            r_.weapon.obj.material.needsUpdate  = true;             

            if (hits[0].distance < cfg.playerHeight) {
                //console.log( hits[0].object)
                i_.controls.getObject().position.y = hits[0].object.position.y + cfg.playerHeight + r_.bobfactor;

            } else if (hits[0].distance > cfg.playerHeight) {

                i_.controls.getObject().position.y = hits[0].object.position.y + cfg.playerHeight + r_.bobfactor;
            }
        } else {

             //i_.controls.getObject().position.y = cfg.playerHeight;
        }

        var isOnObject = true; 

        r_.velocity.x -= r_.velocity.x * 5.0 * delta; // 5.0 = speed
        r_.velocity.z -= r_.velocity.z * 5.0 * delta;
        r_.velocity.y -= 9.8 * 150.0 * delta; // 9.8 = ?; 100.0 = mass       

        if ( i_.act.forward ) r_.velocity.z -= 1600.0 * delta;
        if ( i_.act.back )    r_.velocity.z += 1600.0 * delta;

        if ( i_.act.left )    r_.velocity.x -= 1600.0 * delta;
        if ( i_.act.right )   r_.velocity.x += 1600.0 * delta;

        if ( isOnObject === true ) {
            r_.velocity.y = Math.max( 0, r_.velocity.y );
            i_.act.jump = true;
        }

        //console.log( r_.velocity.x, r_.velocity.y, r_.velocity.z );

        i_.controls.getObject().translateX( r_.velocity.x * delta );
        i_.controls.getObject().translateY( r_.velocity.y * delta );
        i_.controls.getObject().translateZ( r_.velocity.z * delta );

    }

    /*
    if ( i_.controls.getObject().position.y < cfg.playerHeight ) {

        r_.velocity.y = 0;
        i_.controls.getObject().position.y = cfg.playerHeight;
        i_.act.jump = true;
    } 
    */                             

    r_.globaltimer = (r_.globaltimer * 100 * delta > 10) ? 0 : parseInt(r_.globaltimer)+1; 

    // update animated floors
    //
    r_.updateFloors(delta);

    // Update things
    //
    r_.updateThings(delta);
    
    // Falloff
    //
    if (r_.falloff) {
        
        r_.drawFalloff('update', delta);
    }

    r_.prevTime = time;
    r_.render();
};

r_.drawFalloff = function(o,delta){
    
    if (o == 'update') {

        for (var i in r_.hud.chunks) {

            r_.hud.chunks[i].position.y -= c_.random(20, 40);          

            if (r_.hud.chunks[i].position.y < r_.height*-1.5) { // effect finished
                                
                r_.falloff = false;  
    
                // clear chunks
                for (var j in r_.hud.chunks){
                    
                    r_.hudScene.remove( r_.hud.chunks[j] );
                }
                
                break;
            }
        }
        
    } else {

        // update camera position to player start location
        var tcamera = i_.controls.getObject();
        tcamera.position.set( p_.spawn.position.x, p_.spawn.position.y, p_.spawn.position.z );
        tcamera.rotation.set( p_.spawn.rotation.x, p_.spawn.rotation.y, p_.spawn.rotation.z ); 
        tcamera.children[0].rotation.set(0,0,0);
        
        r_.falloff      = true; 
        r_.back.visible = false;
    }
};

r_.drawFlats = function(lines, tsector, sectorIndex){
            
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
            var v1 = o_.map.vertex[ lines[l].v1 ];
            var v2 = o_.map.vertex[ lines[l].v2 ];                    

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

                                //console.log('......shape '+ sectorIndex +' is complete');
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

            // pick vertex from shapes[sh] and compare it to shapes[j] 
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
    floor.sector     = sectorIndex;

    if (r_.img.animated[ tsector.texturefloor.match(/\D+/)[0] ] != undefined) {                    
        floor.frame  = tsector.texturefloor.match(/\d+/)[0];
        floor.sprite = tsector.texturefloor.match(/\D+/)[0];
    }

    r_.objects.push(floor);
    r_.floors.push(floor);
    r_.obstacles.push(floor);
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
        ceiling.sector     = sectorIndex;

        r_.objects.push(ceiling);
        r_.ceilings.push(ceiling);
        r_.obstacles.push(ceiling);
        r_.scene.add(ceiling);
    }

}

r_.drawMessage = function(text){
    
    var x       = 10 + (r_.width/-2);
    var first   = { 
        position: { x: x }, 
        material: { map: { image: { width: 0 } } } 
    };
    var objMsg  = [];
    var prefix  = 'STCFN';
    var size    = r_.scale/1.5;

    text = text.toUpperCase();
    
    for (var i in text){

        var n               = ( text.charCodeAt(i) < 100 ) ? '0'+ text.charCodeAt(i) : text.charCodeAt(i);
        
        if (r_.imgs[ prefix + n ] == undefined) continue;
    
        var w               = r_.imgs[ prefix + n ].image.width;
        var h               = r_.imgs[ prefix + n ].image.height;
        var z               = (r_.height/2) - (r_.msgs.length * h * size) - (h * size);
        var spriteMaterial  = new THREE.SpriteMaterial({map: r_.imgs[ prefix + n ]});
        var sprite          = new THREE.Sprite(spriteMaterial);  
        var prev            = ( objMsg[i-1] != undefined) ? objMsg[i-1] : first;
        
        sprite.scale.set( w * size, h * size, 1);
        sprite.position.set( prev.position.x + (prev.material.map.image.width * size)  , z, 12);
        
        objMsg.push(sprite);
        r_.hud.objects.push(sprite);
        r_.hudScene.add(sprite);
        
        if (i == text.length-1){ // last
            
            r_.msgs.push(objMsg);
  
            window.setTimeout(r_.updateMessages, 5000);
        }
    }
    
    
};
    
r_.drawStatusText = function(o){
       
    var x = (o.x.toString().indexOf('%') == -1) ? o.x : (r_.width/ -2) + (r_.width  * parseFloat(o.x.replace('%','')) / 100);
    var z = (o.z.toString().indexOf('%') == -1) ? o.z : (r_.height/-2) + (r_.height * parseFloat(o.z.replace('%','')) / 100);
    
    for (var i in o.text){

        var n = o.text[i];

        if (n == '%') {
        
            n = 'PRCNT';
        
        } else if (n == '-') {
            
            n = 'MINUS';
        
        } else if ( parseInt(n) >= 0 && parseInt(n) <= 9 ) {
            
            n = 'NUM'+ n;
        }

        var w               = r_.imgs[ o.prefix + n ].image.width;
        var h               = r_.imgs[ o.prefix + n ].image.height;
        var spriteMaterial  = new THREE.SpriteMaterial({map: r_.imgs[ o.prefix + n ]});
        var sprite          = new THREE.Sprite(spriteMaterial);            
        sprite.scale.set( w * r_.scale, h * r_.scale, 1);

        if (o.direction == 'ltr') {

            sprite.position.set( x + (i * r_.scale * w), z, 12);

        } else {

            sprite.position.set( x - ((o.text.length - i) * r_.scale * w), z, 12);
        }
        
        r_.hud.objects.push(sprite);
        r_.hudScene.add(sprite);
    }
};

r_.drawSkyBox = function(){

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

    mesh.position.copy( p_.spawn.position );
    mesh.position.y += 2000;

    // Set the x scale to be -1, this will turn the cube inside out
    mesh.scale.set(-1,1,1);
    r_.skybox = mesh;
    r_.scene.add( mesh );  

    //r_.scene.fog = new THREE.Fog( 0xcccccc, 5000, 7000 );
};

r_.drawWeapon = function(delta){
    
    var wpn = r_.weapon.obj;
    
    if (wpn != null) {
    
        if (r_.weapon.state == 'takeup') { // taking up

            var thisPos = wpn.position.y += 700 * delta;            
            var stopPos = r_.hud.statusbar.position.y + (o_.weapons[ p_.weapon ].offset_y) + (r_.hud.statusbar.material.map.image.height * r_.scale/2) + (wpn.material.map.image.height * r_.scale/2);

            if (thisPos <= stopPos) {

                wpn.position.set(0, thisPos, 5);

            } else {

                wpn.position.set(0, stopPos, 5);
                r_.weapon.state = 'ready';
                //console.log('FIRE: ready');
            }

        } else if ( r_.weapon.state == 'takedown') { // taking down

            var thisPos = wpn.position.y -= 700 * delta;
            var stopPos = (r_.height/-2) - (wpn.material.map.image.height * r_.scale / 2) + (o_.weapons[ p_.weapon ].offset_y );

            if (thisPos >= stopPos) {

                wpn.position.set(0, thisPos, 5);

            } else {

                // weapon is down
                var texture = r_.weapon.getTexture();
                
                wpn.position.set(0, stopPos, 5);
                wpn.scale.x      = texture.image.width  * wpn.scale.x / wpn.material.map.image.width;
                wpn.scale.y      = texture.image.height * wpn.scale.y / wpn.material.map.image.height;
                wpn.material.map = texture;                
                
                r_.weapon.state = 'takeup';
                //console.log('FIRE: takeup');
            }
            
        } else if ( r_.weapon.state == 'ready') {
            
            var yPos = r_.hud.statusbar.position.y + (o_.weapons[ p_.weapon ].offset_y) + (r_.hud.statusbar.material.map.image.height * r_.scale/2) + (wpn.material.map.image.height * r_.scale/2) + ( r_.weapon.sin * r_.weapon.cos );
            var xPos = r_.weapon.sin;
            var dist = Math.sqrt( Math.pow(wpn.position.x - xPos ,2) + Math.pow(wpn.position.y - yPos ,2) );
            var sequence = o_.weapons[ p_.weapon ].ready || o_.weapons.default.ready;
            var frame    = (sequence[ r_.weapon.frame + 1 ] != undefined ) ? r_.weapon.frame + 1 : 0;
            var texture  = r_.imgs[ o_.weapons[ p_.weapon ].sprite + o_.weapons.default.weapon + sequence[ frame ] + '0' ];
            
            if (dist > 10) {  
                xPos = (wpn.position.x + xPos ) / 2;
                yPos = (wpn.position.y + yPos ) / 2;
            }
            
            wpn.position.x           = xPos;
            wpn.position.y           = yPos;
            wpn.scale.x              = texture.image.width  * wpn.scale.x / wpn.material.map.image.width; 
            wpn.scale.y              = texture.image.height * wpn.scale.y / wpn.material.map.image.height;
            wpn.material.map         = texture;
            wpn.material.needsUpdate = true;
            r_.weapon.frame          = frame;
            
        } else if ( i_.controls.enabled && ( r_.weapon.state == 'fire' || r_.weapon.state == 'cooldown' ) ) {            
            
            if ( r_.globaltimer == 1 ) {
                
                // flash
                //
                /*
                var sequence    = o_.weapons[ p_.weapon ].flash; 
                var wpn         = r_.weapon.obj;
                
                if ( sequence[  r_.weapon.flashFrame + 1 ] == undefined ) {
                    
                    // remove flash
                    r_.hudScene.remove( r_.weapon.flash );
                    r_.weapon.flashFrame = 0;
                    r_.weapon.flash      = null;
                    
                } else {
                
                    // animate flash
                    var frame          = r_.weapon.flashFrame + 1;
                    var flash_suffix   = o_.weapons[ p_.weapon ].flasher || o_.weapons.default.flasher;
                    var texture        = r_.imgs[ o_.weapons[ p_.weapon ].sprite + flash_suffix + sequence[frame] + '0'  ];


                    if (r_.weapon.flash == null) {
                        
                        // create flash
                        var spriteMaterial = new THREE.SpriteMaterial({map: texture, transparent: true });
                        var sprite         = new THREE.Sprite(spriteMaterial);   
                        var wpnPosY = r_.hud.statusbar.position.y + (o_.weapons[ p_.weapon ].offset_y) + (r_.hud.statusbar.material.map.image.height * r_.scale/2) + (wpn.material.map.image.height * r_.scale/2);
                        sprite.scale.set(texture.image.width * r_.scale, texture.image.height * r_.scale, 1);
                        sprite.position.x =  wpn.position.x;
                        sprite.position.y =  wpnPosY + (texture.image.height * r_.scale/2);
                        sprite.position.z = 10;
                        //r_.objects.push(sprite);
                        r_.weapon.flash      = sprite;
                        r_.weapon.flashFrame = 0;
                        r_.hudScene.add(sprite);
                        
                    } else {
                        
                        r_.weapon.flashFrame = frame;
                        r_.weapon.flash.material.map         = texture;
                        r_.weapon.flash.material.needsUpdate = true;
                    }
                }
                */
                var sequence = o_.weapons[ p_.weapon ].fire;
                var frame    = r_.weapon.frame + 1;
                
                if (sequence[ frame ] != undefined) {
                    
                    var texture = r_.imgs[ o_.weapons[ p_.weapon ].sprite + o_.weapons.default.weapon + sequence[ frame ] + '0' ];
                    
                    wpn.scale.x              = texture.image.width  * wpn.scale.x / wpn.material.map.image.width; 
                    wpn.scale.y              = texture.image.height * wpn.scale.y / wpn.material.map.image.height;
                    wpn.material.map         = texture;
                    wpn.material.needsUpdate = true;
                    wpn.position.x           = 0;
                    wpn.position.y           = r_.hud.statusbar.position.y + (o_.weapons[ p_.weapon ].offset_y) + (r_.hud.statusbar.material.map.image.height * r_.scale/2) + (wpn.material.map.image.height * r_.scale/2);
                    r_.weapon.frame          = frame;
                }
            }
            
        }
        
    }
};

r_.freezeScreen =function(callback){
    
    // render screen to image and load it as texture
    var scrTexture = new THREE.TextureLoader().load(  r_.renderer.domElement.toDataURL( 'image/png' ) ,
        
        function(texture){
            
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;

            var scrMaterial = new THREE.MeshBasicMaterial({ map: texture });                
            var count  = 200;
            var q      = 1/count;
            var twidth = r_.width / count;        

            r_.hud.chunks = [];

            var map = [
                [ new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1) ],
                [ new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1) ]            
            ];

            for (var i = 0; i < count; i++) {
                // left-bottom, right-bottom, right-upper, left-uppr                                            
                var map = [ 
                    new THREE.Vector2( q*i,   0 ), 
                    new THREE.Vector2( q*i+q, 0 ), 
                    new THREE.Vector2( q*i+q, 1 ), 
                    new THREE.Vector2( q*i,   1 ) 
                ];
                var tgeo = new THREE.PlaneGeometry(twidth, r_.height);               
                tgeo.faceVertexUvs[0][0] = [ map[3], map[0], map[2] ];
                tgeo.faceVertexUvs[0][1] = [ map[0], map[1], map[2] ];

                var chunk = new THREE.Mesh(tgeo, scrMaterial);
                chunk.position.set( (r_.width/-2)+(twidth/2)+(i*twidth), 0, 100);    

                r_.hud.chunks.push(chunk);   
                r_.hudScene.add( chunk );
                
                if (i == count-1 ) { // last
                    
                    callback();
                }
            }
            
        }
    );   
};

r_.findFloor = function(x,z){
    console.log('findFloor(',x,z);
    
    r_.raycaster2.ray.origin.set({ x: x, y: 100, z: z });

    var hits = r_.raycaster2.intersectObjects( r_.floors );
    
    if (hits[0] != undefined) {
        console.log('floor found:',x,z)
        return hits[0];
        
    } else {
        //console.log('no floor:',x,z);
        return false;
    }
};

r_.img = new function(){
    var t = this;
    
    t.cached = 0;
    
    t.load = function(o){
        var f;
        //console.log('r_.img.load()');
        
        o.type = (o.type != undefined) ? o.type : 'png';
        
        t.cached = 0;
        
        for (var i in o.files) {
            
            f = o.files[i];
            //console.log('load image:',f);
            
            // if animated texture loaded, cache other frames
            //
            var animated = t.animated[ f.match(/\D+/) ];
            
            if ( animated != undefined ) {                
                
                for (var j in animated) {
                    
                    console.log('......more cache', f.match(/\D+/)+ animated[j]);
                    var more = f.match(/\D+/)+ animated[j];
                    
                    r_.imgs[ more ] = new THREE.TextureLoader().load( cfg.mod+ "/gra/"+ more +"."+ o.type, function(texture){
                        
                        texture.magFilter = THREE.NearestFilter;
                        texture.minFilter = THREE.NearestFilter;
                    });
                }
            }
            
            r_.imgs[ f ] = new THREE.TextureLoader().load( cfg.mod+ "/gra/"+ f +"."+ o.type , function(texture){
                
                // complete                
                texture.magFilter = THREE.NearestFilter;
                //texture.minFilter = THREE.LinearMipMapLinearFilter;   
                texture.minFilter = THREE.NearestFilter;
                //texture.minFilter = THREE.NearestMipMapNearestFilter, 
                
                t.cached++;
                
                if (typeof o.success == 'function'){
                    
                    o.success(texture);
                }
            },function(e){
                
                // progress
            },function(e){
                
                // error
                console.log('Texture loading error:',e)
            });                  
        }
        
    };
    
    t.animated = {        
        NUKAGE : [1,2,3]
    };
    
    t.ignored = [
        '-'
    ];
};

r_.postInit = function() {
    console.log('r_.postInit()');
    
    //
    // Hud
    //
    r_.hudCamera = new THREE.OrthographicCamera(
        r_.width  / -2, r_.width  /  2,
        r_.height /  2, r_.height / -2, 
        -500, 1000 
    );
    r_.hudCamera.position.x = 0;
    r_.hudCamera.position.y = 0;
    r_.hudCamera.position.z = 0;

    r_.hudScene = new THREE.Scene();

    r_.camera = new THREE.PerspectiveCamera( 75, r_.width /r_.height, 1, 20000 );

    r_.scene = new THREE.Scene();
    //r_.scene.fog = new THREE.FogExp2( 0x000000, 0.002 );

    r_.light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.5 );
    r_.light.position.set( 0, 0, 0 );
    r_.light.visible = true;
    r_.scene.add( r_.light );
    
    //Create the texture that will store our result
    /*
    r_.bufferTexture = new THREE.WebGLRenderTarget(r_.width, r_.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter
    });
    r_.bufferTexture.needsUpdate = true;
    
    // create main "monitor" where scene will be rendered to
    r_.monitor = new THREE.Mesh(
        new THREE.BoxGeometry(r_.width, r_.height, 1), 
        new THREE.MeshBasicMaterial({ map: r_.bufferTexture })
    );
    r_.monitor.position.z = 1;
    r_.hudScene.add( r_.monitor );
    */ 
    r_.renderer = new THREE.WebGLRenderer({ antialias:false, preserveDrawingBuffer: true });
    r_.renderer.setClearColor( 0xffffff );
    r_.renderer.setPixelRatio( window.devicePixelRatio );
    r_.renderer.setSize( r_.width, r_.height );
    r_.renderer.autoClear = false;
    //r_.renderer.gammaInput = true;
    //r_.renderer.gammaOutput = true;
    document.body.appendChild( r_.renderer.domElement );

    window.addEventListener( 'resize', r_.onWindowResize, false );
    
    r_.raycaster = new THREE.Raycaster();
    r_.raycaster.ray.direction.set( 0, -1, 0 );    
    
    r_.stats = new Stats();
    document.body.appendChild( r_.stats.domElement );
    
    i_.init();    
    r_.modInit();
    
    $('canvas').bind( 'click', function ( e ) {

        var element = document.body;

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {

            if (cfg.fullscreen) {

                var fullscreenchange = function ( e ) {

                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                        element.requestPointerLock();
                    }

                };

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();

            } else {

                element.requestPointerLock();
            }

        } else {

                element.requestPointerLock();
        }

    });
};     

// function based on
// https://github.com/substack/point-in-polygon/blob/master/index.js
// ray-casting algorithm based on
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
r_.inPoly = function(point, vs) {
    
    var x = point.x, y = point.y;
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

r_.mode = new function(){
    console.log('....r_.mode()');
    
    var t = this;
    var screenMode = cfg.screenmode.split('x');
        
    t.list      = [ '640x480', '800x600', '1024x768', '1280x800' ];
    t.current   = cfg.screenmode;    
    
    r_.width    = screenMode[0];
    r_.height   = screenMode[1];
    r_.scale    = r_.width / 320;
    
    t.next = function(){
        // get index of current mode
        var i = t.list.indexOf( t.current );
        
        // check next mode
        if ( i < t.list.length-1 ) {
            // set next mode
            t.set( t.list[i+1] );
        } else {
            // set first mode
            t.set( t.list[0] );
        }
    };
    
    t.prev = function(){
        // get index of current mode
        var i = t.list.indexOf( t.current );
        
        // check prev mode
        if ( i > 0 ) {
            // set next mode
            t.set( t.list[i-1] );
        } else {
            // set last mode
            t.set( t.list[ t.list.length-1 ] );
        }
    };
    
    t.set = function( val ){
        console.log('r_.mode.set()');
        
        var scrMode = val.split('x');
                       
        // update render
        r_.camera.aspect = scrMode[0] / scrMode[1];
        r_.camera.updateProjectionMatrix();
        r_.renderer.setSize( scrMode[0], scrMode[1] );
        r_.scale = scrMode[0] / 320;
        r_.width = scrMode[0];
        r_.height= scrMode[1];
        
        t.current = val;
    };
        
};

r_.onWindowResize = function () {

    //scrWidth = window.innerWidth;
    //scrHeight= window.innerHeight;
    //scale    = (scrWidth / scrHeight) * 2;

    //camera.aspect = scrWidth / scrHeight;
    //camera.updateProjectionMatrix();
    //renderer.setSize( scrWidth, scrHeight );
};

r_.render = function() {
    
    r_.renderer.clear();
    r_.renderer.render( r_.scene, r_.camera );
    r_.renderer.clearDepth();
    r_.renderer.render( r_.hudScene, r_.hudCamera );
};

r_.spawnNumber = function (n,x,y,z){
     
    var step = 16 * r_.scale/4 + 3;
    
    for (var i in n) {
        var matSprite = new THREE.SpriteMaterial({ map: r_.imgs[ 'STTNUM'+ n[i] ] });
        var sprite = new THREE.Sprite( matSprite );
        sprite.scale.set( 14 * r_.scale/4, 16 * r_.scale/4, 1);
        sprite.position.set( x , y + (i * step) + (16 * r_.scale/4) , z );
        r_.scene.add(sprite);
    }
};

r_.spawnThing = function( type, x, z, y, state, frame ){  
        
    var thing = o_.things[ type ];
    var texture;
    var sequence;
    var template;
    var angle = 0;
    var hp    = 0;
            
    if (thing == undefined) return; // skip if not found in db

    // define default frame    
    //
    if (thing.sequence[0] == '-') return; // skip special flag

    if (thing.class.indexOf('M') != -1) { // monster
        
        template = o_.things[ thing.template ];
        sequence = thing.move || template.move;      
        frame    = (frame != undefined) ? frame : c_.random(0, sequence.length-1); // put random starting frame
        angle    = 1;
        hp       = thing.hp;
        
    } else { // item
        
        sequence = thing.sequence;
        frame    = (frame != undefined) ? frame : c_.random(0, thing.sequence.length-1); 
        angle    = 0;
        
    }    
    
    texture = r_.imgs[ thing.sprite + sequence[frame] + angle ];  
    
    if (texture == undefined) {
        console.log('......texture not found', type, o_.things[ type ].label);
        return;
    }                
    
    var matPlane    = new THREE.MeshPhongMaterial({ map: texture, transparent: true, alphaTest: 0.5, opacity: (thing.camo) ? 0.5 : 1 });
    var width       = texture.image.width;
    var height      = texture.image.height;
    var geoPlane    = new THREE.PlaneGeometry(width, height);
    var plane       = new THREE.Mesh( geoPlane, matPlane );    
    
    // spawn light sources
    
    if (thing.light != undefined) {
        
        if (cfg.gl_light) {
            
            console.log('..spawning light source', thing.label);
            plane.light = new THREE.PointLight( thing.light, 2, 50 );
            plane.light.position.set(x, 0, z);
            r_.scene.add( plane.light );
            
        } else {
            
            plane.light = true;
        }
    }         
    
    plane.position.set( x, y || 0, z );
    plane.hp    = hp;
    plane.type  = type;
    plane.frame = frame;
    plane.angle = angle;
    plane.state = (state != undefined) ? state : 'move';

    if ( thing.class.indexOf('O') != -1 ) r_.obstacles.push(plane); // add obstacle

    r_.objects.push(plane);
    r_.sprites.push(plane);        
    r_.scene.add(plane);
};

r_.spawnThings = function(){    
    console.log('....spawning things');
    
    for (var i in o_.map.thing) {

        var o = o_.map.thing[i];

        if (o.dm) continue; // skip multiplayer things

        //floorheight = r_.findFloor( -o.x, o.y );
        //floorheight = (floorheight != false) ? floorheight.object.position.y : 0;
        var floorheight = 0;

        if (o.type == 1) { // player starting position

            // remember it to move camera here later
            p_.spawn = {
                position: { x: -o.x, y: floorheight + cfg.playerHeight,  z: o.y },
                rotation: { x: 0,    y: (o.angle + 90) * Math.PI / 180 , z: 0   }
            };
            //i_.controls.getObject().position.set( -o.x, floorheight + cfg.playerHeight, o.y );
            //i_.controls.getObject().rotation.set(0, (o.angle + 90) * Math.PI / 180 , 0 );

        } else if ( o_.things[ o.type ] != undefined ) {

            // known thing
            r_.spawnThing( o.type, -o.x, o.y );

        } else {

            // add thing placeholder for rest
        }
    }
};

r_.updateFloors = function(delta){
    
    if (r_.globaltimer == 1) {
        
        for (var i in r_.floors){

            var o = r_.floors[i];
            
            if (!o.visible) continue;

            if ( o.frame != undefined && o.sprite != undefined) {

                var animated  = r_.img.animated[ o.sprite ];
                var nextFrame = ( animated[ o.frame + 1 ] != undefined ) ? o.frame + 1 : 0;

                o.frame = nextFrame;
                o.material.map = r_.imgs[ o.sprite + animated[ nextFrame ] ];
                o.material.needsUpdate = true;
            }
        };
    }
};

r_.updateMessages = function(){
    
    //console.log('..r_.updateMessages()');
    var size = r_.scale/1.5;
    // remove oldest
    var old = r_.msgs.shift();
    
    for (var i in old){
        
        r_.hud.objects.splice( r_.hud.objects.indexOf(old[i]), 1);
        r_.hudScene.remove( old[i] );
    }
    
    // push up all the rest
    for (var i in r_.msgs){
        
        var tmsg = r_.msgs[i];
        
        for (var j in tmsg) {
            
            var h = tmsg[j].material.map.image.height;
            
            tmsg[j].position.y += (h * size);
        }
    }
};

r_.updateSpecials = function(delta){
    
    if ( o_.map.actions.length > 0){
        
        for (var a in o_.map.actions){
            
            var taction = o_.map.actions[a];
            
            // door opening
            //
            if (taction.special == 1) {              
                
                // raise walls
                //
                for (var i in taction.walls) {
                    
                    var twall = r_.walls[ taction.walls[i] ];
                    twall.position.y += 100 * delta;

                    if ( twall.position.y >= taction.height + (twall.geometry.parameters.height/2) -2 ) {
                        console.log('......door opened')
                        // stop the door, remove action
                        o_.map.actions.splice( a, 1 );
                    }
                }
                
                // raise ceiling
                //
                r_.ceilings[ taction.ceiling ].position.y += 100 * delta;                
            }
        }
    }
};

r_.updateThings = function (delta){
    
    for (var i in r_.sprites){

        if (!r_.sprites[i].visible) continue;
            
        var o = r_.sprites[i];       
        var tsector;

        r_.raycaster.ray.origin.copy( o.position );
        r_.raycaster.ray.origin.y += 400;

        var hits = r_.raycaster.intersectObjects( r_.floors );

        if (hits[0] != undefined) {

            // update things position          
            if ( o_.things[ o.type].class.indexOf('^') == -1 ) {
                
                tsector = o_.map.sector[ hits[0].object.sector ];
                o.position.y = hits[0].object.position.y + (o.material.map.image.height /2);//(o.geometry.parameters.height /2 ); 
            }

            // update light source position
            if (o.light != undefined && cfg.gl_light) {                    
                o.light.position.y = o.position.y + (o.material.map.image.height /2);
            }

        } else {

            tsector = o_.map.sector[0];
        }

        // rotate things to allways face the player
        o.rotation.y = i_.controls.getObject().rotation._y;

        // update animation
        //
        if (r_.globaltimer == 1) {

            var thing       = o_.things[ o.type ];           
            var color, emissive;
            
            if (thing.camo) {
                
                color    = new THREE.Color(0x000000);
                //emissive = new THREE.Color(0x000000);
                
            } else if (o.light != undefined) {
             
                color    = new THREE.Color( 0xffffff );
                //emissive = new THREE.Color( o_.things[ o.type ].light );                
                
            } else {
                
                color    = new THREE.Color('rgb('+ tsector.lightlevel +','+ tsector.lightlevel +','+ tsector.lightlevel +')');
                //emissive = new THREE.Color( 0x000000 );
            }

            if (thing.class.indexOf('M') != -1) { // monster

                var template = o_.things[ thing.template ];
                var sequence = thing[ o.state ] || template[ o.state ];

                if ( sequence[ o.frame + 1] == undefined ) { // last frame in sequence                                            

                    // let it finally die
                    if ( o.state == 'death') {

                        // remove sprite                            
                        r_.sprites.splice( i, 1 );

                        // remove from scene
                        r_.scene.remove( o );

                        // spawn corpse
                        r_.spawnThing( thing.corpse, o.position.x, o.position.z, o.position.y );      

                        break;

                    } else if (o.state == 'pain') {
                        
                        o.state = 'move';
                        o.angle = 1;
                        var nextFrame = 0;
                        
                    } else {

                        var nextFrame = 0;
                    } 

                } else {

                    // there are some frames to show

                    var nextFrame = o.frame + 1;                        
                }                                                                        

            } else {

                var sequence    = thing.sequence;
                
                if ( sequence[ o.frame + 1] == undefined ) { // last frame in sequence                                            

                    // remove sprite at the end of animation
                    if ( o.state == 'death') {

                        // remove sprite                            
                        r_.sprites.splice( i, 1 );

                        // remove from scene
                        r_.scene.remove( o );

                        break;

                    } else {

                        var nextFrame = 0;
                    } 

                } else {

                    // there are some frames to show

                    var nextFrame = o.frame + 1;                        
                }
            }  

            var texture     = r_.imgs[ thing.sprite + sequence[ nextFrame ] + o.angle ];           

            if (texture == undefined) {

                console.log('no texture', thing.sprite, o.state, nextFrame, o.angle);

            } else {

                var oldtxtr   = r_.imgs[ thing.sprite + sequence[ o.frame ] + o.angle ];                    

                o.scale.x               = texture.image.width / oldtxtr.image.width; 
                o.scale.y               = texture.image.height / oldtxtr.image.height;
                o.position.y            = o.position.y - (oldtxtr.image.height/2) + (texture.image.height/2);
                o.frame                 = nextFrame;
                o.material.map          = texture;
                o.material.color        = color;
               // o.material.emissive     = emissive;
                o.material.needsUpdate  = true;                                       
            }
        }                        
    }
};

core.loadNext();