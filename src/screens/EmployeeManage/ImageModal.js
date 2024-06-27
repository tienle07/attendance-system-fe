import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const convertBase64ToImageDataUrl = (base64String) => {
  return `data:image/png;base64,${base64String}`;
};

function ImageModal(props) {
  const { checkInImage,checkOutImage,show,onHide } = props;
  const checkInImageUrl = convertBase64ToImageDataUrl(atob(checkInImage));
  const checkOutImageUrl = convertBase64ToImageDataUrl(atob(checkOutImage));
  return (
    <div>
      <Modal show={show} size='lg' onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Viewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', boxSizing: 'border-box', paddingRight: '10px' }}>
              <p>Check-In</p>
              <img style={{ width: '100%' }} src={checkInImageUrl} alt={`Not Check In Yet`} />
            </div>
            <div style={{ width: '50%', boxSizing: 'border-box', paddingLeft: '10px' }}>
              <p>Check-Out</p>
              <img style={{ width: '100%' }} src={checkOutImageUrl} alt={`Not Check Out Yet`} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageModal;