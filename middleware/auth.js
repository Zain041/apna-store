const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next) {   
    //next is call back to run once we are done with authentication to move to next middleware
    //Get toke from header
    const token = req.header('x-auth-token');
    
    //Check if not token
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
        
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        
        next();
    } catch (err) {

        res.status(401).json({ msg: 'Token is not valid'});
    }
}