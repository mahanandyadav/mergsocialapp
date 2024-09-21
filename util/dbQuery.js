const Post = require("../models/Post");


async function calculateTotalLikes() {
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
  console.log(totalLikes, "initial total like");
  return totalLikes[0]?.totalLikes //number
}
exports.calculateTotalLikes = calculateTotalLikes;
