/* La Mejor Abogada — plataformas estilo Mario con Phaser 3
 * Escenas: Boot → Title → Game (parametrizada por nivel) → Win
 */

const GAME_W = 960;
const GAME_H = 540;
const GROUND_Y = GAME_H - 48;
const PLAYER_SCALE_SMALL = 0.62;
const PLAYER_SCALE_BIG   = 0.78;
const PLAYER_W_SMALL = 28;
const PLAYER_H_SMALL = 58;
const PLAYER_W_BIG   = 32;
const PLAYER_H_BIG   = 72;
const MOVE_SPEED = 220;
const JUMP_VELOCITY = -640;
const DOUBLE_JUMP_VELOCITY = -540;
const GRAVITY = 1500;
const TILE = 32;
const FONT = 'monospace';
const STAR_DURATION = 8000;

// ─────────────────────────────────────────────── BOOT ───
class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }

    preload() {
        this.load.image('p_idle',   'assets/sprites/player_idle.png');
        this.load.image('p_walk1',  'assets/sprites/player_walk_1.png');
        this.load.image('p_walk2',  'assets/sprites/player_walk_2.png');
        this.load.image('p_walk3',  'assets/sprites/player_walk_3.png');
        this.load.image('p_walk4',  'assets/sprites/player_walk_4.png');
        this.load.image('p_jump',   'assets/sprites/player_jump.png');
        this.load.image('p_hurt',   'assets/sprites/player_hurt.png');
        this.load.image('p_crouch', 'assets/sprites/player_crouch.png');
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: [{ key: 'p_walk1' }, { key: 'p_walk2' }, { key: 'p_walk3' }, { key: 'p_walk4' }],
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({ key: 'idle',   frames: [{ key: 'p_idle' }],   frameRate: 1 });
        this.anims.create({ key: 'jump',   frames: [{ key: 'p_jump' }],   frameRate: 1 });
        this.anims.create({ key: 'crouch', frames: [{ key: 'p_crouch' }], frameRate: 1 });
        this.anims.create({ key: 'hurt',   frames: [{ key: 'p_hurt' }],   frameRate: 1 });

        // Goomba: dibujamos uno proceduralmente y lo guardamos como textura
        const g = this.add.graphics();
        g.fillStyle(0x6b3210, 1);   g.fillEllipse(20, 28, 40, 26);   // cuerpo
        g.fillStyle(0x4a2008, 1);   g.fillEllipse(20, 18, 36, 22);   // cabeza
        g.fillStyle(0xffffff, 1);   g.fillCircle(13, 16, 4); g.fillCircle(27, 16, 4);
        g.fillStyle(0x000000, 1);   g.fillCircle(14, 16, 2); g.fillCircle(28, 16, 2);
        g.fillStyle(0x2a1004, 1);   g.fillRect(8, 38, 8, 6); g.fillRect(24, 38, 8, 6); // pies
        g.generateTexture('goomba', 40, 44);
        g.destroy();

        // Bloque ladrillo
        const b = this.add.graphics();
        b.fillStyle(0xb44a1a, 1); b.fillRect(0, 0, 32, 32);
        b.lineStyle(2, 0x4a1c08, 1);
        b.strokeRect(0, 0, 32, 32);
        b.lineBetween(0, 16, 32, 16);
        b.lineBetween(16, 0, 16, 16);
        b.lineBetween(8, 16, 8, 32);
        b.lineBetween(24, 16, 24, 32);
        b.generateTexture('brick', 32, 32);
        b.destroy();

        // Bloque ? (estilo Mario clásico)
        const q = this.add.graphics();
        q.fillStyle(0xe6a000, 1); q.fillRect(0, 0, 32, 32);
        q.fillStyle(0xffc940, 1); q.fillRect(2, 2, 28, 28);
        q.fillStyle(0xe6a000, 1); q.fillRect(4, 4, 24, 24);
        q.lineStyle(3, 0x000000, 1); q.strokeRect(0, 0, 32, 32);
        // remaches en las esquinas
        q.fillStyle(0x000000, 1);
        q.fillRect(4, 4, 3, 3); q.fillRect(25, 4, 3, 3);
        q.fillRect(4, 25, 3, 3); q.fillRect(25, 25, 3, 3);
        // signo de pregunta blanco grande
        q.fillStyle(0xffffff, 1);
        q.fillRect(12, 9, 8, 3);     // top bar
        q.fillRect(18, 12, 3, 3);    // top right curve
        q.fillRect(15, 15, 3, 3);    // middle
        q.fillRect(15, 18, 3, 3);    // stem
        q.fillRect(15, 23, 3, 3);    // dot
        q.generateTexture('qblock', 32, 32);
        q.destroy();

        // Bloque ? agotado
        const qu = this.add.graphics();
        qu.fillStyle(0x8a5a00, 1); qu.fillRect(0, 0, 32, 32);
        qu.lineStyle(2, 0x4a3000, 1); qu.strokeRect(0, 0, 32, 32);
        qu.generateTexture('qblock_used', 32, 32);
        qu.destroy();

        // Tile de suelo
        const t = this.add.graphics();
        t.fillStyle(0x8b5a2b, 1); t.fillRect(0, 0, 32, 32);
        t.fillStyle(0x6b3a18, 1); t.fillRect(0, 24, 32, 8);
        t.lineStyle(1, 0x000000, 0.25); t.strokeRect(0, 0, 32, 32);
        t.generateTexture('ground', 32, 32);
        t.destroy();

        // Tile pasto (encima del suelo)
        const gr = this.add.graphics();
        gr.fillStyle(0x4f7c2a, 1); gr.fillRect(0, 0, 32, 6);
        gr.fillStyle(0x6aa83a, 1); gr.fillRect(0, 0, 32, 2);
        gr.generateTexture('grass', 32, 6);
        gr.destroy();

        // Bloque sólido normal (no rompible, no power-up)
        const sb = this.add.graphics();
        sb.fillStyle(0x9b6b3a, 1); sb.fillRect(0, 0, 32, 32);
        sb.fillStyle(0xb47e44, 1); sb.fillRect(2, 2, 28, 28);
        sb.fillStyle(0x9b6b3a, 1); sb.fillRect(4, 4, 24, 24);
        sb.lineStyle(2, 0x4a2e15, 1); sb.strokeRect(0, 0, 32, 32);
        // remaches de las esquinas
        sb.fillStyle(0x4a2e15, 1);
        sb.fillRect(4, 4, 3, 3); sb.fillRect(25, 4, 3, 3);
        sb.fillRect(4, 25, 3, 3); sb.fillRect(25, 25, 3, 3);
        sb.generateTexture('solid', 32, 32);
        sb.destroy();

        // Champiñón (rojo con manchas blancas)
        const m = this.add.graphics();
        m.fillStyle(0xf7d39a, 1); m.fillRect(8, 16, 16, 12);          // tallo
        m.lineStyle(2, 0x4a2008, 1); m.strokeRect(8, 16, 16, 12);
        m.fillStyle(0xd83020, 1); m.fillEllipse(16, 12, 30, 18);      // sombrero
        m.lineStyle(2, 0x4a0000, 1); m.strokeEllipse(16, 12, 30, 18);
        m.fillStyle(0xffffff, 1);
        m.fillCircle(8, 10, 3); m.fillCircle(22, 10, 3); m.fillCircle(16, 6, 3);
        m.fillStyle(0x000000, 1);
        m.fillCircle(12, 22, 1.5); m.fillCircle(20, 22, 1.5);          // ojos
        m.generateTexture('mushroom', 32, 32);
        m.destroy();

        // Flor de fuego
        const fl = this.add.graphics();
        fl.fillStyle(0x4f7c2a, 1); fl.fillRect(14, 18, 4, 14);          // tallo
        fl.fillStyle(0xff8800, 1); fl.fillCircle(16, 12, 9);            // centro
        fl.fillStyle(0xffe600, 1); fl.fillCircle(16, 12, 5);            // amarillo
        fl.fillStyle(0xff5500, 1);
        fl.fillCircle(8, 10, 5); fl.fillCircle(24, 10, 5);              // pétalos
        fl.fillCircle(10, 18, 5); fl.fillCircle(22, 18, 5);
        fl.fillStyle(0x000000, 1);
        fl.fillCircle(14, 11, 1); fl.fillCircle(18, 11, 1);             // ojos
        fl.generateTexture('fireflower', 32, 32);
        fl.destroy();

        // Estrella
        const st = this.add.graphics();
        const cx = 16, cy = 16, R = 14, r = 6;
        const starPoints = [];
        for (let i = 0; i < 10; i++) {
            const ang = -Math.PI / 2 + i * Math.PI / 5;
            const rad = i % 2 === 0 ? R : r;
            starPoints.push({ x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad });
        }
        st.fillStyle(0xffe600, 1);
        st.fillPoints(starPoints, true);
        st.lineStyle(2, 0xb37a00, 1);
        st.strokePoints(starPoints, true, true);
        st.fillStyle(0x000000, 1);
        st.fillCircle(12, 14, 1.5); st.fillCircle(20, 14, 1.5);
        st.generateTexture('star', 32, 32);
        st.destroy();

        // Bola de fuego
        const fb = this.add.graphics();
        fb.fillStyle(0xffaa00, 1); fb.fillCircle(8, 8, 8);
        fb.fillStyle(0xff4400, 1); fb.fillCircle(8, 8, 5);
        fb.fillStyle(0xffee44, 1); fb.fillCircle(8, 8, 2);
        fb.generateTexture('fireball', 16, 16);
        fb.destroy();

        // Koopa (tortuga verde)
        const k = this.add.graphics();
        k.fillStyle(0x2a8a1a, 1); k.fillEllipse(20, 26, 36, 22);
        k.lineStyle(2, 0x0a3a08, 1); k.strokeEllipse(20, 26, 36, 22);
        k.fillStyle(0xffe68a, 1); k.fillEllipse(20, 30, 22, 12);
        k.fillStyle(0xb5e068, 1); k.fillCircle(32, 18, 8);
        k.lineStyle(2, 0x0a3a08, 1); k.strokeCircle(32, 18, 8);
        k.fillStyle(0xffffff, 1); k.fillCircle(34, 16, 3);
        k.fillStyle(0x000000, 1); k.fillCircle(35, 16, 1.5);
        k.fillStyle(0xffd44a, 1);
        k.fillRect(8, 36, 8, 6); k.fillRect(24, 36, 8, 6);
        k.generateTexture('koopa', 44, 44);
        k.destroy();

        // Caparazón
        const sh = this.add.graphics();
        sh.fillStyle(0x2a8a1a, 1); sh.fillEllipse(18, 16, 32, 22);
        sh.lineStyle(2, 0x0a3a08, 1); sh.strokeEllipse(18, 16, 32, 22);
        sh.fillStyle(0xffe68a, 1); sh.fillEllipse(18, 18, 22, 14);
        sh.lineStyle(1, 0x0a3a08, 0.5);
        sh.lineBetween(18, 8, 18, 26);
        sh.lineBetween(8, 16, 28, 16);
        sh.generateTexture('shell', 36, 28);
        sh.destroy();

        // Tubería: parte superior (lip) y cuerpo
        const pt = this.add.graphics();
        pt.fillStyle(0x2a8a1a, 1); pt.fillRect(0, 0, 56, 24);
        pt.fillStyle(0x4ebd2a, 1); pt.fillRect(2, 2, 8, 20);
        pt.fillRect(46, 2, 8, 20);
        pt.lineStyle(2, 0x0a3a08, 1); pt.strokeRect(0, 0, 56, 24);
        pt.generateTexture('pipe_top', 56, 24);
        pt.destroy();

        const pb = this.add.graphics();
        pb.fillStyle(0x2a8a1a, 1); pb.fillRect(0, 0, 48, 32);
        pb.fillStyle(0x4ebd2a, 1); pb.fillRect(4, 0, 6, 32);
        pb.fillRect(38, 0, 6, 32);
        pb.lineStyle(2, 0x0a3a08, 1);
        pb.lineBetween(0, 0, 0, 32);
        pb.lineBetween(48, 0, 48, 32);
        pb.generateTexture('pipe_body', 48, 32);
        pb.destroy();

        // Moneda dorada (más realista que un círculo plano)
        const cn = this.add.graphics();
        cn.fillStyle(0x8a5a00, 1); cn.fillEllipse(11, 11, 22, 22);     // borde oscuro
        cn.fillStyle(0xffd54a, 1); cn.fillEllipse(11, 11, 18, 18);     // cara amarilla
        cn.fillStyle(0xb37a00, 1);
        cn.fillRect(9, 4, 4, 14);                                      // marca central tipo "I"
        cn.fillStyle(0xffe680, 1); cn.fillEllipse(7, 7, 5, 5);         // brillo arriba-izq
        cn.lineStyle(1, 0x4a3000, 1); cn.strokeEllipse(11, 11, 22, 22);
        cn.generateTexture('coin', 22, 22);
        cn.destroy();

        // Partícula de ladrillo roto
        const bp = this.add.graphics();
        bp.fillStyle(0xb44a1a, 1); bp.fillRect(0, 0, 8, 8);
        bp.lineStyle(1, 0x4a1c08, 1); bp.strokeRect(0, 0, 8, 8);
        bp.generateTexture('brick_chunk', 8, 8);
        bp.destroy();

        this.scene.start('Title');
    }
}

// ─────────────────────────────────────────────── TITLE ───
class TitleScene extends Phaser.Scene {
    constructor() { super('Title'); }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Estrellas
        for (let i = 0; i < 60; i++) {
            this.add.circle(
                Phaser.Math.Between(0, GAME_W),
                Phaser.Math.Between(0, GAME_H),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1)
            );
        }

        this.add.text(GAME_W / 2, 110, 'LA MEJOR', {
            fontFamily: FONT, fontSize: '64px', color: '#ffd54a',
            stroke: '#000', strokeThickness: 8,
        }).setOrigin(0.5);
        this.add.text(GAME_W / 2, 180, 'ABOGADA', {
            fontFamily: FONT, fontSize: '64px', color: '#ffd54a',
            stroke: '#000', strokeThickness: 8,
        }).setOrigin(0.5);

        // Personaje en idle
        const player = this.add.sprite(GAME_W / 2, 360, 'p_idle').setOrigin(0.5, 1).setScale(2.2);
        this.tweens.add({ targets: player, y: 350, duration: 700, yoyo: true, repeat: -1 });

        const pressText = this.add.text(GAME_W / 2, 430, 'PULSA ESPACIO PARA EMPEZAR', {
            fontFamily: FONT, fontSize: '20px', color: '#fff',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5);
        this.tweens.add({ targets: pressText, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });

        this.add.text(GAME_W / 2, 470, '← →  mover    ESPACIO/↑  saltar (doble)    F  fuego', {
            fontFamily: FONT, fontSize: '14px', color: '#aaa',
        }).setOrigin(0.5);
        this.add.text(GAME_W / 2, 492, '↓ agacharse    M silenciar', {
            fontFamily: FONT, fontSize: '14px', color: '#aaa',
        }).setOrigin(0.5);

        let started = false;
        const start = () => {
            if (started) return;
            started = true;
            window.SFX.select();
            this.scene.start('Game', { levelIndex: 0, lives: 3, score: 0 });
        };
        this.input.keyboard.once('keydown-SPACE', start);
        this.input.keyboard.once('keydown-UP', start);
        this.input.keyboard.once('keydown-ENTER', start);
        this.input.keyboard.on('keydown-M', () => {
            window.SFX.muted = !window.SFX.muted;
        });
        // Tap/click en cualquier parte para empezar (móvil)
        this.input.once('pointerdown', start);
    }
}

// ─────────────────────────────────────────────── GAME ───
class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    init(data) {
        this.levelIndex = data.levelIndex || 0;
        this.lives = data.lives ?? 3;
        this.score = data.score ?? 0;
        this.level = window.LEVELS[this.levelIndex];
    }

    create() {
        const lvl = this.level;
        const W = lvl.width;

        this.cameras.main.setBackgroundColor(lvl.bgColor);
        // Mundo extendido verticalmente: parte de arriba (0..540) = nivel normal,
        //                                 parte de abajo (540..1100) = zona bonus
        this.physics.world.setBounds(0, 0, W, 1100);
        // Cámara restringida al área normal por defecto
        this.cameras.main.setBounds(0, 0, W, GAME_H);

        // Nubes/estrellas según fondo
        const isNight = lvl.bgColor === '#1a3a6e';
        if (isNight) {
            for (let i = 0; i < 80; i++) {
                this.add.circle(
                    Phaser.Math.Between(0, W),
                    Phaser.Math.Between(20, 250),
                    Phaser.Math.Between(1, 2),
                    0xffffff, Phaser.Math.FloatBetween(0.3, 1)
                ).setScrollFactor(0.5);
            }
            this.add.circle(W * 0.7, 80, 30, 0xfff8c8).setScrollFactor(0.3);
        } else {
            for (let i = 0; i < 16; i++) {
                this.add.ellipse(
                    Phaser.Math.Between(0, W),
                    Phaser.Math.Between(40, 200),
                    Phaser.Math.Between(80, 140), 32, 0xffffff, 0.85
                ).setScrollFactor(0.4);
            }
        }

        // Suelo
        this.platforms = this.physics.add.staticGroup();
        for (let x = 0; x < W; x += TILE) {
            const inGap = lvl.gaps.some(([a, b]) => x >= a && x < b);
            if (inGap) continue;
            const tile = this.add.image(x + TILE / 2, GROUND_Y + 16, 'ground');
            this.physics.add.existing(tile, true);
            this.platforms.add(tile);
            this.add.image(x + TILE / 2, GROUND_Y - 1, 'grass');
        }

        // Plataformas flotantes
        lvl.platforms.forEach(p => {
            const r = this.add.rectangle(p.x, p.y, p.w, 16, 0x9b6b3a)
                .setStrokeStyle(2, 0x4a2e15);
            this.physics.add.existing(r, true);
            this.platforms.add(r);
        });

        // Ladrillos rompibles (con champiñón/fuego)
        this.bricks = this.physics.add.staticGroup();
        (lvl.bricks || []).forEach(b => {
            const img = this.add.image(b.x, b.y, 'brick');
            this.physics.add.existing(img, true);
            this.bricks.add(img);
        });

        // Bloques sólidos normales (no rompibles)
        (lvl.solids || []).forEach(b => {
            const img = this.add.image(b.x, b.y, 'solid');
            this.physics.add.existing(img, true);
            this.platforms.add(img);
        });

        // Tuberías
        this.pipes = this.physics.add.staticGroup();
        this.warpPipeX = null;
        (lvl.pipes || []).forEach(p => {
            const topH = 24, bodyH = 32;
            const baseY = GROUND_Y;
            const topY = baseY - p.h + topH / 2;
            const segs = Math.ceil((p.h - topH) / bodyH);
            for (let i = 0; i < segs; i++) {
                this.add.image(p.x, baseY - p.h + topH + bodyH / 2 + i * bodyH, 'pipe_body');
            }
            this.add.image(p.x, topY, 'pipe_top');
            const hb = this.add.rectangle(p.x, baseY - p.h / 2, 56, p.h, 0x000000, 0);
            this.physics.add.existing(hb, true);
            this.pipes.add(hb);
            // ¿Es el tubo warp del nivel?
            if (lvl.warpPipe === p.x) {
                this.warpPipeX = p.x;
                this.warpPipeTopY = topY - 12;
                // Indicador visual ▼
                this.add.text(p.x, topY - 28, '▼', {
                    fontFamily: FONT, fontSize: '20px', color: '#ffd54a',
                    stroke: '#000', strokeThickness: 3,
                }).setOrigin(0.5);
            }
        });

        // Bloques ? — power-ups distribuidos para que la flor no salga al final
        this.qblocks = this.physics.add.staticGroup();
        const blockTypes = ['mushroom', 'coin', 'fireflower', 'coin', 'star', 'coin'];
        (lvl.questionBlocks || []).forEach((q, i) => {
            const img = this.add.image(q.x, q.y, 'qblock');
            img.used = false;
            img.itemType = blockTypes[i % blockTypes.length];
            this.physics.add.existing(img, true);
            this.qblocks.add(img);
        });

        // Monedas
        this.coins = this.physics.add.staticGroup();
        lvl.coins.forEach(([x, y]) => {
            const cy = y < 0 ? GROUND_Y - 30 : y;
            const c = this.add.image(x, cy, 'coin');
            this.physics.add.existing(c, true);
            this.coins.add(c);
        });

        // ─── Zona BONUS subterránea (data-driven) ───
        this.buildBonusZone(lvl);

        // Escaleras antes del castillo
        if (lvl.stairs) this.createStairs(lvl.stairs.x, lvl.stairs.steps);

        // Mástil con bandera (estilo Mario)
        if (lvl.flagpole) {
            this.createFlagpole(lvl.flagpole.x);
        }

        // Castillo bonito
        this.createCastle(lvl.goalX);
        // Trigger de victoria: pequeño rectángulo en la puerta del castillo
        const goal = this.add.rectangle(lvl.goalX, GROUND_Y - 28, 40, 56, 0x000000, 0);
        this.physics.add.existing(goal, true);
        this.goal = goal;

        // Enemigos: goombas y koopas
        this.enemies = this.physics.add.group();
        (lvl.enemies || []).forEach(e => {
            const tex = e.type === 'koopa' ? 'koopa' : 'goomba';
            const enemy = this.physics.add.sprite(e.x, GROUND_Y - 30, tex);
            enemy.kind = e.type || 'goomba';
            enemy.minX = e.minX;
            enemy.maxX = e.maxX;
            enemy.dir = -1;
            if (enemy.kind === 'koopa') {
                enemy.body.setSize(36, 38).setOffset(4, 4);
                enemy.state = 'walk';      // walk | shell | sliding
                enemy.speed = 50;
            } else {
                enemy.body.setSize(34, 38).setOffset(3, 3);
                enemy.speed = 40;
            }
            enemy.setCollideWorldBounds(false);
            enemy.alive = true;
            this.enemies.add(enemy);
        });

        // Jugador — origin en los pies
        this.player = this.physics.add.sprite(80, GROUND_Y - 50, 'p_idle');
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.powerState = 'small';   // 'small' | 'big' | 'fire'
        this.player.starUntil = 0;

        const refreshBody = () => {
            const isSmall = this.player.powerState === 'small';
            const W = isSmall ? PLAYER_W_SMALL : PLAYER_W_BIG;
            const H = isSmall ? PLAYER_H_SMALL : PLAYER_H_BIG;
            this.player.body.setSize(W, H);
            this.player.body.setOffset(
                this.player.width / 2 - W / 2,
                this.player.height - H
            );
        };
        const applyScale = () => {
            this.player.setScale(this.player.powerState === 'small' ? PLAYER_SCALE_SMALL : PLAYER_SCALE_BIG);
            refreshBody();
        };
        applyScale();
        this.player.applyScale = applyScale;
        this.player.refreshBody = refreshBody;
        this.player.play('idle');
        this.player.on('animationupdate', refreshBody);
        this.player.on('animationstart', refreshBody);
        this.invulnerable = false;
        this.canDoubleJump = false;

        // Power-ups (item drops)
        this.powerups = this.physics.add.group();
        // Fireballs
        this.fireballs = this.physics.add.group();

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.bricks, (pl, br) => this.hitBrick(pl, br));
        this.physics.add.collider(this.player, this.qblocks, (pl, blk) => this.hitQBlock(pl, blk));
        this.physics.add.collider(this.player, this.pipes);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.bricks);
        this.physics.add.collider(this.enemies, this.qblocks);
        this.physics.add.collider(this.enemies, this.pipes);
        // Caparazones deslizándose matan a otros enemigos
        this.physics.add.collider(this.enemies, this.enemies, (a, b) => this.enemyVsEnemy(a, b));

        this.physics.add.overlap(this.player, this.coins, (pl, coin) => this.collectCoin(coin));
        this.physics.add.overlap(this.player, this.enemies, (pl, en) => this.touchEnemy(pl, en));
        this.physics.add.overlap(this.player, this.goal, () => this.win());
        this.physics.add.overlap(this.player, this.powerups, (pl, item) => this.collectPowerup(item));
        this.physics.add.collider(this.powerups, this.platforms);
        this.physics.add.collider(this.powerups, this.bricks);
        this.physics.add.collider(this.powerups, this.qblocks);
        // Las bolas de fuego rebotan en el suelo, se destruyen al chocar con paredes
        const fireballHit = (fb) => {
            if (fb.body.blocked.left || fb.body.blocked.right) fb.destroy();
        };
        this.physics.add.collider(this.fireballs, this.platforms, fireballHit);
        this.physics.add.collider(this.fireballs, this.bricks,    fireballHit);
        this.physics.add.collider(this.fireballs, this.qblocks,   fireballHit);
        this.physics.add.collider(this.fireballs, this.pipes,     fireballHit);
        this.physics.add.overlap(this.fireballs, this.enemies, (fb, en) => this.fireballHitEnemy(fb, en));

        // Overlap con el mástil (se crea aquí porque player no existía cuando se construyó el mástil)
        if (this.flagpoleHitbox) {
            this.physics.add.overlap(this.player, this.flagpoleHitbox, () => this.touchFlagpole());
        }

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // HUD
        this.scoreText = this.add.text(16, 12, '', {
            fontFamily: FONT, fontSize: '20px', color: '#fff',
            stroke: '#000', strokeThickness: 4,
        }).setScrollFactor(0);

        this.livesText = this.add.text(GAME_W / 2, 12, '', {
            fontFamily: FONT, fontSize: '20px', color: '#fff',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5, 0).setScrollFactor(0);

        this.add.text(GAME_W - 130, 12, 'WORLD ' + lvl.name, {
            fontFamily: FONT, fontSize: '18px', color: '#fff',
            stroke: '#000', strokeThickness: 4,
        }).setScrollFactor(0);

        this.msgText = this.add.text(GAME_W / 2, GAME_H / 2, '', {
            fontFamily: FONT, fontSize: '40px', color: '#fff',
            stroke: '#000', strokeThickness: 6,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10);

        this.updateHUD();

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.fireKey  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.input.keyboard.on('keydown-M', () => { window.SFX.muted = !window.SFX.muted; });

        // Controles táctiles para móvil
        this.touchInput = { left: false, right: false, down: false, jumpPressed: false, firePressed: false };
        this.createTouchControls();

        this.gameOver = false;
        this.won = false;
        this.flagTouched = false;
        this.flagWalking = false;
        this.inBonus = false;
        this.warping = false;
    }

    createTouchControls() {
        // Detección robusta de táctil (varios fallbacks)
        const isTouch = this.sys.game.device.input.touch ||
                        ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0) ||
                        (window.innerWidth < 1024);
        if (!isTouch) return;

        const r = 44;
        const make = (x, y, label, hold, oneshot) => {
            const bg = this.add.circle(x, y, r, 0xffffff, 0.3)
                .setStrokeStyle(3, 0xffffff, 0.7)
                .setScrollFactor(0)
                .setDepth(50)
                .setInteractive({ useHandCursor: false });
            this.add.text(x, y, label, {
                fontFamily: FONT, fontSize: '28px', color: '#ffffff',
                stroke: '#000', strokeThickness: 3,
            }).setOrigin(0.5).setScrollFactor(0).setDepth(51);
            bg.on('pointerdown', () => {
                if (hold)    this.touchInput[hold] = true;
                if (oneshot) this.touchInput[oneshot] = true;
                bg.setFillStyle(0xffffff, 0.5);
            });
            const release = () => {
                if (hold) this.touchInput[hold] = false;
                bg.setFillStyle(0xffffff, 0.3);
            };
            bg.on('pointerup', release);
            bg.on('pointerout', release);
            bg.on('pointerupoutside', release);
        };

        // Posiciones con margen de seguridad
        const baseY = GAME_H - 110;     // 110 px desde abajo
        const upY   = GAME_H - 200;     // botón ▼ más arriba
        // Lado izquierdo: D-pad
        make(70,  baseY, '◀', 'left',  null);
        make(180, baseY, '▶', 'right', null);
        make(125, upY,   '▼', 'down',  null);
        // Lado derecho: A=salto, B=fuego
        make(GAME_W - 70,  baseY, 'A', null, 'jumpPressed');
        make(GAME_W - 180, baseY, 'B', null, 'firePressed');
    }

    buildBonusZone(lvl) {
        // Coordenadas del bonus en el mundo virtual
        this.bonusGroundY = 1000;            // suelo del bonus (Y)
        const bonusW = (lvl.bonus && lvl.bonus.width) || 700;
        const bonusStartX = (this.warpPipeX || 200) - 100;
        const bonusEndX   = bonusStartX + bonusW;
        this.bonusStartX = bonusStartX;
        this.bonusSpawnX = bonusStartX + 80;
        this.bonusEntryReturnX = (this.warpPipeX || 200) + 80;

        // Fondo oscuro: enorme para cubrir TODO lo visible cuando estás en el bonus
        this.add.rectangle(
            (bonusStartX + bonusEndX) / 2, 800,
            Math.max(bonusW + 2000, 3000), 600,
            0x0a0a18
        ).setDepth(-2);

        // Suelo subterráneo
        for (let x = bonusStartX; x < bonusEndX; x += TILE) {
            const tile = this.add.image(x + TILE / 2, this.bonusGroundY + 16, 'ground');
            this.physics.add.existing(tile, true);
            this.platforms.add(tile);
        }
        // Paredes laterales
        const lwall = this.add.rectangle(bonusStartX - 8, 800, 16, 500, 0x4a2e15);
        this.physics.add.existing(lwall, true);
        this.platforms.add(lwall);
        const rwall = this.add.rectangle(bonusEndX + 8, 800, 16, 500, 0x4a2e15);
        this.physics.add.existing(rwall, true);
        this.platforms.add(rwall);
        // Techo (para que el doble salto no escape)
        const ceil = this.add.rectangle((bonusStartX + bonusEndX) / 2, 590, bonusW + 20, 16, 0x4a2e15);
        this.physics.add.existing(ceil, true);
        this.platforms.add(ceil);

        const data = lvl.bonus || {};

        // Plataformas del bonus (offsets relativos a bonusStartX y bonusGroundY)
        (data.platforms || []).forEach(p => {
            const r = this.add.rectangle(
                bonusStartX + p.x, this.bonusGroundY - p.y,
                p.w, 16, 0x9b6b3a
            ).setStrokeStyle(2, 0x4a2e15);
            this.physics.add.existing(r, true);
            this.platforms.add(r);
        });

        // Bricks rompibles
        (data.bricks || []).forEach(b => {
            const img = this.add.image(bonusStartX + b.x, this.bonusGroundY - b.y, 'brick');
            this.physics.add.existing(img, true);
            this.bricks.add(img);
        });

        // Bloques sólidos
        (data.solids || []).forEach(b => {
            const img = this.add.image(bonusStartX + b.x, this.bonusGroundY - b.y, 'solid');
            this.physics.add.existing(img, true);
            this.platforms.add(img);
        });

        // Bloques ?
        (data.qblocks || []).forEach((q, i) => {
            const img = this.add.image(bonusStartX + q.x, this.bonusGroundY - q.y, 'qblock');
            img.used = false;
            img.itemType = ['mushroom', 'coin', 'fireflower', 'coin', 'star', 'coin'][i % 6];
            this.physics.add.existing(img, true);
            this.qblocks.add(img);
        });

        // Monedas
        (data.coins || []).forEach(([x, y]) => {
            const c = this.add.image(bonusStartX + x, this.bonusGroundY - y, 'coin');
            this.physics.add.existing(c, true);
            this.coins.add(c);
        });

        // Cartel
        const title = data.title || 'ZONA BONUS';
        this.add.text((bonusStartX + bonusEndX) / 2, 640, title, {
            fontFamily: FONT, fontSize: '24px', color: '#ffd54a',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5);

        // Tubo de salida
        const exitOffsetX = (data.exitX != null) ? data.exitX : (bonusW - 80);
        this.bonusExitX = bonusStartX + exitOffsetX;
        const exitTopY = this.bonusGroundY - 64 + 12;
        for (let i = 0; i < 2; i++) {
            this.add.image(this.bonusExitX, this.bonusGroundY - 64 + 24 + 16 + i * 32, 'pipe_body');
        }
        this.add.image(this.bonusExitX, exitTopY, 'pipe_top');
        const exitHb = this.add.rectangle(this.bonusExitX, this.bonusGroundY - 32, 56, 64, 0x000000, 0);
        this.physics.add.existing(exitHb, true);
        this.pipes.add(exitHb);
        this.bonusExitTopY = exitTopY - 12;
        this.add.text(this.bonusExitX, exitTopY - 28, '▲', {
            fontFamily: FONT, fontSize: '20px', color: '#ffd54a',
            stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
    }

    createFlagpole(x) {
        const baseY = GROUND_Y;
        const poleH = 280;
        const poleTop = baseY - poleH;
        // Base verde
        this.add.rectangle(x, baseY - 16, 36, 32, 0x2a8a1a)
            .setStrokeStyle(2, 0x0a3a08);
        this.add.rectangle(x, baseY - 30, 24, 6, 0x4ebd2a);
        // Mástil blanco
        this.add.rectangle(x, baseY - poleH / 2 - 16, 6, poleH, 0xffffff)
            .setStrokeStyle(1, 0x888888);
        // Bola verde en la cima
        this.add.circle(x, poleTop - 16, 7, 0x2a8a1a)
            .setStrokeStyle(2, 0x0a3a08);
        // Bandera triangular
        const flag = this.add.triangle(
            x + 18, poleTop - 4,
            0, 0, 28, 12, 0, 24,
            0xffd54a
        ).setStrokeStyle(2, 0xb37a00);
        this.flagSprite = flag;
        this.flagBaseY = baseY - 30;        // donde aterriza la bandera al bajar
        this.flagPoleX = x;
        this.flagPoleTop = poleTop;
        this.flagPoleBottom = baseY - 30;

        // Hitbox vertical de overlap (todo el largo del mástil)
        const hb = this.add.rectangle(x, baseY - poleH / 2 - 16, 14, poleH, 0x000000, 0);
        this.physics.add.existing(hb, true);
        this.flagpoleHitbox = hb;
        // El overlap con el jugador se conecta más tarde, una vez creado this.player
    }

    touchFlagpole() {
        if (this.flagTouched || this.gameOver || this.won) return;
        this.flagTouched = true;
        // Calcular puntos según altura donde tocó (más arriba = más puntos)
        const playerY = this.player.y;
        const t = Phaser.Math.Clamp(
            1 - (playerY - this.flagPoleTop) / (this.flagPoleBottom - this.flagPoleTop),
            0, 1
        );
        const points = [100, 400, 800, 2000, 5000];
        const idx = Math.min(points.length - 1, Math.floor(t * points.length));
        const earned = points[idx];
        this.score += earned;
        this.updateHUD();
        window.SFX.win();

        // Mostrar puntos flotantes
        const txt = this.add.text(this.flagPoleX + 20, playerY - 20, '+' + earned, {
            fontFamily: FONT, fontSize: '18px', color: '#ffd54a',
            stroke: '#000', strokeThickness: 4,
        });
        this.tweens.add({
            targets: txt, y: playerY - 80, alpha: 0, duration: 1200,
            onComplete: () => txt.destroy(),
        });

        // Lock player to pole, slide down
        this.player.setVelocity(0, 0);
        this.player.body.setAllowGravity(false);
        this.player.x = this.flagPoleX - 12;
        this.player.setFlipX(true);
        this.player.play('idle');

        // Bandera baja en paralelo
        this.tweens.add({
            targets: this.flagSprite,
            y: this.flagBaseY - 4,
            duration: 900,
        });
        this.tweens.add({
            targets: this.player,
            y: this.flagBaseY,
            duration: 900,
            onComplete: () => this.flagWalkToCastle(),
        });
    }

    flagWalkToCastle() {
        // Saltar al otro lado del mástil
        this.player.x = this.flagPoleX + 20;
        this.player.setFlipX(false);
        this.player.body.setAllowGravity(true);
        this.player.play('walk');
        this.flagWalking = true;
    }

    createStairs(startX, steps) {
        // Pirámide de bloques marrones (clásica de Mario)
        for (let s = 0; s < steps; s++) {
            for (let h = 0; h <= s; h++) {
                const x = startX + s * TILE + TILE / 2;
                const y = GROUND_Y - h * TILE - TILE / 2;
                const tile = this.add.image(x, y, 'ground');
                this.physics.add.existing(tile, true);
                this.platforms.add(tile);
            }
        }
    }

    createCastle(gx) {
        const baseY = GROUND_Y;
        const W = 180, H = 160;
        const left = gx - W / 2;
        const right = gx + W / 2;
        const wallColor = 0xc14848;
        const stroke = 0x4a0000;

        // Base (cuerpo principal)
        this.add.rectangle(gx, baseY - H / 2, W, H, wallColor).setStrokeStyle(3, stroke);

        // Almenas superiores (5 dientes)
        for (let i = 0; i < 5; i++) {
            this.add.rectangle(left + 20 + i * 35, baseY - H - 8, 22, 18, wallColor)
                .setStrokeStyle(2, stroke);
        }

        // Dos torres laterales más altas
        const towerW = 36, towerH = 80;
        const tx1 = left + 22, tx2 = right - 22;
        this.add.rectangle(tx1, baseY - H - towerH / 2, towerW, towerH, wallColor)
            .setStrokeStyle(3, stroke);
        this.add.rectangle(tx2, baseY - H - towerH / 2, towerW, towerH, wallColor)
            .setStrokeStyle(3, stroke);
        // Almenas de las torres
        for (let i = 0; i < 2; i++) {
            this.add.rectangle(tx1 - 10 + i * 20, baseY - H - towerH - 6, 14, 12, wallColor)
                .setStrokeStyle(2, stroke);
            this.add.rectangle(tx2 - 10 + i * 20, baseY - H - towerH - 6, 14, 12, wallColor)
                .setStrokeStyle(2, stroke);
        }
        // Ventanas de las torres
        this.add.rectangle(tx1, baseY - H - towerH / 2 + 5, 10, 16, 0x000000);
        this.add.rectangle(tx2, baseY - H - towerH / 2 + 5, 10, 16, 0x000000);

        // Puerta (cuadrada pero con arco simulado por triángulos)
        const doorW = 38, doorH = 56;
        this.add.rectangle(gx, baseY - doorH / 2, doorW, doorH, 0x000000);
        // Cuernos del arco simulados con triángulos negros
        this.add.triangle(gx - doorW / 2, baseY - doorH + 8,
            0, 0, 8, 0, 0, 8, 0x000000);
        this.add.triangle(gx + doorW / 2, baseY - doorH + 8,
            0, 0, -8, 0, 0, 8, 0x000000);
        this.add.rectangle(gx, baseY - doorH / 2, doorW, doorH, 0x000000, 0)
            .setStrokeStyle(3, stroke);

        // Ventanas del cuerpo
        this.add.rectangle(gx - 50, baseY - 110, 16, 22, 0x000000);
        this.add.rectangle(gx + 50, baseY - 110, 16, 22, 0x000000);
        this.add.rectangle(gx, baseY - H + 30, 18, 22, 0x000000);

        // Asta + bandera en torre central (más alta)
        const flagPoleY = baseY - H - towerH - 60;
        this.add.rectangle(gx, flagPoleY + 30, 4, 80, 0xeeeeee);
        this.add.triangle(
            gx + 14, flagPoleY + 12,
            0, 0, 28, 12, 0, 24,
            0xffd54a
        ).setStrokeStyle(2, 0xb37a00);

        // Cartel "META" sobre la puerta
        this.add.text(gx, baseY - doorH - 18, 'META', {
            fontFamily: FONT, fontSize: '14px', color: '#ffd54a',
            stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
    }

    updateHUD() {
        this.scoreText.setText('MONEDAS  ' + String(this.score).padStart(4, '0'));
        this.livesText.setText('VIDAS  ' + this.lives);
    }

    collectCoin(coin) {
        coin.destroy();
        this.score += 10;
        window.SFX.coin();
        this.updateHUD();
    }

    hitBrick(player, brick) {
        const fromBelow = player.body.blocked.up || player.body.touching.up;
        if (!fromBelow || player.y <= brick.y) return;
        if (this.player.powerState === 'small') {
            // Solo bounce visual
            this.tweens.add({ targets: brick, y: brick.y - 4, yoyo: true, duration: 80 });
        } else {
            this.breakBrick(brick);
        }
    }

    breakBrick(brick) {
        const x = brick.x, y = brick.y;
        brick.destroy();
        this.score += 50;
        window.SFX.stomp();
        this.updateHUD();
        // Partículas
        for (let i = 0; i < 6; i++) {
            const c = this.add.image(x, y, 'brick_chunk');
            const vx = Phaser.Math.Between(-180, 180);
            const vy = Phaser.Math.Between(-380, -200);
            this.physics.add.existing(c);
            c.body.setVelocity(vx, vy);
            c.body.setGravityY(800);
            this.time.delayedCall(900, () => c.destroy());
        }
    }

    hitQBlock(player, block) {
        if (block.used) return;
        // El golpe vale si el jugador chocó por debajo del bloque
        const fromBelow = player.body.blocked.up || player.body.touching.up;
        if (fromBelow && player.y > block.y) {
            block.used = true;
            block.setTexture('qblock_used');
            // Pequeño bounce visual
            this.tweens.add({
                targets: block, y: block.y - 6, yoyo: true, duration: 80,
            });

            const type = block.itemType;
            if (type === 'coin') {
                this.score += 20;
                window.SFX.coin();
                this.updateHUD();
                const c = this.add.image(block.x, block.y - 20, 'coin');
                this.tweens.add({
                    targets: c, y: block.y - 60, alpha: 0, duration: 500,
                    onComplete: () => c.destroy(),
                });
            } else {
                // Spawn por encima del bloque (block.y es el centro, alto 32 → top = block.y - 16)
                this.spawnPowerup(block.x, block.y - 16, type);
                window.SFX.coin();
            }
        }
    }

    spawnPowerup(blockX, blockTopY, type) {
        // Empieza oculto detrás del bloque y emerge por encima
        const startY = blockTopY + 16;     // dentro del bloque
        const finalY = blockTopY - 16;     // 16px sobre el bloque
        const item = this.physics.add.sprite(blockX, startY, type);
        item.itemType = type;
        item.setOrigin(0.5, 0.5);
        item.body.setSize(28, 28);
        item.body.setAllowGravity(false);
        item.body.checkCollision.none = true;   // sin chocar mientras emerge
        item.setDepth(0.6);
        this.powerups.add(item);

        this.tweens.add({
            targets: item,
            y: finalY,
            duration: 400,
            onComplete: () => {
                if (!item.body) return;
                item.body.checkCollision.none = false;
                if (type === 'mushroom') {
                    item.body.setAllowGravity(true);
                    item.setBounce(0, 0);
                    item.dir = 1;
                    item.update = () => {
                        if (item.body.blocked.left) item.dir = 1;
                        if (item.body.blocked.right) item.dir = -1;
                        item.setVelocityX(80 * item.dir);
                    };
                } else if (type === 'star') {
                    item.body.setAllowGravity(true);
                    item.setBounce(1, 0.6);
                    item.setVelocity(120, -350);
                    item.dir = 1;
                    item.update = () => {
                        if (item.body.blocked.left) item.dir = 1;
                        if (item.body.blocked.right) item.dir = -1;
                        item.setVelocityX(150 * item.dir);
                    };
                } else if (type === 'fireflower') {
                    item.body.setAllowGravity(false);
                    item.body.setVelocity(0, 0);
                    item.update = () => {};
                }
            },
        });
    }

    collectPowerup(item) {
        const type = item.itemType;
        item.destroy();
        window.SFX.coin();
        this.score += 100;

        if (type === 'mushroom') {
            if (this.player.powerState === 'small') {
                this.player.powerState = 'big';
                this.player.applyScale();
            } else {
                this.score += 200;
            }
        } else if (type === 'fireflower') {
            this.player.powerState = 'fire';
            this.player.applyScale();
            this.player.setTint(0xff8844);
        } else if (type === 'star') {
            this.player.starUntil = this.time.now + STAR_DURATION;
            window.SFX.win();
        }
        this.updateHUD();
    }

    shootFireball() {
        if (this.player.powerState !== 'fire') return;
        if (this.fireballs.getChildren().length >= 3) return;
        const dir = this.player.flipX ? -1 : 1;
        const fb = this.physics.add.sprite(
            this.player.x + 20 * dir,
            this.player.y - 40,
            'fireball'
        );
        this.fireballs.add(fb);
        fb.body.setSize(14, 14);
        fb.body.setAllowGravity(true);
        fb.body.setGravityY(-900);   // contrarresta parte de la gravedad global (1500-900=600)
        fb.setVelocity(500 * dir, -50);
        fb.setBounce(1, 0.9);        // rebota horizontal y vertical
        this.time.delayedCall(2000, () => fb && fb.destroy());
        window.SFX.jump();
    }

    fireballHitEnemy(fb, enemy) {
        if (!enemy.alive) return;
        fb.destroy();
        this.killEnemy(enemy, true);
    }

    killEnemy(enemy, fromSide = false) {
        enemy.alive = false;
        enemy.body.enable = false;
        this.score += 50;
        window.SFX.stomp();
        this.tweens.add({
            targets: enemy,
            scaleY: fromSide ? 0.2 : 0.2,
            angle: fromSide ? 180 : 0,
            alpha: 0,
            duration: 400,
            onComplete: () => enemy.destroy(),
        });
        this.updateHUD();
    }

    touchEnemy(player, enemy) {
        if (!enemy.alive || this.gameOver) return;
        // Estrella: barre todo
        if (this.time.now < this.player.starUntil) {
            this.killEnemy(enemy, true);
            return;
        }
        // Caparazón deslizándose siempre hace daño
        if (enemy.kind === 'koopa' && enemy.state === 'sliding') {
            if (this.invulnerable) return;
            this.takeHit();
            return;
        }
        // Caer sobre enemigo
        const stomped = player.body.velocity.y > 50 && player.y < enemy.y - 10;
        if (stomped) {
            if (enemy.kind === 'koopa') {
                if (enemy.state === 'walk') {
                    enemy.state = 'shell';
                    enemy.setTexture('shell');
                    enemy.body.setSize(32, 24).setOffset(2, 4);
                    enemy.setVelocityX(0);
                    this.score += 50;
                    window.SFX.stomp();
                } else if (enemy.state === 'shell') {
                    // Patear: dirección según lado del jugador
                    enemy.state = 'sliding';
                    enemy.dir = player.x < enemy.x ? 1 : -1;
                    enemy.setVelocityX(360 * enemy.dir);
                    window.SFX.stomp();
                }
                player.setVelocityY(JUMP_VELOCITY * 0.6);
                this.updateHUD();
            } else {
                this.killEnemy(enemy, false);
                player.setVelocityY(JUMP_VELOCITY * 0.6);
            }
            return;
        }
        // Tocar caparazón parado por el lado: lo pateas
        if (enemy.kind === 'koopa' && enemy.state === 'shell') {
            enemy.state = 'sliding';
            enemy.dir = player.x < enemy.x ? 1 : -1;
            enemy.setVelocityX(360 * enemy.dir);
            window.SFX.stomp();
            return;
        }
        if (this.invulnerable) return;
        this.takeHit();
    }

    enemyVsEnemy(a, b) {
        const slidingA = a.kind === 'koopa' && a.state === 'sliding';
        const slidingB = b.kind === 'koopa' && b.state === 'sliding';
        if (slidingA && b.alive && !slidingB) {
            this.killEnemy(b, true);
        } else if (slidingB && a.alive && !slidingA) {
            this.killEnemy(a, true);
        }
    }

    takeHit() {
        // Si tienes power-up, lo pierdes en vez de morir
        if (this.player.powerState === 'fire') {
            this.player.powerState = 'big';
            this.player.applyScale();
            this.player.clearTint();
            this.startInvulnerable();
            window.SFX.hurt();
            return;
        }
        if (this.player.powerState === 'big') {
            this.player.powerState = 'small';
            this.player.applyScale();
            this.startInvulnerable();
            window.SFX.hurt();
            return;
        }
        // small → pierdes vida
        this.lives -= 1;
        this.updateHUD();
        window.SFX.hurt();
        if (this.lives <= 0) {
            this.die();
        } else {
            this.startInvulnerable();
            this.player.setVelocityY(-300);
        }
    }

    startInvulnerable() {
        this.invulnerable = true;
        this.tweens.add({
            targets: this.player,
            alpha: 0.3,
            yoyo: true,
            repeat: 8,
            duration: 100,
            onComplete: () => {
                this.player.setAlpha(1);
                this.invulnerable = false;
            },
        });
    }

    die() {
        this.gameOver = true;
        this.player.setTint(0xff5555);
        this.player.play('hurt', true);
        this.player.setVelocity(0, -350);
        this.player.body.checkCollision.none = true;
        window.SFX.hurt();
        this.msgText.setText('GAME OVER');
        this.time.delayedCall(1800, () => {
            this.scene.start('Title');
        });
    }

    win() {
        if (this.won) return;
        this.won = true;
        this.player.setVelocity(0, 0);
        this.player.play('idle', true);
        window.SFX.win();
        const next = this.levelIndex + 1;
        if (next >= window.LEVELS.length) {
            this.msgText.setText('¡GANASTE EL JUEGO!');
            this.time.delayedCall(3000, () => this.scene.start('Title'));
        } else {
            this.msgText.setText('NIVEL ' + this.level.name + ' COMPLETO');
            this.time.delayedCall(2000, () => {
                this.scene.start('Game', {
                    levelIndex: next,
                    lives: this.lives,
                    score: this.score,
                });
            });
        }
    }

    update() {
        if (this.gameOver || this.won) return;
        if (this.warping) return;

        // Secuencia automática del mástil → castillo
        if (this.flagTouched) {
            if (this.flagWalking) {
                this.player.setVelocityX(MOVE_SPEED * 0.7);
                this.player.play('walk', true);
            }
            return;
        }

        // Patrullaje de enemigos
        this.enemies.getChildren().forEach(e => {
            if (!e.alive) return;
            if (e.kind === 'koopa' && e.state === 'shell') {
                e.setVelocityX(0);
                return;
            }
            if (e.kind === 'koopa' && e.state === 'sliding') {
                // El caparazón sigue en su dirección, rebota en paredes
                if (e.body.blocked.left)  e.dir = 1;
                if (e.body.blocked.right) e.dir = -1;
                e.setVelocityX(360 * e.dir);
                return;
            }
            e.setVelocityX(e.speed * e.dir);
            if (e.x <= e.minX || e.body.blocked.left)  e.dir = 1;
            if (e.x >= e.maxX || e.body.blocked.right) e.dir = -1;
            e.setFlipX(e.dir > 0);
        });

        // Power-ups con movimiento (champiñón, estrella)
        this.powerups.getChildren().forEach(it => {
            if (it.update) it.update();
        });

        // Estrella: efecto arcoíris
        if (this.time.now < this.player.starUntil) {
            const tints = [0xff5555, 0xffaa00, 0xffee00, 0x55ff55, 0x55aaff, 0xaa55ff];
            this.player.setTint(tints[Math.floor(this.time.now / 80) % tints.length]);
        } else if (this.player.powerState === 'fire') {
            this.player.setTint(0xff8844);
        } else if (!this.invulnerable) {
            this.player.clearTint();
        }

        const onFloor = this.player.body.blocked.down || this.player.body.touching.down;
        const left  = this.cursors.left.isDown  || this.touchInput.left;
        const right = this.cursors.right.isDown || this.touchInput.right;
        const down  = this.cursors.down.isDown  || this.touchInput.down;
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                            Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                            this.touchInput.jumpPressed;
        const firePressed = Phaser.Input.Keyboard.JustDown(this.fireKey) ||
                            this.touchInput.firePressed;
        // consumir oneshots
        this.touchInput.jumpPressed = false;
        this.touchInput.firePressed = false;

        // Disparar
        if (firePressed) this.shootFireball();

        if (down && onFloor) {
            // Agachado: puedes caminar lento manteniendo la pose
            if (left) {
                this.player.setVelocityX(-MOVE_SPEED * 0.5);
                this.player.setFlipX(true);
            } else if (right) {
                this.player.setVelocityX(MOVE_SPEED * 0.5);
                this.player.setFlipX(false);
            } else {
                this.player.setVelocityX(0);
            }
            this.player.play('crouch', true);
        } else if (left) {
            this.player.setVelocityX(-MOVE_SPEED);
            this.player.setFlipX(true);
            if (onFloor) this.player.play('walk', true);
        } else if (right) {
            this.player.setVelocityX(MOVE_SPEED);
            this.player.setFlipX(false);
            if (onFloor) this.player.play('walk', true);
        } else {
            this.player.setVelocityX(0);
            if (onFloor) this.player.play('idle', true);
        }

        // Reset doble salto al estar firmemente en el suelo
        if (onFloor && !jumpPressed) this.canDoubleJump = false;

        if (jumpPressed) {
            if (onFloor) {
                this.player.setVelocityY(JUMP_VELOCITY);
                this.player.play('jump', true);
                this.canDoubleJump = true;
                window.SFX.jump();
            } else if (this.canDoubleJump) {
                this.player.setVelocityY(DOUBLE_JUMP_VELOCITY);
                this.player.play('jump', true);
                this.canDoubleJump = false;
                window.SFX.jump();
                // Anillo visual en los pies
                const ring = this.add.circle(this.player.x, this.player.y, 12, 0xffffff, 0)
                    .setStrokeStyle(3, 0xffffff);
                this.tweens.add({
                    targets: ring,
                    scale: 2.5,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => ring.destroy(),
                });
            }
        }

        if (!onFloor) this.player.play('jump', true);

        // Detección de warp pipe (entrada y salida)
        const onWarpEntry = this.warpPipeX != null &&
            Math.abs(this.player.x - this.warpPipeX) < 22 &&
            Math.abs(this.player.y - (this.warpPipeTopY + 12)) < 16 &&
            onFloor && !this.inBonus;
        const onWarpExit  = this.bonusExitX != null &&
            Math.abs(this.player.x - this.bonusExitX) < 22 &&
            Math.abs(this.player.y - (this.bonusExitTopY + 12)) < 16 &&
            onFloor && this.inBonus;

        if (down && onWarpEntry) this.warpToBonus();
        else if (down && onWarpExit) this.warpFromBonus();

        // Caída al vacío => muerte directa (excepto en zona bonus)
        if (!this.inBonus && this.player.y > GAME_H + 60 && !this.gameOver) this.die();
        if (this.inBonus && this.player.y > 1100 && !this.gameOver) this.die();
    }

    warpToBonus() {
        if (this.inBonus || this.warping) return;
        this.warping = true;
        window.SFX.coin();
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Cambiar bounds y fondo de la cámara a la zona bonus
            this.cameras.main.setBounds(0, 540, this.level.width, 560);
            this.cameras.main.setBackgroundColor('#0a0a18');
            this.player.x = this.bonusSpawnX;
            this.player.y = this.bonusGroundY;
            this.player.setVelocity(0, 0);
            this.inBonus = true;
            this.warping = false;
            this.cameras.main.fadeIn(250, 0, 0, 0);
        });
    }

    warpFromBonus() {
        if (!this.inBonus || this.warping) return;
        this.warping = true;
        window.SFX.coin();
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Restaurar bounds y fondo de la cámara al área normal
            this.cameras.main.setBounds(0, 0, this.level.width, GAME_H);
            this.cameras.main.setBackgroundColor(this.level.bgColor);
            this.player.x = this.bonusEntryReturnX;
            this.player.y = GROUND_Y - 30;
            this.player.setVelocity(0, 0);
            this.inBonus = false;
            this.warping = false;
            this.cameras.main.fadeIn(250, 0, 0, 0);
        });
    }
}

// ─────────────────────────────────────────────── CONFIG ───
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_W,
    height: GAME_H,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,           // escala manteniendo proporción
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: GRAVITY }, debug: false },
    },
    scene: [BootScene, TitleScene, GameScene],
};

new Phaser.Game(config);
