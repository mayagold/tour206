// MODELS, DEPENDENCIES
const express = require('express');
const app     = express();
const PORT    = 2045;

// MIDDLEWARE
app.use(express.static('public'));


// LISTENER
app.listen(PORT, ()=>{
  console.log('App is listening to good music in the 206 and is also listening on PORT ', PORT);
})
