import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    website:{
        type:String 
    },
    location:{
        type:String 
    },
    // Geo fields (optional): stored as GeoJSON Point and/or array [lat, lng]
    locationCoords: {
        type: [Number], // [lat, lng]
        required: false,
    },
    geoLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: undefined }
    },
    logo:{
        type:String // URL to company logo
    },
    advancePayment:{
        type:Number,
        default:0 // Advance payment for laborers
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
export const Company = mongoose.model("Company", companySchema);
// 2dsphere index for geo queries
companySchema.index({ geoLocation: '2dsphere' });