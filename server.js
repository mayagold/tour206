// MODELS, DEPENDENCIES
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const PORT        = process.env.port || 2045;

// MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// LISTENER
app.listen(PORT, ()=>{
  console.log('App is listening to good music in the 206 and is also listening on PORT ', PORT);
})
