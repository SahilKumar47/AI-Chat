import React, { useEffect, Fragment, useState } from "react";
import { Col, Form, FormGroup, FormControl } from "react-bootstrap";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import classNames from "classnames";

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
      reactions {
        uuid
        content
      }
    }
  }
`;

const Messages = ({ voiceMessage }) => {
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
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (voiceMessage.length > 0) setContent(voiceMessage);
    else setContent("");
  }, [voiceMessage]);

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
    if (content.trim() === "" || !selectedUser) return;
    //Mutation of sending the message
    setContent("");
    sendMessage({
      variables: {
        to: selectedUser.username,
        content: content,
      },
    });
  };

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text">Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text">Loading...</p>;
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
    selectedChatMarkup = <p className="info-text">You are now connected </p>;
  }
  console.log(content);
  return (
    <Col xs={10} md={8} className="message-col p-0">
      <div className="messages-box d-flex flex-column-reverse p-3">
        {selectedChatMarkup}
      </div>
      <div className="px-3 py-2">
        <Form onSubmit={submitMessage}>
          <FormGroup className="d-flex align-items-center m-0">
            <FormControl
              type="text"
              className="message-input rounded-pill p-4 bg-secondary border-0"
              placeholder="Type a message"
              value={content.length === 0 ? voiceMessage : content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              id="send"
              className={classNames("fas fa-paper-plane fa-2x ml-2", {
                "text-primary": content.trim() !== "",
              })}
              onClick={submitMessage}
              role="button"
            ></i>
          </FormGroup>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
