import React, { useEffect, Fragment } from "react";
import { Col } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";

import {
  useMessageDispatch,
  useMessageState,
} from "../../context/messageContext";

import Message from "./Message";

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
  const dispatch = useMessageDispatch();
  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

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
    <Col
      xs={10}
      md={8}
      className="messages-box d-flex flex-column-reverse bg-secondary"
    >
      {selectedChatMarkup}
    </Col>
  );
};

export default Messages;
