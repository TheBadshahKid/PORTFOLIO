import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import './Projects.css';

const PROJECTS = [
    {
        title: 'STREAMIFY',
        tagline: 'Full-Stack Music Platform',
        description: 'Engineered a music streaming platform with secure Clerk authentication, RESTful APIs in Node.js + Express, and real-time collaborative listening via Socket.IO. Built a responsive, component-driven UI with React, TypeScript, and Tailwind CSS.',
        tags: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'MongoDB', 'Socket.IO'],
        github: 'https://github.com/TheBadshahKid/STREAMIFY',
        live: '#',
        icon: '🎵',
    },
    {
        title: 'Real-Time Bidding Platform',
        tagline: 'Live Auction Engine',
        description: 'Architected a real-time auction system with instant WebSocket-driven bid propagation, live price tracking, and seamless user interactions across concurrent sessions.',
        tags: ['React', 'JavaScript', 'Node.js', 'Express', 'Socket.IO'],
        github: '#',
        live: '#',
        icon: '🏛️',
    },
    {
        title: 'Automated Report Distribution',
        tagline: 'Serverless Data Pipeline',
        description: 'Designed a serverless AWS pipeline automating agent-wise CSV report distribution via email. Processed large-scale datasets with EMR + S3, orchestrated through Lambda, SES, SQS, and CloudWatch.',
        tags: ['AWS', 'Lambda', 'S3', 'SES', 'SQS', 'Python', 'Boto3'],
        github: '#',
        live: '#',
        icon: '📊',
    },
    {
        title: 'Autonomous AI Agent',
        tagline: 'Multi-Step Reasoning Engine',
        description: 'Built an autonomous AI agent using LangChain with Llama 3.2, capable of reasoning, planning, and executing complex multi-step tasks with integrated tool-use capabilities.',
        tags: ['Python', 'LangChain', 'Llama 3.2', 'AI'],
        github: 'https://github.com/TheBadshahKid/Autonomous-AI-Agent-with-LangChain',
        live: '#',
        icon: '🤖',
    },
    {
        title: 'DEV TINDER',
        tagline: 'Developer Matching Platform',
        description: 'Created a developer matching platform connecting engineers by skills, interests, and project ideas. Full-stack MERN application with swipe-based discovery and real-time matching.',
        tags: ['React', 'Node.js', 'Express', 'MongoDB'],
        github: 'https://github.com/TheBadshahKid/DEV_TINDER',
        live: '#',
        icon: '💻',
    },
    {
        title: 'Field Force Tracker',
        tagline: 'Location Intelligence Tool',
        description: 'Built a location-aware field force management tool with real-time distance calculation, daily summary reports, and geofencing capabilities for operational oversight.',
        tags: ['React', 'Node.js', 'SQLite', 'Maps API'],
        github: 'https://github.com/TheBadshahKid/unolo-field-force-tracker',
        live: '#',
        icon: '📍',
    },
];

export default function Projects() {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = (dir) => {
        setDirection(dir);
        setCurrentPage(prev => {
            const next = prev + dir;
            if (next < 0) return PROJECTS.length - 1;
            if (next >= PROJECTS.length) return 0;
            return next;
        });
    };

    const project = PROJECTS[currentPage];

    const variants = {
        enter: (dir) => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0 }),
        center: { rotateY: 0, opacity: 1 },
        exit: (dir) => ({ rotateY: dir > 0 ? -90 : 90, opacity: 0 }),
    };

    return (
        <section id="projects" className="section projects">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="section-title">
                    <p className="section-chapter">CHAPTER IV</p>
                    <span className="golden-text">The Portfolio</span>
                    <p className="section-subtitle">Projects that define my craft</p>
                </h2>
            </motion.div>

            <div className="projects__book">
                <button className="projects__nav projects__nav--prev" onClick={() => paginate(-1)}>
                    ◄
                </button>

                <div className="projects__page-container">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentPage}
                            className="projects__page"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <div className="projects__page-inner">
                                <div className="projects__page-header">
                                    <span className="projects__page-icon">{project.icon}</span>
                                    <div>
                                        <h3 className="projects__page-title">{project.title}</h3>
                                        <p className="projects__page-spell">{project.tagline}</p>
                                    </div>
                                </div>

                                <p className="projects__page-desc">{project.description}</p>

                                <div className="projects__page-tags">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="projects__tag">{tag}</span>
                                    ))}
                                </div>

                                <div className="projects__page-links">
                                    {project.github !== '#' && (
                                        <a href={project.github} className="projects__link" target="_blank" rel="noopener noreferrer">
                                            <FiGithub /> Code
                                        </a>
                                    )}
                                    {project.live !== '#' && (
                                        <a href={project.live} className="projects__link projects__link--primary" target="_blank" rel="noopener noreferrer">
                                            <FiExternalLink /> Live Demo
                                        </a>
                                    )}
                                    {project.github === '#' && project.live === '#' && (
                                        <span className="projects__tag" style={{ opacity: 0.5 }}>Internal / Private Project</span>
                                    )}
                                </div>
                            </div>

                            <div className="projects__page-number">
                                {currentPage + 1} / {PROJECTS.length}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button className="projects__nav projects__nav--next" onClick={() => paginate(1)}>
                    ►
                </button>
            </div>

            {/* Page dots */}
            <div className="projects__dots">
                {PROJECTS.map((_, i) => (
                    <button
                        key={i}
                        className={`projects__dot ${i === currentPage ? 'projects__dot--active' : ''}`}
                        onClick={() => { setDirection(i > currentPage ? 1 : -1); setCurrentPage(i); }}
                    />
                ))}
            </div>
        </section>
    );
}
