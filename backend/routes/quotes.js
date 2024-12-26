const router = require('express').Router();
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');

// Get all quotes (public access)
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().populate('user', 'username');
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quotes for logged-in user
router.get('/my-quotes', auth, async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.userId });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new quote
router.post('/', auth, async (req, res) => {
  try {
    const { text, author } = req.body;
    const quote = new Quote({
      text,
      author,
      user: req.userId
    });
    await quote.save();
    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a quote
router.delete('/:id', auth, async (req, res) => {
  try {
    const quote = await Quote.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json({ message: 'Quote deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add update quote route
router.put('/:id', auth, async (req, res) => {
  try {
    const quote = await Quote.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 