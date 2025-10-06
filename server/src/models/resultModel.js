// Create schema result      model
import mongoose from "mongoose";
const resultSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    ui: { type: Number, required: true },
    ux: { type: Number, required: true },
    presentation: { type: Number, required: true },
    viva: { type: Number, required: true },
    overAll: { type: Number, required: true },
    codeQuality: { type: Number, required: true },
    obtainedMarks: { type: Number, default: 0 },
    grade: { type: String, default: 'N/A' },
    rank: { type: Number, default: null },
    status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' }
});

const Result = mongoose.model("Result", resultSchema);
export default Result;
