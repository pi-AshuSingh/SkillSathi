import { Notification } from "../models/notification.model.js";

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.id; // From isAuthenticated middleware

        const notifications = await Notification.find({ recipient: userId })
            .populate({
                path: 'sender',
                select: 'fullname profile.profilePhoto'
            })
            .populate({
                path: 'relatedJob',
                select: 'title company'
            })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        const unreadCount = await Notification.countDocuments({ 
            recipient: userId, 
            isRead: false 
        });

        return res.status(200).json({
            message: "Notifications fetched successfully",
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while fetching notifications",
            success: false
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.id;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
                success: false
            });
        }

        // Check if user is the recipient
        if (notification.recipient.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized access",
                success: false
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            message: "Notification marked as read",
            success: true,
            notification
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while marking notification as read",
            success: false
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.id;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            message: "All notifications marked as read",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while marking all notifications as read",
            success: false
        });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.id;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
                success: false
            });
        }

        // Check if user is the recipient
        if (notification.recipient.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized access",
                success: false
            });
        }

        await Notification.findByIdAndDelete(notificationId);

        return res.status(200).json({
            message: "Notification deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while deleting notification",
            success: false
        });
    }
};

// Delete all notifications for a user
export const clearAllNotifications = async (req, res) => {
    try {
        const userId = req.id;

        await Notification.deleteMany({ recipient: userId });

        return res.status(200).json({
            message: "All notifications cleared successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while clearing notifications",
            success: false
        });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.id;

        const count = await Notification.countDocuments({ 
            recipient: userId, 
            isRead: false 
        });

        return res.status(200).json({
            message: "Unread count fetched successfully",
            success: true,
            count
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while fetching unread count",
            success: false
        });
    }
};
