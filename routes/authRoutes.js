
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.post('/register', authController.register);

router.post('/login', authController.login);
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

module.exports = router;
