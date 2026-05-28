const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminMiddleware = async(req, res, next) => {
     try {
        const {token} = req.cookies;
        
        if(!token) {
            throw new Error("Token is absent");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);

        if(payload.role != 'admin'){
            throw new Error("Invalid User");
        }

        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid Token");
        }

        const result = await User.findById(_id);

        if(!result){
            throw new Error("User does not exists");
        }

        req.result = result;

        next();
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}

module.exports = adminMiddleware;