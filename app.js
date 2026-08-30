const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require("path");
const utils = require("./utils/utils.js");
const connectDB = require("./config/config.js");
const usersModel = require("./model/usersModel.js");
const todoModel = require("./model/todoModel.js");
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
    // console.log(isEmailExist);
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
    
    if (!getDatafromEmail) {
      return res.status(404).send('User not found');
    }

    const todos = await todoModel.find({
      user_id: getDatafromEmail._id
    })

    res.render("home",{
      userData : getDatafromEmail,
      todos : todos
    });

  }catch(error){
    console.error("something went wrong: ", error.message);
    res.status(404).send('something went wrong')
  }
} )

app.post('/todo',isLoggedIn, async function(req,res){
  try{
    const {todoName} = req.body;
    if(utils.checkIffieldsAreEmpty(req.body)) return res.send('field is empty');
    const getDatafromEmail = await usersModel.findOne({userEmail: req.user.email});
      if (!getDatafromEmail) {
      return res.status(404).send('User not found');
    }

    const todoCreated = await todoModel.create({
      content: todoName,
      user_id: getDatafromEmail._id
    })
    getDatafromEmail.todos.push(todoCreated._id);
    await getDatafromEmail.save();
    return res.status(201).redirect('/home');
   

  }catch(error){
    console.error("something went wrong: ", error.message);
    res.status(404).send('something went wrong')
  }
})

// todo : update this api to delete it bug when we write delete convert it into delete api it working now but later change it 
app.get('/todo/delete/:id',isLoggedIn,  async function(req,res){

      const todos = await todoModel.findOneAndDelete({
      _id: req.params.id
      })
 
    res.redirect("/home");
})
app.patch('/todo/:id',isLoggedIn,  async function(req,res){

  try {
    const { id } = req.params;
    const { completed } = req.body;

    await todoModel.findByIdAndUpdate({_id: id}, {
      completed: completed
    });

    res.status(201).send({message: "updated "});
    // redirect('/home');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})








app.get('/notes', isLoggedIn, async function(req,res){
  try{
    const getDatafromEmail = await usersModel.findOne({userEmail: req.user.email});
    // console.log(getDatafromEmail)
    res.render("notes",{
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
