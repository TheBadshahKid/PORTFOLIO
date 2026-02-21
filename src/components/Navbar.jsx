import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext, SoundContext } from '../App';
import { HiSun, HiMoon } from 'react-icons/hi';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import './Navbar.css';

const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { soundEnabled, toggleSound } = useContext(SoundContext);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('hero');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);

            // Re-sync active section
            const scrollPos = window.scrollY;
            const windowHeight = window.innerHeight;

            // Find the most prominent section in the viewport
            let current = active;

            // Special case: At the top
            if (scrollPos < 100) {
                current = 'hero';
            }
            // Special case: At the bottom
            else if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
                current = 'contact';
            }
            else {
                // Check all sections using getBoundingClientRect
                for (const link of navLinks) {
                    const el = document.getElementById(link.id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        // If section's top is in the upper part of the viewport
                        if (rect.top >= -100 && rect.top <= windowHeight * 0.4) {
                            current = link.id;
                            break;
                        }
                        // If the section is currently covering the scroll trigger point (20vh)
                        if (rect.top <= windowHeight * 0.2 && rect.bottom >= windowHeight * 0.2) {
                            current = link.id;
                        }
                    }
                }
            }

            if (current !== active) {
                setActive(current);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Instant check

        // Delayed check for lazy-loaded sections that might shift layout
        const timer = setTimeout(onScroll, 500);

        return () => {
            window.removeEventListener('scroll', onScroll);
            clearTimeout(timer);
        };
    }, [active]);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__inner">
                <button className="navbar__logo" onClick={() => scrollTo('hero')}>
                    <span className="navbar__logo-icon">⚡</span>
                    <span className="navbar__logo-text">Portfolio</span>
                </button>

                <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    {navLinks.map(link => (
                        <button
                            key={link.id}
                            className={`navbar__link ${active === link.id ? 'navbar__link--active' : ''}`}
                            onClick={() => scrollTo(link.id)}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="navbar__controls">
                    <button className="navbar__icon-btn" onClick={toggleSound} title={soundEnabled ? 'Mute' : 'Unmute'}>
                        {soundEnabled ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                    </button>

                    {/* Day/Night Pill Toggle */}
                    <button
                        className={`theme-toggle ${theme === 'dark' ? 'theme-toggle--night' : 'theme-toggle--day'}`}
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                        aria-label="Toggle Day/Night theme"
                    >
                        <span className="theme-toggle__icon theme-toggle__icon--sun"><HiSun /></span>
                        <span className="theme-toggle__icon theme-toggle__icon--moon"><HiMoon /></span>
                        <span className="theme-toggle__slider" />
                    </button>
                    <button className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                        <span /><span /><span />
                    </button>
                </div>
            </div>
        </nav>
    );
}
