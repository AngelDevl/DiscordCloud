import React from 'react'
import { Container } from 'react-bootstrap'
import MyToast from './MyToast.js';
import Files from './Files.js';
import FilesNavBarHandler from './NavBar/FilesNavBarHandler.js';

export default function GetFiles() {
    const [show, setShow] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState("");
    const [files, setFiles] = React.useState(null)
    let clickCount = 0;

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
    
    
    React.useEffect(() => {
        fetch('/api/files', {
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
                return AlertUser("You don't have any files! To upload go to /", "", 10000)
            }

            console.log(data.files)
            setFiles(data.files)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    const DownloadFile = (index) => {
        window.open(`http://localhost:5000/api/file/${files[index].name}`);
    }
    
    const handleDelete = async (index) => {
        const response = await fetch(`/api/file/${files[index].name}`, {
            method: 'delete'
        })

        if (!response.ok) {
            return AlertUser(`Something went wrong... ${response.status.toString()}`, "", 10000)
        }

        const res = await response.json()

        if (!res.success) {
            return AlertUser(`[${files[index].name}] Something went wrong when trying to delete your file...`, "", 10000)
        }
        
        setFiles(prevFiles => {
            prevFiles.splice(index, 1)
            return prevFiles
        })

        return AlertUser(`[${files[index].name}] File has been successfully deleted!`, "", 10000)
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
    
    return (<>
        <FilesNavBarHandler/>
        <MyToast message={toastMessage} show={show} onClose={CloseAlert}/>
        <Container style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{paddingBottom: 30}}>Discord Cloud</h1>
            <h2 style={{paddingBottom: 30}}>You Files:</h2>
            {files && <Files files={files} handleFileDoubleClick={handleFileDoubleClick} handleFileButton={handleDelete} buttonName='Delete' />}
        </Container>
    </>);
}
  