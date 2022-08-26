const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Med = require('../../models/Med')
const checkObjectId = require('../../middleware/checkObjectId');


// @route    POST api/meds
// @desc     Create a medication
// @access   Private
router.post(
  '/',
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      const newMed = new Med({
        medName: req.body.medName,
        date: req.body.date,
        status: req.body.status,
        user: req.user.id
      });

      const med = await newMed.save();
      return res.json(med);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/meds
// @desc     Get all medications
// @access   Private
router.get('/',auth,async (req, res) => {
  try {
    const meds = await Med.find({user: req.user.id});
    res.json(meds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/meds/:id
// @desc     Get meds by ID
// @access   Private
router.get('/:id',auth, checkObjectId('id'), async (req, res) => {
  try {
    const med = await Med.findById(req.params.id);

    if (!med) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    if (med.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }



    res.json(med);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/meds/:id
// @desc     Delete a med
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const med = await Med.findById(req.params.id);

    if (!med) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    if (med.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await med.remove();

    res.json({ msg: 'Record removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});


module.exports = router;
