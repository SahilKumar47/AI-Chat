import React, { useEffect, Fragment, useState } from "react";
import { Col, Form, FormGroup, FormControl } from "react-bootstrap";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

import {
  useMessageDispatch,
  useMessageState,
} from "../../context/messageContext";

import Message from "./Message";

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

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

const Messages = () => {
  const { users } = useMessageState();
  const [content, setContent] = useState("");
  const dispatch = useMessageDispatch();
  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) =>
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: selectedUser.username,
          message: data.sendMessage,
        },
      }),
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (content === "") return;
    //Mutation of sending the message
    sendMessage({
      variables: {
        to: selectedUser.username,
        content: content,
      },
    });
  };

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p>Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p>Loading...</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((msg, index) => (
      <Fragment key={msg.uuid}>
        <Message message={msg} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = <p>You are now connected </p>;
  }
  return (
    <Col xs={10} md={8} className=" bg-secondary">
      <div className="messages-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <FormGroup>
            <FormControl
              type="text"
              className="message-input rounded-pill p-4 bg-secondary border-0"
              placeholder="Type a message"
              value={content}
              OnChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
