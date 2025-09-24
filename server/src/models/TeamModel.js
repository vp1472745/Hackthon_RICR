import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    teamCode: {
        type: String,
        required: true,
    },
    teamTheme: {
        type: String,
        default: "General",
    },
    teamProblemStatement: {
        type: String,
        default: "No Problem Statement Provided",
    },
    PaymentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },
    projectGithubLink: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);

export default Team;
