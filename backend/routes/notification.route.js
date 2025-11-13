import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getUserNotifications);
router.route("/unread-count").get(isAuthenticated, getUnreadCount);
router.route("/read/:id").put(isAuthenticated, markAsRead);
router.route("/read-all").put(isAuthenticated, markAllAsRead);
router.route("/delete/:id").delete(isAuthenticated, deleteNotification);
router.route("/clear-all").delete(isAuthenticated, clearAllNotifications);

export default router;
