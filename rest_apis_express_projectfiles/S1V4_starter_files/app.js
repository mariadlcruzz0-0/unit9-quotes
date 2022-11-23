/**
 * Rest API Project
 */

const express = require('express');
const app = express();
const routes = require("./routes");

//This imports the objects from records.js
const records = require('./records');

//Express middleware --> explains that we're expecting requests to
//come in as JSON
app.use(express.json());
//middleware only to be used if route starts with a certain path
app.use("/api", routes);


//middleware function
app.use((req, res, next) => {
  //error constructor that creates an error object and to that
  //object we can pass a string describing the error.
  const err = new Error("Not Found");
  //changes the status code to 404
  err.status = 404;
  //passing the error we just created
  //calling to next signals to express that there's been an error
  next(err);
});

//custom error handler
//It is exactly the same as setting up middle ware with one distinction
//🌟error handles have 4 parameters
app.use((err, req, res, next) => {
  // sends the error message but if it's undefined
  // it will show 500 as the error message
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
})


app.listen(3000, () => console.log('Quote API listening on port 3000!'));

