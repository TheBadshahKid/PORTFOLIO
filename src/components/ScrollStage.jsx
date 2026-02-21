import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Reusable scroll-triggered storytelling wrapper.
 * Each preset provides a unique cinematic entry animation.
 *
 * Presets:
 *  - platform   : Blur dissolve (Hero)
 *  - castle     : Rise from below with fade (About)
 *  - mapUnfold  : Vertical scale reveal (Skills)
 *  - spellbook  : Perspective page-turn (Projects)
 *  - trophyHall : Brightness illuminate (Achievements)
 *  - owlPost    : Fly-in from above (Contact)
 */

const PRESETS = {
    platform: {
        initial: { opacity: 0, scale: 1.05, filter: 'blur(8px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
    },
    castle: {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
    },
    mapUnfold: {
        initial: { opacity: 0, scaleY: 0.4 },
        animate: { opacity: 1, scaleY: 1 },
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
        style: { transformOrigin: 'center top' },
    },
    spellbook: {
        initial: { opacity: 0, rotateY: -30 },
        animate: { opacity: 1, rotateY: 0 },
        transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
        style: { perspective: 1200, transformOrigin: 'left center' },
    },
    trophyHall: {
        initial: { opacity: 0, y: 40, filter: 'brightness(0.3)' },
        animate: { opacity: 1, y: 0, filter: 'brightness(1)' },
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
    owlPost: {
        initial: { opacity: 0, y: -60, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
    },
};

export default function ScrollStage({ preset = 'platform', children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const config = PRESETS[preset] || PRESETS.platform;

    return (
        <motion.div
            ref={ref}
            className={`scroll-stage scroll-stage--${preset} ${className}`}
            initial={config.initial}
            animate={isInView ? config.animate : config.initial}
            transition={{ ...config.transition, delay }}
            style={{
                willChange: 'transform, opacity, filter',
                ...(config.style || {}),
            }}
        >
            {children}
        </motion.div>
    );
}
