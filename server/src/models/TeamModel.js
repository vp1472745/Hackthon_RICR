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
        required: true,
    },
    teamProblemStatement: {
        type: String,
        required: true,
    },
    projectGithubLink: {
        type: String,
    },
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);

export default Team;
