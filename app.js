const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine","ejs")

app.get('/',function(req,res){
    res.send('testing');
})


app.listen(3000, () => {
    console.log("server is on")
})