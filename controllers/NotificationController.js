const Notification = require('../models/notificationModel'); // Import your Notification model

const getNotificationByMemberIDController = async (req, res) => {
  try {
    const { memberId } = req.params; // Assuming member ID is in the route parameters

    // Query the database to get notifications for the specified member
    const notifications = await Notification.findAll({
      where: { MemberID: memberId }, // Filter notifications by MemberID
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'An error occurred while fetching notifications.' });
  }
};

module.exports = getNotificationByMemberIDController; // Export the controller function
