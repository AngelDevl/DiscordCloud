import React from 'react'
import DropFileZone from './DropFileZone.js'
import { Container } from 'react-bootstrap'

export default function UploadFiles() {
    return (
      <Container style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{paddingBottom: 30}}>Discord Cloud</h1>

        <div>
          <DropFileZone />
        </div>
      </Container>
    );
  }
  