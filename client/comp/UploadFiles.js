import React, { useEffect } from 'react'
import DropFileZone from './DropFileZone.js'
import { Container } from 'react-bootstrap'
import FilesNavBarHandler from './NavBar/FilesNavBarHandler.js';


export default function UploadFiles() {
    return (<>
      <FilesNavBarHandler/>
      <Container style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{paddingBottom: 30}}>Discord Cloud</h1>

        <div>
          <DropFileZone />
        </div>
      </Container>
      </>);
  }