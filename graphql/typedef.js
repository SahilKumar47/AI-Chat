const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    email: String
    username: String!
    createdAt: String!
    token: String!
    imageUrl: String
    latestMessage: Message
  }
  type Message {
    uuid: String!
    content: String!
    to: String!
    from: String!
    createdAt: String!
  }
  type Reaction {
    uuid: String!
    content: String!
    createdAt: String!
    Message: Message!
    User: User!
  }
  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(uuid: String!, content: String!): Reaction!
  }
  type Subscription {
    newMessage: Message!
  }
`;
