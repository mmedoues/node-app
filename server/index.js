const express=require('express');
const mongoose= require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const User=require('./models/user');
const {auth} =require('./middlewares/auth');
const db=require('./config/config').get(process.env.NODE_ENV);
const routes = require('./routes/routes');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 8080;
const app=express();
// app use
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


//steps to add github repository
//git init
//git add .
//git commit -m "first commit"
//git remote add origin
//git push -u origin master
// git push -f origin master
//git push origin master --force
// to addan existing project
//git remote add origin

app.use('/', routes);
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, '../client'));
console.log(path.join(__dirname, '../client'));

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
  if (err) console.log(err);
  console.log("database is connected");
  console.log(process.env.MONGODB_URL, process.env.SECRET_KEY);
});

// Define the registration route handler
app.post('/api/register', function (req, res) {
  console.log('Received registration request:', req.body);

  const newuser = new User(req.body);
  console.log(newuser);

  User.findOne({ email: newuser.email }, function (err, user) {
    if (user) {
      return res.status(400).json({ auth: false, message: "Email already exists" });
    }

    newuser.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }

      // Redirect to the signup-successful page
      res.redirect('/signup-successful');
    });
  });
});

app.get('/signup-successful', (req, res) => {
  setTimeout(() => {
    res.redirect('/login');
  }, 2000);
});






app.post('/api/login', function(req, res) {
  console.log('Login request:', req.body);
  let token = req.cookies.auth;

  User.findByToken(token, (err, user) => {
    if (err) return res(err);
    if (user) {
      return res.status(400).json({
        error: true,
        message: "You are already logged in"
      });
    } else {
      User.findOne({ 'email': req.body.email }, function(err, user) {
        if (!user) {
          return res.render('login', { error: 'Auth failed, email not found' }); // Render login page with error message
        }

        user.comparepassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            return res.render('login', { error: "Password doesn't match" }); // Render login page with error message
          }

          user.generateToken(process.env.SECRET_KEY, function(err, user) {
            if (err) return res.status(400).send(err);
            res.cookie('auth', user.token);
            return res.redirect('/Library'); // Redirect to the Library page
          });          
        });
      });
    }
  });
});


  

// Logout user
app.get('/api/logout', auth, function(req, res) {
    req.user.deleteToken(req.token, (err, user) => {
      if (err) return res.status(400).send(err);
      res.redirect('/login'); // Redirect to the login page
    });
  });
  

// get logged in user
app.get('/api/profile',auth,function(req,res){
        res.json({
            isAuth: true,
            id: req.user._id,
            email: req.user.email,
            name: req.user.firstname + req.user.lastname
            
        })
});


app.get('/*',function(req,res){
  res.redirect('/4042')
});

app.listen(port, () => {
  console.log(`app is live at ${port}`);
});