import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import './Achievements.css';

const ACHIEVEMENTS = [
    {
        title: 'CodeRush 2024 — 18th Rank',
        description: 'Competed against top programmers at IIIT Ranchi\'s flagship coding event by AlgoUniversity, finishing in the top 18',
        icon: '🏆',
        count: '18th',
        label: 'Rank',
    },
    {
        title: 'CodeChef 3-Star Coder',
        description: 'Earned 3-star rating on CodeChef with Global Rank 36 in CodeChef Starters 142',
        icon: '⭐',
        count: '3★',
        label: 'CodeChef',
    },
    {
        title: 'Algorithmic Problem Solving',
        description: 'Solved 1000+ problems across LeetCode, GeeksforGeeks, and CodeChef — building deep expertise in data structures and algorithms',
        icon: '🧩',
        count: '1000+',
        label: 'Problems',
    },
    {
        title: 'Projects Delivered',
        description: 'Designed, built, and shipped 25+ full-stack applications — from music platforms to autonomous AI agents',
        icon: '🚀',
        count: '25+',
        label: 'Projects',
    },
    {
        title: 'Vice President — Student Council',
        description: 'Leading student governance at IIIT Ranchi — driving initiatives, cross-club collaborations, and campus development',
        icon: '🎓',
        count: 'VP',
        label: 'Student Council',
    },
    {
        title: 'Head — Literary Club',
        description: 'Spearheading the Literary Club — organizing competitions, workshops, and inter-college literary events',
        icon: '📚',
        count: 'Head',
        label: 'Literary Club',
    },
];

function AnimatedCounter({ target, label }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <div ref={ref} className="achievements__counter">
            <motion.span
                className="achievements__counter-num"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
            >
                {inView ? target : '0'}
            </motion.span>
            <span className="achievements__counter-label">{label}</span>
        </div>
    );
}

export default function Achievements() {
    return (
        <section id="achievements" className="section achievements">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="section-title">
                    <p className="section-chapter">CHAPTER V</p>
                    <span className="golden-text">The Milestones</span>
                    <p className="section-subtitle">A record of growth and achievement</p>
                </h2>
            </motion.div>

            <div className="achievements__grid">
                {ACHIEVEMENTS.map((item, i) => (
                    <motion.div
                        key={item.title}
                        className="achievements__card glass-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        whileHover={{ y: -8 }}
                    >
                        <div className="achievements__card-glow" />
                        <div className="achievements__icon">{item.icon}</div>
                        <AnimatedCounter target={item.count} label={item.label} />
                        <h3 className="achievements__title">{item.title}</h3>
                        <p className="achievements__desc">{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
