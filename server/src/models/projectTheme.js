import mongoose from "mongoose";

const themeSchema = new mongoose.Schema({
    themeName: {
        type: String,
        required: true,
    },
    themeDescription: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Theme = mongoose.model("Theme", themeSchema);

export default Theme;
