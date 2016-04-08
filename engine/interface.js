u_.gui = {
        
};


u_.mnu = new function(){
    var t = this;
    
    t.screens = {};
    t.current = null;
    
    t.init = function( o ){        
        t.screens = o;        
        u_.openmenu('root');
    };
    
    t.down = function(){
        var i = $('#selector').attr('ind');
        var items = t.screens[ t.current ].items;
        
        i = (i < items.length-1) ? parseInt(i)+1 : 0;
        
        var pos = $('#menu img#menu'+i).position();
        
        $('#selector')
            .attr('ind', i )
            .css({
                top     : pos.top,
                left    : pos.left
            });    
    };
    
    t.up = function(){
        
    };
};

u_.openmenu = function( menuID ){
    console.log('u_.openmenu(',menuID,')');
    
    var o = u_.mnu.screens[ menuID ];
    u_.current = menuID;
    
    // clear 
    $('#menu').html('');

    // set background
    if (o.background)
    $('#blocker').prepend('<img class="background" src="'+ cfg.mod +'/gra/'+ o.background +'">');

    // set menu heading
    if (o.heading)
    $('#menu').prepend('<img class="heading" src="'+ cfg.mod +'/gra/'+ o.heading +'"><br/>');

    // draw items
    for (var i in o.items) {
        $('#menu').append('<img id="menu'+ i +'" src="'+ cfg.mod +'/gra/'+ o.items[i].img +'" /><br/>');
    }

    // add selector
    $('#menu').append('<img class="selector" ind="0" src="'+ cfg.mod +'/gra/'+ o.selector.img[0] +'">');
    u_.mnu.selector = o.selector;
    
    var pos = $('#menu img#menu0').position();
    $('#menu .selector')
        .css({ 
            left: pos.left, 
            top: pos.top 
        });
};

u_.inmenu = function(){
    
    return $('#blocker').is(':visible');
};

$('#blocker').bind( 'click', function ( e ) {

    $('#blocker').hide();
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