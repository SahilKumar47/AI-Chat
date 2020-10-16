import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";

import { useAuthDispatch } from "../../context/authContext";

import Users from "./Users";

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      content
      to
      from
      createdAt
    }
  }
`;

const Home = ({ history }) => {
  const dispatch = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);
  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

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
        <Users setSelectedUser={setSelectedUser} />
        <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((msg) => (
              <p key={msg.uuid}>{msg.content}</p>
            ))
          ) : (
            <p>Messages</p>
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
