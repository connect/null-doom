u_.gui = {
        
};

u_.mnu = new function(){
    var t = this;
    
    t.items = {};
    
    t.init = function( o ){
        var item;
        
        // set background
        if (o.background)
        $('#blocker').prepend('<img class="background" src="'+ cfg.mod +'/gra/'+ o.background +'">');
        
        // set menu heading
        if (o.heading)
        $('#menu').prepend('<img class="heading" src="'+ cfg.mod +'/gra/'+ o.heading +'"><br/>');
        
        // add selector
        $('#menu').append('<img class="selector" ind="0" src="'+ cfg.mod +'/gra/'+ o.selector.img[0] +'">');
        t.selector = o.selector;
        
        // add items
        for (var i in o.items) {
            
            item = o.items[i];
            
            //t.items[i] = o.items[i]
            $('#menu').append('<img id="" src="'+ cfg.mod +'/gra/'+ item.img +'" /><br/>');
        }
        
        
    };
};

$('#blocker').bind( 'click', function ( event ) {

    $('#blocker').hide();
    var element = document.body;

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {

        if (cfg.fullscreen) {

            var fullscreenchange = function ( event ) {

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

} );