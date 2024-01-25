import React from "react";
import RemoveDuplicates from "../Helper/RemoveDuplicates.js";
import Files from "./Files.js";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from "axios";


export default function DropFileZone() {
  const [files, setFiles] = React.useState([]);
  let clickCount = 0;
  const onDrop = React.useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length) {
      if (acceptedFiles.length > 5) {
        return alert("To many files... please upload 5 at a time!")
      }

      setFiles((prevFiles) => {
        const newArr = [...prevFiles, ...acceptedFiles]
        const obj = RemoveDuplicates(newArr);

        if (obj.hasDuplicates) {
          alert("Some files that had the same name has been removed!")
        }

        return obj.files
      })
    } 
  }, []);

  const removeFile = (index) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }
  
  const handleFileDoubleClick = (index) => {
    clickCount++;

    if (clickCount == 2) {
      removeFile(index)
      clickCount = 0;
    } else if (clickCount == 1) {
      setTimeout(() => {
        clickCount = 0
      }, 500)
    }
  };

  const UploadFiles = async () => {
    if (!files || files.length == 0) {
        return alert("No file has been provided");
    }
    
    const progressBar = document.getElementById('progress-bar')
    const progressBarPrecent = document.getElementById('progress-bar-precent')

    const formData = new FormData()
    
    Array.from(files).forEach(file => {
        formData.append('file', file);
    });
    
    console.log("Sending files!")

    try {
        const response = await axios({
            method: 'post',
            url: '/file-upload',
            data: formData,
            onUploadProgress: progressEvent => {
                console.log(progressEvent)
                let percentComplete = progressEvent.loaded / progressEvent.total
                percentComplete = parseInt(percentComplete * 100);
                progressBar.value = percentComplete
                progressBarPrecent.innerText = percentComplete + '%';
                console.log(percentComplete);
            }
        })

        console.log(response.data)
        progressBar.value = 0;
        setFiles(() => [])

    } catch(error) {
        console.log(error.message)
    }
  }


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          cursor: "pointer",
          background: "white",
          height: "300px",
          width: "600px",
          border: isDragActive ? "4px dashed red" : "4px dashed gray",
          position: 'relative',
        }}
        {...getRootProps({ className: "dropzone" })}
      >
        <input {...getInputProps()} />
        <p style={{ justifyContent: "center", display: "flex" }}>Drag some files here, or click to select files</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button onClick={async () => await UploadFiles()}>Upload Files</Button>
        <label for="file">Uploading progress:</label>
        <progress id="progress-bar" value="0" max="100"> 0% </progress>
        <p id='progress-bar-precent'>0%</p>

        <h1 style={{ marginBottom: '10px', paddingBottom: 15, paddingTop: 15 }}>Files</h1>
        <Files files={files} handleFileDoubleClick={handleFileDoubleClick} />
      </div>
    </div>
  );
}