import React, { useState, useEffect ,useRef } from 'react';

const initialFormState = {
  profileImage: '',
  name: '',
  age: '',
  gender: '',
  email: '',
  mobile: '',
  attendance: 'Absent',
  location: ''
};

const AttendanceForm = ({ onAdd, onUpdate, onCancel, editingRecord, records }) => {
  const imgRef = useRef(null);
  const [formData, setFormData] = useState(initialFormState);
  const [locationRevealed, setLocationRevealed] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function imgHandle(e){
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress into a JPEG with 70% quality to save localStorage space
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

          setImgPreview(compressedDataUrl);
          setFormData(prev => ({ ...prev, profileImage: compressedDataUrl }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      setImgPreview(null);
      setFormData(prev => ({ ...prev, profileImage: '' }));
    }
  }

  useEffect(() => {
    if (editingRecord) {
      setFormData(editingRecord);
      setImgPreview(editingRecord.profileImage || null);
      if (editingRecord.location) setLocationRevealed(true);
    } else {
      setFormData(initialFormState);
      setImgPreview(null);
      setLocationRevealed(false);
    }
  }, [editingRecord]);

  const handleInputChange = (e) => {
    // Clear the error message the moment the user starts fixing their mistake
    setErrorMessage('');
    
    const { name, value, type, checked } = e.target;

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

  const handleLocationMouseLeave = () => {
    if (formData.location === '') {
      setLocationRevealed(false);
    }
  };

  // --- NEW: Universal Error Trigger ---
  const triggerError = (msg) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Manual validation for Empty Fields (Replaces HTML 'required')
    if (!formData.name || !formData.age || !formData.gender || !formData.email || !formData.mobile || !formData.location) {
      triggerError('Missing Data: Please fill out all fields before submitting!');
      return; 
    }

    // 2. Strict Mobile Length Check
    if (formData.mobile.length < 10) {
      triggerError('Invalid Mobile: Number must be exactly 10 digits!');
      return;
    }

    // 3. Duplicate Validation Check
    if (!editingRecord) {
      const isDuplicate = records?.some((record) => {
        // Use .trim() to ignore accidental spaces
        const existingName = record?.name?.toLowerCase().trim();
        const newName = formData.name.toLowerCase().trim();
        
        return record?.mobile === formData.mobile || existingName === newName;
      });

      if (isDuplicate) {
        triggerError('Duplicate Entry: This user is already on the roster!');
        return; 
      }
    }

    // If it passes all tests, submit!
    if (editingRecord) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
    setFormData(initialFormState);
    setImgPreview(null);
    if (imgRef.current) imgRef.current.value = '';
    setLocationRevealed(false);
    setErrorMessage(''); // Clear errors on success
  };


  return (
    <form 
      onSubmit={handleSubmit} 
      className={`attendance-form ${isShaking ? 'form-vibrate' : ''}`}
    >
      <div className="form-inputs-column">
        {/* Display our dynamic error message here */}
        {errorMessage && <div className="form-error-alert">{errorMessage}</div>}

        <div className="form-group">
          <label>Name</label>
          {/* Removed 'required' from all inputs below */}
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="text" name="age" value={formData.age} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Gender =&gt;</label>
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
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Attendance =&gt; {formData.attendance}</label>
          <label className="switch">
            <input type="checkbox" name="attendance" checked={formData.attendance === 'Present'} onChange={handleInputChange} />
            <span className="slider round"></span>
          </label>
        </div>

        <div 
          className={`form-group location-group ${locationRevealed ? 'revealed' : ''}`}
          onMouseEnter={() => setLocationRevealed(true)}
          onMouseLeave={handleLocationMouseLeave}
        >
          <label>Location =&gt;</label>
          <div className="location-slide-container">
             <span className="hover-prompt">{!locationRevealed ? 'Hover to select ----->' : ''}</span>
             <select name="location" value={formData.location} onChange={handleInputChange}>
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
      </div>

      <div className="form-image-column">
        {imgPreview ? (
          <img className="floating-image-preview" src={imgPreview} alt="Preview" />
        ) : (
          <div className="image-placeholder">
            <span>Upload Photo</span>
          </div>
        )}
        <input type="file" ref={imgRef} onChange={imgHandle} className="file-input-hidden" />
      </div>
    </form>
  );
};

export default AttendanceForm;