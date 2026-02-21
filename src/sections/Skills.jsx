import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

const SKILLS = [
    { name: 'C++', level: 88, x: '12%', y: '18%', category: 'language' },
    { name: 'JavaScript', level: 90, x: '40%', y: '14%', category: 'language' },
    { name: 'Python', level: 82, x: '72%', y: '16%', category: 'language' },
    { name: 'TypeScript', level: 84, x: '25%', y: '36%', category: 'language' },
    { name: 'SQL', level: 78, x: '58%', y: '32%', category: 'language' },
    { name: 'React.js', level: 90, x: '10%', y: '55%', category: 'frontend' },
    { name: 'Next.js', level: 80, x: '35%', y: '52%', category: 'frontend' },
    { name: 'Tailwind CSS', level: 88, x: '60%', y: '50%', category: 'frontend' },
    { name: 'ShadCN', level: 78, x: '83%', y: '35%', category: 'frontend' },
    { name: 'Redux', level: 76, x: '85%', y: '55%', category: 'frontend' },
    { name: 'Node.js', level: 86, x: '15%', y: '75%', category: 'backend' },
    { name: 'Express.js', level: 85, x: '42%', y: '72%', category: 'backend' },
    { name: 'Firebase', level: 75, x: '68%', y: '70%', category: 'backend' },
    { name: 'MongoDB', level: 80, x: '28%', y: '88%', category: 'database' },
    { name: 'MySQL', level: 78, x: '55%', y: '88%', category: 'database' },
    { name: 'AWS (S3/EC2)', level: 78, x: '78%', y: '82%', category: 'cloud' },
    { name: 'Git/GitHub', level: 88, x: '88%', y: '18%', category: 'tool' },
    { name: 'Docker', level: 70, x: '80%', y: '68%', category: 'tool' },
];

const CATEGORY_COLORS = {
    language: '#c9a84c',
    frontend: '#4ecdc4',
    backend: '#ff6b6b',
    database: '#a29bfe',
    cloud: '#fd79a8',
    tool: '#74b9ff',
};

export default function Skills() {
    return (
        <section id="skills" className="section skills">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="section-title">
                    <p className="section-chapter">CHAPTER III</p>
                    <span className="golden-text">The Arsenal</span>
                    <p className="section-subtitle">Technologies I command with confidence</p>
                </h2>
            </motion.div>

            {/* Legend */}
            <div className="skills__legend">
                {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                    <div key={cat} className="skills__legend-item">
                        <span className="skills__legend-dot" style={{ background: color }} />
                        <span>{cat}</span>
                    </div>
                ))}
            </div>

            {/* Map */}
            <div className="skills__map">
                {/* Decorative paths */}
                <svg className="skills__paths" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M12,18 Q25,25 40,14" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M40,14 Q55,20 72,16" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M25,36 Q40,42 58,32" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M10,55 Q25,60 42,72" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M28,88 Q40,85 55,88" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M60,50 Q75,58 80,68" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                </svg>

                {SKILLS.map((skill, i) => (
                    <motion.div
                        key={skill.name}
                        className="skills__node"
                        style={{ left: skill.x, top: skill.y }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                    >
                        <div
                            className="skills__node-dot"
                            style={{
                                background: CATEGORY_COLORS[skill.category],
                                boxShadow: `0 0 12px ${CATEGORY_COLORS[skill.category]}40`,
                            }}
                        />
                        <div className="skills__node-info">
                            <span className="skills__node-name">{skill.name}</span>
                            <div className="skills__node-bar">
                                <motion.div
                                    className="skills__node-fill"
                                    style={{ background: CATEGORY_COLORS[skill.category] }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.06 + 0.3 }}
                                />
                            </div>
                            <span className="skills__node-level">{skill.level}%</span>
                        </div>

                        {/* Footprint animation */}
                        <div className="skills__footprints">
                            <span className="skills__footprint">👣</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
