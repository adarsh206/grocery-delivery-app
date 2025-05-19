import Order from "../models/Order.js";
import Product from "../models/Product.js";


// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            })
        }
        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                })
            }
            return (await acc) + (product.price * item.quantity);
        }, 0);

        // Add Tax Charge
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items, 
            amount,
            address,
            paymentType: "COD",
        });
        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
        })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })        
    }
}

// Get Orders by User Id : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({ userId, 
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })        
        
    }
}