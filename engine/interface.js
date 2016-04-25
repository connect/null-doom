u_.gui = {
        
};

u_.menu = new function(){
    var t = this;
    
    t.screens = {};
    t.current = null;
    
    t.init = function( o ){        
        console.log('u_.menu.init()')
        t.screens = o;        
        //u_.openmenu('root');                                               
    };
    
    t.back = function(){
        console.log('u_.menu.back()')        
        
        var o = t.screens[ t.current ];
        
        if ( typeof o.animate == 'function') {
            // stop animation
            window.clearInterval( t.timer );
        }
        
        $('#blocker').hide();
       
        // sound
        s_.play( s_.menuback );
    };
    
    t.select = function(){
        var i  = $('#menu .selector').attr('ind');
        var fn = t.screens[ t.current ].items[i].action;  
        var o  = t.screens[ t.current ];
        
        if ( typeof o.animate == 'function') {
            // stop animation
            window.clearInterval( t.timer );
        }
        
        if (typeof fn == 'function') {
            fn();
        } else {
            console.log('no function assigned');
        }
        
        // sound
        s_.play( s_.menuselect );
    };
    
    t.down = function(){
        var i = $('#menu .selector').attr('ind');
        var items = t.screens[ t.current ].items;
                
        i = (i < items.length-1) ? parseInt(i)+1 : 0;                        
                
        var pos = $('#menu img#menu'+i).position();
        
        $('#menu .selector')
            .attr('ind', i )
            .css({
                top     : pos.top / 2, // x2 scale
                left    : pos.left / 2
            });  
        
        // sound
        s_.play( s_.menunext );
    };
    
    t.up = function(){
        var i = $('#menu .selector').attr('ind');
        var items = t.screens[ t.current ].items;
                
        i = (i > 0 ) ? parseInt(i)-1 : items.length-1;                        
                
        var pos = $('#menu img#menu'+i).position();
        
        $('#menu .selector')
            .attr('ind', i )
            .css({
                top     : pos.top / 2, // x2 scale
                left    : pos.left / 2
            });
            
        // sound
        s_.play( s_.menunext );        
    };
};

u_.openmenu = function( menuID ){
    console.log('u_.openmenu(',menuID,')');
    
    $('#blocker').show();
    
    var o = u_.menu.screens[ menuID ];
    u_.menu.current = menuID;
    
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
        
        if (i == o.items.length-1) {
            window.setTimeout(function(){
                // add selector
                $('#menu').append('<img class="selector" ind="0" anim="0" src="'+ cfg.mod +'/gra/'+ o.selector.img[0] +'">');
                u_.menu.selector = o.selector;

                var pos = $('#menu img#menu0').position();

                $('#menu .selector')
                    .css({ 
                        left: pos.left /2, 
                        top: pos.top /2
                    });
                
                // sound
                s_.play( s_.menuopen );
                
                if (typeof o.animate == 'function') {
                    u_.menu.timer = window.setInterval(o.animate,500);
                }                                    
            },200);
        }
    }

    
};

u_.inmenu = function(){
    
    return $('#blocker').is(':visible');
};

//$('#blocker').trigger( 'click')

u_.postInit = function(o){
    
};

core.loadNext();