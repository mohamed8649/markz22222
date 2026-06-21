'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import { CreditCard, Calendar, CheckCircle2, User, Printer, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode';
import { useParams } from 'next/navigation';

export default function VerifyMembership() {
  const params = useParams();
  const { id } = params;
  const { t, lang } = useLanguage();
  
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchMembership = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('memberships')
          .select(`
            *,
            profiles:member_id (full_name, email, phone, photo_url)
          `)
          .eq('id', id)
          .single();

        if (fetchError || !data) {
          setError(true);
        } else {
          setMembership(data);
          
          // Generate QR code pointing to this verification page
          const verificationUrl = window.location.href;
          QRCode.toDataURL(verificationUrl, { width: 100, margin: 1 }, (err, url) => {
            if (!err) setQrCodeData(url);
          });
        }
      } catch (err) {
        console.error('Error fetching membership:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const isExpired = () => {
    if (!membership) return false;
    return new Date(membership.expiry_date) < new Date() || membership.status === 'expired';
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content spinner-container">
          <div className="spinner"></div>
        </main>
      </div>
    );
  }

  if (error || !membership) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content verify-layout">
          <div className="glass-card verify-card" style={{ textAlignment: 'center' }}>
            <div className="verify-badge">
              <div className="verify-icon-wrapper error">
                <AlertTriangle size={32} />
              </div>
              <h2 className="section-title" style={{ fontSize: '1.75rem', marginTop: '1rem' }}>
                {t('notFoundTitle')}
              </h2>
            </div>
            <p className="verify-label" style={{ marginBottom: '2rem', lineHeight: '1.6', textAlign: 'center' }}>
              {t('notFoundDesc')}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content verify-layout">
        <div className="glass-card verify-card" style={{ maxWidth: '650px', padding: '2.5rem' }}>
          
          {/* Badge & Status */}
          <div className="verify-badge">
            <div className={`verify-icon-wrapper ${isExpired() ? 'error' : 'success'}`}>
              {isExpired() ? <AlertTriangle size={36} /> : <CheckCircle2 size={36} />}
            </div>
            <h2 className="section-title" style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0' }}>
              {t('verificationResult')}
            </h2>
            <span className={`badge ${isExpired() ? 'rejected' : 'approved'}`} style={{ fontSize: '0.85rem' }}>
              {isExpired() ? t('expired') : t('valid')}
            </span>
          </div>

          {/* Membership Card Visual */}
          <div className="membership-card-glow" style={{ marginBottom: '2rem' }}>
            <div className="membership-card-header">
              <span className="membership-card-logo">{lang === 'ar' ? 'بطاقة عضوية' : 'Membership Card'}</span>
              <span className={`badge ${isExpired() ? 'rejected' : 'approved'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                {isExpired() ? t('expired') : t('valid')}
              </span>
            </div>

            <div className="membership-card-body">
              {membership.profiles?.photo_url ? (
                <img src={membership.profiles.photo_url} alt={membership.profiles.full_name} className="membership-card-photo" />
              ) : (
                <div className="membership-card-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <User size={32} />
                </div>
              )}
              <div className="membership-card-info" style={{ textAlign: 'start' }}>
                <span className="membership-card-name">{membership.profiles?.full_name}</span>
                <span className="membership-card-number">{t('membershipNumber')}: {membership.membership_number}</span>
              </div>
            </div>

            <div className="membership-card-footer">
              <div className="membership-card-date" style={{ textAlign: 'start' }}>
                <div>{t('expiryDate')}: {new Date(membership.expiry_date).toLocaleDateString()}</div>
              </div>
              {qrCodeData && (
                <img src={qrCodeData} alt="Card QR Code" className="membership-card-qr" />
              )}
            </div>
          </div>

          {/* Membership Details */}
          <div className="verify-details" style={{ marginBottom: '2.5rem' }}>
            <div className="verify-row">
              <span className="verify-label">{t('verifiedMembership')}</span>
              <span className="verify-value" style={{ color: isExpired() ? 'var(--error-color)' : 'var(--success-color)' }}>
                {membership.membership_number}
              </span>
            </div>

            <div className="verify-row">
              <span className="verify-label">{t('holderName')}</span>
              <span className="verify-value">{membership.profiles?.full_name}</span>
            </div>

            <div className="verify-row">
              <span className="verify-label">{t('phone')}</span>
              <span className="verify-value">{membership.profiles?.phone || '-'}</span>
            </div>

            <div className="verify-row">
              <span className="verify-label">{t('startDate')}</span>
              <span className="verify-value">{new Date(membership.start_date).toLocaleDateString()}</span>
            </div>

            <div className="verify-row" style={{ borderBottom: 'none' }}>
              <span className="verify-label">{t('expiryDate')}</span>
              <span className="verify-value">{new Date(membership.expiry_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn" onClick={handlePrint} style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', boxShadow: 'none' }} id="print_member_btn">
              <Printer size={16} />
              <span>{t('actions')} - Print</span>
            </button>
          </div>

        </div>
      </main>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .verify-card, .verify-card * {
            visibility: visible;
          }
          .verify-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff !important;
            color: #000 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .membership-card-glow {
            border: 1px solid #000 !important;
            background: #f3f4f6 !important;
            color: #000 !important;
          }
          .membership-card-name, .membership-card-logo {
            color: #000 !important;
          }
          .verify-label {
            color: #444 !important;
          }
          .verify-value {
            color: #000 !important;
          }
          .badge {
            border: 1px solid ${isExpired() ? '#ef4444' : '#10b981'} !important;
            color: ${isExpired() ? '#ef4444' : '#10b981'} !important;
            background: none !important;
          }
          #print_member_btn, #app_navbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
