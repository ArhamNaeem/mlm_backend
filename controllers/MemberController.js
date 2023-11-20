const Member = require('../models/membersModel');
const Notification = require('../models/notificationModel')
const Recruit = require('../models/recruitsModel'); // Import the Recruits model
const sequelize = require('../config/database');
const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing

// Register a new member after payment verification, credit referring member, and create a recruit entry
// async function registerMember(Name, JoiningDate, Balance, Email, Phone, Address, ReferringMemberID=null) {
//   try {
//     // Check if the joining fee is paid (Rs 10,000)
//     if (Balance >= 10000) {
//       const transaction = await sequelize.transaction(); // Start a transaction

//       try {
//         // Create the new member
//         const member = await Member.create({
//           Name,
//           JoiningDate,
//           Balance,
//           Email,
//           Phone,
//           Address,
//         }, { transaction });
//         console.log("member",member);
//         if (ReferringMemberID) {
//           // Credit the referring member with Rs 1,500
//           const referringMember = await Member.findByPk(ReferringMemberID, { transaction });

//           if (referringMember) {
//             referringMember.Balance += 1500;
//             await referringMember.save({ transaction });
//           }

//           // Create a recruit entry in the Recruits model
//           await Recruit.create({
//             MemberID: ReferringMemberID,
//             RecruitMemberID: member.MemberID,
//             JoiningDate: JoiningDate,
//           }, { transaction });
//         }

//         await transaction.commit(); // Commit the transaction

//         return member;
//       } catch (error) {
//         await transaction.rollback(); // Roll back the transaction in case of an error
//         throw new Error('Failed to complete the registration');
//       }
//     } else {
//       throw new Error('Joining fee of Rs 10,000 is required for registration');
//     }
//   } catch (error) {
//     throw new Error('Failed to register member: ' + error.message);
//   }
// }
// async function registerMember(Name, JoiningDate, Balance, Email, Phone, Address, ReferringMemberID = null) {
//   try {
//     const transaction = await sequelize.transaction(); // Start a transaction

//     // Create the new member
//     const member = await Member.create({
//       Name,
//       JoiningDate,
//       Balance,
//       Email,
//       Phone,
//       Address,
//     }, { transaction, returning: true });

//     console.log("member", member);

//     if (ReferringMemberID) {
//       // Credit the referring member with Rs 1,500
//       const referringMember = await Member.findByPk(ReferringMemberID, { transaction });

//       if (referringMember) {
//         referringMember.Balance += 1500;
//         await referringMember.save({ transaction });
//       }

//       // Create a recruit entry in the Recruits model
//       await Recruit.create({
//         MemberID: ReferringMemberID,
//         RecruitMemberID: member.MemberID,
//         JoiningDate: JoiningDate,
//       }, { transaction });
//     }

//     await transaction.commit(); // Commit the transaction

//     return member;
//   } catch (error) {
//     throw new Error('Failed to complete the registration: ' + error.message);
//   }
// }
async function registerMember(Name, JoiningDate, Balance, Email, Phone, Address, Password, ReferringMemberID) {
  try {
    const transaction = await sequelize.transaction(); // Start a transaction
        const hashedPassword = await bcrypt.hash(Password, 10); // You can adjust the saltRounds as needed

    // Create the new member
    const createdMember = await Member.create({
      Name,
      JoiningDate,
      Balance,
      Email,
      Phone,
      Address,
      Password: hashedPassword, // Store the hashed password
    }, { transaction });

    const memberData = createdMember.get({ plain: true }); // Retrieve member data

    console.log("member", memberData);
    console.log("ReferringMemberID", ReferringMemberID);
   
     // Send a welcome notification to the registered member
     await Notification.create({
      MemberID: createdMember.MemberID, // ID of the newly registered member
      message: 'Welcome, you have earned a bicycle',
    }, { transaction });

    if (ReferringMemberID) {
      // Credit the referring member with Rs 1,500
      const referringMember = await Member.findByPk(ReferringMemberID, { transaction });
      if (referringMember.Level < 3) {
        referringMember.Level++; // Increment the level
        await referringMember.save({ transaction });
      }

      if (referringMember && referringMember.DirectCommision !== null) {
        const currentCommission = parseInt(referringMember.DirectCommision, 10);
        referringMember.DirectCommision = currentCommission + 1500;
    
        // Ensure that you save the updated balance as an integer
        await referringMember.save({ transaction });
      }

          // Find the ReferringMemberID of ReferringMemberID from the Recruit model
    const referringMemberRecruit = await Recruit.findOne({
      where: { RecruitMemberID: ReferringMemberID },
      attributes: ['MemberID',], // Assuming MemberID is the field you want
      transaction,
    });

    if (referringMemberRecruit) {
      // Now you can access referringMemberRecruit.MemberID to get the ReferringMemberID of ReferringMemberID
      const referredBy = referringMemberRecruit.MemberID;
      console.log('Referred by:', referredBy );
      const referringMember = await Member.findByPk(referredBy, { transaction });
      // Adding Commision 10%
      referringMember.DirectCommision = parseInt(referringMember.DirectCommision,10) + 1000;
      await referringMember.save({ transaction });
      if (referringMember.Level < 3) {
        referringMember.Level++; // Increment the level
        await referringMember.save({ transaction });
      }

      
    }
  

      // Create a recruit entry in the Recruits model
      await Recruit.create({
        MemberID: ReferringMemberID,
        RecruitMemberID: createdMember.MemberID,
        JoiningDate: JoiningDate,
      }, { transaction });
    }

    await transaction.commit(); // Commit the transaction

    return memberData; // Return the member data
  } catch (error) {
    throw new Error('Failed to complete the registration: ' + error.message);
  }
}

// async function registerMember(Name, JoiningDate, Balance, Email, Phone, Address, ReferringMemberID, Password) {
//   try {
//     // Check if the joining fee is paid (Rs 10,000)
//     if (Balance >= 10000) {
//       const transaction = await sequelize.transaction(); // Start a transaction

//       try {
//         // Hash the password before storing it
//         const hashedPassword = await bcrypt.hash(Password, 10); // You can adjust the saltRounds as needed

//         // // Create the new member with the hashed password
//         // const member = await Member.create({
//         //   Name,
//         //   JoiningDate,
//         //   Balance,
//         //   Email,
//         //   Phone,
//         //   Address,
//         //   Password: hashedPassword, // Store the hashed password
//         // }, { transaction });

//         // console.log("uptill here has been executed 1");
//         //     // Create the new member
//     const createdMember = await Member.create({
//       Name,
//       JoiningDate,
//       Balance,
//       Email,
//       Phone,
//       Address,
//       Password: hashedPassword, // Store the hashed password
//     }, { transaction });

//     const memberData = createdMember.get({ plain: true }); // Retrieve member data

//     console.log("member", memberData);

//         if (ReferringMemberID != null) {
//         // Function to increment levels recursively
//         async function incrementLevels(memberID, currentLevel) {
//           if (currentLevel >= 3) return; // Exit if the maximum level is reached

//           const referringMember = await Member.findByPk(memberID, { transaction });

//           if (referringMember && referringMember.Level < 3) {
//             referringMember.Level++; // Increment the level
//             await referringMember.save({ transaction });
//             await incrementLevels(referringMember.ReferringMemberID, currentLevel + 1);
//           }
//         }
//       }


//         // Credit the referring member with Rs 1,500
//         if (ReferringMemberID != null) {
//           const referringMember = await Member.findByPk(ReferringMemberID, { transaction });

//           if (referringMember) {
//             referringMember.Balance += 1500;
//             await referringMember.save({ transaction });
//             await incrementLevels(ReferringMemberID, 1); // Start incrementing levels
//           }
//         }

//         // Create a recruit entry in the Recruits model
//         if (ReferringMemberID != null) {
//           await Recruit.create({
//             MemberID: ReferringMemberID,
//             RecruitMemberID: member.MemberID,
//             JoiningDate: JoiningDate,
//           }, { transaction });
//         }

//         await transaction.commit(); // Commit the transaction

//         return member;
//       } catch (error) {
//         await transaction.rollback(); // Roll back the transaction in case of an error
//         throw new Error('Failed to complete the registration');
//       }
//     } else {
//       throw new Error('Joining fee of Rs 10,000 is required for registration');
//     }
//   } catch (error) {
//     throw new Error('Failed to register member: ' + error.message);
//   }
// }

// Update member profile

async function updateMemberProfile(memberId, Name, Email, Phone, Address) {
  try {
    const member = await Member.findByPk(memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    member.Name = Name;
    member.Email = Email;
    member.Phone = Phone;
    member.Address = Address;

    await member.save();
    return member;
  } catch (error) {
    throw new Error('Failed to update member profile');
  }
}

// Retrieve member details
async function getMemberDetails(memberId) {
  try {
    const member = await Member.findByPk(memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  } catch (error) {
    throw new Error('Failed to retrieve member details');
  }
}

const memberLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the member by email
    const member = await Member.findOne({ where: { Email: email } });

    // Check if the member exists and the password is correct
    if (member && await bcrypt.compare(password, member.Password)) {
      return res.status(200).json({ message: 'Login successful' , member});
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Error during member login:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

const calculateTotalRecruits = async (req, res) => {
  const memberId = req.params.memberId; // Get the MemberID from the URL parameter

  try {
    // Count the number of recruits for the member
    const totalRecruits = await Recruit.count({
      where: {
        MemberID: memberId,
      },
    });

    return res.status(200).json({ totalRecruits });
  } catch (error) {
    console.error('Error calculating total recruits:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

module.exports = {
  registerMember,
  updateMemberProfile,
  getMemberDetails,memberLogin, calculateTotalRecruits
};
