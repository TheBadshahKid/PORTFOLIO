import React from 'react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <p className="footer__magic">
                    "I solemnly swear that I am up to no good."
                </p>
                <p className="footer__copy">
                    © {new Date().getFullYear()} · Crafted with ⚡ magic and ☕ coffee
                </p>
                <p className="footer__mischief">Mischief Managed.</p>
            </div>
        </footer>
    );
}
