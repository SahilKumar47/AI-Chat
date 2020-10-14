import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Flip, Zoom, Fade } from "react-reveal";
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

const Register = ({ history }) => {
  const [variables, setVariables] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, __) {
      history.push("/login");
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });
  const submitRegisterForm = (e) => {
    e.preventDefault();
    setErrors({});
    registerUser({ variables });
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
              <Form.Label className={errors.email && "text-danger"}>
                {errors.email ?? "Email address"}
              </Form.Label>
              <Form.Control
                type="email"
                isInvalid={errors.email}
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
              <Form.Label className={errors.username && "text-danger"}>
                {errors.username ?? "Username"}
              </Form.Label>
              <Form.Control
                isInvalid={errors.username}
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
              <Form.Label className={errors.password && "text-danger"}>
                {errors.password ?? "Password"}
              </Form.Label>
              <Form.Control
                isInvalid={errors.password}
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
              <Form.Label className={errors.confirmPassword && "text-danger"}>
                {errors.confirmPassword ?? "Confirm Password"}
              </Form.Label>
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
                disabled={loading}
              >
                {loading ? "Loading.." : "Register"}
              </Button>
              <br />
              <small>
                Already have an account <Link to="/login">login</Link>
              </small>
            </div>
          </Zoom>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
