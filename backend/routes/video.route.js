import express from "express";
import upload from "../middlewares/multer.js"; // Reuse the multer configuration
import { addNewVideoPost,likeVideo,dislikeVideo,bookmarkVideo,getVideos } from "../controllers/video.controller.js";

const router = express.Router();

router.post("/upload", upload.single("video"), addNewVideoPost);

router.put('/:videoId/like', likeVideo);
router.put('/:videoId/dislike', dislikeVideo);
router.put('/:videoId/bookmark', bookmarkVideo);
router.get('/videos', getVideos); 
export default router;
