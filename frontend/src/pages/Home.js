import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Stars background effect */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            background: '#e91e8c',
            borderRadius: '50%',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.7 + 0.3,
            animation: `pulse ${Math.random() * 3 + 2}s infinite`
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        {/* Logo */}
        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>💙</div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #e91e8c, #9c27b0, #64b5f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '15px',
          lineHeight: 1.2
        }}>
          الحب من طرف واحد
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '40px',
          lineHeight: 1.8
        }}>
          تحاور مع الذكاء الاصطناعي 🤖<br />
          تعلم الحب والعلاقات 💕<br />
          مع مساعدك "قلبي" ✨
        </p>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          marginBottom: '40px'
        }}>
          {[
            { icon: '💬', text: 'شات ذكي' },
            { icon: '🎭', text: 'روليبلاي' },
            { icon: '💡', text: 'نصائح للحب' },
            { icon: '🌐', text: '4 لغات' },
            { icon: '📱', text: 'موبايل + ويب' },
            { icon: '🔒', text: 'خاص وآمن' }
          ].map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(233,30,140,0.3)',
              borderRadius: '15px',
              padding: '15px 10px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{f.icon}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>{f.text}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #e91e8c, #9c27b0)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 20px rgba(233,30,140,0.4)'
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            ابدأ مجاناً 🚀
          </button>

          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              color: '#e91e8c',
              border: '2px solid #e91e8c',
              padding: '13px 40px',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => { e.target.style.background = '#e91e8c'; e.target.style.color = 'white'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#e91e8c'; }}
          >
            دخول 💙
          </button>
        </div>

        <p style={{
          marginTop: '30px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.85rem'
        }}>
          HubbMinTaraf © 2024 • الحب من طرف واحد
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
