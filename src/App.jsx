import React, { useState, useEffect,useRef } from 'react';
import AttendanceForm from './component/AttendanceForm';
import AttendanceTable from './component/AttendanceTable';
import './App.css';

const App = () => {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('attendanceRecords');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [tableFilter, setTableFilter] = useState('All');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  
  // --- Computed Stats ---
  const totalRecords = records.length;
  const totalPresent = records.filter(r => r.attendance === 'Present').length;
  const totalAbsent = records.filter(r => r.attendance === 'Absent').length;

  const filteredRecords = tableFilter === 'All' 
    ? records 
    : records.filter(record => record.attendance === tableFilter);

  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }, [records]);

  // --- Scroll Listener for Floating Button ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddRecord = (newRecord) => {
    setRecords([...records, { ...newRecord, id: Date.now() }]);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(records.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const handleEditInit = (record) => {
    setEditingRecord(record);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  return (
    <div className="app-wrapper">
      <div className="app-background"></div>
      
      <div className={`home-page ${showDashboard ? 'background-dimmed' : ''}`}>
        <div className="home-left-table">
          <AttendanceTable records={filteredRecords} readonly={true} />
        </div>
        <div className="home-content">
          <h1 className="home-title">Attendance<br/>Portal</h1>
          <p className="home-subtitle">Manage your team securely with dashboard.</p>
          
          <div className="home-stats">
            <div 
              className={`stat-box ${tableFilter === 'All' ? 'active-filter' : ''}`}
              onClick={() => setTableFilter('All')}
            >
              <h3>{totalRecords}</h3>
              <p>Total Members</p>
            </div>
            <div 
              className={`stat-box ${tableFilter === 'Present' ? 'active-filter' : ''}`}
              onClick={() => setTableFilter('Present')}
            >
              <h3 className="stat-present">{totalPresent}</h3>
              <p>Present</p>
            </div>
            <div 
              className={`stat-box ${tableFilter === 'Absent' ? 'active-filter' : ''}`}
              onClick={() => setTableFilter('Absent')}
            >
              <h3 className="stat-absent">{totalAbsent}</h3>
              <p>Absent</p>
            </div>
          </div>

          <button 
            className="btn-enter-dashboard" 
            onClick={() => setShowDashboard(true)}
          >
            Enter Dashboard
          </button>
        </div>
      </div>

      {showDashboard && (
        <div className="dashboard-overlay" onClick={() => setShowDashboard(false)}>
          <div className="dashboard-container modal-style" onClick={(e) => e.stopPropagation()}>
            <div className="header dashboard-header">
              <h2>Mark Attendance</h2>
              <button className="btn-back" onClick={() => setShowDashboard(false)}>✕ Close Dashboard</button>
            </div>
          
            <AttendanceForm 
              onAdd={handleAddRecord} 
              onUpdate={handleUpdateRecord} 
              onCancel={handleCancelEdit}
              editingRecord={editingRecord}
              records={records}
            />

            <AttendanceTable 
              records={records} 
              onEdit={handleEditInit} 
              onDelete={handleDeleteRecord} 
              editingId={editingRecord?.id || null} 
            />
          </div>
        </div>
      )}

      {/* Floating Back to Home Button */}
      {showDashboard && showScrollBtn && (
        <button 
          className="floating-back-btn"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShowDashboard(false);
          }}
        >
          ⟵ Home
        </button>
      )}
    </div>
  );
}

export default App;