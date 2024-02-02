import React from "react";
import { Button } from "react-bootstrap";
import { FileIcon } from 'react-file-icon';

export default function Files({ files, handleFileDoubleClick, handleFileButton = false, buttonName = "" }) {
    const fileIconStyles = {
      width: 24,
      height: 24,
      marginRight: '8px',
    };
  
    return (
      <ul>
        {files.map((file, index) => (
            <>
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', padding: 15, height: '50px' }}>
                <li onClick={() => handleFileDoubleClick(index)} style={{ marginRight: '8px', cursor: 'pointer', maxHeight: 50, maxWidth: 50 }}>
                <FileIcon
                    extension={file.name.split('.').pop()}
                    {...fileIconStyles}
                />
                </li>
                <span>{file.name} - {file.type}</span>
                {handleFileButton && <Button onClick={() => handleFileButton(index)}>{buttonName}</Button>}
            </div>
            <br></br>
          </>
        ))}
      </ul>
    );
}