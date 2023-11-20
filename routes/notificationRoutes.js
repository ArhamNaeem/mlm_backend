const express = require('express');
const router = express.Router();
const getNotificationByMemberIDController = require('../controllers/NotificationController'); // Import the controller

// Define the API route to get notifications by member ID
router.get('/:memberId', getNotificationByMemberIDController);

module.exports = router;
