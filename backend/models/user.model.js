import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        skillBadges:[{
            skillName: {type: String},
            issuedBy: {type: String},
            issuedDate: {type: Date},
            verified: {type: Boolean, default: false}
        }],
        experience:[{
            jobTitle: {type: String},
            company: {type: String},
            location: {type: String},
            duration: {type: String},
            description: {type: String}
        }],
        certifications:[{
            name: {type: String},
            issuedBy: {type: String},
            issuedDate: {type: Date},
            certificateUrl: {type: String}
        }],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        },
        preferredLanguage:{
            type:String,
            enum:['en','hi','bn','te','ta','mr','gu','kn','ml','pa','or'],
            default:'en'
        },
        availability:{
            type:String,
            enum:['Full-time','Part-time','Daily basis','Seasonal','Weekends'],
            default:'Full-time'
        },
        location:{
            address: {type: String},
            city: {type: String},
            state: {type: String},
            pincode: {type: String},
            coordinates: {
                lat: {type: Number},
                lng: {type: Number}
            }
        },
        rating:{
            average: {type: Number, default: 0, min: 0, max: 5},
            count: {type: Number, default: 0}
        },
        completedJobs: {type: Number, default: 0},
        endorsements:[{
            endorsedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            skill: {type: String},
            comment: {type: String},
            date: {type: Date, default: Date.now}
        }],
        learningProgress:[{
            courseName: {type: String},
            provider: {type: String},
            status: {type: String, enum: ['enrolled','in-progress','completed']},
            completionDate: {type: Date}
        }],
        notificationPreferences:{
            email: {type: Boolean, default: true},
            sms: {type: Boolean, default: true},
            push: {type: Boolean, default: true}
        },
        // Bank and Payment Details
        bankDetails:{
            accountHolderName: {type: String},
            accountNumber: {type: String},
            ifscCode: {type: String},
            bankName: {type: String},
            branchName: {type: String}
        },
        upiDetails:{
            upiId: {type: String},
            upiName: {type: String}
        },
        // Wage and Payment Tracking
        wageInfo:{
            dailyWage: {type: Number, default: 0},
            monthlyWage: {type: Number, default: 0},
            wageType: {type: String, enum: ['daily', 'monthly', 'hourly', 'project'], default: 'daily'},
            currency: {type: String, default: 'INR'}
        }
    },
},{timestamps:true});
export const User = mongoose.model('User', userSchema);