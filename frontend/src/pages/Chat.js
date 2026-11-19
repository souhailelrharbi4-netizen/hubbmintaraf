import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const modes = [
  { value: 'chat', label: '💬 شات', desc: 'تحاور بشكل عام' },
  { value: 'roleplay', label: '🎭 روليبلاي', desc: 'قلبي = شريكك' },
  { value: 'advice', label: '💡 نصائح', desc: 'نصائح للحب' }
];

const languages = [
  { value: 'darija', label: '🇲🇦' },
  { value: 'arabic', label: '🌍' },
  { value: 'french', label: '🇫🇷' },
  { value: 'english', label: '🇬🇧' }
];

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('chat');
  const [language, setLanguage] = useState(user?.language || 'darija');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    loadHistory();
  }, [mode]);

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat/history?mode=${mode}`);
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message immediately
    const tempUserMsg = { role: 'user', content: userMessage, id: Date.now() };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await axios.post(`${API_URL}/chat/send`, {
        message: userMessage,
        mode,
        language
      });

      const aiMsg = { role: 'assistant', content: res.data.message, id: Date.now() + 1 };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        content: '❌ واش عندك مشكلة في الاتصال؟ حاول مرة أخرى',
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = async () => {
    if (!window.confirm('واش بغيتي تمحي المحادثة؟')) return;
    try {
      await axios.delete(`${API_URL}/chat/clear?mode=${mode}`);
      setMessages([]);
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: '#0a0a0f',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        background: 'rgba(255,255,255,0.03)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <div style={{ padding: '20px', minWidth: '280px' }}>
          {/* User info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '15px',
            background: 'rgba(233,30,140,0.1)',
            borderRadius: '15px',
            marginBottom: '25px',
            border: '1px solid rgba(233,30,140,0.2)'
          }}>
            <div style={{
              width: '45px', height: '45px',
              background: 'linear-gradient(135deg, #e91e8c, #9c27b0)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0
            }}>
              {user?.username?.[0]?.toUpperCase() || '👤'}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{user?.username}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{user?.email}</div>
            </div>
          </div>

          {/* Mode selection */}
          <div style={{ marginBottom: '25px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '12px', letterSpacing: '1px' }}>
              وضع المحادثة
            </p>
            {modes.map(m => (
              <button
                key={m.value}
                onClick={() => { setMode(m.value); setSidebarOpen(false); }}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: mode === m.value ? 'rgba(233,30,140,0.2)' : 'transparent',
                  border: mode === m.value ? '1px solid rgba(233,30,140,0.4)' : '1px solid transparent',
                  borderRadius: '12px',
                  color: mode === m.value ? '#e91e8c' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.9rem',
                  textAlign: 'right',
                  marginBottom: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600' }}>{m.label}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{m.desc}</div>
              </button>
            ))}
          </div>

          {/* Language */}
          <div style={{ marginBottom: '25px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '12px', letterSpacing: '1px' }}>
              اللغة
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {languages.map(l => (
                <button
                  key={l.value}
                  onClick={() => setLanguage(l.value)}
                  style={{
                    padding: '10px',
                    background: language === l.value ? 'rgba(233,30,140,0.2)' : 'rgba(255,255,255,0.05)',
                    border: language === l.value ? '1px solid #e91e8c' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={clearChat}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(255,100,100,0.1)',
              border: '1px solid rgba(255,100,100,0.2)',
              borderRadius: '12px', color: '#ff6b6b',
              cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem', marginBottom: '10px'
            }}
          >
            🗑️ مسح المحادثة
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem'
            }}
          >
            🚪 خروج
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '15px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            ☰
          </button>

          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #e91e8c, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              💙 قلبي
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              {modes.find(m => m.value === mode)?.label} • {languages.find(l => l.value === language)?.label}
            </p>
          </div>

          <div style={{
            width: '10px', height: '10px',
            background: '#4caf50',
            borderRadius: '50%',
            boxShadow: '0 0 8px #4caf50'
          }} />
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {messages.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              opacity: 0.6
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '15px' }}>💙</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>مرحبا {user?.username}!</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                أنا "قلبي"، هنا باش نساعدك في الحب 💕<br />
                ابدأ المحادثة دابا!
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={msg.id || i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: '35px', height: '35px',
                  background: 'linear-gradient(135deg, #e91e8c, #9c27b0)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0
                }}>
                  💙
                </div>
              )}

              <div style={{
                maxWidth: '70%',
                padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                background: msg.role === 'user'
                  ? 'rgba(255,255,255,0.08)'
                  : 'linear-gradient(135deg, rgba(233,30,140,0.2), rgba(156,39,176,0.2))',
                border: msg.role === 'user'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(233,30,140,0.3)',
                fontSize: '0.95rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div style={{
                  width: '35px', height: '35px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0
                }}>
                  {user?.username?.[0]?.toUpperCase() || '👤'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '10px' }}>
              <div style={{
                width: '35px', height: '35px',
                background: 'linear-gradient(135deg, #e91e8c, #9c27b0)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem'
              }}>
                💙
              </div>
              <div style={{
                padding: '14px 20px',
                background: 'linear-gradient(135deg, rgba(233,30,140,0.2), rgba(156,39,176,0.2))',
                border: '1px solid rgba(233,30,140,0.3)',
                borderRadius: '20px 20px 5px 20px'
              }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '8px', height: '8px',
                      background: '#e91e8c',
                      borderRadius: '50%',
                      animation: `bounce 1s infinite ${i * 0.2}s`
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          style={{
            padding: '15px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا... 💙"
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '25px',
              color: 'white',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'Cairo, sans-serif',
              transition: 'border 0.3s'
            }}
            onFocus={e => e.target.style.borderColor = '#e91e8c'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              width: '50px', height: '50px',
              background: loading || !input.trim()
                ? 'rgba(233,30,140,0.3)'
                : 'linear-gradient(135deg, #e91e8c, #9c27b0)',
              border: 'none',
              borderRadius: '50%',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1.3rem',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
          >
            {loading ? '⏳' : '💙'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
