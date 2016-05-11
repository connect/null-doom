o_.things = {

    template1: {
        attack      : 'EF',
        death       : 'HIJKL',        
        gibs        : 'MNOPQRSTU',
        move        : 'ABCD',        
        pain        : 'G'
    }, 

    1: {
        radius      : 16,
        sprite      : 'PLAY',
        sequence    : '+',
        class       : '',
        label       : 'Player 1 start'
    },
    2: {
        radius      : 16,
        sprite      : 'PLAY',
        sequence    : '+',
        class       : '',
        label       : 'Player 2 start'
    },
    3: {
        radius      : 16,
        sprite      : 'PLAY',
        sequence    : '+',
        class       : '',
        label       : 'Player 3 start'
    },
    4: {
        radius      : 16,
        sprite      : 'PLAY',
        sequence    : '+',
        class       : '',
        label       : 'Player 4 start'
    },
    5: {
        radius      : 20,
        sprite      : 'BKEY',
        sequence    : 'AB',
        class       : 'P',
        label       : 'Blue keycard',
        powerup     : 'bluekeycard',
        light       : 0x0000ff
    },
    6: {
        radius      : 20,
        sprite      : 'YKEY',
        sequence    : 'AB',
        class       : 'P',
        label       : 'Yellow keycard',
        powerup     : 'yellowkeycard',
        light       : 0xffff00
    },
    7: {
        radius      : 128,
        sprite      : 'SPID',
        sequence    : '+',
        class       : 'MO',
        label       : 'Spider Mastermind'
    },
    8: {
        radius      : 20,
        sprite      : 'BPAK',
        sequence    : 'A',
        class       : 'P',
        label       : 'Backpack',
        powerup     : 'backpack'
    },
    9: {
        radius      : 20,
        sprite      : 'SPOS',
        sequence    : '+',
        class       : 'MO',
        label       : 'Former Human Sergeant',
        template    : 'template1',
        corpse      : 19,
        hp          : 30,
        speed       : 8,
        reaction    : 8,
        painchance  : 170,
        paintime    : 6,
        sfx_pain    : s_.popain,
        sfx_death   : [s_.podeath1, s_.podeath2, s_.podeath3 ]                
    },
    10: {
        radius      : 16,
        sprite      : 'PLAY',
        sequence    : 'W',
        class       : '',
        label       : 'Bloody mess'
    },
    11: {
        radius      : 20,
        sprite      : 'none',
        sequence    : '-',
        class       : '',
        label       : 'Deathmatch start'
    },
    12: {
        radius      : 16,
        sprite      : 'PLAY',
        sequence    : 'W',
        class       : '',
        label       : 'Bloody mess'
    },
    13: {
        radius      : 20,
        sprite      : 'RKEY',
        sequence    : 'AB',
        class       : 'P',
        label       : 'Red keycard',
        powerup     : 'redkeycard',
        light       : 0xff0000
    },
    14: {
        radius      : 20,
        sprite      : 'none',
        sequence    : '-',
        class       : '',
        label       : 'Teleport landing'
    },
    15: {
        radius      : 16,
        sprite      : 'PLAY',
        sequence    : 'N',
        class       : '',
        label       : 'Dead player'
    },
    16: {
        radius      : 40,
        sprite      : 'CYBR',
        sequence    : '+',
        class       : 'MO',
        label       : 'Cyberdemon',
        attack      : 'EF',
        death       : 'HIJKLMNOP',
        move        : 'ABCD',
        pain        : 'G'
    },
    17: {
        radius      : 20,
        sprite      : 'CELP',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Cell charge pack',
        powerup     : 'energypack'
    },
    18: {
        radius      : 20,
        sprite      : 'POSS',
        sequence    : 'L',
        class       : '',
        label       : 'Dead former human'
    },
    19: {
        radius      : 20,
        sprite      : 'SPOS',
        sequence    : 'L',
        class       : '',
        label       : 'Dead former sergeant'
    },
    20: {
        radius      : 20,
        sprite      : 'TROO',
        sequence    : 'M',
        class       : '',
        label       : 'Dead imp'
    },
    21: {
        radius      : 30,
        sprite      : 'SARG',
        sequence    : 'N',
        class       : '',
        label       : 'Dead demon'
    },
    22: {
        radius      : 31,
        sprite      : 'HEAD',
        sequence    : 'L',
        class       : '',
        label       : 'Dead cacodemon'
    },
    23: {
        radius      : 16,
        sprite      : 'SKUL',
        sequence    : 'K',
        class       : '',
        label       : 'Dead lost soul (invisible)'
    },
    24: {
        radius      : 16,
        sprite      : 'POL5',
        sequence    : 'A',
        class       : '',
        label       : 'Pool of blood and flesh'
    },
    25: {
        radius      : 16,
        sprite      : 'POL1',
        sequence    : 'A',
        class       : 'O',
        label       : 'Impaled human'
    },
    26: {
        radius: 16,
        sprite: 'POL6',
        sequence: 'AB',
        class: 'O',
        label: 'Twitching impaled human'
    },
    27: {
        radius: 16,
        sprite: 'POL4',
        sequence: 'A',
        class: 'O',
        label: 'Skull on a pole'
    },
    28: {
        radius: 16,
        sprite: 'POL2',
        sequence: 'A',
        class: 'O',
        label: 'Five skulls "shish kebab"'
    },
    29: {
        radius: 16,
        sprite: 'POL3',
        sequence: 'AB',
        class: 'O',
        label: 'Pile of skulls and candles'
    },
    30: {
        radius: 16,
        sprite: 'COL1',
        sequence: 'A',
        class: 'O',
        label: 'Tall green pillar'
    },
    31: {
        radius: 16,
        sprite: 'COL2',
        sequence: 'A',
        class: 'O',
        label: 'Short green pillar'
    },
    32: {
        radius: 16,
        sprite: 'COL3',
        sequence: 'A',
        class: 'O',
        label: 'Tall red pillar'
    },
    33: {
        radius: 16,
        sprite: 'COL4',
        sequence: 'A',
        class: 'O',
        label: 'Short red pillar'
    },
    34: {
        radius      : 16,
        sprite      : 'CAND',
        sequence    : 'A',
        class       : '',
        label       : 'Candle',
        light       : 0xffff00
    },
    35: {
        radius      : 16,
        sprite      : 'CBRA',
        sequence    : 'A',
        class       : 'O',
        label       : 'Candelabra',
        light       : 0xffff00
    },
    36: {
        radius      : 16,
        sprite      : 'COL5',
        sequence    : 'AB',
        class       : 'O',
        label       : 'Short green pillar with beating heart'
    },
    37: {
        radius      : 16,
        sprite      : 'COL6',
        sequence    : 'A',
        class       : 'O',
        label       : 'Short red pillar with skull'
    },
    38: {
        radius      : 20,
        sprite      : 'RSKU',
        sequence    : 'AB',
        class       : 'P',
        label       : 'Red skull key',
        powerup     : 'redskullkey',
        light       : 0xff0000
    },
    39: {
        radius      : 20,
        sprite      : 'YSKU',
        sequence    : 'AB',
        class       : 'P',
        label       : 'Yellow skull key',
        powerup     : 'yellowskullkey',
        light       : 0xffff00
    },
    40: {
        radius      : 20,
        sprite      : 'BSKU',
        sequence    : 'AB',
        class       : 'P',
        label       : 'Blue skull key',
        powerup     : 'blueskullkey',
        light       : 0x0000ff
    },
    41: {
        radius      : 16,
        sprite      : 'CEYE',
        sequence    : 'ABCB',
        class       : 'O',
        label       : 'Evil eye'
    },
    42: {
        radius      : 16,
        sprite      : 'FSKU',
        sequence    : 'ABC',
        class       : 'O',
        label       : 'Floating skull'
    },
    43: {
        radius      : 16,
        sprite      : 'TRE1',
        sequence    : 'A',
        class       : 'O',
        label       : 'Burnt tree'
    },
    44: {
        radius      : 16,
        sprite      : 'TBLU',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Tall blue firestick',
        light       : 0x0000ff
    },
    45: {
        radius      : 16,
        sprite      : 'TGRN',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Tall green firestick',
        light       : 0x00ff00
    },
    46: {
        radius      : 16,
        sprite      : 'TRED',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Tall red firestick',
        light       : 0xff0000
    },
    47: {
        radius: 16,
        sprite: 'SMIT',
        sequence: 'A',
        class: 'O',
        label: 'Stalagmite'
    },
    48: {
        radius: 16,
        sprite: 'ELEC',
        sequence: 'A',
        class: 'O',
        label: 'Tall techno pillar'
    },
    49: {
        radius: 16,
        sprite: 'GOR1',
        sequence: 'ABCB',
        class: 'O^',
        label: 'Hanging victim, twitching'
    },
    50: {
        radius: 16,
        sprite: 'GOR2',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging victim, arms out'
    },
    51: {
        radius: 16,
        sprite: 'GOR3',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging victim, one - legged'
    },
    52: {
        radius: 16,
        sprite: 'GOR4',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging pair of legs'
    },
    53: {
        radius: 16,
        sprite: 'GOR5',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging leg'
    },
    54: {
        radius      : 32,
        sprite      : 'TRE2',
        sequence    : 'A',
        class       : 'O',
        label       : 'Large brown tree'
    },
    55: {
        radius      : 16,
        sprite      : 'SMBT',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Short blue firestick',
        light       : 0x0000ff
    },
    56: {
        radius      : 16,
        sprite      : 'SMGT',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Short green firestick',
        light       : 0x00ff00
    },
    57: {
        radius      : 16,
        sprite      : 'SMRT',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Short red firestick',
        light       : 0xff0000
    },
    58: {
        radius      : 30,
        sprite      : 'SARG',
        sequence    : '+',
        class       : 'MO',
        label       : 'Spectre',
        attack      : 'EFG',
        death       : 'IJKLMN',
        move        : 'ABCD',
        pain        : 'H',
        corpse      : 21,
        hp          : 150,
        speed       : 10,
        reaction    : 8,
        painchance  : 180,
        paintime    : 4,
        camo        : true,
        sfx_pain    : s_.dmpain,
        sfx_death   : s_.dmdeath
    },
    59: {
        radius: 16,
        sprite: 'GOR2',
        sequence: 'A',
        class: '^',
        label: 'Hanging victim, arms out'
    },
    60: {
        radius: 16,
        sprite: 'GOR4',
        sequence: 'A',
        class: '^',
        label: 'Hanging pair of legs'
    },
    61: {
        radius: 16,
        sprite: 'GOR3',
        sequence: 'A',
        class: '^',
        label: 'Hanging victim, one - legged'
    },
    62: {
        radius: 16,
        sprite: 'GOR5',
        sequence: 'A',
        class: '^',
        label: 'Hanging leg'
    },
    63: {
        radius: 16,
        sprite: 'GOR1',
        sequence: 'ABCB',
        class: '^',
        label: 'Hanging victim, twitching'
    },
    64: {
        radius      : 20,
        sprite      : 'VILE',
        sequence    : '+',
        class       : 'MO',
        label       : 'Arch-Vile'
    },
    65: {
        radius: 20,
        sprite: 'CPOS',
        sequence: '+',
        class: 'MO',
        label: 'Chaingunner'
    },
    66: {
        radius: 20,
        sprite: 'SKEL',
        sequence: '+',
        class: 'MO',
        label: 'Revenant'
    },
    67: {
        radius: 48,
        sprite: 'FATT',
        sequence: '+',
        class: 'MO',
        label: 'Mancubus'
    },
    68: {
        radius: 64,
        sprite: 'BSPI',
        sequence: '+',
        class: 'MO',
        label: 'Arachnotron'
    },
    69: {
        radius: 24,
        sprite: 'BOS2',
        sequence: '+',
        class: 'MO',
        label: 'Hell Knight'
    },
    70: {
        radius      : 10,
        sprite      : 'FCAN',
        sequence    : 'ABC',
        class       : 'O',
        label       : 'Burning barrel',
        light       : 0xffff00
    },
    71: {
        radius: 31,
        sprite: 'PAIN',
        sequence: '+',
        class: 'MO^',
        label: 'Pain Elemental'
    },
    72: {
        radius: 16,
        sprite: 'KEEN',
        sequence: 'A+',
        class: 'MO^',
        label: 'Commander Keen'
    },
    73: {
        radius: 16,
        sprite: 'HDB1',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging victim, guts removed'
    },
    74: {
        radius: 16,
        sprite: 'HDB2',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging victim, guts and brain removed'
    },
    75: {
        radius: 16,
        sprite: 'HDB3',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging torso, looking down'
    },
    76: {
        radius: 16,
        sprite: 'HDB4',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging torso, open skull'
    },
    77: {
        radius: 16,
        sprite: 'HDB5',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging torso, looking up'
    },
    78: {
        radius: 16,
        sprite: 'HDB6',
        sequence: 'A',
        class: 'O^',
        label: 'Hanging torso, brain removed'
    },
    79: {
        radius: 16,
        sprite: 'POB1',
        sequence: 'A',
        class: '',
        label: 'Pool of blood'
    },
    80: {
        radius: 16,
        sprite: 'POB2',
        sequence: 'A',
        class: '',
        label: 'Pool of blood'
    },
    81: {
        radius: 16,
        sprite: 'BRS1',
        sequence: 'A',
        class: '',
        label: 'Pool of brains'
    },
    82: {
        radius: 20,
        sprite: 'SGN2',
        sequence: 'A',
        class: 'WP3',
        label: 'Super shotgun'
    },
    83: {
        radius      : 20,
        sprite      : 'MEGA',
        sequence    : 'ABCD',
        class       : 'AP',
        label       : 'Megasphere',
        powerup     : 'megasphere'
    },
    84: {
        radius      : 20,
        sprite      : 'SSWV',
        sequence    : '+',
        class       : 'MO',
        label       : 'Wolfenstein SS'
    },
    85: {
        radius      : 16,
        sprite      : 'TLMP',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Tall techno floor lamp',
        light       : 0xffffff 
    },
    86: {
        radius      : 16,
        sprite      : 'TLP2',
        sequence    : 'ABCD',
        class       : 'O',
        label       : 'Short techno floor lamp',
        light       : 0xffffff
    },
    87: {
        radius      : 0,
        sprite      : 'none',
        sequence    : '-',
        class       : '',
        label       : 'Spawn spot'
    },
    88: {
        radius      : 16,
        sprite      : 'BBRN',
        sequence    : '+',
        class       : 'O5',
        label       : 'Boss Brain'
    },
    89: {
        radius      : 20,
        sprite      : 'none',
        sequence    : '-',
        class       : '',
        label       : 'Spawn shooter'
    },
    
    1001: {
        radius      : 0,
        sprite      : 'PUFF',
        sequence    : 'ABCD',
        class       : '^',
        label       : 'Sparkle'
    },
    1002: {
        radius      : 0,
        sprite      : 'BLUD',
        sequence    : 'A',
        class       : '^',
        label       : 'Bleed'
    },
    1003: {
        radius      : 0,
        sprite      : 'BLUD',
        sequence    : 'B',
        class       : '^',
        label       : 'Bleed'
    },
    1004: {
        radius      : 0,
        sprite      : 'BLUD',
        sequence    : 'C',
        class       : '^',
        label       : 'Bleed'
    },
    1005: {
        radius      : 0,
        sprite      : 'BLUD',
        sequence    : 'ABC',
        class       : '^',
        label       : 'Bleed'
    },
    
    2001: {
        radius      : 20,
        sprite      : 'SHOT',
        sequence    : 'A',
        class       : 'WP3',
        label       : 'Shotgun',
        weapon      : 'shotgun'
    },
    2002: {
        radius      : 20,
        sprite      : 'MGUN',
        sequence    : 'A',
        class       : 'WP3',
        label       : 'Chaingun',
        weapon      : 'chaingun'
    },
    2003: {
        radius      : 20,
        sprite      : 'LAUN',
        sequence    : 'A',
        class       : 'WP3',
        label       : 'Rocket launcher',
        weapon      : 'rocketlauncher'
    },
    2004: {
        radius      : 20,
        sprite      : 'PLAS',
        sequence    : 'A',
        class       : 'WP3',
        label       : 'Plasma rifle',
        weapon      : 'plasmagun'
    },
    2005: {
        radius      : 20,
        sprite      : 'CSAW',
        sequence    : 'A',
        class       : 'WP7',
        label       : 'Chainsaw',
        weapon      : 'chainsaw'
    },
    2006: {
        radius      : 20,
        sprite      : 'BFUG',
        sequence    : 'A',
        class       : 'WP3',
        label       : 'BFG 9000',
        weapon      : 'bfg'
    },
    2007: {
        radius      : 20,
        sprite      : 'CLIP',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Ammo clip',
        ammo        : 'clip'
    },
    2008: {
        radius      : 20,
        sprite      : 'SHEL',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Shotgun shells',
        ammo        : 'shotgunshells'
    },
    2010: {
        radius      : 20,
        sprite      : 'ROCK',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Rocket',
        ammo        : 'rocket'
    },
    2011: {
        radius      : 20,
        sprite      : 'STIM',
        sequence    : 'A',
        class       : 'P8',
        label       : 'Stimpack',
        powerup     : 'stimpack',
        light       : 0xff0000
    },
    2012: {
        radius      : 20,
        sprite      : 'MEDI',
        sequence    : 'A',
        class       : 'P8',
        label       : 'Medikit',
        powerup     : 'medkit',
        light       : 0xff0000
    },
    2013: {
        radius      : 20,
        sprite      : 'SOUL',
        sequence    : 'ABCDCB',
        class       : 'AP',
        label       : 'Soul sphere',
        powerup     : 'soulsphere',
        light       : 0x0000ff
    },
    2014: {
        radius      : 20,
        sprite      : 'BON1',
        sequence    : 'ABCDCB',
        class       : 'AP',
        label       : 'Health potion',
        powerup     : 'healthpotion',
        light       : 0x000011
    },
    2015: {
        radius      : 20,
        sprite      : 'BON2',
        sequence    : 'ABCDCB',
        class       : 'AP',
        label       : 'Spiritual armor',
        powerup     : 'spiritualarmor',
        light       : 0x001100
    },
    2018: {
        radius      : 20,
        sprite      : 'ARM1',
        sequence    : 'AB',
        class       : 'P9',
        label       : 'Green armor',
        powerup     : 'greenarmor',
        light       : 0x00ff00
    },
    2019: {
        radius      : 20,
        sprite      : 'ARM2',
        sequence    : 'AB',
        class       : 'P10',
        label       : 'Blue armor',
        powerup     : 'bluearmor',
        light       : 0x0000ff
    },
    2022: {
        radius      : 20,
        sprite      : 'PINV',
        sequence    : 'ABCD',
        class       : 'AP',
        label       : 'Invulnerability',
        powerup     : 'invulnerability'
    },
    2023: {
        radius      : 20,
        sprite      : 'PSTR',
        sequence    : 'A',
        class       : 'AP',
        label       : 'Berserk',
        powerup     : 'berserk'
    },
    2024: {
        radius      : 20,
        sprite      : 'PINS',
        sequence    : 'ABCD',
        class       : 'AP',
        label       : 'Invisibility',
        powerup     : 'invisibility'
    },
    2025: {
        radius      : 20,
        sprite      : 'SUIT',
        sequence    : 'A',
        class       : 'P',
        label       : 'Radiation suit',
        powerup     : 'radiationsuit'
    },
    2026: {
        radius      : 20,
        sprite      : 'PMAP',
        sequence    : 'ABCDCB',
        class       : 'AP11',
        label       : 'Computer map',
        powerup     : 'computermap'
    },
    2028: {
        radius      : 16,
        sprite      : 'COLU',
        sequence    : 'A',
        class       : 'O',
        label       : 'Floor lamp',
        light       : 0x111100
    },
    2035: {
        radius      : 10,
        sprite      : 'BAR1',
        sequence    : 'AB+',
        class       : 'O',
        label       : 'Barrel',
        light       : 0x001100,
        //explode     : BEXP(A-E)0
    },
    2045: {
        radius      : 20,
        sprite      : 'PVIS',
        sequence    : 'AB',
        class       : 'AP',
        label       : 'Light amplification visor',
        powerup     : 'lightamplificationvisor'
    },
    2046: {
        radius      : 20,
        sprite      : 'BROK',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Box of rockets',
        ammo        : 'boxofrockets'
    },
    2047: {
        radius      : 20,
        sprite      : 'CELL',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Cell charge',
        ammo        : 'energycell'
    },
    2048: {
        radius      : 20,
        sprite      : 'AMMO',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Box of ammo',
        ammo        : 'boxofammo'
    },
    2049: {
        radius      : 20,
        sprite      : 'SBOX',
        sequence    : 'A',
        class       : 'P2',
        label       : 'Box of shells',
        powerup     : 'boxofshells'
    },
    3001: {
        radius      : 20,
        sprite      : 'TROO',
        sequence    : '+',
        class       : 'MO',
        label       : 'Imp',
        attack      : 'EF',
        death       : 'IJKL',        
        gibs        : 'MNOPQRSTU',
        move        : 'ABCD',        
        pain        : 'GH',
        corpse      : 20,
        hp          : 60,
        speed       : 8,
        reaction    : 8,
        painchance  : 200,
        paintime    : 4,   
        sfx_pain    : s_.popain,
        sfx_death   : [ s_.bgdeath1, s_.bgdeath2 ]
    },
    3002: {
        radius      : 30,
        sprite      : 'SARG',
        sequence    : '+',
        class       : 'MO',
        label       : 'Demon',
        attack      : 'EFG',
        death       : 'IJKLMN',
        move        : 'ABCD',
        pain        : 'H',
        corpse      : 21,
        hp          : 150,
        speed       : 10,
        reaction    : 8,
        painchance  : 180,
        paintime    : 4,
        sfx_pain    : s_.dmpain,
        sfx_death   : s_.dmdeath
    },
    3003: {
        radius      : 24,
        sprite      : 'BOSS',
        sequence    : '+',
        class       : 'MO',
        label       : 'Baron of Hell',
        attack      : 'EFG',
        death       : 'IJKLMNO',
        move        : 'ABCD',      
        pain        : 'H'
    },
    3004: {
        radius      : 20,
        sprite      : 'POSS',
        sequence    : '+',
        class       : 'MO',
        label       : 'Former Human Trooper',
        template    : 'template1',
        corpse      : 18,
        hp          : 20,
        speed       : 8,
        painchance  : 200,
        paintime    : 6,
        sfx_pain    : s_.popain,
        sfx_death   : [s_.podeath1, s_.podeath2, s_.podeath3 ],
        drop        : 2007 // clip
    },
    3005: {
        radius      : 31,
        sprite      : 'HEAD',
        sequence    : '+',
        class       : 'MO^',
        label       : 'Cacodemon',
        attack      : 'BCD',
        death       : 'GHJKL',
        move        : 'A',
        pain        : 'EF',
        corpse      : 22
    },
    3006: {
        radius      : 16,
        sprite      : 'SKUL',
        sequence    : '+',
        class       : 'MO^',
        label       : 'Lost Soul',
        attack      : 'CD',
        death       : 'FGHJK',
        move        : 'AB',
        pain        : 'E'
    }
};