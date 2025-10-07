import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: "No token provided"})
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            if (!req.body) {
                req.body = {};
                }
            req.body.userId = tokenDecode.id
        }else{
            return res.json({success: false, message: "Invalid token"})
        }
        next();
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}