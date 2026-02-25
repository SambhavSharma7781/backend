import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/")
    .post(verifyJWT, createPlaylist);

router.route("/user/:userId")
    .get(getUserPlaylists);

router.route("/:playlistId")
    .get(getPlaylistById);

router.route("/:playlistId/video/:videoId")
    .post(verifyJWT, addVideoToPlaylist);

router.route("/:playlistId/video/:videoId")
    .delete(verifyJWT, removeVideoFromPlaylist);

router.route("/:playlistId")
    .patch(verifyJWT, updatePlaylist);

router.route("/:playlistId")
    .delete(verifyJWT, deletePlaylist);

export default router;