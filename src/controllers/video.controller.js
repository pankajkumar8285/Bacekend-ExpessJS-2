import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllVideos = asynchandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = {
    ...(query && { title: { $regex: query, $options: "i" } }),
    ...(userId && { owner: userId }),
  };

  const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

  const videos = await Video.find(filter)
    .sort(sort.skip(page - 1) * limit)
    .limit(Number(limit))
    .populate("owner", "username avatar");

  const total = await Video.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page: Number(page),
      limit: Number(limit),
      videos,
    })
  );
});

const publishAVideo = asynchandler(async (req, res) => {
  const { title, description } = req.body;

  if (!(title || description)) {
    throw new ApiError(400, "All fields are required");
  }
  const videoLocalPath = req.files?.video?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!(videoLocalPath || !thumbnailLocalPath)) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  const videoUpload = await uploadOnCloudinary(videoLocalPath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

  if (!(videoUpload?.secure_url || !thumbnailUpload?.secure_url)) {
    throw new ApiError(400, "Cloudnary upload failed");
  }

  const video = await Video.create({
    title,
    description,
    videofile: videoUpload.secure_url,
    thumbnail: thumbnailUpload.secure_url,
    duration: videoUpload.duration || 0,
    owner: req.user._id,
    ispublished: true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }
  const video = Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  if (!(title || description)) {
    throw new ApiError(400, "All fields are required");
  }

  const video = Video.findById(videoId);

  if (!video) {
    throw new ApiError("Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(404, "unauthorized user");
  }
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnailUpload) {
    throw new ApiError(400, "thumnail failed to upload");
  }

  video.thumbnail = thumbnailUpload.secure_url;
  video.title = title;
  video.description = description;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = Video.findById(videoId);

  if (!video) {
    throw new ApiError("Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(404, "unauthorized user");
  }

  await video.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asynchandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = Video.findById(videoId);

  if (!video) {
    throw new ApiError("Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(404, "unauthorized user");
  }

  video.ispublished = !video.ispublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        `Video ${video.ispublished ? "published" : "unpublished"} successfully`
      )
    );
});

export {
  publishAVideo,
  getVideoById,
  updateVideo,
  togglePublishStatus,
  getAllVideos,
  deleteVideo
};
