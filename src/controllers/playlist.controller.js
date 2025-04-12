import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asyncHandler.js"


const createPlaylist = asynchandler(async (req, res) => {
    const {name, description} = req.body

    if (!(name || description)) {
        throw new ApiError(400, "All fileds are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user._id
    })
    res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"))


})

const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params;
    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id")
    }

    const playlist = await Playlist.find({owner: userId}).populate("videos")

    res.status(200).json(200, playlist)
    
})

const getPlaylistById = asynchandler(async (req, res) => {
    const {playlistId} = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos");
    
    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }

    res.status(200).json(200, playlist);
    
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid  Playlist or Video Id");
    }
 
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }
    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, "unauthorized");
    }

    if(playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist")
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist and video Id")
    }
    
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (String(playlist.owner !== String(req.user._id))) {
        throw new ApiError(403, "unauthorized")    
    }

    playlist.videos = playlist.videos.filter(id => String(id) !== String(videoId));
    playlist.save();

    res.status(200).json(new ApiError(200, playlist, "Video is successfully removed from playlist"))
})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invaild playlist Id");
    }
    
    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200)
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id ");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name : name,
                description: description
            }
        },
        {
            new: true
        }
    )

    res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"));

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}