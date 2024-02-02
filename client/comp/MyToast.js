import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";


function MyToast({message, show, onClose, link = null}) {
  return (
    <ToastContainer position="top-end">
        <Toast show={show} onClose={onClose}>
        <Toast.Header>
            <strong className="me-auto">Discord Cloud</strong>
        </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
          {link && <Toast.Body><a href={link}></a></Toast.Body>}
        </Toast>
    </ToastContainer>
  );
}

export default MyToast;