import User from "../models/User.js";

// Update User CartData : /api/cart/update

export const updateCart = async (req, res) => {
    try {

         const userId = req.userId; 
        const { cartItems } = req.body;
        await User.findByIdAndUpdate(userId, {cartItems});
        return res.status(200).json({
            success: true,
            message: "Cart updated successfully"
        })

    } catch (error) {
        console.log(error.message);
       return res.json({ success: false, message: error.message })
        
    }
}