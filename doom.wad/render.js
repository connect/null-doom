/*
 * NULL Engine
 * 
 * @module DOOM/render
 * @author kod.connect
 */

r_.hud      = {};

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

    r_.mats.face = [ 
        new THREE.SpriteMaterial({map: r_.imgs.STFST00}), 
        new THREE.SpriteMaterial({map: r_.imgs.STFST01}),
        new THREE.SpriteMaterial({map: r_.imgs.STFST02})
    ];
    r_.hud.face = new THREE.Sprite(r_.mats.face[0]);
    r_.hud.face.scale.set( 24 * r_.scale, 29 * r_.scale, 1);
    r_.hud.face.position.set( 0, (r_.height/-2) + (29 * r_.scale / 2), 11);
    r_.hud.objects.push( r_.hud.face );
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
        text: '50', prefix: 'STT', 
        width: 14,  height: 16,     direction: 'rtl',
        x: '16%',   z: '9%'    
    });

    // HEALTH
    //
    r_.drawText({
        text: '100%', prefix: 'STT', 
        width: 14,  height: 16,     direction: 'rtl',
        x: '34.5%', z: '9%'
    });

    // ARMOR
    //
    r_.drawText({
        text: '0%', prefix: 'STT', 
        width: 14,  height: 16,     direction: 'rtl',
        x: '75.5%', z: '9%'  
    });

    // Arms numbers
    //
    r_.drawText({
        text: '2',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '34.8%', z: '10.5%'  
    });
    r_.drawText({
        text: '3',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '39%',   z: '10.5%'  
    });
    r_.drawText({
        text: '4',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '42.5%', z: '10.5%'  
    });
    r_.drawText({
        text: '5',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '34.8%', z: '6.5%'  
    });
    r_.drawText({
        text: '6',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '39%',   z: '6.5%'
    });
    r_.drawText({
        text: '7',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'ltr',
        x: '42.5%', z: '6.5%'
    });
    
    // Ammo Info
    r_.drawText({
        text: '50', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '10%'  
    });
    r_.drawText({
        text: '0',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '7.5%'  
    });
    r_.drawText({
        text: '0',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '5%'  
    });
    r_.drawText({
        text: '0',  prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '91%',   z: '2.5%'  
    });
    
    r_.drawText({
        text: '200', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '99%',   z: '10%'  
    });
    r_.drawText({
        text: '50', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '99%',   z: '7.5%'  
    });
    r_.drawText({
        text: '50', prefix: 'STYS',
        width: 4,   height: 6,      direction: 'rtl',
        x: '99%',   z: '5%'  
    });
    r_.drawText({
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

r_.hud.update = function(){
    
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
            'STFST00',
            'STFST01',
            'STFST02',

            // Big red font
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

// start render
r_.postInit();
r_.animate();

w_.loadNext();