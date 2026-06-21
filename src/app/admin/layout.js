'use client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, BookOpen, Award, CreditCard, LogOut, Globe, Home } from 'lucide-react';

export default function AdminLayout({ children }) {
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

  // Route protection
  if (!user || profile?.role !== 'admin') {
    return (
      <div className="verify-layout" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <div className="glass-card verify-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Shield size={48} style={{ color: 'var(--error-color)', marginBottom: '1rem', marginHorizontal: 'auto' }} />
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('accessDenied')}</h2>
          <p className="verify-label" style={{ marginBottom: '2rem' }}>
            {lang === 'ar' ? 'عذراً، هذه الصفحة مخصصة لمدراء النظام فقط.' : 'Sorry, this page is restricted to administrators only.'}
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
    { name: t('adminHome'), path: '/admin', icon: <Home size={18} /> },
    { name: t('manageMembers'), path: '/admin/members', icon: <Users size={18} /> },
    { name: t('manageCourses'), path: '/admin/courses', icon: <BookOpen size={18} /> },
    { name: t('issueCertificates'), path: '/admin/certificates', icon: <Award size={18} /> },
    { name: t('manageMemberships'), path: '/admin/memberships', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--accent-color)' }} />
            <span>{t('adminDashboard')}</span>
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
              {lang === 'ar' ? 'نظام إدارة مركز التدريب الاحترافي' : 'Professional Training Center Management System'}
            </p>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
