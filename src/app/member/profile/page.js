'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { User, Phone, Upload, CheckCircle2 } from 'lucide-react';

export default function MemberProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const { t, lang } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!fullName) {
      setError(t('requiredField'));
      setLoading(false);
      return;
    }

    try {
      let photoUrl = profile.photo_url || '';

      // Upload profile image to Supabase storage if selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const randName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${randName}`;

        const { error: uploadError } = await supabase.storage
          .from('member-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('member-photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // Update profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          photo_url: photoUrl,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess(t('profileUpdated'));
      setFile(null);
      setFileName('');
      await refreshProfile(); // Refreshes the local auth context profile data
    } catch (err) {
      console.error('Error updating profile details:', err);
      setError(err.message || t('somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={20} className="accent-icon" />
        <span>{t('myProfile')}</span>
      </h3>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} id="profile_form">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt={profile.full_name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-color)' }} />
          ) : (
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '2px solid var(--border-color)' }}>
              <User size={40} />
            </div>
          )}

          <div style={{ width: '100%' }}>
            <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.5rem' }}>{t('profilePhoto')}</label>
            <div
              className="file-upload-wrapper"
              onClick={() => document.getElementById('profile_photo_input').click()}
              style={{ padding: '1rem' }}
            >
              <Upload size={18} className="file-upload-icon" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {fileName || (lang === 'ar' ? 'اختر صورة جديدة' : 'Choose New Photo')}
              </span>
              <input
                type="file"
                id="profile_photo_input"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('fullName')} *</label>
          <input
            type="text"
            className="form-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            id="profile_name_input"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label">{t('phone')}</label>
          <input
            type="tel"
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            id="profile_phone_input"
          />
        </div>

        <button type="submit" className="btn" disabled={loading} id="profile_submit_btn">
          {loading ? t('submitting') : t('saveChanges')}
        </button>
      </form>
    </div>
  );
}
