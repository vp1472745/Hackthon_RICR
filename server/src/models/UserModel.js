import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    collegeName: {
        type: String,
        required: true,
        default: "Sample College",
    },
    course: {
        type: String,
        required: true,
        default: "Sample Course",
    },
    role: {
        type: String,
        enum: ['Leader', 'Member'],
        required: true,
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        default: null
    },
    collegeBranch: {
        type: String,
        required: true,
        default: "Sample Branch",
    },
    collegeSemester: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
        default: 1,
    },
    GitHubProfile: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
