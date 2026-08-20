import QuotationModel from "../models/QuotationModel.js";
import ClientModel from "../models/ClientModel.js";
import QuotationItemModel from "../models/QuotationItemModel.js";

// Create a quotation
export const createQuotation = async (req, res) => {
    try {
        const { client, title, status } = req.body;

        if (!client || !title) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const existingClient = await ClientModel.findOne({ _id: client, createdBy: req.user._id });
        if (!existingClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        const newQuotation = await QuotationModel.create({
            client,
            title,
            status: status || 'draft',
            createdBy: req.user._id,
        });

        const populatedQuotation = await QuotationModel.findById(newQuotation._id)
            .populate('client', 'name company email')
            .populate('createdBy', 'email')
            .select('-__v');

        res.status(201).json({
            message: "Quotation created successfully",
            quotation: populatedQuotation,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while creating quotation",
            error: error.message,
        });
    }
};

// Get all quotations
export const getQuotations = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const quotations = await QuotationModel.find({ createdBy: req.user._id })
            .populate('client', 'name company email')
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({ quotations });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while fetching quotations",
            error: error.message,
        });
    }
};

// Get single quotation with items
export const getQuotationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const quotation = await QuotationModel.findOne({ _id: id, createdBy: req.user._id })
            .populate('client', 'name company email phone')
            .select('-__v');

        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        const items = await QuotationItemModel.find({ quotation: id }).select('-__v');

        const quote = {
            ...quotation.toObject()//since quotation is a mongoose document,
            , items
        }

        res.status(200).json({ quote });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while fetching quotation",
            error: error.message,
        });
    }
};

// Update quotation (title, status, client)
export const updateQuotation = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status, client } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const quotation = await QuotationModel.findOne({ _id: id, createdBy: req.user._id });
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        if (status && !['draft', 'sent', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (title) quotation.title = title;
        if (status) quotation.status = status;
        if (client) {
            const existingClient = await ClientModel.findOne({ _id: client, createdBy: req.user._id });
            if (!existingClient) {
                return res.status(404).json({ message: "Client not found" });
            }
            quotation.client = client;
        }

        await quotation.save();

        const populatedQuotation = await QuotationModel.findById(quotation._id)
            .populate('client', 'name company email')
            .select('-__v');

        //Fire n8n webhook only when approved
        if (status === 'approved') {
            const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
            if (n8nWebhookUrl) {
                try {
                    const n8nRes = await fetch(n8nWebhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            quotation_id: populatedQuotation._id,
                            title: populatedQuotation.title,
                            total_amount: populatedQuotation.total_amount,
                            status: populatedQuotation.status,
                            client: {
                                name: populatedQuotation.client?.name,
                                company: populatedQuotation.client?.company,
                                email: populatedQuotation.client?.email,
                            },
                            createdAt: populatedQuotation.createdAt,
                            approved_at: new Date().toISOString(),
                        })
                    });
                    console.log('n8n webhook sent:', n8nRes.status);
                } catch (err) {
                    console.error('n8n webhook failed:', err.message);
                }
            }
        }

        res.status(200).json({
            message: "Quotation updated successfully",
            quotation: populatedQuotation,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while updating quotation",
            error: error.message,
        });
    }
};

// Delete quotation (and its items)
export const deleteQuotation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const quotation = await QuotationModel.findOne({ _id: id, createdBy: req.user._id });
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        await QuotationItemModel.deleteMany({ quotation: id });
        await QuotationModel.deleteOne({ _id: id });

        res.status(200).json({ message: "Quotation deleted successfully" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while deleting quotation",
            error: error.message,
        });
    }
};