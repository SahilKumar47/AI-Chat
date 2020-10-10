const { sequelize } = require("./models");
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./graphql/typedef");

const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
    sequelize
      .authenticate()
      .then(() => console.log("DataBase connected"))
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
