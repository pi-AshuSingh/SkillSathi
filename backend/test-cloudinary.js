import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

console.log("Testing Cloudinary Configuration...");
console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.API_KEY);
console.log("API Secret:", process.env.API_SECRET);
console.log("\n");

// Test by getting account details
cloudinary.api.ping()
    .then(result => {
        console.log("✅ SUCCESS! Cloudinary credentials are VALID!");
        console.log("Response:", result);
    })
    .catch(error => {
        console.log("❌ FAILED! Cloudinary credentials are INVALID!");
        console.log("Error:", error.message);
        console.log("\nPlease check your API_SECRET in the .env file");
        console.log("Go to https://cloudinary.com/console to get the correct API Secret");
    });
