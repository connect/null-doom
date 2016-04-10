o_.map = new function(){   
    
    var t = this;
    
    t.current   = -1; // none
    t.data      = [];
    t.list      = [];
    
    t.add = function(o){
        
        if (typeof o == 'object' && o.length != undefined) {
            // array 
            for (var i in o){
                t.list.push(o[i]);
            }
        } else {
            // single
            t.list.push(o);
        }
        
    };
    
    t.load = function(){

    };
    
    t.next = function(){        
        
        var i = ( t.current < t.list.length -1 ) ? t.current + 1 : 0;                
        
        // Ask the browser to lock the pointer
        /*
        var element = document.body;
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
        */
    };
};