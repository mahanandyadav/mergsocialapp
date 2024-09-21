const { ApolloServer } = require("apollo-server-express");
const { PubSub } = require("apollo-server");

const mongoose = require("mongoose");
const { createServer } = require("http");
const { useServer } = require("graphql-ws/lib/use/ws");
const { WebSocketServer } = require("ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
// const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const PORT = process.env.port || 5000;
const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  tracing: true, // Enable tracing
  context: ({ req }) => ({ req, pubsub }),
});

const app = express();
server.start().then(() => {
  server.applyMiddleware({ app });

  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema }, wsServer);

  const dburl = `mongodb+srv://twitterclone:twitterclone@cluster0.zxfwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0_twitter_clone`;
  mongoose
    .connect(dburl, { useNewUrlParser: true })
    .then(() => {
      console.log("MongoDB Connected");
      return httpServer.listen({ port: PORT });
    })
    .then(() => {
      console.log(
        `Server running at http://localhost:${PORT}${server.graphqlPath}`
      );
    })
    .catch((err) => {
      console.error(err);
    });
});
