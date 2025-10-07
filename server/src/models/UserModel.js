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
        default: "N/A",
    },
    course: {
        type: String,
        required: true,
        default: "N/A",
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
        default: "N/A",
    },
    collegeSemester: {
        type: Number,
        required: true,
        default: 0,
    },
    GitHubProfile: {
        type: String,

        default: "N/A",
    },
    city: {
        type: String,
        default: "N/A",
    },
    state: {
        type: String,
        default: "N/A",
    },

    termsAccepted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
