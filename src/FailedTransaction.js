import React from "react";
import { useState } from "react";
import { Alert } from "react-bootstrap";

export default () => {
  const [show, setShow] = useState(true);
  setShow(true);
  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Transaction Failed</Alert.Heading>
      </Alert>
    );
  }
};
