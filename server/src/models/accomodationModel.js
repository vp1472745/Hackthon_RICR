// create mongoose schema and model for accomodation
import mongoose from 'mongoose';

const accomodationSchema = new mongoose.Schema({
    teamid: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    book: { type: String, required: true },
    member: { type: String, required: true },
}, { timestamps: true });

const Accomodation = mongoose.model('Accomodation', accomodationSchema);
export default Accomodation;