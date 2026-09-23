import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: optionId }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1200); // in seconds

  useEffect(() => {
    Promise.all([
      api.get(`/quizzes/${id}`),
      api.get(`/quizzes/${id}/questions`),
    ])
      .then(([qRes, quesRes]) => {
        if (qRes.data?.data) {
          setQuiz(qRes.data.data);
          setTimeLeft((qRes.data.data.durationMinutes || 20) * 60);
        }
        if (quesRes.data?.data) {
          setQuestions(quesRes.data.data);
        }
      })
      .catch(() => toast.error('Could not load quiz questions'))
      .finally(() => setLoading(false));
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!result && timeLeft > 0 && !loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, result, loading]);

  const handleSelectOption = (questionId, optionId) => {
    if (result) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: selectedAnswers,
      });
      if (res.data && res.data.data) {
        setResult(res.data.data);
        toast.success('Quiz submitted and scored by server!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Loader text="Loading quiz..." size="lg" />;
  }

  if (questions.length === 0) {
    return (
      <Card title="No Questions Found">
        <p style={{ color: 'var(--text-secondary)' }}>This quiz has not been populated with questions yet.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/student/quizzes')} style={{ marginTop: '1rem' }}>
          Back to Quizzes
        </Button>
      </Card>
    );
  }

  // If Quiz Completed & Result Available
  if (result) {
    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: result.passed ? 'var(--success-light)' : 'var(--primary-light)',
            color: result.passed ? 'var(--success)' : 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <Icon name={result.passed ? "award" : "checkCircle"} size={32} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Quiz Completed!
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {quiz?.title} • Server-Calculated Evaluation
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            marginBottom: '1.5rem',
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Score</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>{result.score} / {result.totalMarks}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Correct Answers</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--text)' }}>{result.correctAnswers} / {result.totalQuestions}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Percentage</span>
              <strong style={{ fontSize: '1.25rem', color: result.passed ? 'var(--success)' : 'var(--danger)' }}>{result.percentage}%</strong>
            </div>
          </div>

          <Button variant="primary" size="md" onClick={() => navigate('/student/quizzes')}>
            Return to Quizzes Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const isAnswered = selectedAnswers[currentQ?.id] !== undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Quiz Top bar: Info & Timer */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)' }}>{quiz?.title}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Question {currentQIndex + 1} of {questions.length} • Worth {currentQ?.marks} Marks
          </span>
        </div>

        {/* Timer Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: timeLeft < 180 ? 'var(--danger-light)' : 'var(--primary-light)',
          color: timeLeft < 180 ? 'var(--danger)' : 'var(--primary-dark)',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 700,
          fontSize: '0.9375rem',
          border: `1px solid ${timeLeft < 180 ? '#FFCDD2' : '#F8BBD0'}`,
        }}>
          <Icon name="clock" size={18} />
          <span>Time Remaining: {formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <Card>
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-light)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
          }}>
            QUESTION {currentQIndex + 1}
          </span>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)', marginTop: '0.75rem', lineHeight: 1.5 }}>
            {currentQ.questionText}
          </h3>
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {currentQ.options && currentQ.options.map((opt, oIdx) => {
            const isSelected = selectedAnswers[currentQ.id] === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {String.fromCharCode(65 + oIdx)}
                </div>
                <span style={{ fontSize: '0.9375rem', color: isSelected ? 'var(--primary-dark)' : 'var(--text)', fontWeight: isSelected ? 600 : 400 }}>
                  {opt.optionText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons between questions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
          <Button
            variant="secondary"
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex(currentQIndex - 1)}
          >
            ← Previous
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentQIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentQIndex(currentQIndex + 1)}
              >
                Next Question →
              </Button>
            ) : (
              <Button
                variant="primary"
                loading={submitting}
                onClick={handleSubmitQuiz}
                style={{ backgroundColor: 'var(--primary-dark)' }}
              >
                Submit Quiz for Grading
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Question Jump Palette */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '1rem',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
      }}>
        {questions.map((q, idx) => {
          const answered = selectedAnswers[q.id] !== undefined;
          const isCurrent = currentQIndex === idx;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQIndex(idx)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isCurrent ? 'var(--primary)' : answered ? 'var(--primary-light)' : 'var(--surface)',
                color: isCurrent ? '#FFFFFF' : answered ? 'var(--primary-dark)' : 'var(--text)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTake;
