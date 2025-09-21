import React, { useState } from 'react';
import './UploadImg.css'



const UploadImg = () => {
  const [profileImage, setProfileImage] = useState('avatar.svg');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setProfileImage(null);
  };

  return (
    <div className="profile-uploader">
      <img
        src={previewUrl || `/${profileImage}`}
        alt="Profile"
        className="profile-image"
      />
      <div className="actions">
        <label className="upload-label">
          Upload new
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
        <span className="remove-button" onClick={handleRemoveImage}>
          Remove
        </span>
      </div>
    </div>
  );
};

export default UploadImg;