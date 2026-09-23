import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';

export const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices')
      .then((res) => {
        if (res.data && res.data.data) {
          setNotices(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Institutional Notices</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Official circulars, exam announcements, and campus updates</p>
      </div>

      {loading ? (
        <Loader text="Loading notices..." size="lg" />
      ) : notices.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No notices found"
          description="There are currently no circulars published for students."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notices.map((n) => (
            <Card key={n.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)' }}>
                  {n.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant={
                    n.priority === 'URGENT' ? 'danger' :
                    n.priority === 'IMPORTANT' ? 'warning' : 'primary'
                  }>
                    {n.priority}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Posted {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {n.content}
              </p>

              <div style={{
                marginTop: '1rem',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>Issued by: <strong>{n.authorName || 'University Administration'}</strong></span>
                {n.expiryDate && <span>Valid until: {n.expiryDate}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotices;
