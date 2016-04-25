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

            // Barrel
            'BAR1A0',

            // Health potion
            'BON1A0',

            //
            'COMP03_1',
            'COMP03_2',

            'CREDIT',

            'FLAT14',
            'FLOOR4_8',
            'FLOOR5_1',
            'FLOOR5_2',
            'FLOOR5_3',

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

            'W28_5',
            'W94_1',
            'WALL03_7',  
            'WALL05_2'
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
    
    t.data  = [
        // fist
        {
            weapon: [
                {
                    img     : 'PUNGA0',
                    swdh    : 113 * r_.scale,
                    shgh    : 42 * r_.scale
                },
                {
                    img     : 'PUNGB0',
                    swdh    : 80 * r_.scale,
                    shgh    : 41 * r_.scale
                },
                {
                    img     : 'PUNGC0',
                    swdh    : 107 * r_.scale,
                    shgh    : 52 * r_.scale
                },
                {
                    img     : 'PUNGD0',
                    swdh    : 147 * r_.scale,
                    shgh    : 76 * r_.scale
                }
            ],
            flash: []
        },
        // pistol
        {
            weapon: [
                {
                    img     : 'PISGA0',
                    swdh    : 57 * r_.scale, 
                    shgh    : 62 * r_.scale 
                },
                {
                    img     : 'PISGB0', 
                    swdh    : 79 * r_.scale,
                    shgh    : 82 * r_.scale
                },
                {
                    img     : 'PISGC0',
                    swdh    : 66 * r_.scale,
                    shgh    : 81 * r_.scale
                },
                {
                    img     : 'PISGD0',
                    swdh    : 61 * r_.scale,
                    shgh    : 81 * r_.scale
                },
                {
                    img     : 'PISGE0',
                    swdh    : 78 * r_.scale,
                    shgh    : 103 * r_.scale
                }
            ],             
            flash: [ 
                {
                    img     : 'PISFA0',
                    swdh    : 41 * r_.scale,
                    shgh    : 38 * r_.scalse
                }              
            ],
        },
        // shotgun
        {
            weapon: [
                {
                    img     : 'SHTGA0',
                    swdh    : 79 * r_.scale,
                    shgh    : 60 * r_.scale
                },
                {
                    img     : 'SHTGB0',
                    swdh    : 119 * r_.scale,
                    shgh    : 121 * r_.scale
                },
                {
                    img     : 'SHTGC0',
                    swdh    : 87 * r_.scale,
                    shgh    : 151 * r_.scale
                },
                {
                    img     : 'SHTGD0',
                    swdh    : 113 * r_.scale,
                    shgh    : 131 * r_.scale
                }
            ],
            flash: [
                {
                    img     : 'SHTFA0',
                    swdh    : 44 * r_.scale,
                    shdh    : 31 * r_.scale
                }
            ]
        }
        //r_.wpn.obj.position.set(0, (scrHeight/-2) + (62 * scale) * -1  , 5); // (scrHeight/-2) + (60 * scale)   
        
    ];
    t.current   = 0;
    t.obj       = null;
    t.status    = 0;
}

// start render
r_.postInit();
r_.animate();

w_.loadNext();