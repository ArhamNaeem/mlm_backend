const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin } = require('../controllers/AdminController');

// Route for admin registration
router.post('/register', adminRegister);

// Route for admin login
router.post('/login', adminLogin);

module.exports = router;
