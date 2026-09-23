import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const StudentAssignments = () => {
  const toast = useToast();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, SUBMITTED, GRADED

  // Submission Modal state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    setLoading(true);
    api.get('/assignments/student')
      .then((res) => {
        if (res.data && res.data.data) {
          setAssignments(res.data.data);
        }
      })
      .catch(() => toast.error('Failed to load assignments'))
      .finally(() => setLoading(false));
  };

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setContent('');
    setFileUrl('');
    setIsSubmitOpen(true);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter your submission text or response.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/assignments/${selectedAssignment.id}/submit`, {
        content,
        fileUrl,
      });
      toast.success('Assignment submitted successfully!');
      setIsSubmitOpen(false);
      loadAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assignments.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Course Assignments</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Review assignment deadlines, submit lab solutions, and view evaluation feedback</p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--surface)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          {['ALL', 'PENDING', 'SUBMITTED', 'GRADED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                backgroundColor: filter === tab ? 'var(--primary)' : 'transparent',
                color: filter === tab ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader text="Loading your assignments..." size="lg" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="fileText"
          title="No assignments found"
          description={`No assignments with status ${filter} were found.`}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((a) => (
            <Card key={a.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{a.courseCode}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• {a.courseTitle}</span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)' }}>
                    {a.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Badge variant={
                    a.status === 'GRADED' ? 'success' :
                    a.status === 'SUBMITTED' ? 'primary' :
                    a.status === 'LATE' ? 'danger' : 'warning'
                  }>
                    {a.status}
                  </Badge>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Max: <strong>{a.maxMarks} Marks</strong>
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {a.description}
              </p>

              {a.instructions && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--primary)',
                  fontSize: '0.8125rem',
                  color: 'var(--text)',
                  marginBottom: '1rem',
                }}>
                  <strong>Instructions:</strong> {a.instructions}
                </div>
              )}

              {/* Graded Feedback Box */}
              {a.status === 'GRADED' && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--success-light)',
                  border: '1px solid #C8E6C9',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                      Marks Obtained: {a.marksObtained} / {a.maxMarks}
                    </span>
                    <Badge variant="success">Evaluated</Badge>
                  </div>
                  {a.feedback && (
                    <p style={{ color: 'var(--text)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>
                      <strong>Instructor Feedback:</strong> {a.feedback}
                    </p>
                  )}
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.75rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Due: <strong>{new Date(a.deadline).toLocaleDateString()} at {new Date(a.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </span>

                <Button
                  variant={a.status === 'GRADED' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleOpenSubmit(a)}
                >
                  {a.status === 'GRADED' ? 'Resubmit Solution' : a.status === 'SUBMITTED' ? 'Edit Submission' : 'Submit Assignment →'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {isSubmitOpen && (
        <Modal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          title={`Submit: ${selectedAssignment?.title}`}
        >
          <form onSubmit={handleSubmitWork}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: '0.375rem' }}>
                Your Solution / Write-up <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                rows={5}
                required
                className="form-control"
                placeholder="Write your explanation, summary, or inline code response here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  backgroundColor: 'var(--surface)',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <Input
              label="Repository or Cloud Document Link"
              placeholder="e.g. https://github.com/myaccount/project or Google Drive link"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              helperText="Optional link to your repository, zip file, or hosted demonstration."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="secondary" onClick={() => setIsSubmitOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Confirm Submission
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentAssignments;
