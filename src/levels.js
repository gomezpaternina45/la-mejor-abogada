/* Datos de niveles. Coordenadas en píxeles del mundo.
 *
 * REGLAS DE COLOCACIÓN (verificadas con tools/check_levels.js):
 *  - Suelo principal: y=492 (jugador grande parado: cabeza en y=420)
 *  - Bloques en suelo (bonk salto simple): y=290 (bottom=306) → cabeza grande 316: ✓
 *  - Si una plataforma está a y=380 (top=372), un bloque encima debe tener
 *    block.bottom <= 372-80 = 292, es decir block.y <= 276.
 *  - Plataformas pisables NUNCA tienen bloques justo encima a la misma X
 *    si la separación es < 80 px.
 *
 * BONUS (suelo a y=1000 mundo, coords relativas hacia ARRIBA):
 *  - Bloques alcanzables desde suelo bonus: bonus_y entre 100 y 200
 *  - Plataformas bonus en y=80: top mundo = 1000-80-8 = 912
 *      → un bloque encima debe estar a bonus_y >= 80 + 80 = 160
 */
const LEVELS = [
    // ───────────────── WORLD 1-1 ─────────────────
    {
        name: '1-1',
        width: 5400,
        bgColor: '#5dadec',
        gaps: [[1500, 1620], [2700, 2820], [3900, 4020]],
        platforms: [
            { x: 880,  y: 380, w: 96 },
            { x: 1080, y: 320, w: 96 },
            { x: 2200, y: 380, w: 128 },
            { x: 3400, y: 380, w: 128 },
            { x: 4500, y: 380, w: 96 },
        ],
        // Bloques sólidos en zonas SIN plataforma encima
        solids: [
            { x: 600, y: 290 },
            { x: 632, y: 290 },
            { x: 1700, y: 290 },
            { x: 3300, y: 290 },
        ],
        // Bricks rompibles, en zonas libres del suelo
        bricks: [
            { x: 1900, y: 290 }, { x: 1932, y: 290 },
            { x: 3100, y: 290 }, { x: 3132, y: 290 }, { x: 3164, y: 290 },
            { x: 4250, y: 290 }, { x: 4282, y: 290 },
        ],
        // ? blocks en posiciones libres del suelo (no encima de plataformas)
        questionBlocks: [
            { x: 350,  y: 290 },
            { x: 700,  y: 290 },
            { x: 1280, y: 290 },
            { x: 2400, y: 290 },
            { x: 3500, y: 290 },
            { x: 4400, y: 290 },
        ],
        pipes: [
            { x: 1800, h: 64 },
            { x: 2900, h: 64, piranha: true },
            { x: 3700, h: 64 },
        ],
        warpPipe: 1800,
        bonus: {
            title: 'BONUS 1-1: GRUTA DE ORO',
            bgColor: '#1a0a00',          // marrón oscuro como cueva
            width: 900,
            // Sin plataformas en bonus 1-1, todo en el suelo
            qblocks: [
                { x: 200, y: 130 },
                { x: 350, y: 130 },
                { x: 500, y: 130 },
                { x: 700, y: 130 },
            ],
            bricks: [
                { x: 250, y: 130 }, { x: 282, y: 130 },
                { x: 450, y: 130 },
                { x: 600, y: 130 }, { x: 632, y: 130 },
            ],
            coins: [
                [100, 30], [150, 30], [200, 30], [250, 30], [300, 30],
                [350, 30], [400, 30], [450, 30], [500, 30], [550, 30],
                [600, 30], [650, 30], [700, 30], [750, 30], [800, 30],
                [200, 80], [350, 80], [500, 80], [700, 80],
                [50, 60], [50, 100],
                [820, 60], [820, 100],
            ],
            exitX: 850,
        },
        coins: [
            [350, 240], [700, 240], [1280, 240],
            [2400, 240], [3500, 240], [4400, 240],
            [880, 340], [1080, 280], [2200, 340], [3400, 340], [4500, 340],
            [200, -1], [1300, -1], [2300, -1], [4000, -1],
        ],
        enemies: [
            { type: 'goomba', x: 600,  minX: 480,  maxX: 780 },
            { type: 'koopa',  x: 1400, minX: 1280, maxX: 1480 },
            { type: 'goomba', x: 2300, minX: 2150, maxX: 2480 },
            { type: 'goomba', x: 3300, minX: 3180, maxX: 3480 },
            { type: 'koopa',  x: 4400, minX: 4280, maxX: 4580 },
        ],
        stairs:   { x: 4750, steps: 6 },
        flagpole: { x: 5160 },
        goalX: 5380,
    },

    // ───────────────── WORLD 1-2 ─────────────────
    {
        name: '1-2',
        width: 5800,
        bgColor: '#1a3a6e',
        gaps: [[700, 820], [1500, 1620], [2400, 2520], [3300, 3420], [4200, 4320]],
        platforms: [
            { x: 400,  y: 380, w: 96 },
            { x: 1000, y: 380, w: 128 },
            { x: 1800, y: 380, w: 128 },
            { x: 2700, y: 380, w: 128 },
            { x: 3600, y: 380, w: 128 },
            { x: 4500, y: 380, w: 128 },
        ],
        // Solids en zonas libres (no encima de plataformas)
        solids: [
            { x: 200, y: 290 },
            { x: 1300, y: 290 }, { x: 1332, y: 290 },
            { x: 2200, y: 290 },
            { x: 3100, y: 290 },
            { x: 4000, y: 290 }, { x: 4032, y: 290 },
        ],
        // Bricks lejos de plataformas
        bricks: [
            { x: 1400, y: 290 }, { x: 1432, y: 290 },
            { x: 2300, y: 290 }, { x: 2332, y: 290 },
            { x: 3200, y: 290 }, { x: 3232, y: 290 },
            { x: 4100, y: 290 }, { x: 4132, y: 290 },
        ],
        questionBlocks: [
            { x: 250,  y: 290 },
            { x: 1200, y: 290 },
            { x: 2150, y: 290 },
            { x: 3050, y: 290 },
            { x: 3950, y: 290 },
            { x: 4800, y: 290 },
        ],
        pipes: [
            { x: 1700, h: 64, piranha: true },
            { x: 2600, h: 64 },
            { x: 3500, h: 64, piranha: true },
            { x: 4400, h: 64 },
        ],
        warpPipe: 2600,
        bonus: {
            title: 'BONUS 1-2: CRIPTA SECRETA',
            bgColor: '#0a0820',          // azul muy oscuro
            width: 1200,
            // Sin plataformas, solo bloques en el suelo bonus
            qblocks: [
                { x: 150, y: 130 },
                { x: 350, y: 130 },
                { x: 550, y: 130 },
                { x: 750, y: 130 },
                { x: 950, y: 130 },
            ],
            bricks: [
                { x: 200, y: 130 }, { x: 232, y: 130 },
                { x: 400, y: 130 }, { x: 432, y: 130 },
                { x: 600, y: 130 }, { x: 632, y: 130 },
                { x: 800, y: 130 }, { x: 832, y: 130 },
                { x: 1000, y: 130 }, { x: 1032, y: 130 },
            ],
            solids: [
                { x: 80, y: 130 },
                { x: 1100, y: 130 },
            ],
            coins: [
                [80, 30], [150, 30], [250, 30], [350, 30], [450, 30],
                [550, 30], [650, 30], [750, 30], [850, 30], [950, 30],
                [1050, 30], [1100, 30],
                [150, 80], [350, 80], [550, 80], [750, 80], [950, 80],
                [50, 60], [1150, 60],
            ],
            exitX: 1130,
        },
        coins: [
            [250, 240], [1200, 240], [2150, 240],
            [3050, 240], [3950, 240], [4800, 240],
            [400, 340], [1000, 340], [1800, 340],
            [2700, 340], [3600, 340], [4500, 340],
            [180, -1], [950, -1], [3000, -1], [4000, -1], [5000, -1],
        ],
        enemies: [
            { type: 'goomba', x: 500,  minX: 380,  maxX: 680 },
            { type: 'koopa',  x: 1300, minX: 1180, maxX: 1480 },
            { type: 'goomba', x: 2100, minX: 1980, maxX: 2280 },
            { type: 'koopa',  x: 2900, minX: 2780, maxX: 3080 },
            { type: 'goomba', x: 3700, minX: 3580, maxX: 3880 },
            { type: 'koopa',  x: 4600, minX: 4480, maxX: 4780 },
        ],
        stairs:   { x: 5100, steps: 7 },
        flagpole: { x: 5560 },
        goalX: 5780,
    },

    // ───────────────── WORLD 1-3 — RESCATE DEL PRÍNCIPE ─────────────────
    {
        name: '1-3',
        width: 6400,
        bgColor: '#1a1a3a',
        gaps: [[600, 720], [1300, 1420], [2100, 2220], [2900, 3020], [3700, 3820], [4500, 4620]],
        platforms: [
            { x: 300,  y: 400, w: 80 },
            { x: 800,  y: 380, w: 100 },
            { x: 1500, y: 360, w: 120 },
            { x: 2300, y: 360, w: 120 },
            { x: 3100, y: 360, w: 140 },
            { x: 3800, y: 380, w: 120 },
            { x: 4750, y: 380, w: 128 },
            { x: 5250, y: 360, w: 128 },
        ],
        // Solids en zonas libres
        solids: [
            { x: 200, y: 290 },
            { x: 1100, y: 290 }, { x: 1132, y: 290 },
            { x: 2000, y: 290 }, { x: 2032, y: 290 },
            { x: 3300, y: 290 },
            { x: 4150, y: 290 },
            { x: 5050, y: 290 },
        ],
        bricks: [
            { x: 1700, y: 290 }, { x: 1732, y: 290 },
            { x: 2500, y: 290 }, { x: 2532, y: 290 },
            { x: 3500, y: 290 },
            { x: 4350, y: 290 }, { x: 4382, y: 290 },
            { x: 5450, y: 290 }, { x: 5482, y: 290 }, { x: 5514, y: 290 },
        ],
        questionBlocks: [
            { x: 100,  y: 290 },
            { x: 1200, y: 290 },
            { x: 1800, y: 290 },
            { x: 2600, y: 290 },
            { x: 3400, y: 290 },
            { x: 4250, y: 290 },
            { x: 4900, y: 290 },
            { x: 5550, y: 290 },
        ],
        pipes: [
            { x: 1000, h: 64, piranha: true },
            { x: 2000, h: 64 },
            { x: 3300, h: 64 },
            { x: 4250, h: 64, piranha: true },
            { x: 4850, h: 64, piranha: true },
        ],
        warpPipe: 3300,
        bonus: {
            title: 'BONUS 1-3: SALA DEL TESORO',
            bgColor: '#1a0010',
            width: 1400,
            // 7 ? blocks distribuidos, intercalados con monedas de premio
            qblocks: [
                { x: 100,  y: 130 },
                { x: 1300, y: 130 },
                { x: 250,  y: 130 },
                { x: 1150, y: 130 },
                { x: 700,  y: 130 },
                { x: 450,  y: 130 },
                { x: 950,  y: 130 },
            ],
            // Pirámide central de bloques sólidos como "altar del tesoro"
            solids: [
                { x: 670, y: 50 }, { x: 702, y: 50 }, { x: 734, y: 50 },
                { x: 686, y: 80 }, { x: 718, y: 80 },
            ],
            bricks: [
                { x: 380, y: 130 }, { x: 412, y: 130 },
                { x: 1020, y: 130 }, { x: 1052, y: 130 },
            ],
            coins: [
                [100, 30], [150, 30], [200, 30], [300, 30], [350, 30],
                [400, 30], [550, 30], [600, 30], [800, 30], [850, 30],
                [900, 30], [1000, 30], [1100, 30], [1200, 30], [1250, 30], [1300, 30],
                [100, 80], [250, 80], [450, 80], [950, 80], [1150, 80], [1300, 80],
                [702, 30],
                [50, 60], [50, 100], [50, 140],
                [1350, 60], [1350, 100], [1350, 140],
            ],
            exitX: 1340,
        },
        coins: [
            [100, 240], [1200, 240], [1800, 240], [2600, 240],
            [3400, 240], [4250, 240], [4900, 240], [5550, 240],
            [300, 360], [800, 340], [1500, 320],
            [2300, 320], [3100, 320], [3800, 340],
            [4750, 340], [5250, 320],
            [180, -1], [1200, -1], [2400, -1], [3200, -1], [4400, -1], [5400, -1],
        ],
        enemies: [
            { type: 'goomba', x: 400,  minX: 280,  maxX: 580 },
            { type: 'koopa',  x: 950,  minX: 800,  maxX: 1080 },
            { type: 'goomba', x: 1600, minX: 1480, maxX: 1780 },
            { type: 'koopa',  x: 2400, minX: 2280, maxX: 2580 },
            { type: 'goomba', x: 3200, minX: 3080, maxX: 3380 },
            { type: 'koopa',  x: 4100, minX: 3980, maxX: 4280 },
            { type: 'goomba', x: 4850, minX: 4750, maxX: 4950 },
            { type: 'koopa',  x: 5300, minX: 5180, maxX: 5450 },
        ],
        stairs:   { x: 5680, steps: 8 },
        flagpole: { x: 6200 },
        goalX: 6360,
        // Marcador para mostrar la escena romántica al ganar este nivel
        finalLevel: true,
    },
];

window.LEVELS = LEVELS;
