import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EasterEggs.css';

/* ---- Bonus achievements data ---- */
const BONUS_ACHIEVEMENTS = [
    { emoji: '🔮', title: 'The Prophecy', desc: 'You found the hidden symbol — a true Seer!' },
    { emoji: '⚡', title: 'The Chosen One', desc: 'Clicked the wand 7 times — Harry would be proud.' },
    { emoji: '💡', title: 'Lumos Maxima', desc: 'Cast the Lumos spell — light in the darkness.' },
    { emoji: '🦌', title: 'Expecto Patronum', desc: 'Summoned a Patronus — your happiest memory.' },
    { emoji: '🐍', title: 'Parseltongue', desc: 'Typed "parseltongue" — you speak to serpents.' },
    { emoji: '🧹', title: 'Accio Broom', desc: 'Typed "accio" — summoned a flying broomstick.' },
];

export default function EasterEggs() {
    const [effect, setEffect] = useState(null);
    const [wandClicks, setWandClicks] = useState(0);
    const [showSecret, setShowSecret] = useState(false);
    const [showBonus, setShowBonus] = useState(false);
    const [discovered, setDiscovered] = useState(() => {
        try { return JSON.parse(localStorage.getItem('hp_eggs') || '[]'); } catch { return []; }
    });

    const discover = useCallback((id) => {
        setDiscovered(prev => {
            if (prev.includes(id)) return prev;
            const next = [...prev, id];
            localStorage.setItem('hp_eggs', JSON.stringify(next));
            return next;
        });
    }, []);

    /* ---- Spell detection (keyboard) ---- */
    useEffect(() => {
        let buffer = '';
        let bufferTimer = null;
        const spells = {
            lumos: () => { setEffect('lumos'); discover('lumos'); },
            nox: () => {
                document.documentElement.setAttribute('data-theme', 'dark');
                setEffect(null);
            },
            expectopatronum: () => { setEffect('patronus'); discover('patronus'); },
            parseltongue: () => { setEffect('parseltongue'); discover('parseltongue'); },
            accio: () => { setEffect('accio'); discover('accio'); },
        };

        const onKeyDown = (e) => {
            // Skip if typing in form fields
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

            buffer += e.key.toLowerCase();
            if (buffer.length > 30) buffer = buffer.slice(-30);

            // Reset buffer after 2s of no typing
            clearTimeout(bufferTimer);
            bufferTimer = setTimeout(() => { buffer = ''; }, 2000);

            for (const [spell, action] of Object.entries(spells)) {
                if (buffer.endsWith(spell)) {
                    action();
                    buffer = '';
                    break;
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => { window.removeEventListener('keydown', onKeyDown); clearTimeout(bufferTimer); };
    }, [discover]);

    /* ---- Effect auto-clear ---- */
    useEffect(() => {
        if (!effect) return;
        const durations = { lumos: 1500, patronus: 4000, parseltongue: 3000, accio: 3000 };
        const timer = setTimeout(() => setEffect(null), durations[effect] || 2000);
        return () => clearTimeout(timer);
    }, [effect]);

    /* ---- Wand multi-click (7 clicks within 3 seconds) ---- */
    useEffect(() => {
        let clickCount = 0;
        let timer = null;

        const onClick = () => {
            clickCount++;
            setWandClicks(clickCount);

            if (timer) clearTimeout(timer);
            timer = setTimeout(() => { clickCount = 0; setWandClicks(0); }, 3000);

            if (clickCount >= 7) {
                setShowSecret(true);
                discover('wand7');
                clickCount = 0;
                setWandClicks(0);
            }
        };

        window.addEventListener('click', onClick);
        return () => { window.removeEventListener('click', onClick); if (timer) clearTimeout(timer); };
    }, [discover]);

    /* ---- Hidden symbol click handler ---- */
    const onSymbolClick = useCallback(() => {
        setShowBonus(true);
        discover('symbol');
    }, [discover]);

    return (
        <>
            {/* ---- Lumos Flash ---- */}
            <AnimatePresence>
                {effect === 'lumos' && (
                    <motion.div
                        className="lumos-flash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </AnimatePresence>

            {/* ---- Patronus ---- */}
            <AnimatePresence>
                {effect === 'patronus' && (
                    <motion.div
                        className="patronus-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="patronus-stag"
                            initial={{ scale: 0.3, y: 50 }}
                            animate={{ scale: 1, y: -20 }}
                            exit={{ scale: 1.5, y: -60, opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        >
                            🦌
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Parseltongue — green snake flash ---- */}
            <AnimatePresence>
                {effect === 'parseltongue' && (
                    <motion.div
                        className="parseltongue-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="parseltongue-snake"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 10 }}
                        >
                            🐍
                        </motion.div>
                        <motion.p
                            className="parseltongue-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            §§ You speak Parseltongue §§
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Accio — broomstick flying across ---- */}
            <AnimatePresence>
                {effect === 'accio' && (
                    <motion.div
                        className="accio-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="accio-broom"
                            initial={{ x: '-100vw', y: '60vh', rotate: -20 }}
                            animate={{ x: '110vw', y: '20vh', rotate: 10 }}
                            transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
                        >
                            🧹
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Wand click counter hint (shows after 4 clicks) ---- */}
            <AnimatePresence>
                {wandClicks >= 4 && wandClicks < 7 && (
                    <motion.div
                        className="wand-hint"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        ✨ {7 - wandClicks} more clicks...
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Secret page (wand 7-click) ---- */}
            <AnimatePresence>
                {showSecret && (
                    <motion.div
                        className="secret-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSecret(false)}
                    >
                        <motion.div
                            className="secret-card"
                            initial={{ scale: 0.8, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 15 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="secret-close" onClick={() => setShowSecret(false)}>✕</button>
                            <div className="secret-icon">🗝️</div>
                            <h3 className="secret-title">The Room of Requirement</h3>
                            <p className="secret-text">
                                You've discovered the hidden room! Only those in great need find it.
                                Here lies what the seeker truly desires...
                            </p>
                            <div className="secret-facts">
                                <div className="secret-fact">
                                    <span className="secret-fact-icon">☕</span>
                                    <span>Fueled by 500+ cups of chai</span>
                                </div>
                                <div className="secret-fact">
                                    <span className="secret-fact-icon">🌙</span>
                                    <span>Most code written between midnight and 4 AM</span>
                                </div>
                                <div className="secret-fact">
                                    <span className="secret-fact-icon">🎮</span>
                                    <span>Favorite spell: git push --force (dangerous!)</span>
                                </div>
                                <div className="secret-fact">
                                    <span className="secret-fact-icon">📚</span>
                                    <span>Read all 7 Harry Potter books thrice</span>
                                </div>
                            </div>
                            <p className="secret-footer">Click outside or ✕ to close</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Hidden Deathly Hallows symbol ---- */}
            <button className="deathly-hallows" onClick={onSymbolClick} title=" ">
                <svg viewBox="0 0 100 120" className="dh-svg">
                    <polygon points="50,5 5,95 95,95" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="50" cy="65" r="25" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="2.5" />
                </svg>
            </button>

            {/* ---- Bonus Achievements Modal ---- */}
            <AnimatePresence>
                {showBonus && (
                    <motion.div
                        className="bonus-overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowBonus(false)}
                    >
                        <motion.div
                            className="bonus-card"
                            initial={{ scale: 0.8, rotateX: 15 }}
                            animate={{ scale: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 14 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="secret-close" onClick={() => setShowBonus(false)}>✕</button>
                            <h3 className="bonus-title">🏆 Hidden Achievements</h3>
                            <p className="bonus-subtitle">Discover all the magical easter eggs</p>
                            <div className="bonus-grid">
                                {BONUS_ACHIEVEMENTS.map((a, i) => {
                                    const unlocked = discovered.includes(
                                        ['symbol', 'wand7', 'lumos', 'patronus', 'parseltongue', 'accio'][i]
                                    );
                                    return (
                                        <div key={i} className={`bonus-item ${unlocked ? 'bonus-item--unlocked' : ''}`}>
                                            <span className="bonus-emoji">{unlocked ? a.emoji : '🔒'}</span>
                                            <div>
                                                <strong>{unlocked ? a.title : '???'}</strong>
                                                <p>{unlocked ? a.desc : 'Keep exploring...'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="bonus-progress">
                                {discovered.length} / {BONUS_ACHIEVEMENTS.length} discovered
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
