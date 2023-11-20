// odometer route:

const express = require('express');
const router = express.Router();
const odometerPictureController = require('../controllers/OdometerPicture');


// Define a route to handle updates
router.put('/updateApprovalStatus', odometerPictureController.updateApprovalStatus);

router.get('/getpending', odometerPictureController.getPendingWithLastAcceptedImage);

// Create a route for adding odometer pictures
router.post('/addOdometerPicture', odometerPictureController.addOdometer);
router.get('/records/:memberId', odometerPictureController.getRecordsByMemberID);


router.get('/odometerPictures/:memberID', async (req, res) => {
  const memberID = parseInt(req.params.memberID); // Convert to integer

  try {
    const odometerPictures = await odometerPictureController.getOdometerPicturesByMemberID(memberID);
    res.json(odometerPictures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router