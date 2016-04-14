/*
 * NULL Engine
 * 
 * @module  DOOM
 * @author  kod.connect
 * 
 */ 

g_.title = 'NULL DOOM';

// set modname
$('title').html(g_.title);

// set favicon
$('head').append('<link rel="icon" href="doom.wad/gra/YSKUB0.png" />');

// load css
$('head').append('<link rel="stylesheet" type="text/css" href="doom.wad/mod.css" />');

// set background
//$('#back').append('<img class="background" src="doom.wad/gra/TITLEPIC.png" />');

////////////////////////////////////////////////////////////////////////////////
// setup menu  

u_.menu.init({
    
    root: {
        heading: 'M_DOOM.png',
        selector: {
            img  : [ 'M_SKULL1.png', 'M_SKULL2.png' ]
        },
        items: [
            {
                img: 'M_NEWG.png',
                action: c_.nextmap
            },
            {
                img: 'M_OPTION.png',
                action: c_.menu_options
            },
            {
                img: 'M_LGTTL.png',
                action: c_.menu_load
            },
            {
                img: 'M_RDTHIS.png',
                action: c_.menu_readme
            },            
            {
                img: 'M_QUITG.png',
                action: c_.exit
            }
        ],
        animate: function(){
            var i = $('#menu .selector').attr('anim');
            var img = u_.menu.selector.img;

            i = ( i < img.length-1 ) ? parseInt(i)+1 : 0;

            $('#menu .selector')
                .attr('src', cfg.mod +'/gra/'+ img[i] )
                .attr('anim', i);
        } 
    }
});

////////////////////////////////////////////////////////////////////////////////
// sound
s_.load([
    
    // effects
    'DSPSTOP.ogg',
    'DSPISTOL.ogg',
    'DSSWTCHN.ogg',
    'DSSWTCHX.ogg',
    
    // music
    'D_INTRO.mp3',
    'D_E1M8.mp3'
]);

s_.menuopen     = 'DSSWTCHN.ogg';
s_.menunext     = 'DSPSTOP.ogg';
s_.menuback     = 'DSSWTCHX.ogg';
s_.menuselect   = 'DSPISTOL.ogg';


s_.play('D_INTRO.mp3');

////////////////////////////////////////////////////////////////////////////////
// bind keys
//
i_.bind( cfg.bind );

////////////////////////////////////////////////////////////////////////////////
// load textures
r_.img.load({
    type: 'png',
    files: [           
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
        'CREDIT',
        
        'W28_5',
        'W94_1',
        'WALL03_7',  
        'WALL05_2'
    ]
});  

// load maps
o_.map.add('e0m0');

// load mod scripts
core.include( 'doom.wad/render.js' );



