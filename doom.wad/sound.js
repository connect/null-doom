/* 
 * NULL Engine
 * 
 * @module DOOM/sound
 * @author kod.connect
 */

s_.load([
    
    // effects
    'DSPSTOP.ogg',
    'DSPISTOL.ogg',
    'DSSWTCHN.ogg',
    'DSSWTCHX.ogg',
    
    // music
    'D_INTRO.mp3',
    'D_E1M8.mp3'
]);

s_.menuopen     = 'DSSWTCHN.ogg';
s_.menunext     = 'DSPSTOP.ogg';
s_.menuback     = 'DSSWTCHX.ogg';
s_.menuselect   = 'DSPISTOL.ogg';


s_.play('D_INTRO.mp3');
s_.positInit();
w_.loadNext();