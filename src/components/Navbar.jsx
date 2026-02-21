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

            const sections = navLinks.map(l => document.getElementById(l.id));
            const scrollPos = window.scrollY + 200;
            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i] && sections[i].offsetTop <= scrollPos) {
                    setActive(navLinks[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
