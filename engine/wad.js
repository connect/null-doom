/* 
 * NULL Engine
 *
 * @module core/wad
 * @author kod.connect
 */

var w_ = new function(){
    
    var t    = this;
    var tmod = 0; 
    var module = function(n){
        var c = 0;
        
        for (var i in t.modules) {
            if (c == n) return i;
            c++;
        }
        
        return -1;
    }; 
    
    t.lumps = {}; // container for all lumps
    
    t.buffer = {
        
        data : new ArrayBuffer(),
        readRaw : function(start, length){
            return this.data.slice(start,start + length)
        },
        readInt : function(start, length){
            
            return new Uint32Array(this.readRaw(start, length))[0];
        },
        readStr : function(start, length){
            
            var dec = new TextDecoder("utf-8");
            
            return dec.decode(new Uint8Array(this.readRaw(start, length))).replace(/\0/g, '');
        }
    };
    
    t.init = function(){
        console.log('....w_.init()');
        
        // open IWAD file
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'dev/doom.wad', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {

            t.readWAD(e.target.response);
        };

        xhr.send();
        
        t.loadNext();
    };
    
    t.loadNext = function(){
        
        var m = module(tmod);

        if (m != -1) {

            console.log('..loading '+ cfg.iwad +'/'+ t.modules[m] +'.js');
            core.include( cfg.iwad +'/'+ t.modules[m] +'.js');        

            tmod++;
        }
    };     
    
    t.modules = {
        c_ : 'commands',
        g_ : 'gameplay',
        i_ : 'input',
        s_ : 'sound',
        u_ : 'interface',
        o_ : 'objects',
        p_ : 'player',        
        r_ : 'render'        
    };
    
    t.readFlat = function(o){
        
        var flat = new Uint8Array( o.data ),
            pal  = new Uint8Array( t.lumps.PLAYPAL ),
            pxl  = [];

        for (var i = 0; i < 64; i++) {

            for (var j = 0; j < 64; j++) {

                var index = flat[i * 64 + j] ;
                var px = [ pal[index*3], pal[index*3+1], pal[index*3+2] ]

                pxl.push(px);
            }
        }
        
        r_.createPNG(pxl);
    };
    
    t.readLump = function(o){
        
        t.lumps[ o.name ] = o.data;
        
        // !!!
        // @FIXME Testing only
        // !!!
        if (o.name == 'FLOOR7_2') {
        
            t.readFlat(o);
        }
    };
    
    t.readWAD = function(data){
        
        t.buffer.data = data;
        
        var header = {
            
                sig         : t.buffer.readStr(0,4),
                numFiles    : t.buffer.readInt(4,4),
                offFat      : t.buffer.readInt(8,4)

            };    
    
        for ( var i = 0; i < header.numFiles; i++){

            var offset = 16 * i + header.offFat, 
                fileEntry = {

                    offData     : t.buffer.readInt(offset, 4),
                    lenData     : t.buffer.readInt(offset+4, 4),
                    name        : t.buffer.readStr(offset+8, 8)
                };
            
            t.readLump({
                entry       : fileEntry,
                id          : i,
                name        : fileEntry.name,
                data        : t.buffer.readRaw(fileEntry.offData, fileEntry.lenData)
            });
        }
    };
    
    t.init();
};


core.loadNext();
