import cloudinary from "../utils/cloudinary.js";
import Video from "../models/Video.js";

export const addNewVideoPost = async (req, res) => {
    try {
        const { title, tags } = req.body;
        const video = req.file;
        // const creatorId = req.id;

        // Validate creator ID
        // if (!creatorId) {
        //     return res.status(400).json({ message: "Creator ID is missing", success: false });
        // }

        // Validate video file
        if (!video) {
            return res.status(400).json({ message: "Video file is required", success: false });
        }

        // Check file type (optional)
        const mimeType = video.mimetype;
        if (!mimeType.startsWith("video/")) {
            return res.status(400).json({ message: "Invalid file type. Please upload a video.", success: false });
        }

        // Upload video to Cloudinary
        const cloudResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "videos",
                    public_id: `video_${Date.now()}`,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(video.buffer);
        });

        // Create a new video document
        const newVideo = await Video.create({
            title,
            tags: tags ? tags.split(",") : [],
            // creator: creatorId,
            url: cloudResponse.secure_url,
        });

        // Populate creator details (optional)
        await newVideo.populate({ path: "creator", select: "name email" });

        return res.status(201).json({
            message: "New video added successfully",
            video: newVideo,
            success: true,
        });
    } catch (error) {
        console.error("Error adding video:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const likeVideo = async (req, res) => {
    try {
        const { videoId } = req.params; // Get video ID from request parameters
        const userId = req.id; // Assuming the user ID is set in the request (e.g., from authentication)

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found", success: false });
        }

        // If the user already liked the video, remove the like
        if (video.likes.includes(userId)) {
            video.likes = video.likes.filter(id => id.toString() !== userId.toString());
        } else {
            // Otherwise, add the user to the likes array
            video.likes.push(userId);
            // Remove dislike if the user is disliking the video
            video.dislikes = video.dislikes.filter(id => id.toString() !== userId.toString());
        }

        await video.save();

        return res.status(200).json({
            message: "Video liked successfully",
            likes: video.likes,
            dislikes: video.dislikes,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Dislike a video
export const dislikeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.id;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found", success: false });
        }

        // If the user already disliked the video, remove the dislike
        if (video.dislikes.includes(userId)) {
            video.dislikes = video.dislikes.filter(id => id.toString() !== userId.toString());
        } else {
            // Otherwise, add the user to the dislikes array
            video.dislikes.push(userId);
            // Remove like if the user is liking the video
            video.likes = video.likes.filter(id => id.toString() !== userId.toString());
        }

        await video.save();

        return res.status(200).json({
            message: "Video disliked successfully",
            likes: video.likes,
            dislikes: video.dislikes,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Bookmark a video
export const bookmarkVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.id;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found", success: false });
        }

        // If the user already bookmarked the video, remove the bookmark
        if (video.bookmarks.includes(userId)) {
            video.bookmarks = video.bookmarks.filter(id => id.toString() !== userId.toString());
        } else {
            // Otherwise, add the user to the bookmarks array
            video.bookmarks.push(userId);
        }

        await video.save();

        return res.status(200).json({
            message: "Video bookmarked successfully",
            bookmarks: video.bookmarks,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('creator', 'name');
        res.status(200).json({
            success: true,
            posts: videos, // Ensuring it matches the frontend's expectation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching videos", success: false });
    }
};

