const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;
