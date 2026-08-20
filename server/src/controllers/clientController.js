import ClientModel from "../models/ClientModel.js";

//add a client
export const addClient = async (req, res) => {

    try {
        const {
            name,
            company,
            email,
            phone,
            notes
        } = req.body;

        //validate for all required fields
        if (!name || !company || !email) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //User authentication 
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        let existingClient = await ClientModel.findOne({ email, createdBy: req.user._id })
        if (existingClient) {
            return res.status(400).json({ message: "Client already exists" })
        }

        const client = {
            name,
            company,
            email,
            phone,
            notes,
            createdBy: req.user._id
        }

        const newClient = await ClientModel.create(client);

        const populatedClient = await ClientModel.findById(newClient._id)
            .populate('createdBy', 'email')
            .select('-__v');
        if (!populatedClient) {
            return res.status(400).json({ message: "Client not created" })
        }

        res.status(201).json({
            message: "Client created successfully",
            client: populatedClient
        })

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({ message: "Client already exists" });
        }//duplicate email check from database
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong while adding data",
            error: error.message
        })
    }


}

//get all clients
export const getClients = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let clientsList = await ClientModel.find({ createdBy: req.user._id })
            .select('-__v')
            .populate("createdBy", "email")
            .sort({ createdAt: -1 });
        res.status(200).json({ clients: clientsList });

    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(500).json({
            message: "Internal server Error",
            error: error.message
        });
    }
};

//Get one client
export const getAClient = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let client = await ClientModel.findOne({ _id: req.params.id, createdBy: req.user._id })
            .select('-__v')
            .populate('createdBy', 'email');
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ client });

    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(500).json({
            message: "Internal server Error",
            error: error.message
        });
    }
};

//Update Client
export const updateClient = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let updatedClient = await ClientModel.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { returnDocument: 'after', runValidators: true }
        ).select('-__v');

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found or not authorized" });
        }

        res.status(200).json({
            message: "Client Data updated succesfully",
            client: updatedClient
        });
    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(500).json({
            message: "Internal server Error",
            error: error.message
        });
    }
};

//Delete a Client

export const deleteClient = async (req, res) => {
    try {
        let clientToDelete = await ClientModel.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

        if (!clientToDelete) {
            return res.status(404).json({
                message: "Client not found or not authorized"
            });
        }

        res.status(200).json({ message: "Client deleted successfully" });

    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(500).json({
            message: "Internal server Error",
            error: error.message

        })
    }
}