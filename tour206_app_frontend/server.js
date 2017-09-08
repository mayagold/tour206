// MODELS, DEPENDENCIES
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const session     = require('express-session');
const env         = require('dotenv').config();
const PORT        = 2045;

// MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

// SESSIONS CONTROLLER
const user = require('./controllers/users_controller.js');
app.use('/users', user);

// LISTENER
app.listen(PORT, ()=>{
  console.log('App is listening to good music in the 206 and is also listening on PORT ', PORT);
})
