'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Award, CreditCard, ExternalLink, Download, User } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function MyCertificates() {
  const { user, profile } = useAuth();
  const { t, lang } = useLanguage();

  const [certs, setCerts] = useState([]);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [membershipQr, setMembershipQr] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchCertificatesAndCard = async () => {
      setLoading(true);
      try {
        // 1. Fetch certificates
        const { data: certData } = await supabase
          .from('certificates')
          .select(`
            *,
            courses:course_id (title, instructor, duration)
          `)
          .eq('member_id', user.id);
        setCerts(certData || []);

        // 2. Fetch membership details
        const { data: memData } = await supabase
          .from('memberships')
          .select('*')
          .eq('member_id', user.id)
          .order('created_at', { ascending: false })
          .maybeSingle();

        setMembership(memData);

        // Generate QR code for the membership card if active
        if (memData) {
          const verificationUrl = `${window.location.origin}/verify/membership/${memData.id}`;
          QRCode.toDataURL(verificationUrl, { width: 80, margin: 1 }, (err, url) => {
            if (!err) setMembershipQr(url);
          });
        }
      } catch (err) {
        console.error('Error fetching member certificates/cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificatesAndCard();
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }} className="responsive-grid-layout">
      
      {/* Certificates List */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} className="accent-icon" />
          <span>{t('statsCertificates')}</span>
        </h3>

        {certs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t('noEarnedCertificates')}</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('certNumber')}</th>
                  <th>{t('courseCompleted')}</th>
                  <th>{t('dateOfIssue')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr key={cert.id}>
                    <td style={{ fontWeight: '600', color: 'var(--success-color)' }}>{cert.certificate_number}</td>
                    <td>{cert.courses?.title}</td>
                    <td>{new Date(cert.issue_date).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/verify/certificate/${cert.id}`} className="btn" style={{ width: 'auto', padding: '0.4rem 0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '0.8rem', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ExternalLink size={12} />
                          <span>{t('verifyBtn').split(' ')[0]}</span>
                        </Link>
                        {cert.pdf_url && (
                          <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.8rem', boxShadow: 'none' }}>
                            <Download size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Digital Membership Card Preview */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={20} className="accent-icon" />
          <span>{lang === 'ar' ? 'بطاقة العضوية الرقمية' : 'Digital Membership Card'}</span>
        </h3>

        {membership ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="membership-card-glow">
              <div className="membership-card-header">
                <span className="membership-card-logo">{lang === 'ar' ? 'بطاقة عضوية' : 'Membership Card'}</span>
                <span className={`badge ${isMemExpired ? 'rejected' : 'approved'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                  {isMemExpired ? t('expired') : t('valid')}
                </span>
              </div>

              <div className="membership-card-body">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt={profile.full_name} className="membership-card-photo" />
                ) : (
                  <div className="membership-card-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    <User size={24} />
                  </div>
                )}
                <div className="membership-card-info" style={{ textAlign: 'start' }}>
                  <span className="membership-card-name">{profile?.full_name}</span>
                  <span className="membership-card-number">{membership.membership_number}</span>
                </div>
              </div>

              <div className="membership-card-footer">
                <div className="membership-card-date" style={{ textAlign: 'start' }}>
                  <div>{t('expiryDate')}: {new Date(membership.expiry_date).toLocaleDateString()}</div>
                </div>
                {membershipQr && (
                  <img src={membershipQr} alt="Membership QR" className="membership-card-qr" />
                )}
              </div>
            </div>

            <Link href={`/verify/membership/${membership.id}`} className="btn" style={{ width: '100%' }}>
              <span>{t('viewCard')}</span>
            </Link>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {lang === 'ar' ? 'لا تملك بطاقة عضوية نشطة حالياً.' : 'You do not have an active membership card.'}
          </p>
        )}
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
