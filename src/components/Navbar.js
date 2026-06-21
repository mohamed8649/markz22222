'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Award, LogOut, User, Shield, Menu, X, Mail, Phone, MapPin, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Monitor scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (profile?.role === 'admin') return '/admin';
    return '/member';
  };

  const menuItems = [
    { labelAr: 'الرئيسية', labelEn: 'Home', href: '/' },
    { labelAr: 'الدورات', labelEn: 'Courses', href: '#courses-section' },
    { labelAr: 'المدربين', labelEn: 'Instructors', href: '#instructors-section' },
    { labelAr: 'من نحن', labelEn: 'About Us', href: '#about-section' },
    { labelAr: 'المدونة', labelEn: 'Blog', href: '#blog-section' },
    { labelAr: 'اتصل بنا', labelEn: 'Contact Us', href: '#contact-section' },
  ];

  return (
    <header className="header-wrapper" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-info" style={{ display: 'flex', gap: '1.5rem', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
          <div className="topbar-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={14} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            <span>info@futuretraining.ly</span>
          </div>
          <div className="topbar-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} dir="ltr">
            <Phone size={14} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            <span>+218 91 234 5678</span>
          </div>
          <div className="topbar-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} dir="ltr">
            <Phone size={14} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            <span>+218 92 345 6789</span>
          </div>
        </div>
        <div className="topbar-address" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={14} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
          <span>{lang === 'ar' ? 'ليبيا - طرابلس - شارع الجامعة - بجانب مصرف الجمهورية' : 'Libya - Tripoli - University St. - Next to Jumhouria Bank'}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="app_navbar" style={{ padding: '0.75rem 6%', boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'var(--shadow-sm)', transition: 'all 0.3s ease' }}>
        <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0064d2' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0f2fe', width: '2.5rem', height: '2.5rem', borderRadius: '50%' }}>
            <Award size={22} style={{ color: '#0064d2' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              {lang === 'ar' ? 'مركز المستقبل' : 'Future Center'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
              {lang === 'ar' ? 'للتدريب والتطوير' : 'for Training & Dev'}
            </span>
          </div>
        </Link>

        {/* Desktop Menu Links */}
        <ul className="nav-menu" style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {menuItems.map((item, idx) => (
            <li key={idx} className="nav-menu-item" style={{ fontSize: '0.95rem', fontWeight: '600' }}>
              <a href={item.href} style={{ transition: 'color 0.2s' }}>
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions (Language, Theme, Auth) */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Language selection toggle */}
          <button onClick={toggleLanguage} className="lang-toggle" style={{ border: 'none', background: 'none', fontWeight: '700', fontSize: '0.85rem', color: '#475569', cursor: 'pointer', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <span style={{ color: lang === 'ar' ? '#0064d2' : '#94a3b8' }}>العربية</span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: lang === 'en' ? '#0064d2' : '#94a3b8' }}>English</span>
          </button>

          {/* Theme Switcher Widget */}
          <div className="theme-toggle-pill" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', background: isDarkMode ? '#1e293b' : '#f1f5f9', border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'), borderRadius: '9999px', padding: '2px', width: '56px', height: '28px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
            <div style={{ position: 'absolute', width: '22px', height: '22px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', top: '2px', left: isDarkMode ? '30px' : '2px', transition: 'all 0.3s ease' }} />
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 6px', zIndex: 1, pointerEvents: 'none' }}>
              <Sun size={14} style={{ color: '#eab308' }} />
              <Moon size={14} style={{ color: '#64748b' }} />
            </div>
          </div>

          {/* Auth Button */}
          {user ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link href={getDashboardLink()} className="nav-btn secondary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
                {profile?.role === 'admin' ? <Shield size={15} /> : <User size={15} />}
                <span>{profile?.role === 'admin' ? t('adminDashboard') : t('memberPortal')}</span>
              </Link>
              <button onClick={signOut} className="nav-btn primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-sm)', background: '#0064d2', color: '#ffffff' }}>
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="nav-btn primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)', background: '#0064d2', color: '#ffffff', fontWeight: '700' }}>
              {t('login')}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', cursor: 'pointer', color: '#0f172a' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 999 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {menuItems.map((item, idx) => (
              <li key={idx} style={{ fontSize: '1rem', fontWeight: '600' }}>
                <a href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '0.5rem 0', color: '#0f172a' }}>
                  {lang === 'ar' ? item.labelAr : item.labelEn}
                </a>
              </li>
            ))}
          </ul>
          <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} style={{ fontWeight: '700', color: '#0064d2', fontSize: '0.9rem' }}>
              {t(lang === 'ar' ? 'english' : 'arabic')}
            </button>
            {user ? (
              <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="nav-btn primary" style={{ background: '#0064d2', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                {profile?.role === 'admin' ? t('adminDashboard') : t('memberPortal')}
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="nav-btn primary" style={{ background: '#0064d2', color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Inline styles for responsive nav menu and mobile button */}
      <style jsx global>{`
        @media (max-width: 992px) {
          .nav-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
