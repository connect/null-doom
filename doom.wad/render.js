/*
 * NULL Engine
 * 
 * @module DOOM/render
 * @author kod.connect
 */
 

r_.modInit = function(){
    console.log('r_.modInit()');
    
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1]; 

    // load textures
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
    
    r_.back = new THREE.Sprite( r_.mats.title[0] );
    r_.back.scale.set( scrWidth, scrHeight, 1);
    r_.hudScene.add(r_.back);
    
};

r_.wpn = new function() {
    
    var t = this;   
            
    t.current   = 0;
    t.obj       = null;
    t.status    = 0;        
}

core.include( cfg.mod +'/weapons.js' );

// start render
r_.postInit();
r_.animate();

w_.loadNext();