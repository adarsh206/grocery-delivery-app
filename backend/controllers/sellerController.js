

// Login Seller : /api/seller/login 
 export const sellerLogin = async (req, res) => {
  try {
      const { email, password } = req.body;
    
    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "30d"});
        res.cookie("sellerToken", token, {
            httpOnly: true, // Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookie in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // SameSite attribute for CSRF protection
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days cookie expiration
        });

        return res.json({success:true, message: "Seller logged in successfully"});
    }
     else{

        return res.status(400).json({success:false, message: "Invalid email or password"});
     }
  } catch (error) {
    console.log(error.message);
    res.json({success:false, message: error.message});  
  }
 }

 // Check Seller Auth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({success:true});
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message});
        
    }
}

// Logout  Seller  : /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 0,
        });
        return res.json({success:true, message: "User logged out successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message});
    }
}