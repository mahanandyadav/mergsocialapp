const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
// const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true, // Enable tracing
  context: ({ req }) => ({ req, pubsub }),
});

const dburl = `mongodb+srv://twitterclone:twitterclone@cluster0.zxfwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0_twitter_clone`;
mongoose
  .connect(dburl, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
