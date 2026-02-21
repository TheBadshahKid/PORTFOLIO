import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

/**
 * Lightweight magical particle background.
 * - Low particle count (35) for performance
 * - Gentle mouse repel for subtle interactivity
 * - Soft golden dust with slow drift & twinkle
 * - detectRetina for crisp rendering
 */
export default function ParticleBackground() {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const options = useMemo(() => ({
        fullScreen: { enable: true, zIndex: 0 },
        fpsLimit: isMobile ? 30 : 60,
        particles: {
            color: { value: ['#c9a84c', '#ffd700', '#8b6914', '#ffe07a'] },
            links: { enable: false },
            move: {
                enable: true,
                speed: { min: 0.15, max: 0.5 },
                direction: 'none',
                random: true,
                straight: false,
                outModes: { default: 'out' },
                attract: { enable: false },
            },
            number: {
                value: isMobile ? 18 : 35,
                density: { enable: true, width: 1400, height: 900 },
            },
            opacity: {
                value: { min: 0.05, max: 0.35 },
                animation: {
                    enable: true,
                    speed: 0.4,
                    minimumValue: 0.05,
                    sync: false,
                },
            },
            shape: { type: ['circle', 'star'] },
            size: {
                value: { min: 0.8, max: 2.5 },
                animation: {
                    enable: true,
                    speed: 0.8,
                    minimumValue: 0.5,
                    sync: false,
                },
            },
            shadow: {
                enable: true,
                color: '#c9a84c',
                blur: 4,
            },
            wobble: {
                enable: true,
                distance: 8,
                speed: { min: -1, max: 1 },
            },
        },
        interactivity: {
            events: {
                onHover: { enable: true, mode: 'repulse' },
                resize: { enable: true },
            },
            modes: {
                repulse: {
                    distance: 80,
                    duration: 0.6,
                    speed: 0.3,
                    factor: 2,
                    maxSpeed: 1.5,
                },
            },
        },
        detectRetina: true,
        smooth: true,
    }), []);

    return <Particles id="magical-particles" init={particlesInit} options={options} />;
}
