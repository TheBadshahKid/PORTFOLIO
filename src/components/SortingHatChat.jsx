import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SortingHatChat.css';

/* -------- Knowledge base -------- */
const RESPONSES = {
    greeting: "Welcome. I'm the guide to Saksham's portfolio. Ask me about his skills, projects, experience, or achievements — I'll point you in the right direction.",
    skills: "Saksham commands **C++, JavaScript, Python, React, Node.js, TypeScript, and AWS** with strong proficiency. His toolkit extends to Tailwind CSS, ShadCN, Redux, Express, MongoDB, MySQL, Firebase, and Docker — a comprehensive full-stack arsenal.",
    projects: "Noteworthy work includes **STREAMIFY** (a full-stack music platform with real-time collaboration), a **serverless AWS Report Distribution** pipeline, **Autonomous AI Agents** built with LangChain, a **Real-Time Bidding Platform**, and **DEV TINDER** for developer matching. Six distinct projects, each solving a real problem.",
    experience: "Currently an **IT Trainee at Care Health Insurance Ltd.** in Gurgaon, architecting Customer360 — a unified platform consolidating cross-functional customer intelligence. Backed by 25+ projects across full-stack development, AI, and cloud infrastructure.",
    education: "**B.Tech in Computer Science at IIIT Ranchi** with a **9.05 CGPA**. 92.6% in XII Boards and 97.6% in X Boards — consistent academic excellence from the very start.",
    contact: "Reach Saksham at **saksham832005@gmail.com**, or connect via GitHub (TheBadshahKid) and LinkedIn (saksham832005). Scroll to the Contact section for the full form.",
    house: "With a 9.05 CGPA, leadership as VP of the Student Council, and 1000+ DSA problems solved — Saksham blends **analytical precision** with **strategic ambition** and the **courage to ship**. A rare combination.",
    achievements: "**18th Rank** in CodeRush 2024, **3-star CodeChef** coder (Global Rank 36 in Starters 142), **1000+ DSA** problems solved, **VP of Student Council**, and **Head of Literary Club**. Consistent growth across every front.",
    aws: "Saksham has production experience with **AWS S3, EC2, Lambda, SES, SQS, EMR**, and CloudWatch. He designed a serverless report distribution pipeline processing large-scale datasets with pre-signed URLs and event-driven queuing.",
    frontend: "On the frontend: **React.js, Next.js, TypeScript, Tailwind CSS, ShadCN, and Redux**. He builds responsive, real-time interfaces with Socket.IO for collaborative features — precise, performant, and production-ready.",
    backend: "The backend stack runs on **Node.js, Express.js, Firebase** with **MongoDB and MySQL**. RESTful APIs, Clerk authentication, and real-time WebSocket communication — built for scale and reliability.",
    leadership: "**Vice President of Student Council** and **Head of Literary Club** at IIIT Ranchi. Driving student governance, organizing inter-college events, and bridging cross-functional collaborations. Leadership by action.",
    default: "Good question. Try asking about Saksham's **skills, projects, experience, achievements, education**, or what defines his **approach** — I'll have answers.",
};

const SUGGESTION_CHIPS = [
    'Skills', 'Projects', 'Experience', 'Achievements', 'Contact', 'Which house?',
];

/* -------- Keyword matcher -------- */
function getResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack') || lower.includes('language') || lower.includes('know')) return RESPONSES.skills;
    if (lower.includes('project') || lower.includes('build') || lower.includes('streamify') || lower.includes('hive') || lower.includes('tinder') || lower.includes('bidding')) return RESPONSES.projects;
    if (lower.includes('experience') || lower.includes('career') || lower.includes('job') || lower.includes('intern') || lower.includes('care health') || lower.includes('work')) return RESPONSES.experience;
    if (lower.includes('education') || lower.includes('study') || lower.includes('college') || lower.includes('iiit') || lower.includes('cgpa') || lower.includes('degree')) return RESPONSES.education;
    if (lower.includes('contact') || lower.includes('reach') || lower.includes('email') || lower.includes('hire') || lower.includes('phone') || lower.includes('connect')) return RESPONSES.contact;
    if (lower.includes('house') || lower.includes('sort') || lower.includes('hat') || lower.includes('gryffindor') || lower.includes('slytherin')) return RESPONSES.house;
    if (lower.includes('achieve') || lower.includes('award') || lower.includes('rank') || lower.includes('codechef') || lower.includes('leetcode') || lower.includes('dsa') || lower.includes('trophy')) return RESPONSES.achievements;
    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('lambda') || lower.includes('serverless')) return RESPONSES.aws;
    if (lower.includes('frontend') || lower.includes('react') || lower.includes('ui') || lower.includes('tailwind') || lower.includes('next')) return RESPONSES.frontend;
    if (lower.includes('backend') || lower.includes('node') || lower.includes('express') || lower.includes('api') || lower.includes('server')) return RESPONSES.backend;
    if (lower.includes('leader') || lower.includes('club') || lower.includes('council') || lower.includes('vp') || lower.includes('president')) return RESPONSES.leadership;
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('greet')) return RESPONSES.greeting;
    return RESPONSES.default;
}

/* -------- Simple Markdown-bold renderer -------- */
function renderText(text) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} style={{ color: 'var(--gold)' }}>{part}</strong> : part
    );
}

/* -------- Component -------- */
export default function SortingHatChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'hat', text: RESPONSES.greeting },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, scrollToBottom]);

    const send = useCallback((text) => {
        const userText = (text || input).trim();
        if (!userText) return;

        const userMsg = { from: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        // Simulate thinking delay (300–800ms)
        const delay = 300 + Math.random() * 500;
        setTimeout(() => {
            const hatMsg = { from: 'hat', text: getResponse(userText) };
            setMessages(prev => [...prev, hatMsg]);
            setTyping(false);
        }, delay);
    }, [input]);

    const handleChip = useCallback((chip) => {
        send(chip);
    }, [send]);

    const toggleOpen = () => {
        if (minimized) {
            setMinimized(false);
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* FAB */}
            <button className="chat-fab" onClick={toggleOpen} title="Ask the Sorting Hat">
                <span className="chat-fab__icon">🎩</span>
                {!isOpen && <span className="chat-fab__pulse" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`chat-window ${minimized ? 'chat-window--minimized' : ''}`}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <span className="chat-header__title">🎩 The Sorting Hat</span>
                            <div className="chat-header__actions">
                                <button
                                    className="chat-header__btn"
                                    onClick={() => setMinimized(!minimized)}
                                    title={minimized ? 'Expand' : 'Minimize'}
                                >
                                    {minimized ? '▲' : '▼'}
                                </button>
                                <button className="chat-header__btn" onClick={() => setIsOpen(false)} title="Close">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Body — hidden when minimized */}
                        {!minimized && (
                            <>
                                <div className="chat-messages">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            className={`chat-msg chat-msg--${msg.from}`}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            {msg.from === 'hat' && <span className="chat-msg__avatar">🎩</span>}
                                            <span className="chat-msg__text">{renderText(msg.text)}</span>
                                        </motion.div>
                                    ))}

                                    {/* Typing indicator */}
                                    {typing && (
                                        <div className="chat-msg chat-msg--hat chat-msg--typing">
                                            <span className="chat-msg__avatar">🎩</span>
                                            <span className="chat-typing">
                                                <span className="chat-typing__dot" />
                                                <span className="chat-typing__dot" />
                                                <span className="chat-typing__dot" />
                                            </span>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Suggestion chips — show only at start */}
                                {messages.length <= 1 && (
                                    <div className="chat-chips">
                                        {SUGGESTION_CHIPS.map(chip => (
                                            <button
                                                key={chip}
                                                className="chat-chip"
                                                onClick={() => handleChip(chip)}
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="chat-input-row">
                                    <input
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && send()}
                                        placeholder="Ask about skills, projects, experience..."
                                        className="chat-input"
                                        disabled={typing}
                                    />
                                    <button className="chat-send" onClick={() => send()} disabled={typing}>
                                        ➤
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
