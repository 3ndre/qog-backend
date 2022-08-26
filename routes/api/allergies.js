const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');


const Allergy = require('../../models/Allergy')

const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/allergies
// @desc     Create a allergy
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

      const newAllergy = new Allergy({
        allergyCategory : req.body.allergyCategory,
        encounterDate : req.body.encounterDate,
        encounterAge : req.body.encounterAge,
        lastOccurence : req.body.lastOccurence,
        status : req.body.status,
        reaction : req.body.reaction,
        note: req.body.note,
        user: req.user.id
      });

      const allergy = await newAllergy.save();
      return res.json(allergy);

     
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/allergies
// @desc     Get all allergies
// @access   Private
router.get('/',auth,async (req, res) => {
  try {
    const allergies = await Allergy.find({user: req.user.id});
    res.json(allergies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/allergies/:id
// @desc     Get allergies by ID
// @access   Private
router.get('/:id',auth, checkObjectId('id'), async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    res.json(allergy);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/allergies/:id
// @desc     Delete a allergy
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    if (allergy.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await allergy.remove();

    res.json({ msg: 'Record removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});


module.exports = router;

