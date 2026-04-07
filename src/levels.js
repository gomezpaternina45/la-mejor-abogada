/* Datos de niveles. Coordenadas en píxeles del mundo.
 *
 * MEDIDAS DEL JUGADOR (calculadas):
 *   Pequeño: 28 (W) × 58 (H) px, head Y desde el suelo = 434
 *   Grande:  32 (W) × 72 (H) px, head Y desde el suelo = 420
 *   Suelo (feet) Y = 492
 *
 * SALTOS (con GRAVITY=1500, JUMP=-560, DOUBLE_JUMP=-480):
 *   Salto simple: feet peak Y = 388, head pequeño = 330, head grande = 316
 *   Doble salto:  feet peak Y = 311, head pequeño = 253, head grande = 239
 *
 * REGLAS PARA POSICIONAR BLOQUES (32×32 centrados en y):
 *   - Para BONK con SALTO SIMPLE (ambos tamaños):
 *       block.y >= 316  (block bottom = 332 ≥ head grande 316)
 *   - Para BONK con DOBLE SALTO (ambos tamaños):
 *       block.y >= 239
 *   - Bloques en plataformas: block.y debe estar a (platformTop - 60) o más alto
 *     para que el jugador grande pueda saltar parado en la plataforma sin chocarse
 *     con el bloque de cabeza inmediatamente.
 *
 * USO ESTÁNDAR:
 *   - Bloques en suelo (bonk simple): y = 330
 *   - Bloques sobre platform y=380:   y = 200 (saltando desde la plataforma)
 *   - Pasaje libre entre obstáculos: separación horizontal >= 80 px
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
        // Bloques sólidos normales (no rompibles, no power-up)
        solids: [
            { x: 600,  y: 330 },
            { x: 632,  y: 330 },
            { x: 1700, y: 330 },
            { x: 3300, y: 330 },
        ],
        // Bricks rompibles (solo big/fuego). Aislados, todos a y=330
        bricks: [
            { x: 1900, y: 330 }, { x: 1932, y: 330 },
            { x: 3100, y: 330 }, { x: 3132, y: 330 }, { x: 3164, y: 330 },
            { x: 4250, y: 330 }, { x: 4282, y: 330 },
        ],
        // ? blocks: bonk simple desde el suelo. y=330 garantizado para ambos tamaños
        questionBlocks: [
            { x: 350,  y: 330 },
            { x: 700,  y: 330 },
            { x: 1280, y: 330 },
            { x: 2400, y: 330 },
            { x: 3500, y: 330 },
            { x: 4400, y: 330 },
        ],
        pipes: [
            { x: 1800, h: 64 },
            { x: 2900, h: 64 },
            { x: 3700, h: 64 },
        ],
        warpPipe: 1800,
        bonus: {
            title: 'BONUS 1-1: GRUTA DE ORO',
            width: 900,
            // y se mide HACIA ARRIBA desde el suelo del bonus (1000)
            platforms: [
                { x: 250, y: 100, w: 96 },
                { x: 500, y: 180, w: 96 },
            ],
            solids: [
                { x: 380, y: 50 },
                { x: 412, y: 50 },
            ],
            coins: [
                [120, 60], [170, 80], [220, 100],
                [280, 140], [320, 140], [360, 140],
                [430, 140], [470, 140], [510, 220],
                [550, 220], [590, 220],
                [680, 60], [720, 60], [760, 60],
            ],
            exitX: 820,
        },
        coins: [
            [350, 280], [700, 280], [1280, 280],
            [2400, 280], [3500, 280], [4400, 280],
            [880, 340], [1080, 280],
            [2200, 340], [3400, 340], [4500, 340],
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
        solids: [
            { x: 300,  y: 330 },
            { x: 1300, y: 330 },
            { x: 1332, y: 330 },
            { x: 2200, y: 330 },
            { x: 3100, y: 330 },
            { x: 4000, y: 330 },
            { x: 4032, y: 330 },
        ],
        bricks: [
            { x: 1800, y: 330 }, { x: 1832, y: 330 },
            { x: 2700, y: 330 }, { x: 2732, y: 330 }, { x: 2764, y: 330 },
            { x: 4500, y: 330 }, { x: 4532, y: 330 },
        ],
        questionBlocks: [
            { x: 250,  y: 330 },
            { x: 1100, y: 330 },
            { x: 2050, y: 330 },
            { x: 2900, y: 330 },
            { x: 3850, y: 330 },
            { x: 4750, y: 330 },
        ],
        pipes: [
            { x: 1400, h: 64 },
            { x: 2300, h: 64 },
            { x: 3200, h: 64 },
            { x: 4100, h: 64 },
        ],
        warpPipe: 2300,
        bonus: {
            title: 'BONUS 1-2: CRIPTA SECRETA',
            width: 1100,
            platforms: [
                { x: 200, y: 80,  w: 96 },
                { x: 360, y: 160, w: 96 },
                { x: 540, y: 240, w: 96 },
                { x: 720, y: 160, w: 96 },
                { x: 880, y: 80,  w: 96 },
            ],
            bricks: [
                { x: 380, y: 50 }, { x: 412, y: 50 },
                { x: 740, y: 50 }, { x: 772, y: 50 },
            ],
            qblocks: [
                { x: 560, y: 300 },
                { x: 920, y: 140 },
            ],
            solids: [
                { x: 100, y: 50 },
                { x: 132, y: 50 },
                { x: 970, y: 50 },
                { x: 1002, y: 50 },
            ],
            coins: [
                [200, 130], [240, 130],
                [360, 210], [400, 210],
                [540, 290], [580, 290],
                [720, 210], [760, 210],
                [880, 130], [920, 130],
                [60, 60], [60, 100],
                [1040, 60], [1040, 100],
                [300, 60], [340, 60],
                [800, 60], [840, 60],
            ],
            exitX: 1020,
        },
        coins: [
            [250, 280], [1100, 280], [2050, 280],
            [2900, 280], [3850, 280], [4750, 280],
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

    // ───────────────── WORLD 1-3 ─────────────────
    {
        name: '1-3',
        width: 6400,
        bgColor: '#5dadec',
        gaps: [[600, 720], [1300, 1420], [2100, 2220], [2900, 3020], [3700, 3820], [4500, 4620]],
        platforms: [
            { x: 300,  y: 400, w: 80 },
            { x: 800,  y: 380, w: 100 },
            { x: 1500, y: 360, w: 120 },
            { x: 2300, y: 360, w: 120 },
            { x: 3100, y: 360, w: 140 },
            { x: 3700, y: 380, w: 120 },
            { x: 4350, y: 360, w: 96 },
            { x: 4750, y: 380, w: 128 },
            { x: 5250, y: 360, w: 128 },
        ],
        solids: [
            { x: 200,  y: 330 },
            { x: 232,  y: 330 },
            { x: 1100, y: 330 },
            { x: 2000, y: 330 },
            { x: 2032, y: 330 },
            { x: 3300, y: 330 },
            { x: 4150, y: 330 },
            { x: 5400, y: 330 },
            { x: 5432, y: 330 },
        ],
        bricks: [
            { x: 1500, y: 330 }, { x: 1532, y: 330 },
            { x: 2800, y: 330 }, { x: 2832, y: 330 },
            { x: 4400, y: 330 }, { x: 4432, y: 330 },
            { x: 5100, y: 330 }, { x: 5132, y: 330 }, { x: 5164, y: 330 },
        ],
        questionBlocks: [
            { x: 400,  y: 330 },
            { x: 1200, y: 330 },
            { x: 1800, y: 330 },
            { x: 2500, y: 330 },
            { x: 3500, y: 330 },
            { x: 4250, y: 330 },
            { x: 4900, y: 330 },
            { x: 5500, y: 330 },
        ],
        pipes: [
            { x: 1000, h: 64 },
            { x: 2000, h: 64 },
            { x: 3300, h: 64 },
            { x: 4250, h: 64 },
            { x: 4850, h: 64 },
        ],
        warpPipe: 3300,
        bonus: {
            title: 'BONUS 1-3: LABERINTO ANTIGUO',
            width: 1400,
            platforms: [
                { x: 150, y: 80,  w: 80 },
                { x: 300, y: 160, w: 80 },
                { x: 450, y: 240, w: 80 },
                { x: 600, y: 320, w: 96 },
                { x: 800, y: 240, w: 80 },
                { x: 950, y: 160, w: 80 },
                { x: 1100, y: 240, w: 96 },
                { x: 1280, y: 80,  w: 96 },
            ],
            bricks: [
                { x: 250, y: 50 }, { x: 282, y: 50 }, { x: 314, y: 50 },
                { x: 700, y: 50 }, { x: 732, y: 50 }, { x: 764, y: 50 },
                { x: 1180, y: 50 }, { x: 1212, y: 50 },
            ],
            qblocks: [
                { x: 380, y: 220 },
                { x: 600, y: 380 },
                { x: 1050, y: 220 },
            ],
            solids: [
                { x: 100, y: 50 },
                { x: 132, y: 50 },
                { x: 1300, y: 50 },
                { x: 1332, y: 50 },
                { x: 480, y: 50 }, { x: 512, y: 50 },
                { x: 880, y: 50 }, { x: 912, y: 50 },
            ],
            coins: [
                [150, 130], [180, 130],
                [300, 210], [330, 210],
                [450, 290], [480, 290],
                [600, 370],
                [800, 290], [830, 290],
                [950, 210], [980, 210],
                [1100, 290], [1130, 290],
                [1280, 130], [1310, 130],
                [60, 60], [60, 100], [60, 140],
                [1380, 60], [1380, 100], [1380, 140],
                [220, 60], [400, 60], [550, 60],
                [780, 60], [1020, 60], [1240, 60],
            ],
            exitX: 1380,
        },
        coins: [
            [400, 280], [1200, 280], [1800, 280],
            [2500, 280], [3500, 280], [4250, 280],
            [4900, 280], [5500, 280],
            [300, 360], [800, 340], [1500, 320],
            [2300, 320], [3100, 320], [3700, 340],
            [4350, 320], [4750, 340], [5250, 320],
            [180, -1], [1200, -1], [2400, -1], [3300, -1], [4500, -1], [5400, -1],
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
        goalX: 6400,
    },
];

window.LEVELS = LEVELS;
