'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, User, Check, X, ArrowLeft, ArrowRight, Search } from 'lucide-react';

export default function ManageMembers() {
  const { t, lang } = useLanguage();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  const fetchMembers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply search filters
      if (search.trim() !== '') {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Apply pagination bounds
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error) {
        setMembers(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error('Error fetching members list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMembers();
  }, [search]);

  useEffect(() => {
    fetchMembers();
  }, [page]);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchMembers();
    }
  };

  const updateRole = async (id, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);

    if (!error) {
      fetchMembers();
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('manageMembers')}</h3>
        
        {/* Search Input */}
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            className="form-input"
            placeholder={t('searchMembers')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingStart: '2.5rem' }}
            id="members_search_input"
          />
          <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lang === 'ar' ? 'auto' : '1rem', right: lang === 'ar' ? '1rem' : 'auto', color: 'var(--text-secondary)' }} />
        </div>
      </div>

      {loading ? (
        <div className="spinner-container" style={{ minHeight: '150px' }}>
          <div className="spinner"></div>
        </div>
      ) : members.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>{t('noMembers')}</p>
      ) : (
        <>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('fullName')}</th>
                  <th>{t('email')}</th>
                  <th>{t('phone')}</th>
                  <th>{t('role')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td style={{ fontWeight: '600' }}>{member.full_name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone || '-'}</td>
                    <td>
                      <span className={`badge ${member.role === 'admin' ? 'approved' : 'pending'}`} style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                        {member.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                        <span>{member.role === 'admin' ? t('makeAdmin').split(' ')[1] : t('makeMember').split(' ')[1]}</span>
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${member.status}`}>
                        {member.status === 'approved' ? t('valid') : member.status === 'pending' ? t('pendingApproval').split(' ')[1] : t('rejected')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* Approval Toggles */}
                        {member.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(member.id, 'approved')}
                              className="btn"
                              style={{ width: 'auto', padding: '0.4rem 0.6rem', background: 'var(--success-color)', fontSize: '0.8rem', boxShadow: 'none' }}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => updateStatus(member.id, 'rejected')}
                              className="btn danger"
                              style={{ width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.8rem', boxShadow: 'none' }}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {member.status === 'rejected' && (
                          <button
                            onClick={() => updateStatus(member.id, 'approved')}
                            className="btn"
                            style={{ width: 'auto', padding: '0.4rem 0.8rem', background: 'var(--success-color)', fontSize: '0.8rem', boxShadow: 'none' }}
                          >
                            {t('approve')}
                          </button>
                        )}
                        {member.status === 'approved' && member.role !== 'admin' && (
                          <button
                            onClick={() => updateStatus(member.id, 'rejected')}
                            className="btn danger"
                            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none' }}
                          >
                            {t('reject')}
                          </button>
                        )}

                        {/* Role promotion */}
                        {member.role === 'admin' ? (
                          <button
                            onClick={() => updateRole(member.id, 'member')}
                            className="btn"
                            style={{ width: 'auto', padding: '0.4rem 0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '0.8rem', boxShadow: 'none' }}
                          >
                            {t('makeMember')}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateRole(member.id, 'admin')}
                            className="btn"
                            style={{ width: 'auto', padding: '0.4rem 0.8rem', background: 'var(--accent-color)', fontSize: '0.8rem', boxShadow: 'none' }}
                          >
                            {t('makeAdmin')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                {lang === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{t('previous')}</span>
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                <span>{t('next')}</span>
                {lang === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
