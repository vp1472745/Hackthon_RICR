import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dp2lhvfjb",
  api_key: process.env.CLOUDINARY_API_KEY || "927918338891443",
  api_secret: process.env.CLOUDINARY_API_SECRET || "JUVD_itChqKZOoCWEPjeEo3SYiA"
});




export default cloudinary;
