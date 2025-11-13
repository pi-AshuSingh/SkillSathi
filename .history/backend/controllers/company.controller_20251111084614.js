import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { geocodeWithGoogle } from "../utils/geocode.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName, advancePayment, location } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };

        // Handle logo upload if provided
        let logoUrl = "";
        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logoUrl = cloudResponse.secure_url;
            } catch (uploadError) {
                console.log("Logo upload error:", uploadError);
            }
        }

        // attempt server-side geocoding for provided location (best-effort)
        const geoFields = {}
        if (location && typeof location === 'string'){
            try{
                const geo = await geocodeWithGoogle(location)
                if (geo){
                    geoFields.location = location
                    geoFields.locationCoords = [geo.lat, geo.lng]
                    geoFields.geoLocation = { type: 'Point', coordinates: [geo.lng, geo.lat] }
                    geoFields.geocodedAt = new Date()
                    geoFields.geocodeProvider = geo.provider
                    geoFields.geocodeRaw = geo.raw
                }
            } catch(e){
                console.warn('Company create geocode failed', e.message)
            }
        }

        company = await Company.create({
            name: companyName,
            logo: logoUrl,
            advancePayment: advancePayment || 0,
            userId: req.id,
            location: location || undefined,
            ...geoFields
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error during company registration",
            success: false
        });
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location, advancePayment } = req.body;
 
        const file = req.file;
        let logo;
        
        if (file) {
            try {
                // idhar cloudinary ayega
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logo = cloudResponse.secure_url;
            } catch (uploadError) {
                console.log("Logo upload error:", uploadError);
            }
        }
    
    const updateData = { name, description, website, location, advancePayment };
        if (logo) {
            updateData.logo = logo;
        }

        // server-side geocode company location if provided
        if (location && typeof location === 'string'){
            try{
                const geo = await geocodeWithGoogle(location)
                if (geo){
                    updateData.locationCoords = [geo.lat, geo.lng]
                    updateData.geoLocation = { type: 'Point', coordinates: [geo.lng, geo.lat] }
                    updateData.geocodedAt = new Date()
                    updateData.geocodeProvider = geo.provider
                    updateData.geocodeRaw = geo.raw
                }
            } catch(e){
                console.warn('Company geocode failed', e.message)
            }
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error during company update",
            success: false
        });
    }
}