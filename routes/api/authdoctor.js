const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authdoctor = require('../../middleware/authdoctor');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Doctor = require('../../models/Doctor');


router.get('/', authdoctor, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id).select('-password');
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/',check('email', 'Please include a valid email').isEmail(),check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let doctor = await Doctor.findOne({ email });

      if (!doctor) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, doctor.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        doctor: {
          id: doctor.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
