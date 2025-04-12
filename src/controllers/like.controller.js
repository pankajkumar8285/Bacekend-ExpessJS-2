import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }
  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });
  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video like removed"));
  }

  await Like.create({ video: videoId, likedBy: userId });
  res.status(200).json(new ApiResponse(200, null, "Video liked"));
});

const toggleCommentLike = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment like removed"));
  }

  await Like.create({ comment: videoId, likedBy: userId });
  res.status(200).json(new ApiResponse(200, null, "Comment liked"));
});

const toggleTweetLike = asynchandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }
  const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });
  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Tweet like removed"));
  }

  await Like.create({ tweet: tweetId, likedBy: userId });
  res.status(200).json(new ApiResponse(200, null, "Tweet liked"));
});

const getLikedVideos = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.find({
    likedBy: userId,
    video: { $ne: null },
  }).populate("video");

  const videos = likedVideos.map((like) => like.video);

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
