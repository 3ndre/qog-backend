const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');


const Query = require('../../models/Query');
const User = require('../../models/User');
const Doctor = require('../../models/Doctor');
const checkObjectId = require('../../middleware/checkObjectId');
const authdoctor = require('../../middleware/authdoctor');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  auth,
  check('text', 'Text is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newQuery = new Query({
        text: req.body.text,
        firstname: user.firstname,
        avatar: user.avatar,
        user: req.user.id
      });

      const query = await newQuery.save();

      res.json(query);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);




// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const queries = await Query.find().sort({ date: -1 });
    res.json(queries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({ msg: 'Query not found' });
    }

    res.json(query);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({ msg: 'Query not found' });
    }

    // Check user
    if (query.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await query.remove();

    res.json({ msg: 'Query removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});




// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    // Check if the post has already been liked
    if (query.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Query already liked' });
    }

    query.likes.unshift({ user: req.user.id });

    await query.save();

    return res.json(query.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});







// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    // Check if the post has not yet been liked
    if (!query.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Query has not yet been liked' });
    }

    // remove the like
    query.likes = query.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await query.save();

    return res.json(query.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  '/comment/:id',
  auth,
  checkObjectId('id'),
  check('text', 'Text is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const query = await Query.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        firstname: user.firstname,
        avatar: user.avatar,
        user: req.user.id
      };

      query.comments.unshift(newComment);

      await query.save();

      res.json(query.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    // Pull out comment
    const comment = query.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    query.comments = query.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await query.save();

    return res.json(query.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});



module.exports = router;
