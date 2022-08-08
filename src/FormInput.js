import React from "react";

import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export const FormInput = (props) => {
  const createDynamicValues = () => {
    console.log("options", props.formData.options);
    if (props.formData.options) {
      console.log("inside: ", props.formData.options);
      return props.formData.options.map((option, index) => (
        <Form.Group className="mb-2" controlId={index}>
          <Form.Check
            id={index}
            type="radio"
            placeholder="Count"
            name="group1"
            onChange={(event) => {
              console.log("top: " + event.target.id);
              let newOptions = props.formData.options.map((option, i) => {
                if (option["correct"] === true && i !== event.target.id) {
                  return { text: option.text, correct: false, id: option.id };
                } else if (i === event.target.id) {
                  return { text: option.text, correct: true, id: option.id };
                } else {
                  return option;
                }
              });
              newOptions[index]["correct"] = true;
              props.updateOptions(newOptions);
            }}
          ></Form.Check>
          <Form.Control
            type="text"
            id={index}
            placeholder={`Enter Option : ${index + 1}`}
            onChange={(event) => {
              let newOptions = [...props.formData.options];
              newOptions[index]["text"] = event.target.value;
              props.updateOptions(newOptions);
            }}
            value={option.text}
          />
        </Form.Group>
      ));
    }
  };

  return (
    <Container className="p-3">
      <h1 className="header">Question: {props.formData.questionId}</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicQuestion">
          <Form.Label>Question that needs to be displayed</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Question Text"
            onChange={(event) => {
              props.updateQuestionText(event.target.value);
            }}
            value={props.formData.questionText}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicOptionsCount">
          <Form.Label>No of Options to be Displayed</Form.Label>
          <Form.Control
            type="number"
            placeholder="Count"
            value={props.formData.count}
            onChange={(event) => {
              var count = event.target.value;
              var freshArray = [];
              for (var i = 0; i < count; i++) {
                freshArray.push({ text: "", correct: false, id: i });
              }
              // props.updateOptions(freshArray);
              props.updateCount(count);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicOptions">
          <div>Choose Correct Option and Fill Details: </div>
          {createDynamicValues()}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicOptionsWeight">
          <Form.Label>Weightage: </Form.Label>
          <Form.Control
            type="number"
            placeholder="weightage"
            value={props.formData.weightage}
            onChange={(event) => {
              var weight = event.target.value;
              props.updateWeightage(weight);
            }}
          />
        </Form.Group>

        <InputGroup className="mb-3" type="submit">
          <DropdownButton
            variant="outline-secondary"
            title="Choose Linked Question"
            id="input-group-dropdown-1"
          >
            <Dropdown.Item
              onClick={(event) => {
                props.correctNewFormClicked();
              }}
            >
              Correct
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={(event) => {
                props.InCorrectNewFormClicked();
              }}
            >
              In Correct
            </Dropdown.Item>
          </DropdownButton>
        </InputGroup>
      </Form>
    </Container>
  );
};
