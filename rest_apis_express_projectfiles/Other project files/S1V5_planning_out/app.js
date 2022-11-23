const express = require('express');
const app = express();

app.get('/quotes', (req, res)=>{
  res.json({greeting: "Hello World!"});
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));
