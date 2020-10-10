const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    email: String!
    username: String!
  }
  type Query {
    getUsers: [User]!
  }
`;
