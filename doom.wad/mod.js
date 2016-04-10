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
$('head').append('<link rel="icon" href="doom.wad/gra/favicon.png" />');

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
        ]
    }
});

// animate menu selector
u_.menu.timer = window.setInterval(function(){
    var i = $('#menu .selector').attr('anim');
    var img = u_.menu.selector.img;
    
    i = ( i < img.length-1 ) ? parseInt(i)+1 : 0;
    
    $('#menu .selector')
        .attr('src', cfg.mod +'/gra/'+ img[i] )
        .attr('anim', i);

},1000); 

////////////////////////////////////////////////////////////////////////////////
// sound
s_.load([
    'DSPSTOP.ogg',
    'DSPISTOL.ogg',
    'DSSWTCHN.ogg',
    'DSSWTCHX.ogg'
]);

s_.menuopen     = 'DSSWTCHN.ogg';
s_.menunext     = 'DSPSTOP.ogg';
s_.menuback     = 'DSSWTCHX.ogg';
s_.menuselect   = 'DSPISTOL.ogg';


////////////////////////////////////////////////////////////////////////////////
// bind keys
//
i_.bind( cfg.bind );

////////////////////////////////////////////////////////////////////////////////
// load textures
r_.img.load({
    type: 'png',
    files: [             
        'SHTGA0',
        'STBAR',
        'STFST00',
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
        'TITLEPIC',
        'W28_5',
        'W94_1',
        'WALL03_7',  
        'WALL05_2'
    ]
});  

// load maps
//o_.map.add({ });


// load mod scripts
core.include( 'doom.wad/render.js' );

