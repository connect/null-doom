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
$('head').append('<link rel="icon" href="doom.wad/gra/favicon.gif" />');

// load css
$('head').append('<link rel="stylesheet" type="text/css" href="doom.wad/mod.css" />');

// set background
$('#back').append('<img class="background" src="doom.wad/gra/TITLEPIC.png" />');

////////////////////////////////////////////////////////////////////////////////
// setup menu  

u_.mnu.init({
    //background: 'TITLEPIC.png',
    heading: 'M_DOOM.png',
    selector: {
        img  : [ 'M_SKULL1.png', 'M_SKULL2.png' ]
    },
    items: {
        new : {
            img: 'M_NEWG.png',
            action: c_.nextmap
        }
    }
});

u_.mnu.timer = window.setInterval(function(){
    var i = $('#menu .selector').attr('ind');
    var img = u_.mnu.selector.img;
    
    i = ( i < img.length-1 ) ? parseInt(i)+1 : 0;
    
    $('#menu .selector')
        .attr('src', cfg.mod +'/gra/'+ img[i] )
        .attr('ind', i);

},1000); 


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
        'W28_5',
        'W94_1',
        'WALL03_7',  
        'WALL05_2'
    ]
});  

// load maps
//o_.map.add({ });


// load mod scripts

// start render
r_.init();
r_.animate();