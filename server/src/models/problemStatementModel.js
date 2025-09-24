import mongoose from "mongoose";

const problemStatementSchema = new mongoose.Schema({
    PStitle: {
        type: String,
        required: true,
    },
    PSdescription: {
        type: String,
        required: true,
    },
    PSTheme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme',
        required: true,
    }
}, { timestamps: true });

const ProblemStatement = mongoose.model("ProblemStatement", problemStatementSchema);

export default ProblemStatement;
