import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { revieweeId, jobId, rating, comment, reviewType, categories } = req.body;
        const reviewerId = req.id; // From isAuthenticated middleware

        // Validate required fields
        if (!revieweeId || !rating || !reviewType) {
            return res.status(400).json({
                message: "Reviewee, rating, and review type are required",
                success: false
            });
        }

        // Check if reviewee exists
        const reviewee = await User.findById(revieweeId);
        if (!reviewee) {
            return res.status(404).json({
                message: "Reviewee not found",
                success: false
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
                success: false
            });
        }

        // Create review
        const review = await Review.create({
            reviewer: reviewerId,
            reviewee: revieweeId,
            job: jobId,
            rating,
            comment,
            reviewType,
            categories
        });

        // Update user's average rating
        const reviews = await Review.find({ reviewee: revieweeId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await User.findByIdAndUpdate(revieweeId, {
            'rating.average': avgRating.toFixed(1),
            'rating.count': reviews.length
        });

        // Create notification for reviewee
        const reviewer = await User.findById(reviewerId);
        await Notification.create({
            recipient: revieweeId,
            sender: reviewerId,
            type: 'review_received',
            title: 'New Review Received',
            message: `${reviewer.fullname} has given you a ${rating}-star rating`,
            priority: 'high',
            link: `/profile/${revieweeId}`
        });

        return res.status(201).json({
            message: "Review submitted successfully",
            success: true,
            review
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while creating review",
            success: false
        });
    }
};

// Get all reviews for a user
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const reviews = await Review.find({ reviewee: userId })
            .populate({
                path: 'reviewer',
                select: 'fullname profile.profilePhoto'
            })
            .populate({
                path: 'job',
                select: 'title company'
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Reviews fetched successfully",
            success: true,
            reviews
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while fetching reviews",
            success: false
        });
    }
};

// Get reviews written by a user
export const getReviewsByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const reviews = await Review.find({ reviewer: userId })
            .populate({
                path: 'reviewee',
                select: 'fullname profile.profilePhoto'
            })
            .populate({
                path: 'job',
                select: 'title company'
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Reviews fetched successfully",
            success: true,
            reviews
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while fetching reviews",
            success: false
        });
    }
};

// Get user's rating statistics
export const getUserRatingStats = async (req, res) => {
    try {
        const userId = req.params.id;

        const reviews = await Review.find({ reviewee: userId });

        if (reviews.length === 0) {
            return res.status(200).json({
                message: "No reviews found",
                success: true,
                stats: {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                    categoryAverages: {
                        professionalism: 0,
                        communication: 0,
                        quality: 0,
                        punctuality: 0
                    }
                }
            });
        }

        // Calculate average rating
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        // Rating distribution
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            ratingDistribution[r.rating]++;
        });

        // Category averages
        const categoryTotals = {
            professionalism: 0,
            communication: 0,
            quality: 0,
            punctuality: 0
        };

        let categoryCount = 0;
        reviews.forEach(r => {
            if (r.categories) {
                if (r.categories.professionalism) categoryTotals.professionalism += r.categories.professionalism;
                if (r.categories.communication) categoryTotals.communication += r.categories.communication;
                if (r.categories.quality) categoryTotals.quality += r.categories.quality;
                if (r.categories.punctuality) categoryTotals.punctuality += r.categories.punctuality;
                categoryCount++;
            }
        });

        const categoryAverages = categoryCount > 0 ? {
            professionalism: (categoryTotals.professionalism / categoryCount).toFixed(1),
            communication: (categoryTotals.communication / categoryCount).toFixed(1),
            quality: (categoryTotals.quality / categoryCount).toFixed(1),
            punctuality: (categoryTotals.punctuality / categoryCount).toFixed(1)
        } : { professionalism: 0, communication: 0, quality: 0, punctuality: 0 };

        return res.status(200).json({
            message: "Rating statistics fetched successfully",
            success: true,
            stats: {
                averageRating: avgRating.toFixed(1),
                totalReviews: reviews.length,
                ratingDistribution,
                categoryAverages
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while fetching rating stats",
            success: false
        });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.id;
        const { rating, comment, categories } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
                success: false
            });
        }

        // Check if user is the reviewer
        if (review.reviewer.toString() !== userId) {
            return res.status(403).json({
                message: "You can only update your own reviews",
                success: false
            });
        }

        // Update fields
        if (rating) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5",
                    success: false
                });
            }
            review.rating = rating;
        }
        if (comment) review.comment = comment;
        if (categories) review.categories = categories;

        await review.save();

        // Recalculate reviewee's average rating
        const reviews = await Review.find({ reviewee: review.reviewee });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await User.findByIdAndUpdate(review.reviewee, {
            'rating.average': avgRating.toFixed(1),
            'rating.count': reviews.length
        });

        return res.status(200).json({
            message: "Review updated successfully",
            success: true,
            review
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while updating review",
            success: false
        });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
                success: false
            });
        }

        // Check if user is the reviewer
        if (review.reviewer.toString() !== userId) {
            return res.status(403).json({
                message: "You can only delete your own reviews",
                success: false
            });
        }

        const revieweeId = review.reviewee;

        await Review.findByIdAndDelete(reviewId);

        // Recalculate reviewee's average rating
        const reviews = await Review.find({ reviewee: revieweeId });
        
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            await User.findByIdAndUpdate(revieweeId, {
                'rating.average': avgRating.toFixed(1),
                'rating.count': reviews.length
            });
        } else {
            await User.findByIdAndUpdate(revieweeId, {
                'rating.average': 0,
                'rating.count': 0
            });
        }

        return res.status(200).json({
            message: "Review deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while deleting review",
            success: false
        });
    }
};
