import { v2 as cloudinary } from "cloudinary";

export const sendFileToCloudinary =async(file,folder,quality,height)=>{
    try {
        const options = {
            folder : folder,
            resource_type : "auto"
        }
        if(quality){
            options.quality = quality 
        }
        if(height){
            options.height = height
        }
    
       const result = await cloudinary.uploader.upload(file.tempFilePath,options)
       return result ;
    } catch (error) {
        console.log(error)
    }
}