/* Sonidos proceduales con Web Audio — sin archivos */
class SFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    _ensure() {
        if (!this.ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AC();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    _tone(freq, dur, type = 'square', vol = 0.15, attack = 0.005, release = 0.05, freqEnd = null) {
        if (this.muted) return;
        this._ensure();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (freqEnd !== null) {
            osc.frequency.linearRampToValueAtTime(freqEnd, now + dur);
        }
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + attack);
        gain.gain.linearRampToValueAtTime(0, now + dur + release);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + release + 0.02);
    }

    jump()  { this._tone(523, 0.08, 'square', 0.12, 0.005, 0.05, 880); }
    coin()  {
        this._tone(988, 0.05, 'square', 0.12);
        setTimeout(() => this._tone(1318, 0.10, 'square', 0.12), 50);
    }
    stomp() { this._tone(180, 0.10, 'square', 0.18, 0.005, 0.08, 80); }
    hurt()  {
        this._tone(440, 0.10, 'sawtooth', 0.18, 0.005, 0.10, 110);
        setTimeout(() => this._tone(220, 0.18, 'sawtooth', 0.18, 0.005, 0.15, 60), 100);
    }
    win() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((n, i) => setTimeout(() => this._tone(n, 0.12, 'square', 0.15), i * 110));
    }
    select() { this._tone(660, 0.06, 'square', 0.10); }
}

window.SFX = new SFX();
