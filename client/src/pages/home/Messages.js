import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";

import {
  useMessageDispatch,
  useMessageState,
} from "../../context/messageContext";

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
  const selectedUser = users?.find((u) => u.selected === true);
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);
  return (
    <Col xs={8}>
      {messagesData && messagesData.getMessages.length > 0 ? (
        messagesData.getMessages.map((msg) => (
          <p key={msg.uuid}>{msg.content}</p>
        ))
      ) : (
        <p>Messages</p>
      )}
    </Col>
  );
};

export default Messages;
