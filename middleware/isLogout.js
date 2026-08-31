const jwt = require("jsonwebtoken");

function islogout(req, res, next) {
  const token = req.cookies.token;
  if (token) {
  const decode = jwt.verify(token, "secrettokenkey");
         req.user = decode;
         res.redirect('/home');
  } else {
    res.redirect("/login");
  }
}

module.exports = islogout;
