import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi';
import './About.css';

const HOUSES = [
    { name: 'Gryffindor', color: '#ae0001', trait: 'Courage & Boldness', emoji: '🦁' },
    { name: 'Ravenclaw', color: '#0e1a40', trait: 'Wisdom & Creativity', emoji: '🦅' },
    { name: 'Slytherin', color: '#1a472a', trait: 'Ambition & Cunning', emoji: '🐍' },
    { name: 'Hufflepuff', color: '#ecb939', trait: 'Dedication & Loyalty', emoji: '🦡' },
];

const DELAY_MS = 2500;

export default function About() {
    const [sorting, setSorting] = useState(false);
    const [sorted, setSorted] = useState(false);
    const [house, setHouse] = useState(null);

    const startSort = () => {
        if (sorting || sorted) return;
        setSorting(true);
        setTimeout(() => {
            const chosen = HOUSES[Math.floor(Math.random() * HOUSES.length)];
            setHouse(chosen);
            setSorting(false);
            setSorted(true);
        }, DELAY_MS);
    };

    const resetSort = () => {
        setSorted(false);
        setHouse(null);
    };

    return (
        <section id="about" className="section about">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="section-title">
                    <p className="section-chapter">CHAPTER II</p>
                    <span className="golden-text">The Origin</span>
                    <p className="section-subtitle">Where ambition meets discipline</p>
                </h2>
            </motion.div>

            <div className="about__grid">
                {/* Sorting Hat */}
                <motion.div
                    className="about__hat-section"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="about__hat-wrapper">
                        <button
                            className={`about__hat ${sorting ? 'about__hat--thinking' : ''} ${sorted ? 'about__hat--done' : ''}`}
                            onClick={startSort}
                            disabled={sorting}
                        >
                            <span className="about__hat-icon">🎩</span>
                        </button>

                        <AnimatePresence mode="wait">
                            {!sorting && !sorted && (
                                <motion.p
                                    key="prompt"
                                    className="about__hat-prompt"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Discover your archetype
                                </motion.p>
                            )}

                            {sorting && (
                                <motion.p
                                    key="thinking"
                                    className="about__hat-thinking"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    "Analyzing your essence..."
                                </motion.p>
                            )}

                            {sorted && house && (
                                <motion.div
                                    key="result"
                                    className="about__house-result"
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                    style={{ '--house-color': house.color }}
                                >
                                    <div className="about__house-emoji">{house.emoji}</div>
                                    <h3 className="about__house-name">{house.name}!</h3>
                                    <p className="about__house-trait">{house.trait}</p>
                                    <button className="about__resort-btn" onClick={resetSort}>Sort Again</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Bio Card */}
                <motion.div
                    className="about__bio glass-card"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="about__bio-header">
                        <div className="about__avatar">⚡</div>
                        <div>
                            <h3>Saksham</h3>
                            <p className="about__bio-role">Full-Stack Developer · IT Trainee @ Care Health Insurance</p>
                        </div>
                    </div>
                    <p className="about__bio-text">
                        Pursuing B.Tech in Computer Science at IIIT Ranchi with a 9.05 CGPA.
                        Currently driving enterprise innovation as an IT Trainee at Care Health Insurance Ltd.,
                        architecting Customer360 — a unified platform consolidating cross-functional customer intelligence.
                    </p>
                    <p className="about__bio-text">
                        Specialized in scalable full-stack systems, serverless AWS pipelines, and real-time architectures.
                        Leading campus initiatives as Vice President of the Student Council and Head of the Literary Club.
                    </p>

                    <div className="about__stats">
                        <div className="about__stat">
                            <span className="about__stat-num">9.05</span>
                            <span className="about__stat-label">CGPA</span>
                        </div>
                        <div className="about__stat">
                            <span className="about__stat-num">1000+</span>
                            <span className="about__stat-label">DSA Problems</span>
                        </div>
                        <div className="about__stat">
                            <span className="about__stat-num">25+</span>
                            <span className="about__stat-label">Projects</span>
                        </div>
                    </div>

                    <div className="about__social-links">
                        <a href="https://github.com/TheBadshahKid" target="_blank" rel="noopener noreferrer" title="GitHub"><FiGithub /></a>
                        <a href="https://www.linkedin.com/in/saksham832005/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><FiLinkedin /></a>
                        <a href="mailto:saksham832005@gmail.com" title="Email"><FiMail /></a>
                    </div>

                    <a
                        href="https://drive.google.com/file/d/1F_ZrX03nQgq6bqeHTVj9vS720NUYzIoJ/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="golden-btn about__resume-btn"
                    >
                        <FiFileText /> View Resume
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
