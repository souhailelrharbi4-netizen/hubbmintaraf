import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const languages = [
  { value: 'darija', label: '🇲🇦 الدارجة' },
  { value: 'arabic', label: '🌍 العربية الفصحى' },
  { value: 'french', label: '🇫🇷 Français' },
  { value: 'english', label: '🇬🇧 English' }
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    language: 'darija'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '15px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'Cairo, sans-serif'
  };

  const labelStyle = {
    display: 'block',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '8px',
    fontSize: '0.9rem'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      return setError('كلمة السر خاصها تكون على الأقل 6 حروف');
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.language);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(233,30,140,0.3)',
        borderRadius: '25px',
        padding: '40px',
        width: '100%',
        maxWidth: '440px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💙</div>
          <h2 style={{
            fontSize: '1.8rem',
            background: 'linear-gradient(135deg, #e91e8c, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800'
          }}>
            سجل دابا
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            إنشاء حساب جديد مجاناً
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>الاسم</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="اسمك هنا"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e91e8c'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>الإيميل</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e91e8c'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>كلمة السر</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e91e8c'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={labelStyle}>اللغة المفضلة</label>
            <select
              value={form.language}
              onChange={e => setForm({ ...form, language: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {languages.map(l => (
                <option key={l.value} value={l.value} style={{ background: '#1a0a2e' }}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,50,50,0.15)',
              border: '1px solid rgba(255,50,50,0.3)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '20px',
              color: '#ff6b6b',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? 'rgba(233,30,140,0.4)' : 'linear-gradient(135deg, #e91e8c, #9c27b0)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Cairo, sans-serif',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳ جاري التسجيل...' : 'سجل مجاناً 🚀'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.9rem'
        }}>
          عندك حساب؟{' '}
          <Link to="/login" style={{ color: '#e91e8c', textDecoration: 'none', fontWeight: '600' }}>
            دخول
          </Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← رجع للصفحة الرئيسية
          </Link>
        </p>
      </div>
    </div>
  );
}
