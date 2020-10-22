import React, { createContext, useReducer, useContext } from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  let usersCopy, userIndex;
  const { username, message, messages, reaction } = action.payload;
  switch (action.type) {
    case "SET_USERS":
      console.log(action.payload);
      return {
        ...state,
        users: action.payload,
      };
    case "SET_USER_MESSAGES":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((user) => user.username === username);
      usersCopy[userIndex] = { ...usersCopy[userIndex], messages };
      return {
        ...state,
        users: usersCopy,
      };
    case "SET_SELECTED_USER":
      usersCopy = state.users.map((user) => ({
        ...user,
        selected: user.username === action.payload,
      }));

      return {
        ...state,
        users: usersCopy,
      };
    case "ADD_MESSAGE":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((user) => user.username === username);
      message.reactions = [];
      let newUser = {
        ...usersCopy[userIndex],
        messages: usersCopy[userIndex].messages
          ? [message, ...usersCopy[userIndex].messages]
          : null,
        latestMessage: message,
      };
      usersCopy[userIndex] = newUser;
      return {
        ...state,
        users: usersCopy,
      };
    case "ADD_REACTION":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((user) => user.username === username);
      //Make a copy of the current user
      let userCopy = { ...usersCopy[userIndex] };

      //Find the index of the message that the reaction belongs
      const messageIndex = userCopy.messages?.findIndex(
        (m) => m.uuid === reaction.message.uuid
      );

      if (messageIndex > -1) {
        //Copy of user messages
        let messageCopy = [...userCopy.messages];

        //Copy of user messages reactions
        let reactionsCopy = [...messageCopy[messageIndex].reactions];
        const reactionIndex = reactionsCopy.findIndex(
          (r) => r.uuid === reaction.uuid
        );
        if (reactionIndex > -1) {
          //reaction exists and updated
          reactionsCopy[reactionIndex] = reaction;
        } else {
          reactionsCopy = [...reactionsCopy, reaction];
        }
        messageCopy[messageIndex] = {
          ...messageCopy[messageIndex],
          reactions: reactionsCopy,
        };
        userCopy = { ...userCopy, messages: messageCopy };
        usersCopy[userIndex] = userCopy;
      }
      return {
        ...state,
        users: usersCopy,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });
  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
