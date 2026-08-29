const jwt = require('jsonwebtoken');


function islogout(req,res,next){
    const token = req.cookies.token;
    if(token){
        const decode = jwt.verify(token, "secrettokenkey");
        if(decode)  res.redirect('home');
        
    }else{
        res.render('login');
    }

}


module.exports = islogout;