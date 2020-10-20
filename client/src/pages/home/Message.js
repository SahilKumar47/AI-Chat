import React from "react";
import classNames from "classnames";
import moment from "moment";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { useAuthState } from "../../context/authContext";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const recieved = !sent;
  return (
    <OverlayTrigger
      placement={sent ? "right" : "left"}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
    >
      <div
        className={classNames("d-flex my-3", {
          "ml-auto": sent,
          "mr-auto": recieved,
        })}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": recieved,
          })}
        >
          <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
};

export default Message;
