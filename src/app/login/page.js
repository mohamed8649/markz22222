'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function LoginPage() {
  const { signIn, user, profile, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user && profile) {
      if (profile.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/member');
      }
    }
  }, [user, profile, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError(t('requiredField'));
      setLoading(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message || t('somethingWrong'));
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content verify-layout">
        <div className="glass-card verify-card" style={{ width: '100%', maxWidth: '450px' }}>
          <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('login')}</h2>
          <p className="section-subtitle" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
            {t('heroSubtitle')}
          </p>

          {error && <div className="alert error">{error}</div>}

          <form onSubmit={handleSubmit} id="login_form">
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                id="login_email_input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">{t('password')}</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                id="login_password_input"
              />
            </div>

            <button type="submit" className="btn" disabled={loading || authLoading} id="login_submit_btn">
              {loading ? t('submitting') : t('loginBtn')}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <Link href="/register" style={{ color: 'var(--accent-color)', fontWeight: '500' }}>
              {t('noAccount')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
