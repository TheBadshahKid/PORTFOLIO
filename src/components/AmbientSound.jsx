import { useContext, useEffect, useRef, useCallback } from 'react';
import { SoundContext } from '../App';

/**
 * AmbientSound — Musical ambient soundscape inspired by Hogwarts atmosphere.
 *
 * Layers:
 *  1. Warm evolving pad in E minor (strings-like harmonics)
 *  2. Celesta / music-box melody fragments (pentatonic E minor)
 *  3. Soft shimmer reverb tails (convolution-like delays)
 *
 * All procedural via Web Audio API — no audio files needed.
 * Default muted. Very low volume. Smooth fade transitions.
 */

// E minor pentatonic scale frequencies across octaves (magical, Harry Potter-esque)
const CELESTA_NOTES = [
    329.63, // E4
    392.00, // G4
    440.00, // A4
    493.88, // B4
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    987.77, // B5
];

// Pad chord: E minor 7 (E, G, B, D) spread across low octaves
const PAD_FREQUENCIES = [
    82.41,  // E2
    123.47, // B2
    164.81, // E3
    196.00, // G3
    246.94, // B3
    293.66, // D4
];

export default function AmbientSound() {
    const { soundEnabled } = useContext(SoundContext);
    const audioCtxRef = useRef(null);
    const masterGainRef = useRef(null);
    const nodesRef = useRef([]);
    const timersRef = useRef([]);
    const isRunning = useRef(false);

    const MASTER_VOLUME = 0.06;
    const FADE_DURATION = 2.0;

    /* ---- Create a single celesta "bell" note ---- */
    const playBellNote = useCallback((ctx, destination, freq, startTime, duration = 3.0) => {
        // Bell = sine fundamental + quiet overtones at non-integer ratios
        const harmonics = [
            { ratio: 1, gain: 0.3 },
            { ratio: 2.0, gain: 0.15 },
            { ratio: 3.0, gain: 0.05 },
            { ratio: 5.04, gain: 0.03 },  // Inharmonic — creates bell character
        ];

        harmonics.forEach(h => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq * h.ratio;

            const env = ctx.createGain();
            env.gain.setValueAtTime(0, startTime);
            // Quick attack
            env.gain.linearRampToValueAtTime(h.gain, startTime + 0.02);
            // Slow exponential decay (bell-like)
            env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(env);
            env.connect(destination);
            osc.start(startTime);
            osc.stop(startTime + duration + 0.1);
        });
    }, []);

    const createAmbience = useCallback(() => {
        if (isRunning.current) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // ---- Master gain with fade-in ----
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, ctx.currentTime);
        master.gain.linearRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + FADE_DURATION);
        master.connect(ctx.destination);
        masterGainRef.current = master;

        // ---- Reverb-like effect using feedback delay ----
        const delay1 = ctx.createDelay();
        delay1.delayTime.value = 0.37;
        const delay2 = ctx.createDelay();
        delay2.delayTime.value = 0.53;

        const feedback1 = ctx.createGain();
        feedback1.gain.value = 0.3;
        const feedback2 = ctx.createGain();
        feedback2.gain.value = 0.25;

        const reverbFilter = ctx.createBiquadFilter();
        reverbFilter.type = 'lowpass';
        reverbFilter.frequency.value = 2500;

        const wetGain = ctx.createGain();
        wetGain.gain.value = 0.4;

        // Send → delay1 → feedback → delay2 → feedback → filter → wet → master
        const reverbSend = ctx.createGain();
        reverbSend.gain.value = 1;
        reverbSend.connect(delay1);
        delay1.connect(feedback1);
        feedback1.connect(delay2);
        delay2.connect(feedback2);
        feedback2.connect(delay1); // Feedback loop
        delay1.connect(reverbFilter);
        delay2.connect(reverbFilter);
        reverbFilter.connect(wetGain);
        wetGain.connect(master);

        // Dry bus (notes go here + into reverb send)
        const dryBus = ctx.createGain();
        dryBus.gain.value = 0.6;
        dryBus.connect(master);
        dryBus.connect(reverbSend);

        // ---- 1. Warm Pad (evolving drone) ----
        const padGain = ctx.createGain();
        padGain.gain.value = 0.12;

        const padFilter = ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.value = 300;
        padFilter.Q.value = 0.7;

        // Slowly modulate filter for evolving texture
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.08; // Very slow
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 120;
        lfo.connect(lfoGain);
        lfoGain.connect(padFilter.frequency);
        lfo.start();
        nodesRef.current.push(lfo);

        padFilter.connect(padGain);
        padGain.connect(master);

        PAD_FREQUENCIES.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            // Alternate between sine and triangle for warmth
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;
            // Slight detuning for chorus effect
            osc.detune.value = (Math.random() - 0.5) * 6;
            osc.connect(padFilter);
            osc.start();
            nodesRef.current.push(osc);
        });

        // ---- 2. Celesta Melody Fragments ----
        const playMelodyFragment = () => {
            if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

            // Pick 2-4 random notes from the scale
            const noteCount = 2 + Math.floor(Math.random() * 3);
            const startTime = ctx.currentTime;

            for (let i = 0; i < noteCount; i++) {
                const note = CELESTA_NOTES[Math.floor(Math.random() * CELESTA_NOTES.length)];
                const noteTime = startTime + i * (0.4 + Math.random() * 0.6);
                const duration = 2.5 + Math.random() * 2;
                playBellNote(ctx, dryBus, note, noteTime, duration);
            }
        };

        // Play melody fragments every 4-10 seconds
        const scheduleMelody = () => {
            const delay = 4000 + Math.random() * 6000;
            const timer = setTimeout(() => {
                playMelodyFragment();
                scheduleMelody();
            }, delay);
            timersRef.current.push(timer);
        };

        // Start after a short initial delay
        const initTimer = setTimeout(() => {
            playMelodyFragment();
            scheduleMelody();
        }, 1500);
        timersRef.current.push(initTimer);

        // ---- 3. Soft wind shimmer (very gentle filtered noise) ----
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        // Smoother noise: average multiple random samples
        for (let i = 0; i < bufferSize; i++) {
            data[i] = ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * 0.3;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 600;
        noiseFilter.Q.value = 0.3;

        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.04; // Very quiet — just adds air

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);
        noise.start();
        nodesRef.current.push(noise);

        isRunning.current = true;
    }, [playBellNote]);

    const stopAmbience = useCallback(() => {
        if (!isRunning.current) return;

        // Clear all scheduled timers
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];

        // Fade out
        if (masterGainRef.current && audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            const ctx = audioCtxRef.current;
            const now = ctx.currentTime;
            masterGainRef.current.gain.cancelScheduledValues(now);
            masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
            masterGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_DURATION);

            setTimeout(() => {
                nodesRef.current.forEach(node => {
                    try { node.stop(); } catch (e) { /* already stopped */ }
                });
                nodesRef.current = [];
                try { ctx.close(); } catch (e) { /* already closed */ }
                audioCtxRef.current = null;
                masterGainRef.current = null;
            }, (FADE_DURATION + 0.2) * 1000);
        }

        isRunning.current = false;
    }, []);

    useEffect(() => {
        if (soundEnabled) {
            createAmbience();
        } else {
            stopAmbience();
        }
        return () => stopAmbience();
    }, [soundEnabled, createAmbience, stopAmbience]);

    return null;
}
