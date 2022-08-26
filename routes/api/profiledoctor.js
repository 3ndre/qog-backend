const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const authdoctor = require('../../middleware/authdoctor');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');

const ProfileDoctor = require('../../models/ProfileDoctor');
const Doctor = require('../../models/Doctor');
const Post = require('../../models/Post');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me',authdoctor, async (req, res) => {
  try {
    const profiledoctor = await ProfileDoctor.findOne({
      doctor: req.doctor.id
    }).populate('doctor', ['firstname', 'avatar']);

    if (!profiledoctor) {
      return res.status(400).json({ msg: 'There is no profile for this doctor' });
    }

    res.json(profiledoctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  POST api/profile
//  Create or update user profile

router.post(
  '/',authdoctor,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body)

    // build a profile
    const profileFields = {
      doctor: req.doctor.id,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      gender : req.body.gender,
      age : req.body.age,
      speciality : req.body.speciality,
      education : req.body.education,
      experience : req.body.experience,
      designation : req.body.designation,
      description : req.body.description,
    };


    try {
      // Using upsert option (creates new doc if no match is found):
      let profiledoctor = await ProfileDoctor.findOneAndUpdate(
        { doctor: req.doctor.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profiledoctor);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await ProfileDoctor.find().populate('doctor', ['firstname', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
  '/doctor/:doctor_id',
  checkObjectId('doctor_id'),
  async ({ params: { doctor_id } }, res) => {
    try {
      const profiledoctor = await ProfileDoctor.findOne({
        doctor: doctor_id
      }).populate('doctor', ['firstname', 'avatar']);

      if (!profiledoctor) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profiledoctor);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      Post.deleteMany({ doctor: req.doctor.id }),
      ProfileDoctor.findOneAndRemove({ doctor: req.doctor.id }),
      Doctor.findOneAndRemove({ _id: req.doctor.id })
    ]);

    res.json({ msg: 'Doctor deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;