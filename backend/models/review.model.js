import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 500
    },
    reviewType: {
        type: String,
        enum: ['employer-to-worker', 'worker-to-employer'],
        required: true
    },
    categories: {
        professionalism: {type: Number, min: 1, max: 5},
        communication: {type: Number, min: 1, max: 5},
        quality: {type: Number, min: 1, max: 5},
        punctuality: {type: Number, min: 1, max: 5}
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

// Index for faster queries
reviewSchema.index({ reviewee: 1, rating: -1 });
reviewSchema.index({ reviewer: 1 });

export const Review = mongoose.model("Review", reviewSchema);
