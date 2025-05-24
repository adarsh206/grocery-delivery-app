import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files;

        if (!req.body.productData) {           
            return res.status(400).json({ success: false, message: 'Missing productData' });
        }
        
        if (!req.files || req.files.length === 0) {
             return res.status(400).json({ success: false, message: "No images uploaded" });
        }

       // let productData = JSON.parse(req.body.productData);
       

        let imagesUrl = await Promise.all(
            req.files.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                });
                return result.secure_url;
            })
        )

        await Product.create({...productData, image: imagesUrl});

        return res.status(200).json({
            success: true,
            message: "Product added successfully"
        })

    } catch (error) {      
        
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// Get All Products : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
            success: true,
            message: "Product list fetched successfully",
            products
        })
    } catch (error) {
      
        return res.json({
            success: false,
            message: error.message
        })
        
    }
}

//Get Single Product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
        
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product .findByIdAndUpdate(id, { inStock })
        return res.status(200).json({
            success: true,
            message: "Product stock updated successfully"
        })
    } catch (error) {
        
        return res.json({
            success: false,
            message: error.message
        })
        
    }
}