import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const LETTER_TEXT = `Dear Visitor,

You have arrived at the portfolio of Saksham — a Computer Science engineer at IIIT Ranchi with a relentless drive for building systems that matter. Currently shaping enterprise technology as an IT Trainee at Care Health Insurance Ltd.

Inside, you will find a body of work spanning full-stack platforms, serverless cloud architectures, autonomous AI agents, and competitive programming excellence — 1000+ problems solved and counting.

Every project here tells a story of ambition meeting execution. Scroll on.

Warmly,

Saksham
Full-Stack Developer & Cloud Engineer`;

export default function Hero() {
    const [phase, setPhase] = useState('bricks'); // bricks → steam → seal → open → letter
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase('steam'), 1500),
            setTimeout(() => setPhase('seal'), 2800),
            setTimeout(() => setPhase('open'), 4200),
            setTimeout(() => setPhase('letter'), 5200),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (phase !== 'letter') return;
        let i = 0;
        const interval = setInterval(() => {
            if (i < LETTER_TEXT.length) {
                setDisplayedText(LETTER_TEXT.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 22);
        return () => clearInterval(interval);
    }, [phase]);

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero" className="hero">
            {/* Platform 9¾ Brick Wall Overlay */}
            <AnimatePresence>
                {(phase === 'bricks' || phase === 'steam') && (
                    <motion.div
                        className="hero__platform"
                        exit={{ opacity: 0, scale: 1.15, filter: 'blur(12px)' }}
                        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="hero__bricks">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div key={i} className="hero__brick" />
                            ))}
                        </div>
                        <motion.div
                            className="hero__platform-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <h2 className="hero__platform-title">Entering the Narrative</h2>
                            <p className="hero__platform-sub">Preparing your experience...</p>
                        </motion.div>

                        {/* Steam particles */}
                        {phase === 'steam' && (
                            <div className="hero__steam">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="hero__steam-puff"
                                        style={{
                                            left: `${10 + Math.random() * 80}%`,
                                            animationDelay: `${Math.random() * 0.8}s`,
                                            animationDuration: `${1 + Math.random()}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="hero__content">
                {/* Chapter Label */}
                <motion.p
                    className="hero__chapter"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 'letter' ? 0.5 : 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    CHAPTER I — The Prologue
                </motion.p>

                {/* Seal Phase */}
                <AnimatePresence>
                    {phase === 'seal' && (
                        <motion.div
                            className="hero__envelope"
                            initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -30 }}
                            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <div className="hero__seal">
                                <div className="hero__seal-wax">
                                    <span>⚡</span>
                                </div>
                                <p className="hero__seal-text">Breaking the seal...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Letter Phase */}
                <AnimatePresence>
                    {(phase === 'open' || phase === 'letter') && (
                        <motion.div
                            className="hero__letter"
                            initial={{ y: 60, opacity: 0, rotateX: -15 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <div className="hero__letter-header">
                                <div className="hero__crest">⚡</div>
                                <h1 className="hero__title">
                                    <span className="golden-text">SAKSHAM</span>
                                    <br />
                                    <span className="hero__title-sub">Engineer · Builder · Leader</span>
                                </h1>
                            </div>

                            <div className="hero__letter-body">
                                <pre className="hero__letter-text">{displayedText}<span className="hero__cursor">|</span></pre>
                            </div>

                            {phase === 'letter' && displayedText.length > 200 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <button className="golden-btn hero__cta" onClick={scrollToAbout}>
                                        Explore My Journey
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="hero__scroll-hint">
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="hero__scroll-arrow"
                >
                    ↓
                </motion.div>
            </div>
        </section>
    );
}
