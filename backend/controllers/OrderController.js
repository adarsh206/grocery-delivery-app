import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";


// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;
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

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { origin } = req.headers;
        const { items, address } = req.body;

        if(!address || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            })
        }

        let productData = [];

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })

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

       const order =  await Order.create({
            userId,
            items, 
            amount,
            address,
            paymentType: "Online",
            isPaid: true
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity
            }
        })

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            url: session.url
        })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })        
    }
}

// Stripe Webhooks to Verify Payment action :/ stripe
export const stripeWebhooks = async (request, response) => {
    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`);
    }
    // Handle the event
    switch(event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId, userId} = session.data[0].metadata;

            // Mark Payment as Paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true})
            // Clear user cart
            await User.findByIdAndUpdate(userId, { cart: {} });
             break;
        }
         case "payment_intent.failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;

         }

        default: {
            console.error(`Unhandled event type ${event.type}`);
            break;
    }
    response.json({ received: true });
}
}
// Get Orders by User Id : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const  userId  = req.userId;
        const orders = await Order.find({ userId, 
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        })
    } catch (error) {
        res.json({ success: false, message: error.message })        
        
    }
}

// Get All Orders(for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try { 
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        res.json({ success: false, message: error.message })        
        
    }
}