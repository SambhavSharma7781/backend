import { Router } from "express";
import { changeUserPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAcessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

router.route("/logOut").post(verifyJWT, logOutUser)

router.route("/refreshToken").post(refreshAcessToken)

router.route("/changePassword").post(verifyJWT, changeUserPassword)

router.route("/getCurrentUser").get(verifyJWT, getCurrentUser)

router.route("/updateAccountDetails").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)




export default router;