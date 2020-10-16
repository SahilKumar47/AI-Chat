import React from "react";
import { gql, useQuery } from "@apollo/client";

import { Col, Image } from "react-bootstrap";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        content
        to
        from
        createdAt
      }
    }
  }
`;

const User = ({ setSelectedUser }) => {
  const { loading, data, error } = useQuery(GET_USERS);

  let usermarkup;
  if (!data || loading) {
    usermarkup = <p>loading...</p>;
  } else if (data.getUsers.length < 0) {
    usermarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usermarkup = data.getUsers.map((user) => (
      <div
        className="d-flex p-3"
        key={user.username}
        onClick={() => setSelectedUser(user.username)}
      >
        <Image
          src={user.imageUrl}
          roundedCircle
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
        <div>
          <p className="text-success">{user.username}</p>
          <p className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are connected :)"}
          </p>
        </div>
      </div>
    ));
  }
  return (
    <Col xs={4} className="p-0 bg-secondary">
      {usermarkup}
    </Col>
  );
};

export default User;
