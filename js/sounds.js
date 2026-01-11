// ============================================
// SISTEMA DE SONIDOS - USING WEB AUDIO API
// ============================================

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.isMuted = false;
        this.soundsEnabled = localStorage.getItem('soundsEnabled') !== 'false';
        
        // Initialize Audio Context on first user interaction
        document.addEventListener('click', () => this.initAudioContext(), { once: true });
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playSound(type = 'success') {
        if (!this.soundsEnabled || !this.audioContext) return;

        try {
            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            oscillator.connect(gain);
            gain.connect(this.audioContext.destination);

            switch (type) {
                case 'success':
                    this.playSuccessSound(oscillator, gain, now);
                    break;
                case 'error':
                    this.playErrorSound(oscillator, gain, now);
                    break;
                case 'levelStart':
                    this.playLevelStartSound(oscillator, gain, now);
                    break;
                case 'buttonClick':
                    this.playButtonClickSound(oscillator, gain, now);
                    break;
                case 'finish':
                    this.playFinishSound(oscillator, gain, now);
                    break;
                default:
                    this.playDefaultSound(oscillator, gain, now);
            }
        } catch (e) {
            console.log('Audio error:', e);
        }
    }

    playSuccessSound(oscillator, gain, now) {
        // Two-tone success sound: ascending notes
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    playErrorSound(oscillator, gain, now) {
        // Error sound: descending tones
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.setValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    playLevelStartSound(oscillator, gain, now) {
        // Level start: bright ascending arpeggio
        const notes = [
            { freq: 523.25, time: 0 },      // C5
            { freq: 659.25, time: 0.1 },    // E5
            { freq: 783.99, time: 0.2 }     // G5
        ];

        notes.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const g = this.audioContext.createGain();
            osc.connect(g);
            g.connect(this.audioContext.destination);
            osc.frequency.setValueAtTime(note.freq, now + note.time);
            g.gain.setValueAtTime(0.2, now + note.time);
            g.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.2);
            osc.start(now + note.time);
            osc.stop(now + note.time + 0.2);
        });
    }

    playButtonClickSound(oscillator, gain, now) {
        // Soft click sound
        oscillator.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    playFinishSound(oscillator, gain, now) {
        // Finish/victory sound: triumphant chord
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const g = this.audioContext.createGain();
            osc.connect(g);
            g.connect(this.audioContext.destination);
            osc.frequency.setValueAtTime(freq, now);
            g.gain.setValueAtTime(0.15, now);
            g.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        });
    }

    playDefaultSound(oscillator, gain, now) {
        // Default: simple beep
        oscillator.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    toggleSound() {
        this.soundsEnabled = !this.soundsEnabled;
        localStorage.setItem('soundsEnabled', this.soundsEnabled);
        return this.soundsEnabled;
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();
