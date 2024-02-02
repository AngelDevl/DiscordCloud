import React from "react";
import HandleNavBarInfo from "./HandleNavBarInfo.js";
import { Container, Navbar } from "react-bootstrap";


export default function NavBar({data}) {
    return (<>
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand>Discord Cloud</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">

                <HandleNavBarInfo data={data}/>

            </Navbar.Collapse>
        </Container>
    </Navbar>
    </>)
}