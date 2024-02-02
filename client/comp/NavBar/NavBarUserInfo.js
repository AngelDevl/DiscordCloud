import React from "react";
import { Nav, Navbar } from "react-bootstrap";


export default function NavBarUser({data}) {
    return <>
        <Nav className="me-auto">
            <Nav.Link href="/files">My Files</Nav.Link>
            <Nav.Link href="/">Upload Files</Nav.Link>

        </Nav>

        <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>{data} files are stored</Navbar.Text>
        </Navbar.Collapse>
    </>
}