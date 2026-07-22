import React, { useState, useEffect } from 'react';

const initialFormState = {
  name: '',
  age: '',
  gender: '',
  email: '',
  mobile: '',
  attendance: 'Absent',
  location: ''
};

const AttendanceForm = ({ onAdd, onUpdate, onCancel, editingRecord }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [locationRevealed, setLocationRevealed] = useState(false);

  // When editingRecord changes, populate the form or clear it
  useEffect(() => {
    if (editingRecord) {
      setFormData(editingRecord);
      if (editingRecord.location) {
        setLocationRevealed(true); // Keep location open if it has a value
      }
    } else {
      setFormData(initialFormState);
      setLocationRevealed(false);
    }
  }, [editingRecord]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validation constraints
    if (name === 'age') {
      setFormData({ ...formData, age: value.replace(/\D/g, '').slice(0, 2) });
      return;
    }

    if (name === 'mobile') {
      setFormData({ ...formData, mobile: value.replace(/\D/g, '').slice(0, 10) });
      return;
    }

    if (type === 'checkbox') {
      if (name === 'male' || name === 'female') {
        setFormData({ ...formData, gender: checked ? (name === 'male' ? 'Male' : 'Female') : '' });
      } else if (name === 'attendance') {
        setFormData({ ...formData, attendance: checked ? 'Present' : 'Absent' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'location' && value !== '') {
      setLocationRevealed(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRecord) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
    setFormData(initialFormState);
    setLocationRevealed(false);
  };

  return (
    <form onSubmit={handleSubmit} className="attendance-form">
      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label>Age</label>
        <input type="text" name="age" value={formData.age} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label>Gender</label>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="male" checked={formData.gender === 'Male'} onChange={handleInputChange} /> Male
          </label>
          <label>
            <input type="checkbox" name="female" checked={formData.gender === 'Female'} onChange={handleInputChange} /> Female
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label>Mobile</label>
        <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label>Attendance  {formData.attendance}</label>
        <label className="switch">
          <input type="checkbox" name="attendance" checked={formData.attendance === 'Present'} onChange={handleInputChange} />
          <span className="slider round"></span>
        </label>
      </div>

      <div 
        className={`form-group location-group ${locationRevealed ? 'revealed' : ''}`}
        onMouseEnter={() => setLocationRevealed(true)}
      >
        <label>Location</label>  
        <div className="location-slide-container">
           <span className="hover-prompt">{!locationRevealed ? 'Hover to select ----->' : ''}</span>
           <select name="location" value={formData.location} onChange={handleInputChange} required>
            <option value="" disabled>Select Location</option>
            <option value="Chennai">Chennai</option>
            <option value="Theni">Theni</option>
            <option value="Madurai">Madurai</option>
            <option value="Selam">Selam</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">{editingRecord ? 'Update' : 'Submit'}</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default AttendanceForm;