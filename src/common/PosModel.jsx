import React from "react";
import { Modal, Button } from "react-bootstrap";

const POsModal = ({ show, handleClose, posTitle }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl" // Extra large for 80% width
      centered // Center the modal
      dialogClassName="custom-modal-width"
    >
      <Modal.Header closeButton>
        <Modal.Title>{posTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Details about Blanket-Release POs go here    {posTitle}...</p>
        {/* You can replace this with a table, list, or API data */}
        {/* <p>Total POs: {blanket ? blanket.count : "0"}</p> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default POsModal;
