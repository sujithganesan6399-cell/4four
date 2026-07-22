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
    setRecords([{ ...newRecord, id: Date.now() }, ...records]);
    setShowDashboard(false);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(records.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    setEditingRecord(null);
    setShowDashboard(false);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords(records.filter(record => record.id !== id));
    }
  };

  const handleEditInit = (record) => {
    setEditingRecord(record);
    setShowDashboard(true);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setShowDashboard(false);
  };

  return (
    <div className="app-wrapper">
      <div className="app-background"></div>
      
      <div className={`home-page ${showDashboard ? 'background-dimmed' : ''}`}>
        <div className="home-top-bar">
          <div className="home-stats">
            <div 
              className={`stat-box ${tableFilter === 'All' ? 'active-filter' : ''}`}
              onClick={() => setTableFilter('All')}
            >
              <h3>{totalRecords}</h3>
              <p>Total Members</p>
            </div>
          </div>
          
          <button 
            className="btn-enter-dashboard" 
            onClick={() => {
              setEditingRecord(null);
              setShowDashboard(true);
            }}
          >
            + Mark Attendance
          </button>
        </div>

        <div className="home-main-table">
          <AttendanceTable 
            records={filteredRecords} 
            readonly={false} 
            onEdit={handleEditInit} 
            onDelete={handleDeleteRecord} 
            editingId={editingRecord?.id || null} 
          />
        </div>
      </div>

      {showDashboard && (
        <div className="dashboard-overlay" onClick={() => setShowDashboard(false)}>
          <div className="dashboard-container modal-style" onClick={(e) => e.stopPropagation()}>
            <div className="header dashboard-header">
              <h2>{editingRecord ? "Edit Record" : "Attendance Record"}</h2>
              <button className="btn-back" onClick={handleCancelEdit}>✕ Close Form</button>
            </div>
          
            <AttendanceForm 
              onAdd={handleAddRecord} 
              onUpdate={handleUpdateRecord} 
              onCancel={handleCancelEdit}
              editingRecord={editingRecord}
              records={records}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;