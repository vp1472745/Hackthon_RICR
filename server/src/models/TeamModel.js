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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme',
        default: null,
    },
    teamProblemStatement: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ProblemStatement',
        default: null,
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
