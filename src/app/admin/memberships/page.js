'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, CreditCard, Search, Link as LinkIcon, Calendar, Check, X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function ManageMemberships() {
  const { t, lang } = useLanguage();
  const [memberships, setMemberships] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Fields
  const [memberId, setMemberId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Set expiry date default to 1 year from now
  const getDefaultExpiryDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };
  const [expiryDate, setExpiryDate] = useState(getDefaultExpiryDate());
  const [membershipNumber, setMembershipNumber] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const generateMembershipNumber = () => {
    const num = `MEM-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    setMembershipNumber(num);
  };

  useEffect(() => {
    generateMembershipNumber();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch approved members
      const { data: memberData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'member')
        .eq('status', 'approved');
      setMembers(memberData || []);

      // 2. Fetch memberships
      await fetchMemberships();
    } catch (err) {
      console.error('Error fetching memberships configurations data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberships = async () => {
    try {
      let query = supabase
        .from('memberships')
        .select(`
          *,
          profiles:member_id (full_name, email)
        `);

      if (search.trim() !== '') {
        query = query.ilike('membership_number', `%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error) {
        setMemberships(data || []);
      }
    } catch (err) {
      console.error('Error querying memberships:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMemberships();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!memberId || !startDate || !expiryDate || !membershipNumber) {
      setFormError(t('requiredField'));
      return;
    }

    setSubmitLoading(true);

    try {
      // Insert membership
      const { error: insertError } = await supabase.from('memberships').insert([
        {
          membership_number: membershipNumber,
          member_id: memberId,
          start_date: startDate,
          expiry_date: expiryDate,
          status: 'active',
        },
      ]);

      if (insertError) {
        setFormError(insertError.message);
      } else {
        setFormSuccess(t('membershipSuccess'));
        setMemberId('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setExpiryDate(getDefaultExpiryDate());
        generateMembershipNumber();
        fetchMemberships();
      }
    } catch (err) {
      console.error('Membership submission error:', err);
      setFormError(err.message || t('somethingWrong'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const isExpired = (expiry) => {
    return new Date(expiry) < new Date();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }} className="responsive-grid-layout">
      
      {/* Membership list */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('manageMemberships')}</h3>
          
          {/* Search */}
          <div style={{ position: 'relative', width: '250px' }}>
            <input
              type="text"
              className="form-input"
              placeholder={t('searchMemberships')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingStart: '2.5rem' }}
              id="memberships_search_input"
            />
            <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lang === 'ar' ? 'auto' : '1rem', right: lang === 'ar' ? '1rem' : 'auto', color: 'var(--text-secondary)' }} />
          </div>
        </div>

        {loading ? (
          <div className="spinner-container" style={{ minHeight: '150px' }}>
            <div className="spinner"></div>
          </div>
        ) : memberships.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t('noMemberships')}</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('membershipNumber')}</th>
                  <th>{t('fullName')}</th>
                  <th>{t('expiryDate')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((membership) => {
                  const expired = isExpired(membership.expiry_date);
                  return (
                    <tr key={membership.id}>
                      <td style={{ fontWeight: '600', color: 'var(--accent-color)' }}>{membership.membership_number}</td>
                      <td>{membership.profiles?.full_name}</td>
                      <td>{new Date(membership.expiry_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${expired ? 'rejected' : 'approved'}`}>
                          {expired ? t('expired') : t('valid')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link href={`/verify/membership/${membership.id}`} className="btn" style={{ width: 'auto', padding: '0.4rem 0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '0.8rem', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <LinkIcon size={12} />
                            <span>Verify</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} className="accent-icon" />
          <span>{t('issueMembershipBtn')}</span>
        </h3>

        {formError && <div className="alert error">{formError}</div>}
        {formSuccess && <div className="alert success">{formSuccess}</div>}

        <form onSubmit={handleSubmit} id="issue_membership_form">
          <div className="form-group">
            <label className="form-label">{t('selectMember')} *</label>
            <select
              className="form-select"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              id="membership_member_select"
            >
              <option value="">-- {t('selectMember')} --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('membershipNumber')} *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={membershipNumber}
                onChange={(e) => setMembershipNumber(e.target.value)}
                required
                id="membership_number_input"
              />
              <button
                type="button"
                className="btn"
                onClick={generateMembershipNumber}
                style={{ width: 'auto', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', boxShadow: 'none', fontSize: '0.8rem', padding: '0.5rem' }}
              >
                Gen
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('startDate')} *</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              id="membership_start_date_input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">{t('expiryDate')} *</label>
            <input
              type="date"
              className="form-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              id="membership_expiry_date_input"
            />
          </div>

          <button type="submit" className="btn" disabled={submitLoading} id="membership_submit_btn">
            {submitLoading ? t('submitting') : t('issueMembershipBtn')}
          </button>
        </form>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .responsive-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
