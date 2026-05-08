import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" //File system, avail default in node, File handling
// Unlink in fs meanss to remove file

export const cloudnaryConfig = async() =>{
try{
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('Connected with Cloudnary!!!');

}catch(error){
    console.log("Error connecting to cloudnary",error)
}
}

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File is uploaded on cloudinary", response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved file as failed to upload
        console.log(error)
        return null
    }

    //  try {
    //     if (!localFilePath) return null
    //     //upload the file on cloudinary
    //     const response = await cloudinary.uploader.upload(localFilePath, {
    //         resource_type: "auto"
    //     })
    //     // file has been uploaded successfull
    //     //console.log("file is uploaded on cloudinary ", response.url);
    //     fs.unlinkSync(localFilePath)
    //     return response;

    // } catch (error) {
    //     fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    //     return null;
    // }
}
const deleteImageOnCloudinary = async (publicId) => {
    try {
        if (!publicId) return null
        const response = await cloudinary.uploader.destroy(publicId)
        console.log("File is deleted from cloudinary", response)
        return response  
    } catch (error) {
        console.log("Error deleting file from cloudinary", error)
        return null
    }
}


export { uploadOnCloudinary , deleteImageOnCloudinary }