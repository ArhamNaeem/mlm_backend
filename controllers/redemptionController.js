const RedemptionRequest = require('../models/redemptionRequestsModel');
const Member = require('../models/membersModel');
const Notification = require('../models/notificationModel')
const Activity = require('../models/odometerPicturesModel');


const submitRedemptionRequest = async (req, res) => {
  try {
    const { memberId, pointsRequested, requestType } = req.body;

    // Validate the input (You may want to add more validation)
    if (!memberId || !pointsRequested || !requestType) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check if the member exists
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    // Create the redemption request
    const redemptionRequest = await RedemptionRequest.create({
      MemberID: memberId,
      RequestDate: new Date(),
      PointsRequested: pointsRequested,
      RequestType: requestType,
      Status: 'Pending', // You can set an initial status
      AdminID: null, // You may assign an admin if needed
    });

    // Send a notification to the member about the redemption request
    await Notification.create({
      MemberID: memberId,
      message: 'Redemption request submitted',
    });

    return res.status(201).json({ message: 'Redemption request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting redemption request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

const getAllPendingRedemptionRequests = async (req, res) => {
  try {
    // Find all pending redemption requests
    const pendingRequests = await RedemptionRequest.findAll({
      where: { Status: 'Pending' },
    });

    return res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error('Error fetching pending redemption requests:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
const getAllRedemptionRequestsByUserId = async (req, res) => {

  try {
    const memberId = req.params.memberId;
    // Find all pending redemption requests
    const pendingRequests = await RedemptionRequest.findAll({
      where: { MemberID: memberId },
    });

    return res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error('Error fetching pending redemption requests:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};


const getTotalPendingRedemptionRequests = async (req, res) => {
  try {
    // Count all pending redemption requests
    const withdrawalRequestsCount = await RedemptionRequest.count({
      where: { Status: 'Pending' },
    });
    const totalMembers = await Member.count();
    const activityRequestsCount = await Activity.count({
      where: { ApprovalStatus: 'Pending' },
    });


    return res.status(200).json({ withdrawalRequestsCount, totalMembers, activityRequestsCount });
  } catch (error) {
    console.error('Error fetching pending redemption requests:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};


const updateRedemptionRequestStatus = async (req, res) => {
  try {
    const { requestId, newStatus } = req.body; // Get the requestId and newStatus from the request body

    // Find the redemption request by ID
    const redemptionRequest = await RedemptionRequest.findByPk(requestId);

    if (!redemptionRequest) {
      return res.status(404).json({ error: 'Redemption request not found.' });
    }

    // Update the status of the redemption request
    redemptionRequest.Status = newStatus;

    // If the new status is "Approved," update member balances
    if (newStatus === 'Approved') {
      const member = await Member.findByPk(redemptionRequest.MemberID);


      if (member) {
        // Deduct points from the member's Balance
        member.Balance = parseInt(member.Balance, 10) - redemptionRequest.PointsRequested;

        // Add points to the member's AvailableBalance
        member.AvailableBalance = parseInt(member.AvailableBalance, 10) + redemptionRequest.PointsRequested;

        // Save the updated member details
        await member.save();

      } else {
        return res.status(404).json({ error: 'Member not found.' });
      }
    }



    // Save the updated request
    await redemptionRequest.save();
    // Send a notification to the member about the redemption request
    await Notification.create({
      MemberID: redemptionRequest.MemberID,
      message: `Redemption request ${newStatus}`,
    });


    return res.status(200).json({ message: 'Redemption request status updated successfully.' });
  } catch (error) {
    console.error('Error updating redemption request status:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

module.exports = {
  submitRedemptionRequest, getAllPendingRedemptionRequests, updateRedemptionRequestStatus, getAllRedemptionRequestsByUserId, getTotalPendingRedemptionRequests
};
