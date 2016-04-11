/*
 * NULL Engine
 * 
 * @module DOOM
 * @author kod.connect
 * 
 */

r_.modInit = function(){
    console.log('r_.modInit()');
    
    var scrMode     = r_.mode.current.split('x');
    var scrWidth    = scrMode[0];
    var scrHeight   = scrMode[1]; 

    // initial screen
    
    var spriteMaterial = new THREE.SpriteMaterial({ map: r_.imgs.TITLEPIC });
    r_.back = new THREE.Sprite(spriteMaterial);
    r_.back.scale.set( scrWidth, scrHeight, 1);
    r_.hudScene.add(r_.back);
    
};

r_.wpn = new function() {
    
    var t = this;
    
    t.obj       = null;
    t.reading   = false;
}

// start render
r_.init();
r_.animate();