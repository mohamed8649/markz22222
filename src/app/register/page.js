'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError(t('requiredField'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('password') + ' does not match confirm password.');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password, fullName, phone);

    if (signUpError) {
      setError(signUpError.message || t('somethingWrong'));
      setLoading(false);
    } else {
      setRegistered(true);
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content verify-layout">
          <div className="glass-card verify-card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
            <div className="verify-badge">
              <div className="verify-icon-wrapper success">
                <CheckCircle size={32} />
              </div>
              <h2 className="section-title" style={{ fontSize: '1.75rem', marginTop: '1rem' }}>
                {t('certSuccess')}
              </h2>
            </div>
            <p className="verify-label" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
              {t('pendingApproval')}
            </p>
            <Link href="/login" className="btn">
              {t('login')}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content verify-layout">
        <div className="glass-card verify-card" style={{ width: '100%', maxWidth: '480px' }}>
          <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('register')}</h2>
          <p className="section-subtitle" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
            {t('heroSubtitle')}
          </p>

          {error && <div className="alert error">{error}</div>}

          <form onSubmit={handleSubmit} id="register_form">
            <div className="form-group">
              <label className="form-label">{t('fullName')}</label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                id="register_name_input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                id="register_email_input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('phone')}</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 50 000 0000"
                required
                id="register_phone_input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                id="register_password_input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">{t('confirmPassword') || 'Confirm Password'}</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                id="register_confirm_password_input"
              />
            </div>

            <button type="submit" className="btn" disabled={loading} id="register_submit_btn">
              {loading ? t('submitting') : t('registerBtn')}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <Link href="/login" style={{ color: 'var(--accent-color)', fontWeight: '500' }}>
              {t('haveAccount')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
