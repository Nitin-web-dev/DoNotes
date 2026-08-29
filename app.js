const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require("path");
const utils = require("./utils/utils.js");
const connectDB = require("./config/config.js");
const usersModel = require("./model/usersModel.js");
const isLoggedIn = require('./middleware/IsLoggedIn.js');
const islogout = require('./middleware/isLogout.js');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/SignUp", islogout,function (req, res) {
  res.render("signup");
});

app.post("/SignUp", async function (req, res) {
  if (utils.checkIffieldsAreEmpty(req.body)) {
    return res.render("signup");
  } else {
    const isEmailExist = await usersModel.findOne({
      userEmail: req.body.email,
    });
    if (isEmailExist) {
      return res.render("signup", {
        message: "user already exist",
      });
    } else {
      try {
        const { userName, email, password } = req.body;
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, async function (err, hashedPassword) {
            const userCreated = await usersModel.create({
              userName,
              userEmail: email,
              hashedPassword,
            });
            res.redirect("login");
          });
        });
      } catch (error) {
        console.error("something went wrong: ", error.message);
        res.status(500).send("Something went wrong");
      }
    }
  }
});

app.get("/login", islogout,  function (req, res) {
  res.render("login");
});

app.post("/login",   async function (req, res) {
  if (utils.checkIffieldsAreEmpty(req.body)) {
    return res.render("login");
  } else {
    const isEmailExist = await usersModel.findOne({
      userEmail: req.body.email,
    });
    console.log(isEmailExist);
    if (!isEmailExist) {
      console.log("user not exist");
       res.redirect("login");
    } else {
      try {
        const { email, password } = req.body;
        bcrypt.compare(password, isEmailExist.hashedPassword, function (err, result) {
            if(result){
              const token = jwt.sign({email},"secrettokenkey",{ expiresIn: "2d"});
              res.cookie("token", token,{
                httpOnly: true
              })
              res.redirect("home");

            }else{
              return res.redirect('login');
            }
        });
      } catch (error) {
        console.error("something went wrong: ", error.message);
        res.status(500).send("Something went wrong");
      }
    }
  }
});


app.get("/logout", function(req,res){
  res.clearCookie("token");
  res.redirect("/login");
})



app.get('/home', isLoggedIn, async function(req,res){
  try{
    const getDatafromEmail = await usersModel.findOne({userEmail: req.user.email});
    // console.log(getDatafromEmail)
    res.render("home",{
      userData : getDatafromEmail
    });

  }catch(error){
    console.error("something went wrong: ", error.message);
    res.status(404).send('something went wrong')
  }
} )



const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("server is on");
    });
  } catch (error) {
    console.error("failed to start: ", error.message);
    process.exit(1);
  }
};

startServer();
