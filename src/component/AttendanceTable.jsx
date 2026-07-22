import React from 'react';

const AttendanceTable = ({ records, onEdit, onDelete, editingId, readonly = false }) => {
  const MIN_ROWS = 10;
  const displayRecords = [...records];
  while (displayRecords.length < MIN_ROWS) {
    displayRecords.push({ isEmptyPlaceholder: true, id: `empty-${displayRecords.length}` });
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Attendance</th>
            <th>Location</th>
            {!readonly && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {displayRecords.map((record, index) => {
            if (record.isEmptyPlaceholder) {
              return (
                <tr key={record.id} className="empty-row">
                  <td className="text-muted">{index + 1}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {!readonly && <td></td>}
                </tr>
              );
            }

            return (
              <tr 
                key={record.id} 
                className={editingId === record.id ? 'row-editing-blur' : ''}
              >
                <td>{index + 1}</td>
                <td>
                  {record.profileImage ? (
                    <img src={record.profileImage} alt="avatar" className="table-avatar" />
                  ) : (
                    <div className="table-avatar-placeholder">No Photo</div>
                  )}
                </td>
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
                {!readonly && (
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
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;