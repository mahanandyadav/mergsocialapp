const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const { GraphQLScalarType } = require('graphql');

// what wrong for bytebuffer
const ByteBuffer = new GraphQLScalarType({
  name: "ByteBuffer",
  description: "Binary data represented as Base64 encoded string",
  serialize(value) {
    return value.toString("base64"); // Convert outgoing buffer to Base64
  },
  parseValue(value) {
    return Buffer.from(value, "base64"); // Convert incoming Base64 to Buffer
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return Buffer.from(ast.value, "base64");
    }
    return null;
  },
});


module.exports = {
  ByteBuffer,
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
};
