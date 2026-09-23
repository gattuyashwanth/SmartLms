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

export const TeacherQuizzes = () => {
  const { showToast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Quiz Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);

  const defaultQuestion = () => ({
    questionText: '',
    marks: 2.0,
    options: [
      { optionText: '', isCorrect: true },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
    ]
  });

  const [questions, setQuestions] = useState([defaultQuestion()]);

  // Results Modal State
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [quizRes, courseRes] = await Promise.all([
        api.get('/quizzes/teacher'),
        api.get('/courses/teacher')
      ]);
      setQuizzes(quizRes.data?.data || []);
      const cList = courseRes.data?.data || [];
      setCourses(cList);
      if (cList.length > 0) {
        setCourseId(cList[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, defaultQuestion()]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) {
      showToast('warning', 'A quiz must have at least one question');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx, text) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[idx].questionText = text;
      return updated;
    });
  };

  const handleQuestionMarksChange = (idx, marks) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[idx].marks = parseFloat(marks) || 1.0;
      return updated;
    });
  };

  const handleOptionTextChange = (qIdx, optIdx, text) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].options[optIdx].optionText = text;
      return updated;
    });
  };

  const handleSelectCorrectOption = (qIdx, optIdx) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].options = updated[qIdx].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIdx
      }));
      return updated;
    });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      showToast('warning', 'Please provide a title and select a course');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        showToast('warning', `Question #${i + 1} text cannot be empty`);
        return;
      }
      const hasCorrect = q.options.some(o => o.isCorrect);
      if (!hasCorrect) {
        showToast('warning', `Question #${i + 1} must have a designated correct option`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].optionText.trim()) {
          showToast('warning', `Option ${String.fromCharCode(65 + j)} in Question #${i + 1} cannot be empty`);
          return;
        }
      }
    }

    const totalCalculatedMarks = questions.reduce((sum, q) => sum + (parseFloat(q.marks) || 0), 0);

    setCreateLoading(true);
    try {
      const payload = {
        title,
        description,
        durationMinutes: parseInt(durationMinutes) || 30,
        totalMarks: totalCalculatedMarks,
        courseId: parseInt(courseId),
        published: true,
        questions: questions.map(q => ({
          questionText: q.questionText,
          marks: q.marks,
          options: q.options.map(o => ({
            optionText: o.optionText,
            isCorrect: o.isCorrect
          }))
        }))
      };

      await api.post('/quizzes', payload);
      showToast('success', 'Quiz created and published successfully!');
      setShowCreateModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      setDurationMinutes(30);
      setQuestions([defaultQuestion()]);
      // Refresh list
      const res = await api.get('/quizzes/teacher');
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error(err);
      showToast('error', err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewAttempts = async (quiz) => {
    setSelectedQuiz(quiz);
    setShowAttemptsModal(true);
    setAttemptsLoading(true);
    try {
      const res = await api.get(`/quizzes/${quiz.id}/attempts`);
      setAttempts(res.data?.data || []);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load quiz attempts');
    } finally {
      setAttemptsLoading(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/quizzes/${deleteTarget.id}`);
      showToast('success', 'Quiz deleted successfully');
      setQuizzes(prev => prev.filter(q => q.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to delete quiz');
    }
  };

  const columns = [
    {
      header: 'Quiz & Course',
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
      header: 'Duration',
      render: (row) => (
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
          {row.durationMinutes || 30} mins
        </span>
      )
    },
    {
      header: 'Total Marks',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>
          {row.totalMarks} Marks
        </span>
      )
    },
    {
      header: 'Questions',
      render: (row) => (
        <Badge variant="default">
          {row.questionCount || 0} Questions
        </Badge>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.published ? 'success' : 'warning'}>
          {row.published ? 'Published' : 'Draft'}
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
            onClick={() => handleViewAttempts(row)}
            icon="barChart"
          >
            Attempts
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Course Quizzes</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Design timed online assessments, manage multiple-choice questions, and inspect student scores
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon="plus"
        >
          Create Quiz
        </Button>
      </div>

      {/* Main Table Card */}
      <Card>
        {loading ? (
          <Loader text="Loading quizzes..." />
        ) : quizzes.length === 0 ? (
          <EmptyState
            title="No quizzes created yet"
            description="Create interactive multiple-choice quizzes to assess your students' understanding."
            icon="helpCircle"
            action={
              <Button variant="primary" onClick={() => setShowCreateModal(true)} icon="plus">
                Create Quiz
              </Button>
            }
          />
        ) : (
          <Table columns={columns} data={quizzes} />
        )}
      </Card>

      {/* Create Quiz Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Quiz Assessment"
        maxWidth="800px"
      >
        <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Course *
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
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
              label="Quiz Title *"
              placeholder="e.g. Mid-Term Quick Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Input
              label="Duration (Minutes) *"
              type="number"
              min="5"
              max="180"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Quiz rules, negative marking policy (if any), guidance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          {/* Question Builder */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text)' }}>
                Questions ({questions.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleAddQuestion}
                icon="plus"
              >
                Add Question
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    background: '#FAFAFA'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9375rem' }}>
                      Question {qIdx + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Marks:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={q.marks}
                          onChange={(e) => handleQuestionMarksChange(qIdx, e.target.value)}
                          style={{
                            width: '60px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.8125rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            background: '#FFFFFF'
                          }}
                        />
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            fontWeight: 600
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter question text here..."
                    value={q.questionText}
                    onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem',
                      background: '#FFFFFF'
                    }}
                  />

                  {/* Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.5rem' }}>
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: opt.isCorrect ? '#FEF2F2' : '#FFFFFF',
                          border: opt.isCorrect ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                          borderRadius: '4px',
                          padding: '0.375rem 0.625rem'
                        }}
                      >
                        <input
                          type="radio"
                          name={`correct-opt-${qIdx}`}
                          checked={opt.isCorrect}
                          onChange={() => handleSelectCorrectOption(qIdx, optIdx)}
                          title="Designate as correct option"
                          style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          value={opt.optionText}
                          onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                          required
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '0.8125rem'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={createLoading} icon="check">
              Save & Publish Quiz
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quiz Attempts Modal */}
      <Modal
        isOpen={showAttemptsModal}
        onClose={() => { setShowAttemptsModal(false); setSelectedQuiz(null); }}
        title={`Results: ${selectedQuiz?.title || ''}`}
        maxWidth="750px"
      >
        {attemptsLoading ? (
          <Loader text="Loading student attempt records..." />
        ) : attempts.length === 0 ? (
          <EmptyState
            title="No quiz attempts recorded"
            description="Students have not yet completed this quiz."
            icon="helpCircle"
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>SUBMISSION DATE</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>SCORE</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>CORRECT</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>PERCENTAGE</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>RESULT</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((att, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text)' }}>
                      {att.submitTime ? new Date(att.submitTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>
                      {att.score} / {att.totalMarks}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {att.correctAnswers} / {att.totalQuestions} Questions
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                      {att.percentage ? att.percentage.toFixed(1) : ((att.score / (att.totalMarks || 1)) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Badge variant={att.passed ? 'success' : 'danger'}>
                        {att.passed ? 'PASSED' : 'FAILED'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Quiz?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All student attempts and records will be deleted.`}
        confirmText="Delete Quiz"
        confirmVariant="danger"
        onConfirm={handleDeleteQuiz}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default TeacherQuizzes;
