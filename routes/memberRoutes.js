const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/MemberController');

// Route to register a new member after payment verification
router.post('/register', async (req, res) => {
  const { Name, JoiningDate, Balance, Email, Phone, Address,Password, ReferringMemberID  } = req.body;
  try {
    const member = await MemberController.registerMember(Name, JoiningDate, Balance, Email, Phone, Address,Password, ReferringMemberID);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to update a member's profile
router.put('/:id', async (req, res) => {
    const memberId = req.params.id;
    const { Name, Email, Phone, Address } = req.body;
    try {
      const member = await MemberController.updateMemberProfile(memberId, Name, Email, Phone, Address);
      res.status(200).json(member);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Route to retrieve member details
  router.get('/:id', async (req, res) => {
    const memberId = req.params.id;
    try {
      const member = await MemberController.getMemberDetails(memberId);
      res.status(200).json(member);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
  
  // Route for member login
router.post('/login', MemberController.memberLogin);

// Route to calculate the total number of recruits by MemberID
router.get('/total-recruits/:memberId', MemberController.calculateTotalRecruits);

// Other member-related routes and controllers



module.exports = router;
