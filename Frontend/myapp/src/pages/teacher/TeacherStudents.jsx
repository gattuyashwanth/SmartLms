import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const TeacherStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/teacher');
      const courseList = res.data?.data || [];
      setCourses(courseList);
      if (courseList.length > 0) {
        setSelectedCourseId(courseList[0].id.toString());
        fetchStudentsForCourse(courseList[0].id);
      } else {
        fetchAllStudents();
      }
    } catch (err) {
      console.error(err);
      fetchAllStudents();
    }
  };

  const fetchStudentsForCourse = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/enrollments/course/${courseId}`);
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
      fetchAllStudents();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/students');
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    setSelectedCourseId(cid);
    if (cid === 'all') {
      fetchAllStudents();
    } else {
      fetchStudentsForCourse(cid);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      (s.fullName && s.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeTab === 'active') return s.active !== false;
    if (activeTab === 'inactive') return s.active === false;
    return true;
  });

  const columns = [
    {
      header: 'Student',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            {row.fullName ? row.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.fullName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Roll Number',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>
          {row.rollNumber || 'N/A'}
        </span>
      )
    },
    {
      header: 'Department',
      render: (row) => (
        <span>{row.departmentName || 'Computer Science & Engineering'}</span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.active !== false ? 'success' : 'default'}>
          {row.active !== false ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Contact',
      render: (row) => (
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {row.phone || '+91 98765 43210'}
        </span>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Enrolled Students</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            View and manage students enrolled in your courses
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter by Course:</span>
          <select
            value={selectedCourseId}
            onChange={handleCourseChange}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: '#FFFFFF',
              color: 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Registered Students</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          background: 'var(--surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="users" size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Total Students</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{students.length}</div>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="checkCircle" size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Active Enrolled</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A' }}>
              {students.filter(s => s.active !== false).length}
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="bookOpen" size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Assigned Courses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{courses.length}</div>
          </div>
        </div>
      </div>

      {/* Main Card with search and filter */}
      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant={activeTab === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              All ({students.length})
            </Button>
            <Button
              variant={activeTab === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('active')}
            >
              Active
            </Button>
          </div>

          <div style={{ maxWidth: '300px', width: '100%' }}>
            <Input
              placeholder="Search by student name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="search"
            />
          </div>
        </div>

        {loading ? (
          <Loader text="Loading students..." />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            title="No students found"
            description="There are no students enrolled in this course matching your search criteria."
            icon="users"
          />
        ) : (
          <Table columns={columns} data={filteredStudents} />
        )}
      </Card>
    </div>
  );
};
export default TeacherStudents;
