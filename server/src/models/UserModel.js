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
    },
    course: {
        type: String,
        required: true,
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
    },
    collegeBranch: {
        type: String,
        required: true,
    },
    collegeSemester: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    GitHubProfile: {
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
