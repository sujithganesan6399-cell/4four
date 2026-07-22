import React, { useState, useEffect } from 'react';

const AttendanceTable = ({ records, onEdit, onDelete, editingId, readonly = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const RECORDS_PER_PAGE = 10;
  
  const totalPages = Math.max(1, Math.ceil(records.length / RECORDS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [records.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const currentRecords = records.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  const endRecord = Math.min(startIndex + RECORDS_PER_PAGE, records.length);
  const showingText = `Showing ${records.length === 0 ? 0 : startIndex + 1}–${endRecord} of ${records.length} candidates`;

  const displayRecords = [...currentRecords];
  while (displayRecords.length < RECORDS_PER_PAGE) {
    displayRecords.push({ isEmptyPlaceholder: true, id: `empty-${startIndex}-${displayRecords.length}` });
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="table-wrapper">
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
          <tbody key={currentPage} className="fade-in-section">
            {displayRecords.map((record, index) => {
              if (record.isEmptyPlaceholder) {
                return (
                  <tr key={record.id} className="empty-row">
                    <td className="text-muted">{startIndex + index + 1}</td>
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
                  <td>{startIndex + index + 1}</td>
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

      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-info">
            {showingText}
          </div>
          <div className="pagination-container">
            <button 
              className="page-btn nav-btn" 
              onClick={handlePrev} 
              disabled={currentPage === 1}
            >
              &lt; 
            </button>
            
            {pageNumbers.map(number => (
              <button 
                key={number} 
                className={`page-btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => handlePageClick(number)}
              >
                {number}
              </button>
            ))}
            
            <button 
              className="page-btn nav-btn" 
              onClick={handleNext} 
              disabled={currentPage === totalPages}
            >
               &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;