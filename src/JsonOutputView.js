import React from "react";
import { Button, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

export const JsonOutputView = (props) => {
  return (
    <Container className="m-3">
      <Button variant="success" onClick={props.generateJson}>
        Generate JSON
      </Button>
      {props.jsonValue && (
        <Card>
          <Card.Body>{JSON.stringify(props.jsonValue)}</Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default JsonOutputView;

