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
    res.json(quote);
  } catch(err) {
    res.json({ message: err.message });
  }
});

//Send a POST request to /quotes to CREATE a new quote
app.post('/quotes', async (req, res) => {
  throw new Error("Oh NOOOO something went wrong!");
  try{
    const quote = await records.createQuote({
      quote: req.body.quote,
      author: req.body.author
    });
    res.json(quote);
  } catch(err) {
      res.json({ message: err.message });
  }
});
//Send a PUT request to /quotes/:id to UPDATE (edit) a quote
//Send a DELETE request to /quotes/:id to DELETE a quote
//Send a GET request to /quotes/quote/random to READ (view) a random quote

app.listen(3000, () => console.log('Quote API listening on port 3000!'));

