import React from "react";
import RemoveDuplicates from "../Helper/RemoveDuplicates.js";
import Files from "./Files.js";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import MyToast from './MyToast.js';

export default function DropFileZone() {
  const defaultMessage = "Wating for file upload..."

  const [show, setShow] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState(defaultMessage);
  const [files, setFiles] = React.useState([]);

  const AlertUser = (message, messageAfter, time) => {
    setToastMessage(message)
    setShow(true)

    setTimeout(() => {
      setShow(false)
      setToastMessage(messageAfter)
    }, time)
  }

  const CloseAlert = () => {
    setShow(false)
  }

  let clickCount = 0;
  const onDrop = React.useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length) {
      setFiles(prevFiles => {
        if (acceptedFiles.length + prevFiles.length > 5) {
          AlertUser("To many files... please upload 5 at a time!", defaultMessage, 10000)
          return prevFiles
        }

        const newArr = [...prevFiles, ...acceptedFiles]
        const obj = RemoveDuplicates(newArr);

        if (obj.hasDuplicates) {
          AlertUser("Some files that had the same name has been removed!", defaultMessage, 10000)
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
    } else if (clickCount == 1) {
      setTimeout(() => {
        clickCount = 0
      }, 500)
    }
  };

  const UploadFiles = async () => {
    const GearImage = document.getElementById('Gear-Loading-Image');
    const UploadButton = document.getElementById("file-upload-button")
    UploadButton.disabled = true;

    if (!files || files.length == 0) {
        UploadButton.disabled = false;
        return AlertUser("No file has been provided", defaultMessage, 10000);
    }
    
    const progressBar = document.getElementById('progress-bar')
    const progressBarPrecent = document.getElementById('progress-bar-precent')
    const FileUploadInfo = document.getElementById('file-upload-info')

    const formData = new FormData()
    
    Array.from(files).forEach(file => {
        formData.append('file', file);
    });
    
    try {
        FileUploadInfo.innerText = "Uploading File/s..."
        GearImage.style.visibility = 'visible';
        const response = await axios({
            method: 'post',
            url: '/api/file-upload',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data; charset=utf-8',
            },
            onUploadProgress: progressEvent => {
                let percentComplete = parseInt((progressEvent.loaded / progressEvent.total) * 100)
                progressBar.value = percentComplete
                progressBarPrecent.innerText = percentComplete + '%';

                if (progressBar.value == 100) {
                  FileUploadInfo.innerText = "Your File/s has been uploaded (processing)"
                }
            }
        })

        if (!response.data.success) {
          FileUploadInfo.innerText = "A problem occurred when we tried to upload your files... please try again"
        } else {
          FileUploadInfo.innerText = "Your File/s has been successfully uploaded and saved"
        }

        AlertUser(FileUploadInfo.innerText, defaultMessage, 10000)
        setTimeout(() => {
          FileUploadInfo.innerText = "Waiting for file upload..."
        }, 10000)

        UploadButton.disabled = false;
        GearImage.style.visibility = 'hidden';
        progressBar.value = 0
        progressBarPrecent.innerText = 0 + '%';
        setFiles(() => [])

    } catch(error) {
        console.log(error.message)
    }
  }


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <MyToast message={toastMessage} show={show} onClose={CloseAlert}/>
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

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Button id="file-upload-button" onClick={async () => await UploadFiles()}>Upload Files</Button>
          <label for="file">Uploading progress:</label>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 15 }}>
            <progress id="progress-bar" value="0" max="100"> 0% </progress>
            <p id='progress-bar-precent' style={{ margin: 0, paddingLeft: 5 }}>0%</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <h3 id='file-upload-info' style={{ margin: 0 }}>Waiting for file upload...</h3>
            <img id="Gear-Loading-Image" src="/public/files/Gear.gif" alt="loading" style={{ height: 45, width: 45, paddingLeft: 10, visibility: 'hidden' }} />
          </div>


          <h1 style={{ marginBottom: '10px', paddingBottom: 15, paddingTop: 15 }}>Files</h1>
          <Files files={files} handleFileDoubleClick={handleFileDoubleClick} />
        </div>
      </div>
    </>
  );
}