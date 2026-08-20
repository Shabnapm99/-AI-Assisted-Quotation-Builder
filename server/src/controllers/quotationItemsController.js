import QuotationItemModel from "../models/QuotationItemModel.js";
import QuotationModel from '../models/QuotationModel.js'
import {recalculateQuotationTotal} from "../utils/recalculateQuotationTotal.js"

// Add an item to a quotation
export const addQuotationItem = async (req, res) => {
    try {
        const { id } = req.params; // quotation id
        const { title, description, quantity, unit_price } = req.body;

        if (!title || !quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const quotation = await QuotationModel.findOne({ _id: id, createdBy: req.user._id });
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        const total = unit_price != null ? quantity * unit_price : 0;

        const newItem = await QuotationItemModel.create({
            quotation: id,
            title,
            description,
            quantity,
            unit_price: unit_price ?? null,
            total,
        });

        const total_amount = await recalculateQuotationTotal(id);

        res.status(201).json({
            message: "Item added successfully",
            item: newItem,
            total_amount,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while adding item",
            error: error.message,
        });
    }
};

// Update an item
export const updateQuotationItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { title, description, quantity, unit_price } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const item = await QuotationItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const quotation = await QuotationModel.findOne({ _id: item.quotation, createdBy: req.user._id });
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        if (title) item.title = title;
        if (description !== undefined) item.description = description;
        if (quantity) item.quantity = quantity;
        if (unit_price !== undefined) item.unit_price = unit_price;

        item.total = item.unit_price != null ? item.quantity * item.unit_price : 0;

        await item.save();

        const total_amount = await recalculateQuotationTotal(item.quotation);

        res.status(200).json({
            message: "Item updated successfully",
            item,
            total_amount,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while updating item",
            error: error.message,
        });
    }
};

// Delete an item
export const deleteQuotationItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const item = await QuotationItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const quotation = await QuotationModel.findOne({ _id: item.quotation, createdBy: req.user._id });
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        const quotationId = item.quotation;
        await QuotationItemModel.deleteOne({ _id: itemId });

        const total_amount = await recalculateQuotationTotal(quotationId);

        res.status(200).json({
            message: "Item deleted successfully",
            total_amount,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while deleting item",
            error: error.message,
        });
    }
};