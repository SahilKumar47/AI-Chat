import React, { Fragment } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/authContext";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
    }
  }
`;

const Home = ({ history }) => {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);
  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data);
  }
  let usermarkup;
  if (!data || loading) {
    usermarkup = <p>loading...</p>;
  } else if (data.getUsers.length < 0) {
    usermarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usermarkup = data.getUsers.map((user) => (
      <div key={user.username}>
        <p>{user.username}</p>
      </div>
    ));
  }
  return (
    <Fragment>
      <Row className="bg-white justify-content-around">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row>
        <Col xs={4}>{usermarkup}</Col>
        <Col xs={8}>
          <p>messages</p>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
