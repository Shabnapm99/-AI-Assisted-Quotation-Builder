import mongoose from "mongoose";
import QuotationItemModel from "../models/QuotationItemModel.js";
import quotationModel from "../models/QuotationModel.js";

//recalculate and save the quotation's total_amount
export const recalculateQuotationTotal = async (quotationId) => {
    const result = await QuotationItemModel.aggregate([
        { $match: { quotation: new mongoose.Types.ObjectId(quotationId) } },//Here id comes from req.params.id — it's a string, not an ObjectId
        { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const total_amount = result.length > 0 ? result[0].total : 0;

    await quotationModel.findByIdAndUpdate(quotationId, { total_amount });

    return total_amount;
};