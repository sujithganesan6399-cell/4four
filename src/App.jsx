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
  
  // --- Computed Stats ---
  const totalRecords = records.length;
  const totalPresent = records.filter(r => r.attendance === 'Present').length;
  const totalAbsent = records.filter(r => r.attendance === 'Absent').length;

  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }, [records]);

  // --- CRUD Operations ---
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
      
      {!showDashboard ? (
        <div className="home-page">
          <div className="home-left-table">
            <AttendanceTable records={records} readonly={true} />
          </div>
          <div className="home-content">
            <h1 className="home-title">Attendance<br/>Portal</h1>
            <p className="home-subtitle">Manage your team securely with dashboard.</p>
            
            <div className="home-stats">
              <div className="stat-box">
                <h3>{totalRecords}</h3>
                <p>Total Members</p>
              </div>
              <div className="stat-box">
                <h3 className="stat-present">{totalPresent}</h3>
                <p>Present</p>
              </div>
              <div className="stat-box">
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
      ) : (
        <div className="dashboard-container">
          <div className="header dashboard-header">
            <h2>Mark Attendance</h2>
            <button className="btn-back" onClick={() => setShowDashboard(false)}>Back to Home</button>
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
      )}
    </div>
  );
}

export default App;