import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const VoiceModal = () => {
  const [modalShow, setModalShow] = React.useState(true);
  const handleClose = () => {
    localStorage.removeItem("modal");
    setModalShow(false);
  };
  return (
    <Modal
      show={modalShow}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          AI Voice Assistant Instructions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>To open specific user chatbox</h5>
        <p>
          <b>Command:</b>
          <br />
          Open (username), Open (username) chat, Open (username) chat box
          <br />
          Example: Open Jane chat box
        </p>
        <h5>To read messages</h5>
        <p>
          <b>Command:</b>
          <br />
          Read me the messages, Read me all the messages,
          <b>Read me the last message</b>
          <br />
        </p>
        <h5>Type a message to a user</h5>
        <p>
          <b>Command: </b>
          Type a message
          <br />
          <b>Command: </b>
          Add (your message)
        </p>
        <h5>Logout user</h5>
        <p>
          <b>Command: </b>Log me out, log out
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VoiceModal;
