//Must include the express package
const express = require("express");
const router = express.Router();
//imports records module
const records = require("./records");

//This function is called and handles all the try/catch
function asyncHandler(cb){
  return async (req, res, next)=>{
    try {
      await cb(req,res, next);
    } catch(err){
      next(err);
    }
  };
}

/**
 * Takes 2 arguments
 * 1st argument is the route we want to handle
 * 2nd argument how do we want to respond.
 * Send a GET request to /quotes to READ a list of quotes
 */
router.get('/quotes', asyncHandler(async(req, res) => {
  /**
   *   calls the function getQuotes on the record file and stores
   *   the data in the quotes variable
   */
    const quotes = await records.getQuotes();
    //quotes response is converted into JSON format
    res.json(quotes);
}));

//Send a GET request to /quotes/:id to READ (view) a quote
router.get('/quotes/:id', async(req, res) => {
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

//Send a GET request to /quotes/quote/random to READ (view) a random quote
router.get('/quotes/quote/random', asyncHandler( async(req, res, next) => {
  const quote = await records.getRandomQuote();
  res.json(quote);
}));

//Send a POST request to /quotes to CREATE a new quote
router.post('/quotes', asyncHandler( async (req, res) => {
  if(req.body.author && req.body.quote) {
    const quote = await records.createQuote({
      quote: req.body.quote,
      author: req.body.author
    });
    res.status(201).json(quote);
  } else {
    res.status(400).json({ message: "Quote & Author are required."})
  }
}));

//Send a PUT request to /quotes/:id to UPDATE (edit) a quote
router.put('/quotes/:id', asyncHandler( async(req, res) => {
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
}));
//Send a DELETE request to /quotes/:id to DELETE a quote
router.delete('/quotes/:id', asyncHandler(async(req, res, next) => {
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);         //-->How do we know we have to wait?
    res.status(204).end();
}));

//exports router 
module.exports = router;