import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Flip, Zoom } from "react-reveal";

const Register = () => {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const submitRegisterForm = (e) => {
    e.preventDefault();
    console.log(variables);
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <Flip left cascade>
          <h1 className="text-center">Register</h1>
        </Flip>
        <Form>
          <Zoom left>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={variables.email}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
              />
            </Form.Group>
          </Zoom>
          <Zoom right delay={100}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={variables.username}
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
            </Form.Group>
          </Zoom>
          <Zoom left delay={200}>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={variables.password}
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
              />
            </Form.Group>
          </Zoom>
          <Zoom right delay={300}>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                value={variables.confirmPassword}
                onChange={(e) =>
                  setVariables({
                    ...variables,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Zoom>
          <Zoom left delay={400}>
            <div className="text-center">
              <Button
                variant="success"
                type="submit"
                onClick={submitRegisterForm}
              >
                Register
              </Button>
            </div>
          </Zoom>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
