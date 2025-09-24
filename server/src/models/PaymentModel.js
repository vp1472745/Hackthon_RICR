import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    currency: {
        type: String,
        required: true,     
        default: 'INR',
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        required: true,
        default: 'Pending',
    },
    paymentGatewayResponse: {
        type: Object,
    },
}, { timestamps: true });


const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
