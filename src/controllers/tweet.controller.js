
import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asyncHandler.js"

const createTweet = asynchandler(async (req, res) => {
    const {content} = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "tweet content is required")
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    res.status(201).json(new ApiResponse(201, tweet, "tweet create successfully"));
})

const getUserTweets = asynchandler(async (req, res) => {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id")
    }

    const tweets = await Tweet.find({
        owner: userId
    }).sort({ createdAt: -1});

    res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})

const updateTweet = asynchandler(async (req, res) => {
    const {tweetId} = req.params;
    const {content} = req.body;

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id ");
    }
    const tweet = await Tweet.findId(tweetId);

    if (!tweet) {
        throw new ApiError(404, "tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id) {
        throw new ApiError(400, "unauthorized");
    }

    if (content) {
        tweet.content = tweet.content
        tweet.save();

    }
    res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
})

const deleteTweet = asynchandler(async (req, res) => {
    const {tweetId} = req.params;
     if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400, "Invalid tweet Id");
     }

     const tweet = await Tweet.findId(tweetId);

    if (tweet.owner.toString() !== req.user._id) {
        throw new ApiError(400, "unauthorized");
    }
     await tweet.deleteOne();

     res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
