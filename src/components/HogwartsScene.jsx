import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import './HogwartsScene.css';

/**
 * Fixed background scene:
 *  Night → deep navy sky with twinkling stars + castle silhouette with glowing windows
 *  Day   → warm golden sky gradient + castle silhouette (dark outline)
 *  Smooth cross-fade on theme change
 */
export default function HogwartsScene() {
    const { theme } = useContext(ThemeContext);
    const isNight = theme === 'dark';

    return (
        <div className={`hogwarts-scene ${isNight ? 'hogwarts-scene--night' : 'hogwarts-scene--day'}`}>
            {/* Sky */}
            <div className="hogwarts-scene__sky" />

            {/* Stars (visible at night) */}
            <div className="hogwarts-scene__stars">
                {Array.from({ length: 45 }).map((_, i) => (
                    <div
                        key={i}
                        className="hogwarts-scene__star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 60}%`,
                            width: `${Math.random() * 2.5 + 1}px`,
                            height: `${Math.random() * 2.5 + 1}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Castle Silhouette (CSS-drawn) */}
            <div className="hogwarts-scene__castle">
                {/* Main towers */}
                <div className="castle__tower castle__tower--left">
                    <div className="castle__spire" />
                    {isNight && <div className="castle__window castle__window--1" />}
                </div>
                <div className="castle__tower castle__tower--center-left">
                    <div className="castle__spire castle__spire--tall" />
                    {isNight && <div className="castle__window castle__window--2" />}
                    {isNight && <div className="castle__window castle__window--3" />}
                </div>
                <div className="castle__body">
                    {isNight && (
                        <>
                            <div className="castle__window castle__window--4" />
                            <div className="castle__window castle__window--5" />
                            <div className="castle__window castle__window--6" />
                        </>
                    )}
                </div>
                <div className="castle__tower castle__tower--center-right">
                    <div className="castle__spire castle__spire--medium" />
                    {isNight && <div className="castle__window castle__window--7" />}
                </div>
                <div className="castle__tower castle__tower--right">
                    <div className="castle__spire" />
                    {isNight && <div className="castle__window castle__window--8" />}
                </div>
            </div>

            {/* Hills / Ground */}
            <div className="hogwarts-scene__ground" />
        </div>
    );
}
