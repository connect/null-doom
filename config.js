/*
 * NULL Engine
 * 
 * Configuration File
 * 
 * @module core/config
 * @author kod.connect
 */

var cfg = {
    mod                 : 'doom.wad',
    screenmode          : '800x600',
    fullscreen          : 0,
    playerHeight        : 45,
    musicvolume         : 0,
    
    bind: {
        38  : '+forward',   // uparrow
        87  : '+forward',   // w
        37  : '+left',      // leftarrow
        65  : '+left',      // a
        40  : '+back',      // downarrow
        83  : '+back',      // s
        39  : '+right',     // right
        68  : '+right',     // d
        
        
        187 : 'zoomin',     // desktop 
        189 : 'zoomout',
        
        61  : 'zoomin',     // laptop
        173 : 'zoomout',
        
        69  : '+use',        // e
        32  : '+use',        // space
        
        mouse1 : '+attack'
    }
};