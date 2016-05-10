/* 
 * NULL Engine
 * 
 * @module DOOM/interface
 * @author kod.connect
 */

// set modname
$('title').html(g_.title);

// set favicon
$('head').append('<link rel="icon" href="doom.wad/gra/YSKUB0.png" />');

// load css
$('head').append('<link rel="stylesheet" type="text/css" href="doom.wad/doom.css" />');

// set background
//$('#back').append('<img class="background" src="doom.wad/gra/TITLEPIC.png" />');


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

console.log('....loading',cfg.mod +'/messages.js')
core.include( cfg.mod +'/messages.js' );

u_.postInit();
w_.loadNext();