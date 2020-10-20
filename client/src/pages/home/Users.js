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
          <Image src={user.imageUrl} className="user-image mr-2" />
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
