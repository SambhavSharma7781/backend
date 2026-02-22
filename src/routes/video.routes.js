import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/videos").get(getAllVideos);

router.route("/videos")
    .post(
        verifyJWT,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 }
        ]),
        publishAVideo
    );

router.route("/videos/:videoId").get(getVideoById);

router.route("/videos/:videoId")
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/videos/:videoId")
    .delete(verifyJWT, deleteVideo);

router.route("/videos/toggle/:videoId")
    .patch(verifyJWT, togglePublishStatus);

export default router;