import mongoose, { Schema } from "mongoose";

const quotationSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Client is required'],
    },
    title: {
        type: String,
        required: [true, 'Quotation title is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'approved', 'rejected'],
        default: 'draft',
    },
    total_amount: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

export default mongoose.model('Quotation', quotationSchema);
