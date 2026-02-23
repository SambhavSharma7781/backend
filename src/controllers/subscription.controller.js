import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    if (existingSubscription) {

        await existingSubscription.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        );
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Subscribed successfully")
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscriptions = await Subscription.find({ channel: channelId })
        .populate("subscriber", "fullname username avatar");

    const subscriberList = subscriptions.map(sub => sub.subscriber);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalSubscribers: subscriberList.length,
                subscribers: subscriberList
            },
            "Channel subscribers fetched successfully"
        )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id");
    }

    const user = await User.findById(subscriberId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "fullname username avatar");

    const subscribedChannels = subscriptions.map(sub => sub.channel);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalSubscribed: subscribedChannels.length,
                channels: subscribedChannels
            },
            "Subscribed channels fetched successfully"
        )
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}