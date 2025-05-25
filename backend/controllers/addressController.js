import Address from "../models/Address.js";

// Add Address : /api/address/add

export const addAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address } = req.body;
        await Address.create({...address, userId});
        return res.status(200).json({
            success: true,
            message: "Address added successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get Address : /api/address/get
export const getAddress = async(req, res) => {
    try {
        const  userId  = req.userId;
        const addresses = await Address.find({ userId });
        if (!addresses) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            })
        }
       return res.status(200).json({
            success: true,
            message: "Address fetched successfully",
            addresses
        })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
        
    }
}