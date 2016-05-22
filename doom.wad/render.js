/*
 * NULL Engine
 * 
 * @module DOOM/render
 * @author kod.connect
 */

r_.hud      = {
    
    ammo    : [],
    health  : [],
    
    smiling: false,
    
    objects : []
};
        
r_.hud.draw = function(){
    console.log('r_.hud.draw()');
    
    if (r_.hud.objects.length > 0) return; // no need to draw
    
    // WEAPON    
    var spriteMaterial  = new THREE.SpriteMaterial({ map: r_.weapon.getTexture() });
    var sprite          = new THREE.Sprite(spriteMaterial);            
    
    sprite.scale.set( spriteMaterial.map.image.width * r_.scale, spriteMaterial.map.image.height * r_.scale ,1);    
    sprite.position.set(0, (r_.height/-2) - (spriteMaterial.map.image.height * r_.scale / 2) , 1);    
    
    r_.weapon.obj   = sprite;    
    r_.weapon.state = 'takeup';    
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);
    

    // STATUS
    //   

    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STBAR});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(spriteMaterial.map.image.width * r_.scale, spriteMaterial.map.image.height * r_.scale ,1);
    sprite.position.set(0, (r_.height/-2) + (spriteMaterial.map.image.height * r_.scale / 2) , 10);
    r_.hud.statusbar = sprite;
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);

    // FACE
    //                     
    /*
    r_.mats.face =  {
        smiling: [
            new THREE.SpriteMaterial({map: r_.imgs.STFEVL0}), 
        ],    
        normal:    [ 
            new THREE.SpriteMaterial({map: r_.imgs.STFST00}), 
            new THREE.SpriteMaterial({map: r_.imgs.STFST01}),
            new THREE.SpriteMaterial({map: r_.imgs.STFST02})
        ]
    };
    */
    r_.hud.face = new THREE.Sprite( new THREE.SpriteMaterial({ map: r_.imgs[ 'STFST00' ]}) );
    r_.hud.face.scale.set( 24 * r_.scale, 29 * r_.scale, 1);
    r_.hud.face.position.set( 0, (r_.height/-2) + (29 * r_.scale / 2), 11);
    r_.hud.objects.push( r_.hud.face );
    r_.hudScene.add( r_.hud.face );

    // animate    
    r_.hud.update.face();

    // AMMO
    //    
    r_.hud.ammo = r_.drawStatusRed('__0','16%','9%',true);

    // HEALTH
    //
    r_.hud.health = r_.drawStatusRed('100%','34.5%','9%',true)

    // ARMOR
    //
    r_.hud.armor = r_.drawStatusRed('__0%','75.5%','9%',true);
    
    // ARMS background
    //

    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STARMS});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(40 * r_.scale, 32 * r_.scale ,1);
    sprite.position.set((r_.width/-2) + (r_.width * 0.385), (r_.height/-2) + (32 * r_.scale / 2) , 11);
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);

    // Arms numbers
    //
    var coords = {
        pistol          : [ '34.8%',   '10.5%' ],
        shotgun         : [ '39%',     '10.5%' ],
        chaingun        : [ '42.5%',   '10.5%' ],
        rocketlauncher  : [ '34.8%',   '6.5%'  ],
        plasmagun       : [ '39%',     '6.5%'  ],
        bfg             : [ '42.5%',   '6.5%'  ]
    };
    var n = 1;
    for (var i in coords) {    
        n++;
        r_.hud[ 'wpn' +i ] = (p_.weapons[i]) ? r_.drawStatusYellow( n, coords[i][0], coords[i][1] ) : r_.drawStatusGray( n, coords[i][0], coords[i][1] );
    }
        
    
    // Ammo Info
    r_.hud.bullets      = r_.drawStatusYellow('__0','91%','10%', true);
    r_.hud.shells       = r_.drawStatusYellow('__0','91%','7.5%',true);
    r_.hud.rockets      = r_.drawStatusYellow('__0','91%','5.0%',true);
    r_.hud.cells        = r_.drawStatusYellow('__0','91%','2.5%',true);    

    r_.hud.bullets_max  = r_.drawStatusYellow('200','99%','10%', true);
    r_.hud.shells_max   = r_.drawStatusYellow('_50','99%','7.5%',true);
    r_.hud.rockets_max  = r_.drawStatusYellow('_50','99%','5.0%',true);
    r_.hud.cells_max    = r_.drawStatusYellow('300','99%','2.5%',true);
        
    
    // Keys
    //
    // Blue key
    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STKEYS_, transparent: true});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(7 * r_.scale, 7 * r_.scale ,1);
    sprite.position.set((r_.width/-2) + (r_.width * 0.759), (r_.height/-2) + (r_.height * 0.107) , 11);
    r_.hud.bluekey = sprite;
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);
    
    // Yellow key
    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STKEYS_, transparent: true});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(7 * r_.scale, 7 * r_.scale ,1);
    sprite.position.set((r_.width/-2) + (r_.width * 0.759), (r_.height/-2) + (r_.height * 0.066) , 11);
    r_.hud.yellowkey = sprite;
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);
    
    // Red key
    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STKEYS_, transparent: true});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(7 * r_.scale, 7 * r_.scale ,1);
    sprite.position.set((r_.width/-2) + (r_.width * 0.759), (r_.height/-2) + (r_.height * 0.025) , 11);
    r_.hud.redkey = sprite;
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);
    
    // Crosshair
    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.cross, transparent: true, opacity: 0.5});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(2 * r_.scale, 2 * r_.scale, 1);
    sprite.position.z = 2;
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);
};

r_.hud.update = new function(){
    
    var t = this;
    
    t.ammo_value    = '0';
    t.armor_value   = '0';
    t.health_value  = '100';
    t.redkey        = false;
    t.yellowkey     = false;
    t.bluekey       = false;
    t.bullets       = '0';
    t.shells        = '0';
    t.rockets       = '0';
    t.cells         = '0';
    
    t.all = function(){
        
        t.ammo(); 
        t.ammos();
        t.armor();
        t.arms();
        t.health();
        t.keys();
    };
    
    t.ammo = function(){
        
        var value = (p_.ammo[ o_.weapons[ p_.weapon ].ammo ] != undefined) ? p_.ammo[ o_.weapons[ p_.weapon ].ammo ].toString() : '0';        
        
        if (t.ammo_value != value) { // prevent redraw without need
            
            t.ammo_value = value;
            
            for (var i = 0; i < 3; i++){

                var tobj = r_.hud.ammo[ i ];                
                var n    = value[ value.length -1 -i ] || '_';                      
                
                tobj.material.map = r_.imgs[ 'STTNUM' +n ];             
            }
        }
    };
    
    t.ammos = function(){
        
        var atype = [ 'bullets', 'shells', 'rockets', 'cells'];
        
        for (var i in atype){
            
            var value = (p_.ammo[ atype[i] ] != undefined) ? p_.ammo[ atype[i] ].toString() : '0';
            
            
            if (t[ atype[i] ] != value) {
            
                t[ atype[i] ] = value;
            
                for (var j = 0; j < 3; j++){

                    var tobj = r_.hud[ atype[i] ][j];
                    var n    = value[ value.length -1 -j ] || '_';                      
                    //console.log( atype[i], t[atype[i]], value, tobj)
                    tobj.material.map = r_.imgs[ 'STYSNUM' +n ];             
                }
                
            }
        }
    };
    
    t.armor = function(){
        
        var value = p_.armor.toString();
        
        if (t.armor_value != value) { // prevent redraw without need
            
            t.armor_value = value;
            
            for (var i = 0; i < 3; i++){ // skip '%' char

                var tobj = r_.hud.armor[ i + 1 ];
                var n    = value[ value.length -1 -i ] || '_'; 

                tobj.material.map = r_.imgs[ 'STTNUM' +n ];
            }
        }
    };
    
    t.arms = function(){

        var weapons = [
            'fist',
            'chainsaw',
            'pistol',
            'shotgun',
            'chaingun',
            'rocketlauncher',
            'plasmagun',
            'bfg'
        ];
        
        for (var i in weapons){
            
            if (i > 1){
                
                var map = r_.hud[ 'wpn' + weapons[i] ][0].material.map;
                
                if (p_.weapons[ weapons[i] ] == true && map != r_.imgs[ 'STYSNUM'+i ]) {
                    
                    r_.hud[ 'wpn' + weapons[i] ][0].material.map = r_.imgs[ 'STYSNUM'+i ];
                    
                    r_.hud.smile();
                }
            }
        }
    };
    
    t.face = function(){           
        
        // stop face timer if exist
        window.clearTimeout( r_.hud.face.timer );
        
        var state = 5 - Math.ceil( (p_.health+1) /20 );
        state = (state < 0) ? '0' : state.toString();
        
        if (r_.hud.smiling) {
            
            r_.hud.face.material.map = r_.imgs[ 'STFEVL' + state ];            
            
        } else if (r_.hud.pain) {
            
            r_.hud.face.material.map = r_.imgs[ 'STFKILL' + state ];            
            
        } else {
                        
            r_.hud.face.material.map = r_.imgs[ 'STFST' + state + c_.random(0,2).toString() ];            
            r_.hud.face.timer = window.setTimeout(t.face, c_.random(500, 5000));
        }
    };
    
    t.health = function(){
        
        var value = p_.health.toString();
        
        if (t.health_value != value) { // prevent redraw without need
            
            t.health_value = value;
            t.face();
            
            for (var i = 0; i < 3; i++){ // skip '%' char

                var tobj = r_.hud.health[ i + 1 ];
                var n    = value[ value.length -1 -i ] || '_'; 

                tobj.material.map = r_.imgs[ 'STTNUM' +n ];
            }
        }
    };
    
    t.keys = function(){
        
        // blue
        if (!t.bluekey) {
        
            if (p_.keys.bluekeycard) {

                r_.hud.bluekey.material.map = r_.imgs[ o_.powerups.bluekeycard.hudkey ];
                t.bluekey = true;

            } else if ( p_.keys.blueskullkey) {

                r_.hud.bluekey.material.map = r_.imgs[ o_.powerups.blueskullkey.hudkey ];
                t.bluekey = true;

            }           
            
        } else if ( !p_.keys.bluekeycard && !p_.keys.blueskullkey ) {
            
            r_.hud.bluekey.material.map = r_.imgs.STKEYS_;
            t.bluekey = false;
        }
        
        // yellow
        if (!t.yellowkey) {
        
            if (p_.keys.yellowkeycard) {

                r_.hud.yellowkey.material.map = r_.imgs[ o_.powerups.yellowkeycard.hudkey ];
                t.yellowkey = true;

            } else if ( p_.keys.yellowskullkey) {

                r_.hud.yellowkey.material.map = r_.imgs[ o_.powerups.yellowskullkey.hudkey ];
                t.yellowkey = true;

            }           
            
        } else if ( !p_.keys.yellowkeycard && !p_.keys.yellowskullkey ) {
            
            r_.hud.yellowkey.material.map = r_.imgs.STKEYS_;
            t.yellowkey = false;
        }
        
        // red
        if (!t.redkey) {
        
            if (p_.keys.redkeycard) {

                r_.hud.redkey.material.map = r_.imgs[ o_.powerups.redkeycard.hudkey ];
                t.redkey = true;

            } else if ( p_.keys.redskullkey) {

                r_.hud.redkey.material.map = r_.imgs[ o_.powerups.redskullkey.hudkey ];
                t.redkey = true;

            }           
            
        } else if ( !p_.keys.redkeycard && !p_.keys.redskullkey ) {
            
            r_.hud.redkey.material.map = r_.imgs.STKEYS_;
            t.redkey = false;
        }
    };        
        
}; 

r_.hud.smile = function(){
  
    r_.hud.smiling = true;
    r_.hud.update.face();
    
    window.setTimeout(function(){ 

        r_.hud.smiling = false;
        r_.hud.update.face();
        
    }, 2000);        
};

r_.drawStatusGray = function(text, x, z, alignRight){
       
    return r_.drawStatusText({
        
        text        : text,
        x           : x,
        z           : z,
        prefix      : 'STG',
        width       : 4,  
        height      : 6,
        direction   : (alignRight) ? 'rtl' : 'ltr'
    });
};

r_.drawStatusRed = function(text, x, z, alignRight){
    
    return r_.drawStatusText({
        
        text        : text,
        x           : x,
        z           : z,
        prefix      : 'STT',
        width       : 14,  
        height      : 16,
        direction   : (alignRight) ? 'rtl' : 'ltr'
    });
};

r_.drawStatusYellow = function(text, x, z, alignRight){
    
    return r_.drawStatusText({
        
        text        : text,
        x           : x,
        z           : z,
        prefix      : 'STYS',
        width       : 4,  
        height      : 6,
        direction   : (alignRight) ? 'rtl' : 'ltr'
    });
};

r_.modInit = function(){
    console.log('..r_.modInit()');
    
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1]; 

    // load some textures
    r_.img.load({
        type: 'png',
        files: [     
          
            'CREDIT',
            
            // Pistol
            'PISGA0',
            
            // Shotgun
            'SHTGA0',
            'SHTGB0',
            'SHTGC0',
            'SHTGD0',

            // Status
            'STARMS',
            'STBAR',

            // Face
            'STFKILL0',
            'STFEVL0',
            'STFST00',
            'STFST01',
            'STFST02',
            
            'STFKILL1',
            'STFEVL1',
            'STFST10',
            'STFST11',
            'STFST12',
            
            'STFKILL2',
            'STFEVL2',
            'STFST20',
            'STFST21',
            'STFST22',
            
            'STFKILL3',
            'STFEVL3',
            'STFST30',
            'STFST31',
            'STFST32',
            
            'STFKILL4',
            'STFEVL4',
            'STFST40',
            'STFST41',
            'STFST42',
            
            // keys
            'STKEYS_',
            'STKEYS0',
            'STKEYS1',
            'STKEYS2',
            'STKEYS3',
            'STKEYS4',
            'STKEYS5',

            // Big red font
            'STTNUM_', // space
            'STTMINUS',
            'STTNUM0',
            'STTNUM1',
            'STTNUM2',
            'STTNUM3',
            'STTNUM4',
            'STTNUM5',
            'STTNUM6',
            'STTNUM7',
            'STTNUM8',
            'STTNUM9',
            'STTPRCNT',

            // Yellow small font
            'STYSNUM_',
            'STYSNUM0',
            'STYSNUM1',
            'STYSNUM2',
            'STYSNUM3',
            'STYSNUM4',
            'STYSNUM5',
            'STYSNUM6',
            'STYSNUM7',
            'STYSNUM8',
            'STYSNUM9',

            //
            'STGNUM0',
            'STGNUM1',
            'STGNUM2',
            'STGNUM3',
            'STGNUM4',
            'STGNUM5',
            'STGNUM6',
            'STGNUM7',
            'STGNUM8',
            'STGNUM9',

            //
            'AMMNUM0',
            'AMMNUM1',
            'AMMNUM2',
            'AMMNUM3',
            'AMMNUM4',
            'AMMNUM5',
            'AMMNUM6',
            'AMMNUM7',
            'AMMNUM8',
            'AMMNUM9',                 

            'TITLEPIC',
            
            'cross' // crosshair
        ]
    }); 
    
    // cache message font
    for (var i = 32; i <= 95; i++ ){
        
        r_.img.load({ files: [ 'STCFN0'+ i ] });
    }
    // cache message font '!' character
    r_.img.load({ files: [ 'STCFN121' ] });


    // initial screen   
    r_.mats.title = [
        new THREE.SpriteMaterial({ map: r_.imgs.TITLEPIC }),
        new THREE.SpriteMaterial({ map: r_.imgs.CREDIT })
    ];
    
    r_.timerTitle = window.setInterval(function(){
        
        r_.back.material = (r_.back.material == r_.mats.title[0]) ? r_.mats.title[1] : r_.mats.title[0];
        
    },15000);
    
    // setup title back
    //
    r_.back = new THREE.Sprite( r_.mats.title[0] );
    r_.back.scale.set( scrWidth, scrHeight, 1);
    r_.hudScene.add(r_.back);
    
    /*
    setTimeout(function(){
        c_.nextmap();
    }, 2000);
     */
};

r_.weapon   = {
    
    obj         : null,
    state       : 'ready',
    sin         : 0,
    cos         : 0,
    cooldown    : 0,
    delay       : 0,
    frame       : -1,
    flash       : null,
    flashFrame  : -1,
    
    getTexture: function(){
        var wpn             = o_.weapons[ p_.weapon ];        
        var ready           = wpn.ready  != undefined ? wpn.ready[0] : o_.weapons.default.ready[0];
        var wpn_suffix      = wpn.weapon != undefined ? wpn.weapon   : o_.weapons.default.weapon;
        
        return r_.imgs[ wpn.sprite + wpn_suffix + ready + '0'  ];
    }
}; 

// start render
r_.postInit();
r_.animate();

w_.loadNext();