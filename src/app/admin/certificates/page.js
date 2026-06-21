'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Award, Upload, Search, Link as LinkIcon, FileCheck } from 'lucide-react';
import Link from 'next/link';

export default function ManageCertificates() {
  const { t, lang } = useLanguage();
  const [certs, setCerts] = useState([]);
  const [members, setMembers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Fields
  const [memberId, setMemberId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [grade, setGrade] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Generate unique cert number
  const generateCertificateNumber = () => {
    const num = `CERT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    setCertificateNumber(num);
  };

  useEffect(() => {
    generateCertificateNumber();
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

      // 2. Fetch active courses
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title')
        .eq('status', 'active');
      setCourses(courseData || []);

      // 3. Fetch certificates
      await fetchCertificates();
    } catch (err) {
      console.error('Error fetching certificates configurations data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      let query = supabase
        .from('certificates')
        .select(`
          *,
          profiles:member_id (full_name, email),
          courses:course_id (title)
        `);

      if (search.trim() !== '') {
        query = query.ilike('certificate_number', `%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error) {
        setCerts(data || []);
      }
    } catch (err) {
      console.error('Error querying certificates:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [search]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!memberId || !courseId || !grade || !certificateNumber) {
      setFormError(t('requiredField'));
      return;
    }

    setSubmitLoading(true);

    try {
      let pdfUrl = '';

      // Upload file to Supabase storage if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const randName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${randName}`;

        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('certificates')
          .getPublicUrl(filePath);

        pdfUrl = publicUrl;
      }

      // Generate verification token
      const verificationToken = `tok-${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

      // Insert certificate
      const { error: insertError } = await supabase.from('certificates').insert([
        {
          certificate_number: certificateNumber,
          member_id: memberId,
          course_id: courseId,
          issue_date: issueDate,
          grade,
          pdf_url: pdfUrl,
          verification_token: verificationToken,
        },
      ]);

      if (insertError) {
        setFormError(insertError.message);
      } else {
        setFormSuccess(t('certSuccess'));
        setMemberId('');
        setCourseId('');
        setGrade('');
        setFile(null);
        setFileName('');
        generateCertificateNumber();
        fetchCertificates();
      }
    } catch (err) {
      console.error('Certificate submission error:', err);
      setFormError(err.message || t('somethingWrong'));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }} className="responsive-grid-layout">
      
      {/* Certificate List */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('issuedCertificatesCount')}</h3>
          
          {/* Search */}
          <div style={{ position: 'relative', width: '250px' }}>
            <input
              type="text"
              className="form-input"
              placeholder={t('searchCertificates')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingStart: '2.5rem' }}
              id="certs_search_input"
            />
            <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lang === 'ar' ? 'auto' : '1rem', right: lang === 'ar' ? '1rem' : 'auto', color: 'var(--text-secondary)' }} />
          </div>
        </div>

        {loading ? (
          <div className="spinner-container" style={{ minHeight: '150px' }}>
            <div className="spinner"></div>
          </div>
        ) : certs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t('noCertificates')}</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('certNumber')}</th>
                  <th>{t('fullName')}</th>
                  <th>{t('courseCompleted')}</th>
                  <th>{t('gradeReceived')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr key={cert.id}>
                    <td style={{ fontWeight: '600', color: 'var(--success-color)' }}>{cert.certificate_number}</td>
                    <td>{cert.profiles?.full_name}</td>
                    <td>{cert.courses?.title}</td>
                    <td>{cert.grade}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/verify/certificate/${cert.id}`} className="btn" style={{ width: 'auto', padding: '0.4rem 0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '0.8rem', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <LinkIcon size={12} />
                          <span>Verify</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} className="accent-icon" />
          <span>{t('issueCertificates')}</span>
        </h3>

        {formError && <div className="alert error">{formError}</div>}
        {formSuccess && <div className="alert success">{formSuccess}</div>}

        <form onSubmit={handleSubmit} id="issue_cert_form">
          <div className="form-group">
            <label className="form-label">{t('selectMember')} *</label>
            <select
              className="form-select"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              id="cert_member_select"
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
            <label className="form-label">{t('selectCourse')} *</label>
            <select
              className="form-select"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              id="cert_course_select"
            >
              <option value="">-- {t('selectCourse')} --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('certNumber')} *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                required
                id="cert_number_input"
              />
              <button
                type="button"
                className="btn"
                onClick={generateCertificateNumber}
                style={{ width: 'auto', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', boxShadow: 'none', fontSize: '0.8rem', padding: '0.5rem' }}
              >
                Gen
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('grade')} *</label>
            <input
              type="text"
              className="form-input"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. Excellent / A+ / 95%"
              required
              id="cert_grade_input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('issueDate')} *</label>
            <input
              type="date"
              className="form-input"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
              id="cert_date_input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">{t('pdfFile')}</label>
            <div
              className="file-upload-wrapper"
              onClick={() => document.getElementById('cert_file_input').click()}
            >
              <Upload size={24} className="file-upload-icon" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {fileName || (lang === 'ar' ? 'اختر ملف PDF أو صورة شهادة' : 'Choose Certificate PDF or Image')}
              </span>
              <input
                type="file"
                id="cert_file_input"
                onChange={handleFileChange}
                accept="application/pdf,image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <button type="submit" className="btn" disabled={submitLoading} id="cert_submit_btn">
            {submitLoading ? t('submitting') : t('issueCertBtn')}
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
