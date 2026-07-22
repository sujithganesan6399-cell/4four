import React, { useState, useEffect } from 'react';
import AttendanceForm from './component/AttendanceForm';
import AttendanceTable from './component/AttendanceTable';
import './App.css';

const App = () => {
  // Load records from local storage on initial render
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('attendanceRecords');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Track which record is currently being edited
  const [editingRecord, setEditingRecord] = useState(null);

  // Sync to local storage whenever records change
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
      
      <div className="dashboard-container">
        <div className="header">
          <h2>Mark Attendance</h2>
        </div>

        <AttendanceForm 
          onAdd={handleAddRecord} 
          onUpdate={handleUpdateRecord} 
          onCancel={handleCancelEdit}
          editingRecord={editingRecord}
        />

        <AttendanceTable 
          records={records} 
          onEdit={handleEditInit} 
          onDelete={handleDeleteRecord} 
          editingId={editingRecord?.id || null} 
        />
      </div>
    </div>
  );
};

export default App;