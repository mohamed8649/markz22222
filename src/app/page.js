'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  ShieldCheck, Search, BookOpen, CreditCard, Award, 
  Users, User, Book, Clock, MapPin, Phone, Mail, 
  ArrowRight, CheckCircle2, ChevronDown, Star, Building2, Quote,
  Play, Gift, ChevronRight, MessageSquare, Briefcase, Globe, Check, X
} from 'lucide-react';

const localTranslations = {
  ar: {
    badge: "تعلم الآن.. وطور مستقبلك",
    heroTitle: "مركز المستقبل للتدريب والتطوير",
    heroSubtitle: "نقدم دورات تدريبية معتمدة وشهادات موثقة لرفع مهاراتك وبناء مستقبل مهني ناجح في مختلف المجالات التقنية والإدارية.",
    exploreBtn: "استكشف الدورات",
    watchVideoBtn: "شاهد الفيديو",
    
    // Hero features
    featAccredited: "شهادات معتمدة",
    featAccreditedDesc: "معتمدة محلياً ودولياً",
    featPractical: "تعلم عملي",
    featPracticalDesc: "تطبيقات عملية",
    featInstructors: "مدربون محترفون",
    featInstructorsDesc: "ذوي خبرة عالية",
    featSupport: "دعم مستمر",
    featSupportDesc: "مساعدة على مدار الساعة",
    
    // Stats
    statExperience: "سنوات من الخبرة",
    statInstructors: "مدرب محترف",
    statCertificates: "شهادة صادرة",
    statStudents: "متدرب ناجح",
    statCourses: "دورة تدريبية",
    
    // Courses
    coursesTitle: "الدورات التدريبية",
    coursesSubtitle: "اختر الدورة المناسبة لك وابدأ رحلتك نحو التميز",
    hourBadge: "ساعة",
    currency: "دينار",
    bookNow: "احجز الآن",
    showAllCourses: "عرض جميع الدورات",
    
    // Features
    featuresBadge: "مميزاتنا",
    featuresTitle: "لماذا تختار منصتنا؟",
    feat1: "مجتمع نشط",
    feat1Desc: "التحق بمجتمع من الطلاب والمحترفين لتبادل الخبرات",
    feat2: "مشاريع عملية",
    feat2Desc: "تطبيقات ومشاريع عملية تضاف لمسيرتك الذاتية",
    feat3: "دعم فني",
    feat3Desc: "دعم فني ومساعدة على مدار الساعة لمواجهة أي عقبات",
    feat4: "تعلم مرن",
    feat4Desc: "تعلم في أي وقت ومن أي مكان يناسبك",
    feat5: "محتوى حديث",
    feat5Desc: "مناهج محدثة باستمرار تتماشى مع سوق العمل",
    feat6: "شهادات موثقة",
    feat6Desc: "شهادات معتمدة محلياً ودولياً يمكن التحقق منها",
    
    // Middle sections
    whyChooseUs: "لماذا تختارنا؟",
    whyChooseUs1: "خبرة أكثر من 5 سنوات في مجال التدريب",
    whyChooseUs2: "آلاف المتدربين الناجحين",
    whyChooseUs3: "شراكات مع كبرى الشركات",
    whyChooseUs4: "متابعة ما بعد التدريب",
    whyChooseUs5: "ضمان استرجاع في حال عدم الرضا",
    
    testimonialsTitle: "ماذا يقول متدربونا؟",
    testimonialText: "كانت تجربة رائعة! المحتوى ممتاز والمدربون محترفون جداً. حصلت على وظيفة بعد انتهاء الدورة بشهر.",
    studentName: "أحمد محمد",
    studentRole: "مطور ويب",
    
    verifyTitle: "تحقق من الشهادة",
    verifyPlaceholder: "أدخل رقم الشهادة",
    verifyBtnText: "تحقق الآن",
    howToFindCode: "كيفية العثور على رقم الشهادة؟",
    
    // CTA
    ctaTitle: "ابدأ رحلتك التعليمية اليوم",
    ctaSubtitle: "سجل الآن واحصل على خصم 27% على أول دورة",
    registerNowBtn: "سجل الآن",
    
    // Footer
    footerDesc: "نحن نسعى لتمكين الأفراد من خلال تعليم وتدريب عالي الجودة لبناء مستقبل أفضل.",
    centerInfo: "معلومات المركز",
    supportHelp: "الدعم والمساعدة",
    quickLinks: "روابط سريعة",
    newsletterTitle: "النشرة البريدية",
    newsletterDesc: "اشترك للحصول على آخر الأخبار والعروض",
    subscribeBtn: "اشترك",
    copyright: "جميع الحقوق محفوظة © 2024 مركز المستقبل للتدريب والتطوير",
    credits: "تصميم وتطوير فريق المستقبل"
  },
  en: {
    badge: "Learn Now.. Develop Your Future",
    heroTitle: "Future Center for Training & Development",
    heroSubtitle: "We provide certified training courses and documented certificates to elevate your skills and build a successful professional career in various technical and administrative fields.",
    exploreBtn: "Explore Courses",
    watchVideoBtn: "Watch Video",
    
    // Hero features
    featAccredited: "Accredited Certificates",
    featAccreditedDesc: "Accredited locally & globally",
    featPractical: "Practical Learning",
    featPracticalDesc: "Hands-on projects",
    featInstructors: "Expert Mentors",
    featInstructorsDesc: "Highly experienced",
    featSupport: "Continuous Support",
    featSupportDesc: "Helpdesk round the clock",
    
    // Stats
    statExperience: "Years of Experience",
    statInstructors: "Expert Mentors",
    statCertificates: "Issued Certificates",
    statStudents: "Successful Graduates",
    statCourses: "Training Programs",
    
    // Courses
    coursesTitle: "Training Programs",
    coursesSubtitle: "Select the program that suits your career goals and begin your excellence journey",
    hourBadge: "Hours",
    currency: "LYD",
    bookNow: "Book Now",
    showAllCourses: "Show All Courses",
    
    // Features
    featuresBadge: "Our Features",
    featuresTitle: "Why Choose Our Platform?",
    feat1: "Active Community",
    feat1Desc: "Join a network of students and professionals to exchange expertise",
    feat2: "Practical Projects",
    feat2Desc: "Hands-on assignments to build up your professional portfolio",
    feat3: "Technical Support",
    feat3Desc: "Round-the-clock helpdesk to assist with any challenges",
    feat4: "Flexible Study",
    feat4Desc: "Learn at your own pace from anywhere in the world",
    feat5: "Modern Content",
    feat5Desc: "Curriculums continuously updated to match job market trends",
    feat6: "Verified Credentials",
    feat6Desc: "Locally & globally certified credentials verifiable instantly",
    
    // Middle sections
    whyChooseUs: "Why Choose Us?",
    whyChooseUs1: "Over 5 years of training expertise",
    whyChooseUs2: "Thousands of successful graduates",
    whyChooseUs3: "Strategic partnerships with corporate leaders",
    whyChooseUs4: "Post-training career guidance & follow-ups",
    whyChooseUs5: "100% satisfaction and money-back guarantee",
    
    testimonialsTitle: "What Our Students Say",
    testimonialText: "It was an amazing experience! The curriculum is comprehensive and the instructors are very professional. I secured a job just a month after completing the course.",
    studentName: "Ahmed Mohamed",
    studentRole: "Web Developer",
    
    verifyTitle: "Verify Credentials",
    verifyPlaceholder: "Enter certificate number",
    verifyBtnText: "Verify Now",
    howToFindCode: "How to find certificate number?",
    
    // CTA
    ctaTitle: "Start Your Learning Journey Today",
    ctaSubtitle: "Register now and get 27% discount on your first course",
    registerNowBtn: "Register Now",
    
    // Footer
    footerDesc: "We aim to empower individuals with high-quality education and training to build a brighter future.",
    centerInfo: "Center Info",
    supportHelp: "Support & Help",
    quickLinks: "Quick Links",
    newsletterTitle: "Newsletter",
    newsletterDesc: "Subscribe to receive latest news and promotions",
    subscribeBtn: "Subscribe",
    copyright: "All Rights Reserved © 2024 Future Center for Training & Development",
    credits: "Designed & Developed by Future Team"
  }
};

export default function LandingPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const lt = (key) => {
    return localTranslations[lang]?.[key] || localTranslations['en']?.[key] || key;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!searchQuery.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال رمز تحقق صالح.' : 'Please enter a valid verification code.');
      return;
    }

    setLoading(true);

    try {
      // 1. Check certificates
      const { data: cert } = await supabase
        .from('certificates')
        .select('id')
        .eq('certificate_number', searchQuery.trim())
        .maybeSingle();

      if (cert) {
        router.push(`/verify/certificate/${cert.id}`);
        return;
      }

      // 2. Check memberships
      const { data: member } = await supabase
        .from('memberships')
        .select('id')
        .eq('membership_number', searchQuery.trim())
        .maybeSingle();

      if (member) {
        router.push(`/verify/membership/${member.id}`);
        return;
      }

      setError(lang === 'ar' ? 'لم يتم العثور على هذا السجل. يرجى التأكد من الرقم.' : 'Record not found. Please verify the ID.');
    } catch (err) {
      console.error('Verification error:', err);
      setError(lang === 'ar' ? 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterSuccess(lang === 'ar' ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(''), 4000);
  };

  // Mock Courses Data matching mockup details
  const mockCourses = [
    { 
      name: lang === 'ar' ? 'دورة التسويق الرقمي' : 'Digital Marketing Course', 
      desc: lang === 'ar' ? 'تعلم SEO, Social Media, وبناء خطط تسويقية ناجحة' : 'Learn SEO, Social Media, & strategic marketing campaign design',
      price: '250', 
      duration: '20', 
      rating: '4.5', 
      reviews: '70',
      gradient: 'linear-gradient(135deg, #fb923c, #ea580c)'
    },
    { 
      name: lang === 'ar' ? 'دورة تحليل البيانات' : 'Data Analysis Course', 
      desc: lang === 'ar' ? 'تعلم Excel, SQL, Power BI وتطبيقات عملية' : 'Master data pipelines with Excel, SQL, Power BI and visualization',
      price: '300', 
      duration: '25', 
      rating: '4.6', 
      reviews: '35',
      gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)'
    },
    { 
      name: lang === 'ar' ? 'دورة البرمجة Python' : 'Python Programming Course', 
      desc: lang === 'ar' ? 'تعلم لغة Python من الصفر إلى الاحتراف' : 'Acquire coding logic with Python from syntax basics to backend deployment',
      price: '500', 
      duration: '30', 
      rating: '4.9', 
      reviews: '156',
      gradient: 'linear-gradient(135deg, #4ade80, #16a34a)'
    },
    { 
      name: lang === 'ar' ? 'دورة التصميم الجرافيكي' : 'Graphic Design Course', 
      desc: lang === 'ar' ? 'تعلم Photoshop, Illustrator وتصميم الهويات البصرية' : 'Learn Photoshop, Illustrator, and corporate brand layout assets',
      price: '350', 
      duration: '35', 
      rating: '4.7', 
      reviews: '96',
      gradient: 'linear-gradient(135deg, #c084fc, #9333ea)'
    },
    { 
      name: lang === 'ar' ? 'دورة تطوير الويب الشامل' : 'Comprehensive Web Dev Course', 
      desc: lang === 'ar' ? 'تعلم HTML, CSS, JavaScript وبناء مواقع احترافية' : 'Full-stack fundamentals covering HTML, CSS, Javascript, and responsive UI',
      price: '450', 
      duration: '40', 
      rating: '4.8', 
      reviews: '120',
      gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)'
    }
  ];

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        
        {/* Hero Section */}
        <section className="hero" style={{ padding: '6rem 6% 8rem 6%' }}>
          <div className="hero-text">
            <span className="hero-badge">
              {lt('badge')}
            </span>
            <h1 className="hero-title" style={{ fontSize: '3.25rem', color: '#0f172a', fontWeight: '800', lineHeight: '1.25' }}>
              {lt('heroTitle')}
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: '#475569', margin: '1.5rem 0 2.5rem 0', lineHeight: '1.75', maxWidth: '600px' }}>
              {lt('heroSubtitle')}
            </p>
            
            <div className="hero-actions" style={{ display: 'flex', gap: '1rem' }}>
              <a href="#courses-section" className="btn" style={{ background: '#0064d2', border: '1px solid #0064d2', color: '#ffffff', padding: '0.8rem 2.25rem', borderRadius: '6px', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(0, 100, 210, 0.2)' }}>
                {lt('exploreBtn')}
              </a>
              <button onClick={() => setVideoModalOpen(true)} className="btn" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.8rem 2.25rem', borderRadius: '6px', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Play size={18} fill="#0f172a" />
                <span>{lt('watchVideoBtn')}</span>
              </button>
            </div>

            {/* Hero mini boxes */}
            <div className="hero-feature-grid">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '50%', background: '#e0f2fe' }}>
                  <Award size={16} style={{ color: '#0064d2' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{lt('featAccredited')}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lt('featAccreditedDesc')}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '50%', background: '#e0f2fe' }}>
                  <BookOpen size={16} style={{ color: '#0064d2' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{lt('featPractical')}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lt('featPracticalDesc')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '50%', background: '#e0f2fe' }}>
                  <Users size={16} style={{ color: '#0064d2' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{lt('featInstructors')}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lt('featInstructorsDesc')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '50%', background: '#e0f2fe' }}>
                  <Clock size={16} style={{ color: '#0064d2' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{lt('featSupport')}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lt('featSupportDesc')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-mockup-wrapper">
            <img 
              src="/graduation_books.png" 
              alt="Graduation Cap and Diploma" 
              className="hero-mockup-img"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15))' }}
            />
          </div>
        </section>

        {/* Floating Stats Bar Grid */}
        <div className="stats-bar-grid">
          <div className="stat-bar-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', textAlign: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stat-bar-value" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0064d2' }}>5</span>
              <span className="stat-bar-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>{lt('statExperience')}</span>
            </div>
            <div style={{ background: '#e0f2fe', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} style={{ color: '#0064d2' }} />
            </div>
          </div>

          <div className="stat-bar-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', textAlign: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stat-bar-value" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0064d2' }}>+15</span>
              <span className="stat-bar-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>{lt('statInstructors')}</span>
            </div>
            <div style={{ background: '#e0f2fe', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} style={{ color: '#0064d2' }} />
            </div>
          </div>

          <div className="stat-bar-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', textAlign: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stat-bar-value" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0064d2' }}>+980</span>
              <span className="stat-bar-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>{lt('statCertificates')}</span>
            </div>
            <div style={{ background: '#e0f2fe', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} style={{ color: '#0064d2' }} />
            </div>
          </div>

          <div className="stat-bar-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', textAlign: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stat-bar-value" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0064d2' }}>+1250</span>
              <span className="stat-bar-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>{lt('statStudents')}</span>
            </div>
            <div style={{ background: '#e0f2fe', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} style={{ color: '#0064d2' }} />
            </div>
          </div>

          <div className="stat-bar-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', textAlign: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stat-bar-value" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0064d2' }}>+250</span>
              <span className="stat-bar-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>{lt('statCourses')}</span>
            </div>
            <div style={{ background: '#e0f2fe', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} style={{ color: '#0064d2' }} />
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <section style={{ padding: '5rem 6%', background: '#f8fafc' }} id="courses-section">
          <h2 className="section-title" style={{ fontSize: '2.25rem', color: '#0f172a', fontWeight: '800' }}>
            {lt('coursesTitle')}
          </h2>
          <p className="section-subtitle" style={{ fontSize: '1.05rem', color: '#64748b' }}>
            {lt('coursesSubtitle')}
          </p>

          <div className="cards-grid" style={{ maxWidth: '1200px', margin: '0 auto', gap: '2rem' }}>
            {mockCourses.map((course, idx) => (
              <div key={idx} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'start' }}>
                <div style={{ height: '140px', background: course.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', position: 'relative' }}>
                  <BookOpen size={48} style={{ opacity: 0.25 }} />
                  <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', color: '#ffffff' }}>
                    {course.duration} {lt('hourBadge')}
                  </span>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>{course.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', minHeight: '40px' }}>{course.desc}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0064d2' }}>
                      {course.price} {lt('currency')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                      <Star size={14} fill="#eab308" style={{ color: '#eab308' }} />
                      <span>{course.rating}</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>({course.reviews})</span>
                    </span>
                  </div>

                  <button 
                    onClick={() => router.push(user ? '/member/courses' : '/login')} 
                    className="btn" 
                    style={{ width: '100%', background: '#0064d2', border: '1px solid #0064d2', color: '#ffffff', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <span>{lt('bookNow')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }}>
            <button 
              onClick={() => router.push(user ? '/member/courses' : '/login')} 
              className="btn" 
              style={{ width: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.8rem 2.5rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.95rem' }}
            >
              {lt('showAllCourses')}
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '5rem 6%' }} id="features-section">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: '#0064d2', border: '1px solid #e0f2fe', padding: '0.4rem 1.25rem', borderRadius: '9999px', background: '#f0f9ff' }}>
              {lt('featuresBadge')}
            </span>
            <h2 className="section-title" style={{ marginTop: '1.25rem', fontSize: '2.25rem', color: '#0f172a', fontWeight: '800' }}>
              {lt('featuresTitle')}
            </h2>
          </div>

          <div className="cards-grid" style={{ maxWidth: '1200px', margin: '0 auto', gap: '1.5rem' }}>
            {[
              { title: lt('feat1'), desc: lt('feat1Desc'), icon: <MessageSquare size={24} /> },
              { title: lt('feat2'), desc: lt('feat2Desc'), icon: <Briefcase size={24} style={{ color: '#0064d2' }} /> },
              { title: lt('feat3'), desc: lt('feat3Desc'), icon: <Phone size={24} style={{ color: '#0064d2' }} /> },
              { title: lt('feat4'), desc: lt('feat4Desc'), icon: <Globe size={24} style={{ color: '#0064d2' }} /> },
              { title: lt('feat5'), desc: lt('feat5Desc'), icon: <BookOpen size={24} style={{ color: '#0064d2' }} /> },
              { title: lt('feat6'), desc: lt('feat6Desc'), icon: <ShieldCheck size={24} style={{ color: '#0064d2' }} /> },
            ].map((feat, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'start' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '8px', background: '#e0f2fe', color: '#0064d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feat.icon}
                </div>
                <h4 style={{ fontWeight: '800', fontSize: '1.15rem', color: '#0f172a' }}>{feat.title}</h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Columns Grid (Why Choose Us, Testimonials, Verification Widget) */}
        <section style={{ padding: '4rem 6% 6rem 6%', background: '#f8fafc' }} id="bottom-cols-section">
          <div className="bottom-three-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Column 1: Why Choose Us */}
            <div style={{ textAlign: 'start', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{lt('whyChooseUs')}</span>
              </h3>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <li key={num} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
                    <div style={{ background: '#d1fae5', color: '#059669', width: '1.25rem', height: '1.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{lt(`whyChooseUs${num}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Testimonials */}
            <div style={{ textAlign: 'start', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                {lt('testimonialsTitle')}
              </h3>

              <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="#eab308" style={{ color: '#eab308' }} />
                  ))}
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{lt('testimonialText')}"
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#e0f2fe', color: '#0064d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem' }}>
                    أ
                  </div>
                  <div>
                    <h5 style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{lt('studentName')}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lt('studentRole')}</span>
                  </div>
                </div>

                {/* Slider Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <span style={{ width: '16px', height: '6px', borderRadius: '3px', background: '#0064d2' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1' }} />
                </div>
              </div>
            </div>

            {/* Column 3: Verification Widget */}
            <div style={{ textAlign: 'start', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: '#0064d2' }} />
                <span>{lt('verifyTitle')}</span>
              </h3>

              <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {lang === 'ar' ? 'أدخل رقم الشهادة أو رقم العضوية للتحقق الفوري من صحتها وصلاحيتها.' : 'Enter the certificate number or membership ID to verify its authenticity instantly.'}
                </p>

                {error && (
                  <div className="alert error" style={{ padding: '0.75rem', fontSize: '0.85rem', marginBottom: 0 }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={lt('verifyPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingInlineStart: '2.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
                      required
                    />
                    <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem', color: '#94a3b8' }} />
                  </div>

                  <button type="submit" className="btn" disabled={loading} style={{ background: '#0064d2', border: '1px solid #0064d2', color: '#ffffff', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700' }}>
                    {loading ? t('loading') : lt('verifyBtnText')}
                  </button>
                </form>

                <a href="#help" onClick={(e) => { e.preventDefault(); setHelpModalOpen(true); }} style={{ fontSize: '0.8rem', color: '#0064d2', fontWeight: '700', textDecoration: 'underline', alignSelf: 'center', marginTop: '0.5rem' }}>
                  {lt('howToFindCode')}
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* CTA discount banner */}
        <section style={{ padding: '1rem 6%' }}>
          <div className="cta-banner" style={{ background: 'linear-gradient(135deg, #0064d2, #3b82f6)', borderRadius: '12px', padding: '2.5rem 3.5rem' }}>
            <div className="cta-text" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', width: '3.5rem', height: '3.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={28} style={{ color: '#ffffff' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
                <h3 className="cta-title" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {lt('ctaTitle')}
                </h3>
                <p className="cta-subtitle" style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', margin: '0.25rem 0 0 0' }}>
                  {lt('ctaSubtitle')}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => router.push(user ? '/member' : '/register')} 
              className="cta-btn" 
              style={{ background: '#ffffff', color: '#0064d2', border: 'none', padding: '0.8rem 2.25rem', borderRadius: '6px', fontWeight: '800', fontSize: '0.95rem' }}
            >
              {lt('registerNowBtn')}
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="main-footer" style={{ background: '#0f172a', color: '#ffffff', padding: '4rem 6% 2rem 6%' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr 1fr 1.25fr', gap: '3rem', maxWidth: '1200px', margin: '0 auto 3rem auto' }}>
          
          {/* Col 1: Logo & description */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <Award size={28} style={{ color: '#3b82f6' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                  {lang === 'ar' ? 'مركز المستقبل' : 'Future Center'}
                </span>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  {lang === 'ar' ? 'والتطوير' : '& Development'}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }}>
              {lt('footerDesc')}
            </p>
            <div className="footer-socials" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div className="social-icon" style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.85rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className="social-icon" style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.85rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </div>
              <div className="social-icon" style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.85rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <div className="social-icon" style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.85rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </div>
              <div className="social-icon" style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.85rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
              </div>
            </div>
          </div>

          {/* Col 2: Center Info */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'start' }}>
            <h4 className="footer-col-title" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#3b82f6', borderBottom: '2px solid rgba(59, 130, 246, 0.2)', paddingBottom: '0.5rem', alignSelf: 'flex-start' }}>
              {lt('centerInfo')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '0.15rem' }} />
                <span>{lang === 'ar' ? 'ليبيا - طرابلس - شارع الجامعة - بجانب مصرف الجمهورية' : 'Libya - Tripoli - University St. - Next to Jumhouria Bank'}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} dir="ltr">
                <Phone size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <span>+218 91 234 5678</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} dir="ltr">
                <Phone size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <span>+218 92 345 6739</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <span>info@futuretraining.ly</span>
              </div>
            </div>
          </div>

          {/* Col 3: Support & Help */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'start' }}>
            <h4 className="footer-col-title" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#3b82f6', borderBottom: '2px solid rgba(59, 130, 246, 0.2)', paddingBottom: '0.5rem', alignSelf: 'flex-start' }}>
              {lt('supportHelp')}
            </h4>
            <ul className="footer-links-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</a></li>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a></li>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</a></li>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</a></li>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}</a></li>
            </ul>
          </div>

          {/* Col 4: Quick Links + Newsletter */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'start' }}>
            <h4 className="footer-col-title" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#3b82f6', borderBottom: '2px solid rgba(59, 130, 246, 0.2)', paddingBottom: '0.5rem', alignSelf: 'flex-start' }}>
              {lt('quickLinks')}
            </h4>
            <ul className="footer-links-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
              <li className="footer-link-item"><a href="#courses-section">{lang === 'ar' ? 'الدورات' : 'Courses'}</a></li>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'الباقات' : 'Packages'}</a></li>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'المدربين' : 'Instructors'}</a></li>
              <li className="footer-link-item"><a href="#">{lang === 'ar' ? 'المدونة' : 'Blog'}</a></li>
            </ul>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>{lt('newsletterTitle')}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{lt('newsletterDesc')}</span>
              
              {newsletterSuccess && (
                <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '700' }}>
                  {newsletterSuccess}
                </span>
              )}

              <form onSubmit={handleNewsletterSubmit} className="newsletter-form" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', flex: 1 }}
                  required
                />
                <button type="submit" className="newsletter-btn" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                  {lt('subscribeBtn')}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="footer-copy" style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {lt('copyright')}
          </span>
          <span className="footer-copy" style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {lt('credits')}
          </span>
        </div>
      </footer>

      {/* Video Modal Overlay */}
      {videoModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }} onClick={() => setVideoModalOpen(false)}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', width: '100%', maxWidth: '720px', position: 'relative', boxShadow: 'var(--shadow-lg)' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setVideoModalOpen(false)} style={{ position: 'absolute', top: '-2.5rem', right: '0', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
              <X size={28} />
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', background: '#000000' }}>
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Training Center Presentation Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Help Modal Overlay */}
      {helpModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }} onClick={() => setHelpModalOpen(false)}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '480px', position: 'relative', boxShadow: 'var(--shadow-lg)', textAlign: 'start' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setHelpModalOpen(false)} style={{ position: 'absolute', top: '1rem', [lang === 'ar' ? 'left' : 'right']: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              {lang === 'ar' ? 'أين أجد رقم الشهادة؟' : 'Where is the Certificate Number?'}
            </h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                {lang === 'ar' 
                  ? 'ستجد رقم التحقق الفريد مطبوعاً في أسفل الشهادة الورقية أو الرقمية مباشرة بجانب رمز الاستجابة السريعة (QR Code).' 
                  : 'You will find the unique verification number printed at the bottom of the printed or digital certificate, directly next to the QR Code.'}
              </p>
              <p>
                {lang === 'ar' 
                  ? 'مثال على صيغة الرقم: C-2024-XXXX' 
                  : 'Example format of the code: C-2024-XXXX'}
              </p>
              <p>
                {lang === 'ar' 
                  ? 'أما بالنسبة لبطاقات العضوية، فيمكنك استخدام الرقم المطبوع في واجهة البطاقة (مثال: M-10XX).' 
                  : 'For membership cards, you can use the membership ID printed on the front of the smart card (e.g. M-10XX).'}
              </p>
            </div>
            <button onClick={() => setHelpModalOpen(false)} className="btn" style={{ width: '100%', background: '#0064d2', border: '1px solid #0064d2', color: '#ffffff', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', marginTop: '1.5rem' }}>
              {lang === 'ar' ? 'فهمت ذلك' : 'I Understand'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
