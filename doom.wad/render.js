/*
 * NULL Engine
 * 
 * @module DOOM/render
 * @author kod.connect
 */

r_.hud      = {
    
    ammo    : [],
    health  : [],
    
    smiling: false
};
        
r_.hud.draw = function(){
    console.log('r_.hud.draw()');
    
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

    // ARMS
    //

    var spriteMaterial = new THREE.SpriteMaterial({map: r_.imgs.STARMS});
    var sprite = new THREE.Sprite(spriteMaterial);            
    sprite.scale.set(40 * r_.scale, 32 * r_.scale ,1);
    sprite.position.set((r_.width/-2) + (r_.width * 0.385), (r_.height/-2) + (32 * r_.scale / 2) , 11);
    r_.hud.objects.push(sprite);
    r_.hudScene.add(sprite);

    // FACE
    //                     

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
    r_.hud.face = new THREE.Sprite(r_.mats.face[0]);
    r_.hud.face.scale.set( 24 * r_.scale, 29 * r_.scale, 1);
    r_.hud.face.position.set( 0, (r_.height/-2) + (29 * r_.scale / 2), 11);
    r_.hud.objects.push( r_.hud.face );
    r_.hudScene.add( r_.hud.face );

    // animate
    r_.animateFace = function(){           
        
        if (r_.hud.smiling) {
            
            r_.hud.face.material = r_.mats.face.smiling[0];            
            
        } else {
            
            r_.hud.face.material = r_.mats.face.normal[ c_.random(0,2) ];            
            window.setTimeout(r_.animateFace, c_.random(500, 5000));
        }
    };
    r_.animateFace();

    // AMMO
    //    
    r_.hud.ammo = r_.drawStatusBigFont('___','16%','9%',true);

    // HEALTH
    //
    r_.hud.health = r_.drawStatusBigFont('100%','34.5%','9%',true)

    // ARMOR
    //
    r_.drawStatusText({
        text: '0%', prefix: 'STT', 
        width: 14,  height: 16,     direction: 'rtl',
        x: '75.5%', z: '9%'  
    });

    // Arms numbers
    //
    r_.drawStatusText({
        text: '2',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '34.8%', z: '10.5%'  
    });
    r_.drawStatusText({
        text: '3',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '39%',   z: '10.5%'  
    });
    r_.drawStatusText({
        text: '4',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '42.5%', z: '10.5%'  
    });
    r_.drawStatusText({
        text: '5',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '34.8%', z: '6.5%'  
    });
    r_.drawStatusText({
        text: '6',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '39%',   z: '6.5%'
    });
    r_.drawStatusText({
        text: '7',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '42.5%', z: '6.5%'
    });
    
    // Ammo Info
    r_.drawStatusText({
        text: '50', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '10%'  
    });
    r_.drawStatusText({
        text: '0',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '7.5%'  
    });
    r_.drawStatusText({
        text: '0',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '5%'  
    });
    r_.drawStatusText({
        text: '0',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '2.5%'  
    });
    
    r_.drawStatusText({
        text: '200', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '99%',   z: '10%'  
    });
    r_.drawStatusText({
        text: '50', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '99%',   z: '7.5%'  
    });
    r_.drawStatusText({
        text: '50', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '99%',   z: '5%'  
    });
    r_.drawStatusText({
        text: '300', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '99%',   z: '2.5%'  
    });
    
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
    
    t.ammo_value    = 0;
    t.armor_value   = 0;
    t.health_value  = 100;
    
    t.all = function(){
        
        t.ammo();
        //t.health();
    };
    
    t.ammo = function(){
        
        var value = p_.ammo[ p_.weapon ].toString();
        
        if (t.ammo_value != value) { // prevent redraw without need
            
            t.ammo_value = value;
            
            for (var i = 1; i < 4; i++){

                var tobj = r_.hud.ammo[ r_.hud.ammo.length -i ];                
                var n    = value[ value.length -i ] || '_';      
                
                console.log( r_.imgs[ 'STTNUM' +n ] );
                
                if (false) {

                    tobj.material.map = r_.imgs[ 'STTNUM' +n ];
                    //tobj.meterial.needsUpdate = true;
                }                
            }
        }
    };
    
    t.health = function(){
        
        var value = p_.health;
        
        if (t.health_value != value) { // prevent redraw without need
            
            for (var i = 2; i < 5; i++){ // skip '%' char

                var tobj = r_.hud.health[ r_.hud.health.length -i ];
                var n    = value[ value.length -i ] || '_'; 

                tobj.material.map = r_.imgs[ 'STTNUM' +n ];
                tobj.meterial.needsUpdate = 1;
            }
            
            t.health_value = value;
        }
    };
}; 

r_.hud.smile = function(){
  
    r_.hud.smiling = true;
    r_.animateFace();
    
    window.setTimeout(function(){ 

        r_.hud.smiling = false;
        r_.animateFace();
        
    }, 2000);        
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
            'STFEVL0',
            'STFST00',
            'STFST01',
            'STFST02',

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