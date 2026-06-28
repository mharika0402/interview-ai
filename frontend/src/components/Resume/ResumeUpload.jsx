import { useState, useRef } from 'react';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import './ResumeUpload.css';

const ResumeUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (file) onUpload(file);
  };

  return (
    <div className="resume-upload">
      <h2>Upload Your Resume</h2>
      <p>Upload your resume and our AI will generate personalized interview questions</p>

      <div
        className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          hidden
        />
        {file ? (
          <div className="file-preview">
            <FiFile className="file-icon" />
            <span className="file-name">{file.name}</span>
            <button className="file-remove" onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
              <FiX />
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <FiUploadCloud className="upload-icon" />
            <p>Drag & drop your resume here</p>
            <span>or click to browse (PDF, DOCX)</span>
          </div>
        )}
      </div>

      {file && (
        <button className="btn btn-primary btn-lg" onClick={handleSubmit} style={{ marginTop: '20px' }}>
          Upload & Continue
        </button>
      )}
    </div>
  );
};

export default ResumeUpload;
