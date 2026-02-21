import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};

    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }

    if (userId) {
        filter.owner = new mongoose.Types.ObjectId(userId);
    }

    const sortOptions = {
        [sortBy]: sortType === "asc" ? 1 : -1
    };

    const videos = await Video.find(filter)
        .populate("owner", "fullname username avatar")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );

})

const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    const uploadedVideo = await uploadToCloudinary(videoLocalPath);
    if (!uploadedVideo) {
        throw new ApiError(500, "Video upload failed");
    }

    const uploadedThumbnail = await uploadToCloudinary(thumbnailLocalPath);
    if (!uploadedThumbnail) {
        await cloudinary.uploader.destroy(uploadedVideo.public_id, {
            resource_type: "video"
        });
        throw new ApiError(500, "Thumbnail upload failed");
    }

    let newVideo;

    try {
        newVideo = await Video.create({
            title: title.trim(),
            description: description.trim(),
            videoFile: uploadedVideo.url,
            thumbnail: uploadedThumbnail.url,
            duration: uploadedVideo.duration || 0,
            owner: req.user._id
        });
    } catch (error) {
        await cloudinary.uploader.destroy(uploadedVideo.public_id, {
            resource_type: "video"
        });

        await cloudinary.uploader.destroy(uploadedThumbnail.public_id);

        throw new ApiError(500, "Failed to create video in database");
    }

    return res.status(201).json(
        new ApiResponse(201, newVideo, "Video published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}