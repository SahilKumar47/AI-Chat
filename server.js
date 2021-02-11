const { sequelize } = require("./models");
const { ApolloServer } = require("apollo-server");

require("dotenv").config();

const typeDefs = require("./graphql/typedef");

const resolvers = require("./graphql/resolvers");

const contextMiddleware = require("./utils/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscriptions: { path: "/" },
});

server
  .listen()
  .then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`);
    console.log(`Subscription ready at ${subscriptionsUrl}`);
    sequelize
      .authenticate()
      .then(() => console.log("DataBase connected"))
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
