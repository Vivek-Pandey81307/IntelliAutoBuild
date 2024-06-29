import React, { useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

function App() {
  const [files, setFiles] = useState([]);
  
  const handleChangeEvent = (items) => {
      setFiles([...items.allEntries.filter((file) => file.status === 'success')]);
    };

  return (
    <div>
      <FileUploaderRegular onChange={handleChangeEvent} pubkey="ed4090b17a4d0cfb429a" />

      <div>
        {files.map((file) => (
          <div key={file.uuid}>
            <img
              src={file.cdnUrl}
              alt={file.fileInfo.originalFilename}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;