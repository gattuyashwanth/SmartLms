import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/common/Icons';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get('/courses/public')
      .then((res) => {
        if (res.data && res.data.data) {
          setCourses(res.data.data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name="graduationCap" size={24} color="#FFFFFF" />
          </div>
          <span style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--primary-dark)', letterSpacing: '0.04em' }}>
            SMART LMS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="primary" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F5 100%)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}>
            <Icon name="award" size={16} color="var(--primary)" />
            University Academic Platform
          </div>

          <h1 style={{
            fontSize: '3.25rem',
            fontWeight: 800,
            color: 'var(--text)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em',
          }}>
            Learn  Explore  Grow.
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
          }}>
            Smart Learning Management System for modern education. Complete course management, interactive quizzes, automated grading, attendance tracking, and university analytics in one unified platform.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Get Started Now
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
              Sign In to Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section style={{
        padding: '2.5rem 2rem',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>8+</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Engineering Departments</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>50+</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Accredited Courses</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>95%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Class Attendance Average</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>100%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Automated Grade Tracking</div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section style={{ padding: '4.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Engineered for Modern University Education
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Empowering students, faculty, and academic administrators with purpose-built tools.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Icon name="book" size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dynamic Course Delivery</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Modular syllabus structure with multi-part lessons, embedded video lectures, lecture notes, downloadable slide decks, and self-paced completion tracking.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Icon name="checkCircle" size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Verified Attendance System</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Subject-wise roster marking with Present, Absent, and Late states. Automatic percentage formulas, attendance alerts, and monthly breakdown logs.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Icon name="award" size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Transparent Academic Grading</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Consolidated evaluation combining lab assignments, periodic quizzes, and semester exams. Automatically calculates percentages and letter grades (A+ to F).
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Icon name="helpCircle" size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Automated Quiz Engine</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Secure server-side evaluation. Multiple-choice questions with randomized options, timed attempts, and instant feedback reports.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Icon name="calendar" size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Timetable & Notice Board</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Interactive class schedules mapped by day, room, and session type (Lecture, Lab, Tutorial), accompanied by high-priority institutional circulars.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Icon name="shield" size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Enterprise Security</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Strict role-based isolation (Student, Teacher, Admin), BCrypt password hashing, stateless JWT authorization, and server-side course ownership verification.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Catalog */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text)' }}>Featured University Courses</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Explore accredited computing and technology curriculums</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Browse All Courses
            </Button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ height: '150px', backgroundColor: 'var(--primary-light)', position: 'relative' }}>
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="book" size={40} color="var(--primary)" />
                      </div>
                    )}
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(198, 40, 40, 0.9)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {course.code}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {course.categoryName || 'General'}
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
                        {course.title}
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {course.description ? course.description.slice(0, 90) + '...' : 'Comprehensive university syllabus course.'}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '0.75rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}>
                      <span>{course.teacherName || 'Faculty Instructor'}</span>
                      <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
                        Enroll
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Connecting to university course catalog...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: 'var(--primary)',
        color: '#FFFFFF',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to Accelerate Your Academic Journey?
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#FFEBEE', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join thousands of university students and professors using Smart LMS every day.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button
              style={{ backgroundColor: '#FFFFFF', color: 'var(--primary-dark)', border: 'none', fontWeight: 700 }}
              size="lg"
              onClick={() => navigate('/register')}
            >
              Register as Student
            </Button>
            <Button
              style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '2px solid #FFFFFF', fontWeight: 600 }}
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        <p>© 2026 Smart LMS. Built for modern universities with Spring Boot & React.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
