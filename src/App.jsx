import React, { useState, useEffect, createContext, lazy, Suspense } from 'react';
import { motion, useScroll } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import './App.css';
import './components/ScrollStage.css';

/* ---- Lazy-loaded: below-fold sections ---- */
const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
const Achievements = lazy(() => import('./sections/Achievements'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./components/Footer'));

/* ---- Lazy-loaded: heavy / non-critical components ---- */
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));
const HogwartsScene = lazy(() => import('./components/HogwartsScene'));
const WandCursor = lazy(() => import('./components/WandCursor'));
const EasterEggs = lazy(() => import('./components/EasterEggs'));
const SortingHatChat = lazy(() => import('./components/SortingHatChat'));
const AmbientSound = lazy(() => import('./components/AmbientSound'));
const ScrollStage = lazy(() => import('./components/ScrollStage'));

export const ThemeContext = createContext();
export const SoundContext = createContext();

/* ---- Lightweight scroll progress bar ---- */
function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div
            className="scroll-progress"
            style={{ scaleX: scrollYProgress }}
        />
    );
}

/* ---- Minimal divider (no JS cost) ---- */
function SectionDivider() {
    return <div className="section-divider" />;
}

/* ---- Invisible loader (no layout shift) ---- */
function SectionFallback() {
    return <div style={{ minHeight: '60vh' }} />;
}

function App() {
    const [theme, setTheme] = useState('dark');
    const [soundEnabled, setSoundEnabled] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    const toggleSound = () => setSoundEnabled(prev => !prev);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
                {/* Non-critical background layers — load after first paint */}
                <Suspense fallback={null}>
                    <AmbientSound />
                    <ParticleBackground />
                    <HogwartsScene />
                    <WandCursor />
                    <EasterEggs />
                </Suspense>

                <ScrollProgressBar />
                <Navbar />

                <main>
                    {/* Hero loads eagerly — critical above-fold content */}
                    <Suspense fallback={null}>
                        <ScrollStage preset="platform">
                            <Hero />
                        </ScrollStage>
                    </Suspense>

                    <SectionDivider />

                    {/* Below-fold sections — lazy loaded on demand */}
                    <Suspense fallback={<SectionFallback />}>
                        <ScrollStage preset="castle">
                            <About />
                        </ScrollStage>
                    </Suspense>

                    <SectionDivider />

                    <Suspense fallback={<SectionFallback />}>
                        <ScrollStage preset="mapUnfold">
                            <Skills />
                        </ScrollStage>
                    </Suspense>

                    <SectionDivider />

                    <Suspense fallback={<SectionFallback />}>
                        <ScrollStage preset="spellbook">
                            <Projects />
                        </ScrollStage>
                    </Suspense>

                    <SectionDivider />

                    <Suspense fallback={<SectionFallback />}>
                        <ScrollStage preset="trophyHall">
                            <Achievements />
                        </ScrollStage>
                    </Suspense>

                    <SectionDivider />

                    <Suspense fallback={<SectionFallback />}>
                        <ScrollStage preset="owlPost">
                            <Contact />
                        </ScrollStage>
                    </Suspense>
                </main>

                <Suspense fallback={null}>
                    <Footer />
                    <SortingHatChat />
                </Suspense>
            </SoundContext.Provider>
        </ThemeContext.Provider>
    );
}

export default App;
