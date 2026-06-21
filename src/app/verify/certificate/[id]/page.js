'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import { Award, Calendar, CheckCircle2, FileText, Printer, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode';
import { useParams } from 'next/navigation';

export default function VerifyCertificate() {
  const params = useParams();
  const { id } = params;
  const { t } = useLanguage();
  
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchCertificate = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('certificates')
          .select(`
            *,
            profiles:member_id (full_name, email, phone),
            courses:course_id (title, description, instructor, duration)
          `)
          .eq('id', id)
          .single();

        if (fetchError || !data) {
          setError(true);
        } else {
          setCert(data);
          
          // Generate QR code pointing to this verification page
          const verificationUrl = window.location.href;
          QRCode.toDataURL(verificationUrl, { width: 100, margin: 1 }, (err, url) => {
            if (!err) setQrCodeData(url);
          });
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const handlePrint = () => {
    window.print();
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

  if (error || !cert) {
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
            <div className="verify-icon-wrapper success">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="section-title" style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0' }}>
              {t('verificationResult')}
            </h2>
            <span className="badge approved" style={{ fontSize: '0.85rem' }}>
              {t('valid')}
            </span>
          </div>

          {/* Certificate Layout */}
          <div className="verify-details" style={{ marginBottom: '2.5rem' }}>
            <div className="verify-row">
              <span className="verify-label">{t('verifiedCertificate')}</span>
              <span className="verify-value" style={{ color: 'var(--success-color)' }}>
                {cert.certificate_number}
              </span>
            </div>

            <div className="verify-row">
              <span className="verify-label">{t('holderName')}</span>
              <span className="verify-value">{cert.profiles?.full_name}</span>
            </div>

            <div className="verify-row">
              <span className="verify-label">{t('courseCompleted')}</span>
              <span className="verify-value">{cert.courses?.title}</span>
            </div>

            <div className="verify-row">
              <span className="verify-label">{t('gradeReceived')}</span>
              <span className="verify-value">{cert.grade}</span>
            </div>

            <div className="verify-row">
              <span className="verify-label">{t('dateOfIssue')}</span>
              <span className="verify-value">{new Date(cert.issue_date).toLocaleDateString()}</span>
            </div>
            
            <div className="verify-row" style={{ borderBottom: 'none' }}>
              <span className="verify-label">{t('instructor')}</span>
              <span className="verify-value">{cert.courses?.instructor}</span>
            </div>
          </div>

          {/* QR Code and Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'start' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{t('scanQRToVerify')}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('stampText')}</span>
            </div>
            {qrCodeData && (
              <img src={qrCodeData} alt="Verification QR Code" style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', background: '#fff', padding: '2px' }} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn" onClick={handlePrint} style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', boxShadow: 'none' }} id="print_cert_btn">
              <Printer size={16} />
              <span>{t('actions')} - Print</span>
            </button>
            {cert.pdf_url && (
              <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                <FileText size={16} />
                <span>{t('downloadPdf')}</span>
              </a>
            )}
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
          .verify-label {
            color: #444 !important;
          }
          .verify-value {
            color: #000 !important;
          }
          .badge {
            border: 1px solid #10b981 !important;
            color: #10b981 !important;
            background: none !important;
          }
          #print_cert_btn, #app_navbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
