// @ts-nocheck
import React, { useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { boolean } from 'zod';

function UploadCareButton() {
  const [files, setFiles] = useState([]);
  let b =1;
  const handleChangeEvent = (items) => {
      setFiles([...items.allEntries.filter((file) => file.status === 'success')]);b=0;
    };

  return (
    <div>
      {b && <FileUploaderRegular onChange={handleChangeEvent} pubkey="ed4090b17a4d0cfb429a" />}

      <div>
        {files.map((file) => (
          <div key={file.uuid}>
            <img
              src={file.cdnUrl + '/-/smart_resize/300x300/-/border_radius/50p/-/setfill/000000/'}
              alt={file.fileInfo.originalFilename}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadCareButton;