/**
 * Rest API Project
 */

const express = require('express');
const app = express();

//This imports the objects from records.js
const records = require('./records');

//Express middleware --> explains that we're expecting requests to
//come in as JSON
app.use(express.json());
/**
 * Takes 2 arguments
 * 1st argument is the route we want to handle
 * 2nd argument how do we want to respond.
 */

//Send a GET request to /quotes to READ a list of quotes
app.get('/quotes', async(req, res) => {
  /**
   *   calls the function getQuotes on the record file and stores
   *   the data in the quotes variable
   */
  try{
    const quotes = await records.getQuotes();
    //quotes response is converted into JSON format
    res.json(quotes);
  } catch(err) {
    res.json({ message: err.message });
  }
});

//Send a GET request to /quotes/:id to READ (view) a quote
app.get('/quotes/:id', async(req, res) => {
  try{
    const quote = await records.getQuote(req.params.id);
    if(quote) {
      res.json(quote);
    } else {
        res.status(404).json({ message: "Quote not found "});
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

//Send a POST request to /quotes to CREATE a new quote
app.post('/quotes', async (req, res) => {
  throw new Error("Oh NOOOO something went wrong!");
  try{
    if(req.body.quote && req.body.author) {
      const quote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author
      });
      res.status(201).json(quote);
    } else {
      res.status(400).json({ message: "Quote & Author are required."})
    }
  } catch(err) {
      res.status(500).json({ message: err.message });
  }
});
//Send a PUT request to /quotes/:id to UPDATE (edit) a quote
app.put('/quotes/:id', async(req, res) => {
  try{
    const quote = await records.getQuote(req.params.id);
    if(quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;

      await records.updateQuote(quote);
      //it's convention not to respond with any message
      //Must put end to let Express know that we are done!
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Quote not found" });
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});
//Send a DELETE request to /quotes/:id to DELETE a quote
app.delete('/quotes/:id', async(req, res) => {
  try{
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);         //-->How do we know we have to wait?
    res.status(204).end();
  }catch(err) {
    res.status(500).json({ message: err.message });
  }
});
//Send a GET request to /quotes/quote/random to READ (view) a random quote

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

