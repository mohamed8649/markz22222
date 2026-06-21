'use client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, BookOpen, Award, LogOut, Globe, Home, ShieldAlert } from 'lucide-react';

export default function MemberLayout({ children }) {
  const { user, profile, loading, signOut } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Auth Protection
  if (!user || !profile) {
    return null;
  }

  // Pending Status Protection
  if (profile.status === 'pending') {
    return (
      <div className="verify-layout" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <div className="glass-card verify-card" style={{ textAlign: 'center', maxWidth: '450px' }}>
          <ShieldAlert size={48} style={{ color: 'var(--warning-color)', marginBottom: '1rem' }} />
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('pendingApprovalsCount')}</h2>
          <p className="verify-label" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            {t('pendingApproval')}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" className="btn" style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
              {t('home')}
            </Link>
            <button onClick={signOut} className="btn" style={{ flex: 1 }}>
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rejected Status Protection
  if (profile.status === 'rejected') {
    return (
      <div className="verify-layout" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <div className="glass-card verify-card" style={{ textAlign: 'center', maxWidth: '450px' }}>
          <ShieldAlert size={48} style={{ color: 'var(--error-color)', marginBottom: '1rem' }} />
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('accessDenied')}</h2>
          <p className="verify-label" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            {t('rejectedMsg')}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" className="btn" style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
              {t('home')}
            </Link>
            <button onClick={signOut} className="btn" style={{ flex: 1 }}>
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: t('memberHome'), path: '/member', icon: <Home size={18} /> },
    { name: t('myProfile'), path: '/member/profile', icon: <User size={18} /> },
    { name: t('myCourses'), path: '/member/courses', icon: <BookOpen size={18} /> },
    { name: t('myCertificates'), path: '/member/certificates', icon: <Award size={18} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          {profile.photo_url ? (
            <img src={profile.photo_url} alt={profile.full_name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-color)' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '2px solid var(--border-color)' }}>
              <User size={32} />
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>{profile.full_name}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{profile.email}</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link href={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={toggleLanguage} className="lang-toggle" style={{ width: '100%', justifyContent: 'center' }}>
            <Globe size={16} />
            <span>{t(lang === 'ar' ? 'english' : 'arabic')}</span>
          </button>
          <button onClick={signOut} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'start' }}>
            <LogOut size={18} style={{ color: 'var(--error-color)' }} />
            <span style={{ color: 'var(--error-color)' }}>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">{t('welcomeBack')}, {profile.full_name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {lang === 'ar' ? 'بوابة المشتركين الرقمية الآمنة' : 'Secure Digital Member Portal'}
            </p>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
