import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createReview,
    getUserReviews,
    getReviewsByUser,
    getUserRatingStats,
    updateReview,
    deleteReview
} from "../controllers/review.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createReview);
router.route("/user/:id").get(getUserReviews);
router.route("/by-user/:id").get(getReviewsByUser);
router.route("/stats/:id").get(getUserRatingStats);
router.route("/update/:id").put(isAuthenticated, updateReview);
router.route("/delete/:id").delete(isAuthenticated, deleteReview);

export default router;
