'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, CheckCircle, Clock, Book } from 'lucide-react';

export default function MyCourses() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const [enrolled, setEnrolled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const fetchCoursesData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch member's enrollments joined with course details
      const { data: enrollData } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses:course_id (*)
        `)
        .eq('member_id', user.id);
      setEnrolled(enrollData || []);

      // Get enrolled course IDs for exclusion
      const enrolledIds = enrollData?.map(e => e.course_id) || [];

      // 2. Fetch courses the user is NOT enrolled in and are active
      let availQuery = supabase
        .from('courses')
        .select('*')
        .eq('status', 'active');
      
      if (enrolledIds.length > 0) {
        availQuery = availQuery.not('id', 'in', `(${enrolledIds.join(',')})`);
      }

      const { data: availData } = await availQuery;
      setAvailable(availData || []);

    } catch (err) {
      console.error('Error fetching member courses lists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesData();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (enrollLoading) return;
    setEnrollLoading(true);

    try {
      const { error } = await supabase.from('enrollments').insert([
        {
          member_id: user.id,
          course_id: courseId,
          status: 'active',
        },
      ]);

      if (!error) {
        fetchCoursesData();
      } else {
        console.error('Enrollment error:', error.message);
      }
    } catch (err) {
      console.error('Enrollment submission error:', err);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Enrolled Courses */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} className="accent-icon" />
          <span>{t('myCourses')}</span>
        </h3>

        {enrolled.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t('noEnrolledCourses')}</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('courseTitle')}</th>
                  <th>{t('instructor')}</th>
                  <th>{t('duration')}</th>
                  <th>{t('gradeReceived')}</th>
                  <th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {enrolled.map((enroll) => (
                  <tr key={enroll.id}>
                    <td style={{ fontWeight: '600' }}>{enroll.courses?.title}</td>
                    <td>{enroll.courses?.instructor}</td>
                    <td>{enroll.courses?.duration}</td>
                    <td style={{ fontWeight: '600' }}>{enroll.grade || '-'}</td>
                    <td>
                      <span className={`badge ${enroll.status === 'completed' ? 'approved' : enroll.status === 'cancelled' ? 'rejected' : 'pending'}`}>
                        {enroll.status === 'completed'
                          ? (lang === 'ar' ? 'مكتملة' : 'Completed')
                          : enroll.status === 'cancelled'
                          ? (lang === 'ar' ? 'ملغية' : 'Cancelled')
                          : (lang === 'ar' ? 'مستمرة' : 'In Progress')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Available Courses */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Book size={20} className="accent-icon" style={{ color: 'var(--success-color)' }} />
          <span>{lang === 'ar' ? 'الدورات المتاحة للتسجيل' : 'Available Courses for Enrollment'}</span>
        </h3>

        {available.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'لا توجد دورات جديدة متاحة حالياً.' : 'No new courses available at the moment.'}
          </p>
        ) : (
          <div className="cards-grid">
            {available.map((course) => (
              <div key={course.id} className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'start' }}>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{course.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', minHeight: '40px' }}>
                    {course.description || '-'}
                  </p>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>{t('instructor')}: {course.instructor}</div>
                  <div>{t('duration')}: {course.duration}</div>
                </div>

                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrollLoading}
                  className="btn"
                  style={{ width: '100%', padding: '0.6rem', marginTop: 'auto' }}
                >
                  {enrollLoading ? t('submitting') : (lang === 'ar' ? 'سجل الآن' : 'Enroll Now')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
