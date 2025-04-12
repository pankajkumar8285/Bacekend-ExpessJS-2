
import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asyncHandler.js"


const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel Id");
    }

    if (userId.toString() === channelId) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const existingSub = await Subscription({
        subscriber: userId,
        channel: channelId
    });

    if (existingSub) {
        await existingSub.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Unsubscribed"));
    }

    await Subscription.create({
        subscriber: userId,
        channel: channelId
    })
    res.status(201).json(new ApiResponse(201, null , "Channel subscribed"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel Id");
    }

    const subscribers = await Subscription.find({ channel: channelId}).populate("subscriber", "username avatar name");
    res.status(200).json(new ApiResponse(200, subscribers, "Channel subscribers"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params;
    
    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber Id");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId}).populate("channel","username avatar name");

    res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
