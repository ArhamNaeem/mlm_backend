const express = require('express');
const router = express.Router();
const { submitRedemptionRequest, getAllPendingRedemptionRequests, updateRedemptionRequestStatus, getAllRedemptionRequestsByUserId ,getTotalPendingRedemptionRequests} = require('../controllers/redemptionController');

// Route to submit a redemption request
router.post('/submit-redemption-request', submitRedemptionRequest);

// Route to fetch all pending redemption requests
router.get('/pending-redemption-requests', getAllPendingRedemptionRequests);

// Route to update the status of a redemption request
router.post('/update-redemption-request-status', updateRedemptionRequestStatus);

router.get('/total-pending-redemption-requests', getTotalPendingRedemptionRequests);

// Route to fetch all pending redemption requests
router.get('/member-redemption-requests/:memberId', getAllRedemptionRequestsByUserId);


module.exports = router;
