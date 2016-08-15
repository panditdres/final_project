var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // console.log("REQ.BODY",req.body)
    // console.log("REQ PARAM",req.params)
    // console.log("REQ HEADER",req.headers)
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['authentication'];
    // decode token
    //console.log("TOKEN before", token)
    if (token) {
        // verifies secret and checks exp
        // Key can be changed to anything you'd like
        jwt.verify(token, 'dwaynetherockjohnson', function(err, decoded) {          
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });      
            } else {
                //res.send(token);
                req.decoded = decoded;  
                next();
            }
        });
        
    } else {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });

    }

};