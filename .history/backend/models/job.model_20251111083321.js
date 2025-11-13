import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel:{
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    // Geo fields (optional): stored as GeoJSON Point and/or array [lat, lng]
    locationCoords: {
        type: [Number], // [lat, lng]
        required: false
    },
    // GeoJSON point for spatial indexes: { type: 'Point', coordinates: [lng, lat] }
    geoLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: undefined }
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
},{timestamps:true});
export const Job = mongoose.model("Job", jobSchema);
// 2dsphere index for geo queries
jobSchema.index({ geoLocation: '2dsphere' });