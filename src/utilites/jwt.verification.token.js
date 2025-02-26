const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SESSION_SECRET;

const verifyToken = (req, res, next) =>{

    // const  vertifyToken = req.headers['authorization'];

    // const  vertifyToken = req.query.token;

    const  vertifyToken = req.body.token;

    console.log("vertifyToken", vertifyToken);

    if(!vertifyToken){
        res.status(401).send({message:"No token provided"});
    }

    if(vertifyToken){
        // const genToken = vertifyToken.split(" ")[1];
        jwt.verify(vertifyToken, SECRET_KEY, (err, decoded)=>{
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }
    
            req.user = decoded
            next();
        })
    }
   

}

module.exports = verifyToken;