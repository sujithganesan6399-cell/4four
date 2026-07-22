import React from 'react';

const AttendanceTable = ({ records, onEdit, onDelete, editingId }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Attendance</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr 
              key={record.id} 
              className={editingId === record.id ? 'row-editing-blur' : ''}
            >
              <td>{index + 1}</td>
              <td>{record.name}</td>
              <td>{record.age}</td>
              <td>{record.gender}</td>
              <td>{record.email}</td>
              <td>
                {record.mobile}
                {/* Mobile Length Validation Notice */}
                {record.mobile.length > 0 && record.mobile.length < 10 && (
                  <div className="error-msg">Error: Must be 10 digits</div>
                )}
              </td>
              <td className={record.attendance === 'Present' ? 'text-present' : 'text-absent'}>
                {record.attendance}
              </td>
              <td>{record.location}</td>
              <td>
                <button 
                  className="action-btn edit-btn" 
                  onClick={() => onEdit(record)} 
                  disabled={editingId !== null}
                >
                  Edit
                </button>
                <button 
                  className="action-btn delete-btn" 
                  onClick={() => onDelete(record.id)} 
                  disabled={editingId !== null}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>No attendance records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;