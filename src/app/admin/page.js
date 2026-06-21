'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Users, BookOpen, Award, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboardHome() {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState({
    members: 0,
    courses: 0,
    certificates: 0,
    pending: 0,
  });
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStatsAndPending = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const { count: membersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      const { count: certsCount } = await supabase.from('certificates').select('*', { count: 'exact', head: true });
      const { count: pendingCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        members: membersCount || 0,
        courses: coursesCount || 0,
        certificates: certsCount || 0,
        pending: pendingCount || 0,
      });

      // Fetch actual pending list
      const { data: pendingData } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingMembers(pendingData || []);
    } catch (err) {
      console.error('Error fetching dashboard overview details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndPending();
  }, []);

  const handleApprove = async (memberId) => {
    setActionLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'approved' })
      .eq('id', memberId);

    if (!error) {
      fetchStatsAndPending();
    } else {
      console.error('Error approving member:', error.message);
    }
    setActionLoading(false);
  };

  const handleReject = async (memberId) => {
    setActionLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'rejected' })
      .eq('id', memberId);

    if (!error) {
      fetchStatsAndPending();
    } else {
      console.error('Error rejecting member:', error.message);
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t('totalMembers')}</span>
            <span className="stat-value">{stats.members}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t('activeCourses')}</span>
            <span className="stat-value">{stats.courses}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t('issuedCertificatesCount')}</span>
            <span className="stat-value">{stats.certificates}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t('pendingApprovalsCount')}</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600' }}>
          {t('pendingApprovalsCount')}
        </h3>

        {pendingMembers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {lang === 'ar' ? 'لا توجد طلبات معلقة بانتظار الموافقة.' : 'No pending approval requests.'}
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('fullName')}</th>
                  <th>{t('email')}</th>
                  <th>{t('phone')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((member) => (
                  <tr key={member.id}>
                    <td style={{ fontWeight: '600' }}>{member.full_name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone || '-'}</td>
                    <td>
                      <span className="badge pending">{t('pendingApproval')}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApprove(member.id)}
                          disabled={actionLoading}
                          className="btn"
                          style={{ width: 'auto', padding: '0.4rem 0.8rem', background: 'var(--success-color)', fontSize: '0.85rem', boxShadow: 'none', display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                        >
                          <CheckCircle size={14} />
                          <span>{t('approve')}</span>
                        </button>
                        <button
                          onClick={() => handleReject(member.id)}
                          disabled={actionLoading}
                          className="btn danger"
                          style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem', boxShadow: 'none', display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                        >
                          <XCircle size={14} />
                          <span>{t('reject')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
