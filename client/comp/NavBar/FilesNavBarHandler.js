import React, {useEffect} from "react";
import NavBar from "./NavBar.js";

export default function FilesNavBarHandler({}) {
    const [triggerCount, setTriggerCount] = React.useState(0)
    const [fileCount, setFileCount] = React.useState(0)

    useEffect(() => {
        fetch('/api/files?' + new URLSearchParams({count: triggerCount}),
            {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
            }
        ).then(response => {
            if (response.ok) {
                return response.json();
            }
    
            return Promise.reject(response)
        }).then(data => {
            if (data && data.count)
                setFileCount(data.count);
        }).catch(error => {
            console.log(error.message)
        })
    
        const intervalId = setInterval(() => {
            setTriggerCount(prev => prev + 1)
        }, 60000)
    
        return () => clearInterval(intervalId);
    }, [triggerCount])
  
    return <NavBar data={fileCount}/>
}