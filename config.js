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
    screenmode          : '1024x768',
    fullscreen          : 0,
    playerHeight        : 45,
    musicvolume         : 0.5,
    noclip              : 1,
    gl_light            : 0,
    
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
        
        69  : '+use',       // e
        32  : '+use',       // space
        
        67  : 'noclip',     // c
        
        49  : 'slot1',      // 1
        50  : 'slot2',      // 2
        51  : 'slot3',      // 3
        52  : 'slot4',      // 4
        53  : 'slot5',      // 5
        54  : 'slot6',      // 6
        55  : 'slot7',      // 7
        56  : 'slot8',      // 8
        57  : 'slot9',      // 9
        58  : 'slot0',      // 0
        
        mouse1 : '+attack'
    }
};