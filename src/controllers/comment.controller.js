import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import {asynchandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get video comment 

 const getVideoComments = asynchandler(async(req, res) => {
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query;

    if(!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const skip = (page -1) * limit;

    const commentAggregate = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $sort: { createdAt: -1}
        },
        {
            $skip: skip
        },
        {
            $limit: Number(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"

            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                "user._id": 1,
                "user.username": 1,
                "user.avatar": 1
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, commentAggregate, "Get all the comments"))
 })
// add comment
const addComment = asynchandler(async (req, res) => {
    const videoId = req.params;
    const {content} = req.body;
    if(!content) {
        throw new ApiError(400, "Content is required");
    }
    const comment = await Comment.create({
        user: req.user._id, 
        video: videoId
    });

    const commentAggregate = await Comment.aggregate([
        {
            $match: {_id: comment._id},
        },
        {
            $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                "user.id": 1,
                "user.username": 1,
                "user.avatar": 1
            }
        }
    ]);

    return res.status(201).json(new ApiResponse(201, commentAggregate[0], "Comment added successfully"))

});


// upadte comment 

const updateComment = asynchandler(async(req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, "comment not found");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }
    
    if (comment.user.toString() !== req.user._id.toString()) { // is the logged-in user the same as the user who wrote this comment?
        throw new ApiError(403, "You are not allowed to update this comment")
    }

    comment.content = content || comment.content
    await comment.save();

    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"))

})


//comment delete

const deleteComment = asynchandler(async(req, res) => {
    const {commentId} = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(400, "comment not found")
    }
    if (comment.user.toString() !== req.user._id.toString() ) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    await comment.deleteOne();
    return res.status(200).json(200, null, "Comment deleted successfully")

})


export {addComment, updateComment, deleteComment, getVideoComments}