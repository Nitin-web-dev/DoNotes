const jwt = require('jsonwebtoken');



function isLoggedIn(req,res,next){
    const token = req.cookies.token;
    if(!token){ res.redirect('/login');}
    else{
        const decode = jwt.verify(token, "secrettokenkey");
        req.user = decode;
        next();
    }
}



module.exports = isLoggedIn;