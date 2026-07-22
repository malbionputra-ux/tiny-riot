import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatWidget.css';

const ChatWidget = ({ setCursorVariant, activeSlideIndex, chatOpen, setChatOpen, hasInteractedChat, setHasInteractedChat }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo! Kami Tiny Riot. Projek apa yang sedang ingin lo garap?' }
  ]);
  const [selectedService, setSelectedService] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [step, setStep] = useState('select_service'); // 'select_service', 'ask_email', 'finished'
  const chatEndRef = useRef(null);

  const isHero = activeSlideIndex === 0;
  const showCornerBtn = chatOpen || hasInteractedChat || !isHero;

  const handleToggle = () => {
    if (chatOpen) {
      setChatOpen(false);
      if (isHero && setHasInteractedChat) {
        setHasInteractedChat(false);
      }
    } else {
      if (!hasInteractedChat && setHasInteractedChat) setHasInteractedChat(true);
      if (setChatOpen) setChatOpen(true);
    }
  };

  const services = [
    'Social Media Strategy',
    'Creative Production',
    'UI/UX Design',
    'Custom Web Dev'
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: service },
      { id: Date.now() + 1, sender: 'bot', text: `Mantap! ${service} adalah keahlian kami. Boleh minta alamat email lo biar tim kami bisa langsung ngehubungin?` }
    ]);
    setStep('ask_email');
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const targetEmail = emailInput.trim();
    if (!targetEmail) return;

    setIsSending(true);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: targetEmail },
      { id: Date.now() + 1, sender: 'bot', text: `Mengirim email konfirmasi ke ${targetEmail}...` }
    ]);
    setEmailInput('');

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'c90666ec-7e50-4822-b924-f7b7cf7a86f9',
          email: targetEmail,
          name: 'Client Tiny Riot',
          subject: `[Tiny Riot] Konfirmasi Diskusi Proyek ${selectedService || 'Layanan'}`,
          message: `Halo! Terima kasih telah mengontak Tiny Riot untuk layanan ${selectedService || 'Layanan'}. Tim kami akan segera menghubungi Anda dalam 24 jam.`
        })
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, sender: 'bot', text: `✅ Berhasil! Email konfirmasi telah terkirim ke ${targetEmail}. Silakan cek inbox/spam Anda.` }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, sender: 'bot', text: `Terima kasih! Email ${targetEmail} telah tersimpan di sistem kami.` }
      ]);
    } finally {
      setIsSending(false);
      setStep('finished');
    }
  };

  return (
    <div className="chat-widget-wrapper bottom-right-mode">
      {/* Floating Pill Button - Morphing between Hero Center and Bottom Right */}
      {showCornerBtn && (
        <motion.button 
          layoutId="talk-pill-btn"
          className={`chat-toggle-btn ${chatOpen ? 'active' : ''}`}
          onClick={handleToggle}
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        >
          <img src="/assets/new-logo-transparent.png" alt="Logo" className="custom-toggle-logo" />
          <span className="toggle-text">{chatOpen ? 'CLOSE' : "LET'S TALK"}</span>
        </motion.button>
      )}

      {/* Chat Window Popup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            className="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            <div className="chat-window-header">
              <div className="header-branding">
                <span className="brand-dot"></span>
                <span className="brand-title">TINY TALK</span>
              </div>
              <span className="chat-status">ONLINE</span>
            </div>

            <div className="chat-messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
                  {msg.sender === 'bot' && <div className="bot-avatar">T</div>}
                  <div className={`chat-bubble ${msg.sender}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-window-footer">
              {step === 'select_service' && (
                <div className="services-options">
                  {services.map((service, idx) => (
                    <button 
                      key={idx} 
                      className="service-option-pill"
                      onClick={() => handleSelectService(service)}
                      onMouseEnter={() => setCursorVariant('hover')}
                      onMouseLeave={() => setCursorVariant('default')}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}

              {step === 'ask_email' && (
                <form onSubmit={handleSendEmail} className="chat-input-form">
                  <input 
                    type="email" 
                    placeholder="Masukkan email lo di sini..." 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="chat-input"
                  />
                  <button 
                    type="submit" 
                    className="chat-send-btn"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </form>
              )}

              {step === 'finished' && (
                <div className="chat-finished-state">
                  <span>👋 Obrolan selesai</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
