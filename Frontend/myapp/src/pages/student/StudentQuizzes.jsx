import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes/student')
      .then((res) => {
        if (res.data && res.data.data) {
          setQuizzes(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Knowledge Quizzes</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Timed objective assessments with instant server evaluation</p>
      </div>

      {loading ? (
        <Loader text="Loading available quizzes..." size="lg" />
      ) : quizzes.length === 0 ? (
        <EmptyState
          icon="helpCircle"
          title="No quizzes available"
          description="There are currently no active quizzes for your enrolled courses."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {quizzes.map((quiz) => (
            <Card key={quiz.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {quiz.courseCode}
                  </span>
                  <Badge variant={quiz.attempted ? 'success' : 'primary'}>
                    {quiz.attempted ? 'Completed' : 'Available'}
                  </Badge>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                  {quiz.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {quiz.description || 'Periodic theoretical assessment.'}
                </p>

                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-light)',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Duration</span>
                    <strong>{quiz.durationMinutes} mins</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Questions</span>
                    <strong>{quiz.questionsCount || 5}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Total Marks</span>
                    <strong>{quiz.totalMarks}</strong>
                  </div>
                </div>

                {quiz.attempted && (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--success-light)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #C8E6C9',
                    marginBottom: '1rem',
                    textAlign: 'center',
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)' }}>
                      Your Score: {quiz.score} / {quiz.totalMarks}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant={quiz.attempted ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => navigate(`/student/quizzes/${quiz.id}`)}
                >
                  {quiz.attempted ? "Review Answers" : "Start Quiz →"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;
