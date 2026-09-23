import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const StudentCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons'); // lessons, resources, assignments, quizzes
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    setLoading(true);
    try {
      const [cRes, lRes, rRes, aRes, qRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/lessons/course/${id}`),
        api.get(`/resources/course/${id}`),
        api.get(`/assignments/course/${id}`),
        api.get(`/quizzes/course/${id}`),
      ]);

      if (cRes.data?.data) setCourse(cRes.data.data);
      if (lRes.data?.data) {
        setLessons(lRes.data.data);
        if (lRes.data.data.length > 0) {
          setSelectedLesson(lRes.data.data[0]);
        }
      }
      if (rRes.data?.data) setResources(rRes.data.data);
      if (aRes.data?.data) setAssignments(aRes.data.data);
      if (qRes.data?.data) setQuizzes(qRes.data.data);
    } catch (err) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (lessonId) => {
    try {
      const res = await api.post(`/lessons/${lessonId}/toggle-complete`);
      const completed = res.data?.data?.completed;
      setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, completed } : l));
      if (selectedLesson?.id === lessonId) {
        setSelectedLesson(prev => ({ ...prev, completed }));
      }
      toast.success(completed ? 'Lesson marked as completed!' : 'Lesson unmarked.');
      // Refresh course progress percentage
      const cRes = await api.get(`/courses/${id}`);
      if (cRes.data?.data) setCourse(cRes.data.data);
    } catch (err) {
      toast.error('Could not update lesson progress');
    }
  };

  if (loading) {
    return <Loader text="Loading course curriculum..." size="lg" />;
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Course Hero Header */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem 2rem',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
              {course.code}
            </span>
            <Badge variant="primary">{course.categoryName || 'Engineering'}</Badge>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>• {course.departmentName}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/student/courses')}>
            ← All Courses
          </Button>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
          {course.title}
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {course.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)' }}>
            <Icon name="user" size={18} color="var(--primary)" />
            <span>Faculty Instructor: <strong>{course.teacherName}</strong></span>
          </div>

          <div style={{ width: '260px' }}>
            <ProgressBar progress={course.progress || 0} showLabel={true} />
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        gap: '0.5rem',
      }}>
        {[
          { id: 'lessons', label: `Lessons (${lessons.length})`, icon: 'book' },
          { id: 'resources', label: `Resources (${resources.length})`, icon: 'download' },
          { id: 'assignments', label: `Assignments (${assignments.length})`, icon: 'fileText' },
          { id: 'quizzes', label: `Quizzes (${quizzes.length})`, icon: 'helpCircle' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === tab.id ? 'var(--primary-dark)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Lessons & Video/Content Viewer */}
      {activeTab === 'lessons' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }} className="course-lessons-grid">
          {/* Lessons List Playlist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
              Course Syllabus
            </h3>
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedLesson?.id === lesson.id ? 'var(--primary-light)' : 'var(--surface)',
                  border: `1px solid ${selectedLesson?.id === lesson.id ? 'var(--primary)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(lesson.id);
                    }}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name={lesson.completed ? "checkCircle" : "clock"}
                      size={18}
                      color={lesson.completed ? "var(--success)" : "var(--text-muted)"}
                    />
                  </span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
                      {lesson.title}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {lesson.durationMinutes || 45} mins
                    </span>
                  </div>
                </div>
                {lesson.completed && <Badge variant="success">Completed</Badge>}
              </div>
            ))}
          </div>

          {/* Active Lesson Reader & Viewer */}
          <div>
            {selectedLesson ? (
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                      {selectedLesson.title}
                    </h2>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Estimated study time: {selectedLesson.durationMinutes} minutes
                    </span>
                  </div>
                  <Button
                    variant={selectedLesson.completed ? "secondary" : "primary"}
                    size="sm"
                    icon={selectedLesson.completed ? "check" : "play"}
                    onClick={() => handleToggleComplete(selectedLesson.id)}
                  >
                    {selectedLesson.completed ? "Mark Incomplete" : "Mark as Completed"}
                  </Button>
                </div>

                {/* Video Player Box */}
                {selectedLesson.videoUrl && (
                  <div style={{
                    marginBottom: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    backgroundColor: '#000',
                  }}>
                    <iframe
                      src={selectedLesson.videoUrl}
                      title={selectedLesson.title}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Lesson Description & Content */}
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
                    Lecture Summary
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {selectedLesson.description}
                  </p>

                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
                    Syllabus Notes & Walkthrough
                  </h4>
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: 'var(--text)',
                    whiteSpace: 'pre-line',
                  }}>
                    {selectedLesson.content || 'Detailed lesson contents are provided by the instructor during scheduled university hours.'}
                  </div>
                </div>
              </Card>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Select a lesson to begin studying.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Course Resources */}
      {activeTab === 'resources' && (
        <Card title="Downloadable Course Materials" subtitle="Lecture slides, reference PDFs, and reading materials">
          {resources.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No resources uploaded for this course yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resources.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-alt)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.5rem',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}>
                      {r.resourceType}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
                        {r.title}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Uploaded {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    View Resource ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <Card title="Course Assignments" subtitle="Track requirements, deadlines, and submissions">
          {assignments.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No assignments assigned for this course.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {assignments.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>
                        {a.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Deadline: {new Date(a.deadline).toLocaleDateString()} • Max Marks: {a.maxMarks}
                      </span>
                    </div>
                    <Badge variant={a.status === 'GRADED' ? 'success' : a.status === 'SUBMITTED' ? 'primary' : 'warning'}>
                      {a.status}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {a.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" size="sm" onClick={() => navigate('/student/assignments')}>
                      Open Submission Portal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab 4: Quizzes */}
      {activeTab === 'quizzes' && (
        <Card title="Knowledge Assessments & Quizzes" subtitle="Take self-evaluations and periodic quizzes">
          {quizzes.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No quizzes currently available for this course.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>
                      {q.title}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {q.description} • {q.durationMinutes} minutes • {q.totalMarks} Marks
                    </p>
                    {q.attempted && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, display: 'inline-block', marginTop: '0.25rem' }}>
                        ✓ Attempted — Score: {q.score}/{q.totalMarks}
                      </span>
                    )}
                  </div>
                  <Button
                    variant={q.attempted ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => navigate(`/student/quizzes/${q.id}`)}
                  >
                    {q.attempted ? "Review Result" : "Start Quiz →"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <style>{`
        @media (max-width: 850px) {
          .course-lessons-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentCourseDetail;
export { StudentCourseDetail as CourseDetail };
