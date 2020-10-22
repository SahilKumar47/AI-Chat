import React, { Fragment, useEffect } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";

import { useAuthDispatch, useAuthState } from "../../context/authContext";
import {
  useMessageDispatch,
  useMessageState,
} from "../../context/messageContext";

import Users from "./Users";
import Messages from "./Messages";

// Alan AI
import alanBtn from "@alan-ai/alan-sdk-web";
const alanKey =
  "6749b00271dd3581b26b897bec4b19192e956eca572e1d8b807a3e2338fdd0dc/stage";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;

const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      createdAt
      message {
        uuid
        to
        from
      }
    }
  }
`;

const Home = ({ history }) => {
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();
  const messageDispatch = useMessageDispatch();
  const { users } = useMessageState();

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  );

  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  );

  useEffect(() => {
    if (users) {
      alanBtn({
        key: alanKey,
        onConnectionStatus: (status) => {
          console.log(`Connection is on ${status}`);
        },
        onCommand: ({ command, username }) => {
          if (command === "type_message") {
            alanBtn().playText("Ok sure");
          } else if (command === "openUser") {
            username = username.toLowerCase();
            console.log(username);
            console.log("users are", users);
            if (!users.find((u) => u.username === username)) {
              console.log("no user found");
              alanBtn().playText(`No user found of username ${username}`);
            } else {
              alanBtn().playText(`Opening ${username}'s chat`);
              messageDispatch({
                type: "SET_SELECTED_USER",
                payload: username,
              });
            }
          }
        },
      });
    }
  }, [users]);

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message: message,
        },
      });
    }
  }, [messageError, messageData]);

  useEffect(() => {
    if (reactionError) console.log(reactionError);
    if (reactionData) {
      const reaction = reactionData.newReaction;
      const otherUser =
        user.username === reaction.message.to
          ? reaction.message.from
          : reaction.message.to;
      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          username: otherUser,
          reaction,
        },
      });
    }
  }, [reactionData, reactionError]);

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
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
};

export default Home;
