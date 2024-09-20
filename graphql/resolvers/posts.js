const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const LISTENER_KEY = require("../../util/listener");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTotalLikes() {
      try {
        const totalLikes = await Post.aggregate([
          {
            $project: {
              likes: { $size: "$likes" },
            },
          },
          {
            $group: {
              _id: null,
              totalLikes: { $sum: "$likes" },
            },
          },
        ]);
        // console.log(totalLikes, "totalLikes");
        return totalLikes[0];
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // async createPost(_, { body }, context) {
    async createPost(_, { postBody }, context) {
      // console.log(postBody, "postBody");
      const inputString = postBody.inputString;
      const file = postBody.file;
      const user = checkAuth(context);
      if (inputString?.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body: inputString,
        file: file,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish(LISTENER_KEY.NEW_POST, {
        // newPostListener: post,
        newPost: post,
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete(); 
          // // publish to listener total likes
          // context.pubsub.publish(LISTENER_KEY.TOTAL_LIKE, {
          //   totalLikeListener: {
          //     totalLikes: "1000",
          //   },
          // });
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();

        return post;
      } else throw new UserInputError("Post not found");
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator(LISTENER_KEY.NEW_POST),
    },
    // newPostListener: {
    //   subscribe: (_, __, { pubsub }) =>
    //     pubsub.asyncIterator(LISTENER_KEY.NEW_POST),
    // },
    
  },
};
// totalLikeListener: {
//       subscribe: (_, __, { pubsub }) =>
//         pubsub.asyncIterator(LISTENER_KEY.TOTAL_LIKE),
//     },