import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const TeacherAssignments = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100,
    passingMarks: 40
  });

  // Submissions Modal states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [showSubsModal, setShowSubsModal] = useState(false);

  // Grade Modal states
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [marksInput, setMarksInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [gradeSubmitting, setGradeSubmitting] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [assRes, courseRes] = await Promise.all([
        api.get('/assignments/teacher'),
        api.get('/courses/teacher')
      ]);
      setAssignments(assRes.data?.data || []);
      const cList = courseRes.data?.data || [];
      setCourses(cList);
      if (cList.length > 0) {
        setFormData(prev => ({ ...prev, courseId: cList[0].id.toString() }));
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.courseId || !formData.dueDate) {
      showToast('warning', 'Please fill in all required fields');
      return;
    }

    setCreateLoading(true);
    try {
      const payload = {
        courseId: parseInt(formData.courseId),
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString(),
        maxMarks: parseInt(formData.maxMarks) || 100,
        passingMarks: parseInt(formData.passingMarks) || 40
      };

      const res = await api.post('/assignments', payload);
      showToast('success', 'Assignment published successfully!');
      setShowCreateModal(false);
      setFormData({
        courseId: courses[0]?.id?.toString() || '',
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100,
        passingMarks: 40
      });
      // Refresh list
      const updated = await api.get('/assignments/teacher');
      setAssignments(updated.data?.data || []);
    } catch (err) {
      console.error(err);
      showToast('error', err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubsModal(true);
    setSubsLoading(true);
    try {
      const res = await api.get(`/assignments/${assignment.id}/submissions`);
      setSubmissions(res.data?.data || []);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load submissions');
    } finally {
      setSubsLoading(false);
    }
  };

  const handleOpenGradeModal = (sub) => {
    setGradingSubmission(sub);
    setMarksInput(sub.marksObtained !== null && sub.marksObtained !== undefined ? sub.marksObtained.toString() : '');
    setFeedbackInput(sub.feedback || '');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!marksInput || isNaN(marksInput)) {
      showToast('warning', 'Please enter valid marks');
      return;
    }

    const marks = parseFloat(marksInput);
    if (marks < 0 || marks > (selectedAssignment?.maxMarks || 100)) {
      showToast('warning', `Marks must be between 0 and ${selectedAssignment?.maxMarks || 100}`);
      return;
    }

    setGradeSubmitting(true);
    try {
      await api.put(`/assignments/submissions/${gradingSubmission.id}/grade`, {
        marksObtained: marks,
        feedback: feedbackInput
      });
      showToast('success', 'Grade and feedback submitted successfully!');
      setGradingSubmission(null);
      // Refresh submissions
      const res = await api.get(`/assignments/${selectedAssignment.id}/submissions`);
      setSubmissions(res.data?.data || []);
    } catch (err) {
      console.error(err);
      showToast('error', err.response?.data?.message || 'Failed to submit grade');
    } finally {
      setGradeSubmitting(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/assignments/${deleteTarget.id}`);
      showToast('success', 'Assignment deleted successfully');
      setAssignments(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to delete assignment');
    }
  };

  const columns = [
    {
      header: 'Title & Course',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{row.title}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {row.courseCode ? `${row.courseCode} - ${row.courseTitle}` : row.courseTitle}
          </div>
        </div>
      )
    },
    {
      header: 'Due Date',
      render: (row) => (
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
          {row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No due date'}
        </span>
      )
    },
    {
      header: 'Marks',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>
          {row.maxMarks} pts (Pass: {row.passingMarks || 40})
        </span>
      )
    },
    {
      header: 'Submissions',
      render: (row) => (
        <Badge variant="primary">
          {row.submissionCount || 0} Submitted
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenSubmissions(row)}
            icon="fileText"
          >
            Submissions
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteTarget(row)}
            icon="trash"
          />
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Assignments Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Create assignments, review submissions, and submit grades with student feedback
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon="plus"
        >
          Create Assignment
        </Button>
      </div>

      {/* Main Table Card */}
      <Card>
        {loading ? (
          <Loader text="Loading course assignments..." />
        ) : assignments.length === 0 ? (
          <EmptyState
            title="No assignments created yet"
            description="Create your first academic assignment or problem set to assign tasks to your enrolled students."
            icon="fileText"
            action={
              <Button variant="primary" onClick={() => setShowCreateModal(true)} icon="plus">
                Create Assignment
              </Button>
            }
          />
        ) : (
          <Table columns={columns} data={assignments} />
        )}
      </Card>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Assignment"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Select Course *
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: '#FFFFFF',
                color: 'var(--text)',
                fontSize: '0.9375rem'
              }}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Assignment Title *"
            placeholder="e.g. Lab 3: Binary Search Tree Implementation"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Description & Instructions
            </label>
            <textarea
              rows={4}
              placeholder="Enter instructions, requirements, evaluation rubrics, submission format..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                color: 'var(--text)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <Input
              label="Due Date & Time *"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <Input
              label="Max Marks *"
              type="number"
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
              required
            />
            <Input
              label="Passing Marks *"
              type="number"
              value={formData.passingMarks}
              onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={createLoading} icon="check">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Submissions Roster Modal */}
      <Modal
        isOpen={showSubsModal}
        onClose={() => { setShowSubsModal(false); setSelectedAssignment(null); }}
        title={`Submissions: ${selectedAssignment?.title || ''}`}
        maxWidth="850px"
      >
        {subsLoading ? (
          <Loader text="Loading student submissions..." />
        ) : submissions.length === 0 ? (
          <EmptyState
            title="No submissions yet"
            description="None of your enrolled students have submitted their solutions for this assignment yet."
            icon="fileText"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              color: 'var(--primary-dark)',
              fontWeight: 600
            }}>
              <span>Total Submissions: {submissions.length}</span>
              <span>Max Marks: {selectedAssignment?.maxMarks || 100}</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>STUDENT</th>
                    <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>SUBMITTED AT</th>
                    <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>SUBMISSION CONTENT</th>
                    <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>GRADE</th>
                    <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{sub.studentName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub.studentRollNumber || sub.studentEmail}</div>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text)' }}>
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {sub.submissionText && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {sub.submissionText}
                          </div>
                        )}
                        {sub.fileUrl && (
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.8125rem', color: 'var(--primary)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}
                          >
                            <Icon name="link" size={14} /> Attached Document
                          </a>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {sub.marksObtained !== null && sub.marksObtained !== undefined ? (
                          <Badge variant="success">
                            {sub.marksObtained} / {selectedAssignment?.maxMarks}
                          </Badge>
                        ) : (
                          <Badge variant="warning">Ungraded</Badge>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <Button
                          variant={sub.marksObtained !== null ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => handleOpenGradeModal(sub)}
                          icon="edit"
                        >
                          {sub.marksObtained !== null ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Grade Individual Submission Modal */}
      <Modal
        isOpen={!!gradingSubmission}
        onClose={() => setGradingSubmission(null)}
        title={`Grade: ${gradingSubmission?.studentName || ''}`}
        maxWidth="500px"
      >
        <form onSubmit={handleSaveGrade} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#FFF5F5', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Assignment:</div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>{selectedAssignment?.title}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Maximum Score: <strong>{selectedAssignment?.maxMarks || 100} Marks</strong>
            </div>
          </div>

          <Input
            label={`Marks Obtained (Max: ${selectedAssignment?.maxMarks || 100}) *`}
            type="number"
            value={marksInput}
            onChange={(e) => setMarksInput(e.target.value)}
            placeholder="e.g. 85"
            required
          />

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Feedback & Remarks
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Excellent work on the data structure logic, minor edge case missed in remove()."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                color: 'var(--text)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setGradingSubmission(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={gradeSubmitting} icon="check">
              Save Grade
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Assignment?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All student submissions for this assignment will also be removed.`}
        confirmText="Delete Assignment"
        confirmVariant="danger"
        onConfirm={handleDeleteAssignment}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default TeacherAssignments;
