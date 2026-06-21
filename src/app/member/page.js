'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Award, CreditCard, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function MemberDashboardHome() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  
  const [membership, setMembership] = useState(null);
  const [counts, setCounts] = useState({ courses: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMemberDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch active membership
        const { data: memData } = await supabase
          .from('memberships')
          .select('*')
          .eq('member_id', user.id)
          .order('created_at', { ascending: false })
          .maybeSingle();

        setMembership(memData);

        // 2. Fetch course enrollment count
        const { count: courseCount } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('member_id', user.id);

        // 3. Fetch certificates count
        const { count: certsCount } = await supabase
          .from('certificates')
          .select('*', { count: 'exact', head: true })
          .eq('member_id', user.id);

        setCounts({
          courses: courseCount || 0,
          certificates: certsCount || 0,
        });

      } catch (err) {
        console.error('Error loading member dashboard details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const isMemExpired = membership ? new Date(membership.expiry_date) < new Date() : true;

  return (
    <div>
      {/* Stats Overview */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t('myCourses')}</span>
            <span className="stat-value">{counts.courses}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t('statsCertificates')}</span>
            <span className="stat-value">{counts.certificates}</span>
          </div>
        </div>
      </div>

      {/* Membership status card */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CreditCard size={24} className="accent-icon" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('membershipStatus')}</h3>
        </div>

        {membership ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'start' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                {t('membershipNumber')}: <span style={{ color: 'var(--accent-color)' }}>{membership.membership_number}</span>
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {t('startDate')}: {new Date(membership.start_date).toLocaleDateString()} | {t('expiryDate')}: {new Date(membership.expiry_date).toLocaleDateString()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`badge ${isMemExpired ? 'rejected' : 'approved'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                {isMemExpired ? t('expired') : t('valid')}
              </span>
              <Link href="/member/certificates" className="btn" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', boxShadow: 'none' }}>
                {t('viewCard')}
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <ShieldAlert style={{ color: 'var(--warning-color)' }} />
            <div style={{ textAlign: 'start' }}>
              <h5 style={{ fontWeight: '700', color: 'var(--warning-color)' }}>{lang === 'ar' ? 'لا توجد عضوية نشطة' : 'No Active Membership'}</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {lang === 'ar' ? 'يرجى التواصل مع إدارة المركز لإصدار بطاقة العضوية الخاصة بك.' : 'Please contact the administration to issue your membership card.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
