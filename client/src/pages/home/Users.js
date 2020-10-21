import React from "react";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";

import { Col, Image } from "react-bootstrap";
import {
  useMessageDispatch,
  useMessageState,
} from "../../context/messageContext";

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

const User = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      console.log(data);
      dispatch({ type: "SET_USERS", payload: data.getUsers });
    },
    onError: (err) => console.log(err),
  });

  let usermarkup;
  if (!users || loading) {
    usermarkup = <p>loading...</p>;
  } else if (users.length < 0) {
    usermarkup = <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    usermarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      console.log(selectedUser);
      return (
        <div
          role="button"
          className={classNames("user-div d-flex p-3", {
            "bg-white": selected,
          })}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={
              user.imageUrl ||
              "data:image/png;base64,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"
            }
            className="user-image mr-2"
          />
          <div className="d-none d-md-block">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are connected :)"}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {usermarkup}
    </Col>
  );
};

export default User;
