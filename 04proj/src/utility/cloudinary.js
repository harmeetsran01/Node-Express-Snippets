import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" //File system, avail default in node, File handling
// Unlink in fs meanss to remove file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded on cloudinary", response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved file as failed to upload
        console.log(error)
        return null
    }
}

export { uploadOnCloudinary }