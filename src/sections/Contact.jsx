import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        setTimeout(() => {
            setSending(false);
            setSent(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 2000);
    };

    return (
        <section id="contact" className="section contact">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="section-title">
                    <p className="section-chapter">CHAPTER VI</p>
                    <span className="golden-text">Let's Connect</span>
                    <p className="section-subtitle">Start a conversation — I'd love to hear from you</p>
                </h2>
            </motion.div>

            <motion.div
                className="contact__container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {/* Owl */}
                <div className="contact__owl-wrapper">
                    <motion.div
                        className={`contact__owl ${sending ? 'contact__owl--flying' : ''} ${sent ? 'contact__owl--delivered' : ''}`}
                        animate={sending ? { y: [-10, -200], x: [0, 100], opacity: [1, 0], rotate: [-5, 15] } : sent ? {} : {}}
                        transition={{ duration: 1.5, ease: 'easeIn' }}
                    >
                        ✉️
                    </motion.div>
                    {!sending && !sent && (
                        <p className="contact__owl-label">Ready to send...</p>
                    )}
                    {sending && (
                        <p className="contact__owl-label contact__owl-label--sending">Delivering your message...</p>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {sent ? (
                        <motion.div
                            key="success"
                            className="contact__success glass-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="contact__success-icon">✨</div>
                            <h3>Message Sent!</h3>
                            <p>Thank you for reaching out. I'll get back to you shortly.</p>
                            <button className="golden-btn" onClick={() => setSent(false)}>Send Another Message</button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            className="contact__form glass-card"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="contact__form-row">
                                <div className="contact__field">
                                    <label className="contact__label" htmlFor="name">Your Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="contact__input"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="contact__field">
                                    <label className="contact__label" htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="contact__input"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="contact__field">
                                <label className="contact__label" htmlFor="subject">Subject</label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    className="contact__input"
                                    placeholder="Let's discuss an opportunity..."
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="contact__field">
                                <label className="contact__label" htmlFor="message">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="contact__input contact__textarea"
                                    placeholder="Share your thoughts here..."
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="golden-btn contact__submit" disabled={sending}>
                                {sending ? 'Sending...' : 'Send Message ✉️'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
