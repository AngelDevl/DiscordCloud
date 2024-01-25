import React from 'react'
import { Container, Row } from 'react-bootstrap'
import Files from './Files.js';
import axios from 'axios';

export default function GetFiles() {
    const [files, setFiles] = React.useState(null)
    let clickCount = 0;

    React.useEffect(() => {
        fetch('/get-files', {
                method: 'get',
                headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.ok)  {
                return response.json()
            }
    
            return Promise.reject(response)
        })
        .then(data => {
            if (data.files && Array.isArray(data.files) && data.files.length == 0) {
                return alert("You don't have any files! To upload go to /")
            }

            console.log(data.files)
            setFiles(data.files)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    const DownloadFile = (index) => {
        window.open(`http://noam:5000/get-file/${files[index].name}`);
    }
    
    const handleFileDoubleClick = (index) => {
        clickCount++;
    
        if (clickCount == 2) {
            DownloadFile(index)
          clickCount = 0;
        } else if (clickCount == 1) {
          setTimeout(() => {
            clickCount = 0
          }, 500)
        }
      };
    
    return (
        <Container style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{paddingBottom: 30}}>Discord Cloud</h1>
            <h2 style={{paddingBottom: 30}}>You Files:</h2>
            {files && <Files files={files} handleFileDoubleClick={handleFileDoubleClick} />}
        </Container>
    );
}
  