'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, BookOpen, Trash2, Search, Edit2 } from 'lucide-react';

export default function ManageCourses() {
  const { t, lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let query = supabase.from('courses').select('*');

      if (search.trim() !== '') {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error) {
        setCourses(data || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!title || !instructor || !duration) {
      setFormError(t('requiredField'));
      return;
    }

    setSubmitLoading(true);

    try {
      const { error } = await supabase.from('courses').insert([
        {
          title,
          description,
          instructor,
          duration,
          status: 'active',
        },
      ]);

      if (error) {
        setFormError(error.message);
      } else {
        setFormSuccess(lang === 'ar' ? 'تم إضافة الدورة بنجاح!' : 'Course added successfully!');
        setTitle('');
        setDescription('');
        setInstructor('');
        setDuration('');
        fetchCourses();
      }
    } catch (err) {
      console.error('Submit error:', err);
      setFormError(t('somethingWrong'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const toggleCourseStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('courses')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchCourses();
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }} className="responsive-grid-layout">
      
      {/* Course List */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('manageCourses')}</h3>
          
          {/* Search */}
          <div style={{ position: 'relative', width: '250px' }}>
            <input
              type="text"
              className="form-input"
              placeholder={t('searchCourses')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingStart: '2.5rem' }}
              id="courses_search_input"
            />
            <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lang === 'ar' ? 'auto' : '1rem', right: lang === 'ar' ? '1rem' : 'auto', color: 'var(--text-secondary)' }} />
          </div>
        </div>

        {loading ? (
          <div className="spinner-container" style={{ minHeight: '150px' }}>
            <div className="spinner"></div>
          </div>
        ) : courses.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t('noCourses')}</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('courseTitle')}</th>
                  <th>{t('instructor')}</th>
                  <th>{t('duration')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td style={{ fontWeight: '600' }}>
                      <div>{course.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginTop: '0.25rem' }}>{course.description || '-'}</div>
                    </td>
                    <td>{course.instructor}</td>
                    <td>{course.duration}</td>
                    <td>
                      <span className={`badge ${course.status === 'active' ? 'approved' : 'rejected'}`}>
                        {course.status === 'active' ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleCourseStatus(course.id, course.status)}
                        className="btn"
                        style={{ width: 'auto', padding: '0.4rem 0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '0.8rem', boxShadow: 'none' }}
                      >
                        {course.status === 'active' ? t('inactive') : t('active')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Course Form */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} className="accent-icon" />
          <span>{t('createCourse')}</span>
        </h3>

        {formError && <div className="alert error">{formError}</div>}
        {formSuccess && <div className="alert success">{formSuccess}</div>}

        <form onSubmit={handleSubmit} id="create_course_form">
          <div className="form-group">
            <label className="form-label">{t('courseTitle')} *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js Development"
              required
              id="course_title_input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('courseDesc')}</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Master the App Router..."
              style={{ minHeight: '80px', resize: 'vertical' }}
              id="course_desc_input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('instructor')} *</label>
            <input
              type="text"
              className="form-input"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Ahmad"
              required
              id="course_instructor_input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">{t('duration')} *</label>
            <input
              type="text"
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 4 Weeks"
              required
              id="course_duration_input"
            />
          </div>

          <button type="submit" className="btn" disabled={submitLoading} id="course_submit_btn">
            {submitLoading ? t('submitting') : t('addCourseBtn')}
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
