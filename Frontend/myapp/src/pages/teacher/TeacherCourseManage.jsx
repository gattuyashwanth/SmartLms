import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const TeacherCourseManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', content: '', videoUrl: '', durationMinutes: 45, sortOrder: 1 });
  const [savingLesson, setSavingLesson] = useState(false);

  // Resource modal state
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resourceForm, setResourceForm] = useState({ title: '', resourceType: 'PDF', fileUrl: '' });
  const [savingResource, setSavingResource] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const [cRes, lRes, rRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/lessons/course/${id}`),
        api.get(`/resources/course/${id}`),
      ]);
      if (cRes.data?.data) setCourse(cRes.data.data);
      if (lRes.data?.data) setLessons(lRes.data.data);
      if (rRes.data?.data) setResources(rRes.data.data);
    } catch (err) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setSavingLesson(true);
    try {
      await api.post('/lessons', {
        ...lessonForm,
        courseId: Number(id),
      });
      toast.success('Lesson published to syllabus!');
      setIsLessonModalOpen(false);
      setLessonForm({ title: '', description: '', content: '', videoUrl: '', durationMinutes: 45, sortOrder: lessons.length + 1 });
      loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lesson');
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      toast.success('Lesson removed.');
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    } catch (err) {
      toast.error('Could not delete lesson');
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setSavingResource(true);
    try {
      await api.post('/resources', {
        ...resourceForm,
        courseId: Number(id),
      });
      toast.success('Resource added to course!');
      setIsResourceModalOpen(false);
      setResourceForm({ title: '', resourceType: 'PDF', fileUrl: '' });
      loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add resource');
    } finally {
      setSavingResource(false);
    }
  };

  const handleDeleteResource = async (resId) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await api.delete(`/resources/${resId}`);
      toast.success('Resource removed.');
      setResources(prev => prev.filter(r => r.id !== resId));
    } catch (err) {
      toast.error('Failed to delete resource');
    }
  };

  if (loading) {
    return <Loader text="Loading course manager..." size="lg" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{course?.code}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• {course?.departmentName}</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
            Manage: {course?.title}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" onClick={() => navigate('/teacher/courses')}>
            ← Back to Courses
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsResourceModalOpen(true)} icon="download">
            Add Resource
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsLessonModalOpen(true)} icon="plus">
            Add New Lesson
          </Button>
        </div>
      </div>

      {/* Course Overview Card */}
      <Card title="Course Information">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {course?.description}
        </p>
      </Card>

      {/* Lessons List */}
      <Card
        title={`Course Lessons (${lessons.length})`}
        subtitle="Manage lecture topics, duration, and embedded video lectures"
        action={
          <Button variant="primary" size="sm" onClick={() => setIsLessonModalOpen(true)} icon="plus">
            Add Lesson
          </Button>
        }
      >
        {lessons.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No lessons created yet. Click "Add Lesson" to build your syllabus.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
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
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)' }}>
                    {lesson.sortOrder}. {lesson.title}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {lesson.durationMinutes} mins • {lesson.videoUrl ? 'Video included' : 'Text lecture'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="danger" size="sm" icon="trash" onClick={() => handleDeleteLesson(lesson.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Resources List */}
      <Card
        title={`Course Resources (${resources.length})`}
        subtitle="Shared documents, reference slides, and external links"
        action={
          <Button variant="secondary" size="sm" onClick={() => setIsResourceModalOpen(true)} icon="plus">
            Upload Resource
          </Button>
        }
      >
        {resources.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No resources uploaded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resources.map((res) => (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>{res.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({res.resourceType})</span>
                </div>
                <Button variant="danger" size="sm" icon="trash" onClick={() => handleDeleteResource(res.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Lesson Modal */}
      {isLessonModalOpen && (
        <Modal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          title="Add New Lesson to Syllabus"
        >
          <form onSubmit={handleCreateLesson}>
            <Input
              label="Lesson Title"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              placeholder="e.g. 5. Advanced JPA Relationships"
              required
            />
            <Input
              label="Short Summary"
              value={lessonForm.description}
              onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
              placeholder="Brief summary of what this lesson covers..."
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.375rem' }}>
                Lecture Notes & Content
              </label>
              <textarea
                rows={4}
                className="form-control"
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                placeholder="Full lesson syllabus text..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              />
            </div>
            <Input
              label="Video Embed URL"
              value={lessonForm.videoUrl}
              onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
              placeholder="e.g. https://www.youtube.com/embed/..."
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Duration (Minutes)"
                type="number"
                value={lessonForm.durationMinutes}
                onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                required
              />
              <Input
                label="Sequence Order"
                type="number"
                value={lessonForm.sortOrder}
                onChange={(e) => setLessonForm({ ...lessonForm, sortOrder: Number(e.target.value) })}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsLessonModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={savingLesson}>
                Publish Lesson
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Resource Modal */}
      {isResourceModalOpen && (
        <Modal
          isOpen={isResourceModalOpen}
          onClose={() => setIsResourceModalOpen(false)}
          title="Attach Course Resource"
        >
          <form onSubmit={handleAddResource}>
            <Input
              label="Resource Title"
              value={resourceForm.title}
              onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
              placeholder="e.g. Lecture 3 Slide Deck (PDF)"
              required
            />
            <Input
              label="Resource Link / File URL"
              value={resourceForm.fileUrl}
              onChange={(e) => setResourceForm({ ...resourceForm, fileUrl: e.target.value })}
              placeholder="e.g. https://domain.edu/slides.pdf or cloud link"
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsResourceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={savingResource}>
                Save Resource
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeacherCourseManage;
