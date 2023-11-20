// odometer controller:
// odometerPictureController.js
const axios = require('axios');
const Member = require('../models/membersModel');
const Recruit = require('../models/recruitsModel');
const fs = require('fs');
const { Op } = require('sequelize');
const OdometerPictureModel = require('../models/odometerPicturesModel');
const multer = require("multer");
const Notification = require('../models/notificationModel')


// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './Assets');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// })

// var upload = multer({ storage: storage }).fields([{name: "Image"}, {name: "Image2"}]);


// let addOdometer = async (req, res) => {
//   try {
//     let { MemberID, ApprovalStatus, ReasonForRejection, Distance } = req.body;

//     // Promisify the upload function
//     const uploadAsync = (req, res) => {
//       return new Promise((resolve, reject) => {
//         upload(req, res, function (err) {
//           if (err) {
//             reject(err);
//           } else {
//             resolve();
//           }
//         });
//       });
//     };

//     await uploadAsync(req, res);

//     var path = req.files;
//     var filepath = path["Image"][0].path;

//     const newOdometerPicture = await OdometerPictureModel.create({
//       MemberID,
//       OdometerPicture: path["Image"][0].path, // Adjust this to the correct field name and index
//      
//       ApprovalStatus,
//       ReasonForRejection,
//       Distance,
//       MimeType: path["Image"][0].mimetype, // Adjust this to the correct field name and index
//     });

//     res.json({ success: true, message: 'Odometer picture added successfully', data: newOdometerPicture, filepath});
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//   }
// };



// let addOdometer = async (req, res) => {
//   try {
//     let { MemberID, ApprovalStatus, ReasonForRejection, Distance, OdometerPicture } = req.body;
//     // const downloadImage = async (imageUrl) => {
//     //   try {

//     //     let imageBuffer = Buffer.from(imageUrl, 'binary');
//     //     return imageBuffer;
//     //   } catch (error) {
//     //     throw new Error(`Error downloading image from ${imageUrl}: ${error.message}`);
//     //   }
//     // };




//     // let imageUrl = OdometerPicture;
//     // let imageData = await downloadImage(imageUrl); // Function to download image (explained below)
//     // let  base64EncodedImage = imageData.toString('base64');
//     const imageData = fs.readFileSync(OdometerPicture);
//     console.log(OdometerPicture);

//     const mimeType = `image/${OdometerPicture.split('.').pop()}`;




//     // Create a new OdometerPicture entry
//     const newOdometerPicture = await OdometerPictureModel.create({
//       MemberID,
//       OdometerPicture: imageData,

//       ApprovalStatus,
//       ReasonForRejection,
//       Distance,
//       MimeType: mimeType,

//     });








//     res.json({ success: true, message: 'Odometer picture added successfully', data: newOdometerPicture });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//   }
// };


// let addOdometer = async (req, res) => {
//   try {
//     const { MemberID, ApprovalStatus, ReasonForRejection, Distance, OdometerPicture } = req.body;

//     // Convert base64 image to binary data
//     const base64Data = OdometerPicture.replace(/^data:image\/\w+;base64,/, '');
//     const imageData = Buffer.from(base64Data, 'base64');

//     const mimeType = 'image/png'; // You might want to specify the correct image type.

//     // Create a new OdometerPicture entry
//     const newOdometerPicture = await OdometerPictureModel.create({
//       MemberID,
//       OdometerPicture: imageData,
//       ApprovalStatus,
//       ReasonForRejection,
//       Distance,
//       MimeType: mimeType,
//     });

//     res.json({ success: true, message: 'Odometer picture added successfully', data: newOdometerPicture });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//   }
// };


let addOdometer = async (req, res) => {
  try {
    const { MemberID, ApprovalStatus, ReasonForRejection, Distance, OdometerPicture } = req.body;

    // Convert base64 image to binary data
    const base64Data = OdometerPicture.replace(/^data:image\/\w+;base64,/, '');
    const imageData = Buffer.from(base64Data, 'base64');

    // Determine the MIME type
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      // Add more as needed
    };

    const extMatch = /image\/(\w+)/.exec(OdometerPicture); // Extract the image format
    const ext = extMatch ? extMatch[1].toLowerCase() : null;
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Create a new OdometerPicture entry
    const newOdometerPicture = await OdometerPictureModel.create({
      MemberID,
      OdometerPicture: imageData,
      ApprovalStatus,
      ReasonForRejection,
      Distance,
      MimeType: mimeType,
    });

            // Send a notification to the member about the redemption request
            await Notification.create({
              MemberID: MemberID,
              message: 'Activity request submitted',
            });


    res.json({ success: true, message: 'Odometer picture added successfully', data: newOdometerPicture });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    res.status(413).json({ success: false, message: 'file uploaded was too large', error: error.message });
  }
};

const getRecordsByMemberID = async (req, res) => {
  const memberId = req.params.memberId;

  try {
    const records = await OdometerPictureModel.findAll({
      where: {
        MemberID: memberId,
      },
      attributes: ['PictureID', 'MemberID', 'OdometerPicture', 'SubmissionDate', 'ApprovalStatus', 'ReasonForRejection', 'Distance', 'MimeType'],
    });

    if (records.length > 0) {
      const processedRecords = records.map(record => {
        const currentImageBuffer = record.OdometerPicture;
        const base64StringC = currentImageBuffer.toString('base64');
        const mimeTypeC = record.MimeType;
        const dataURICurrent = `data:${mimeTypeC};base64,${base64StringC}`;

        return {
          PictureID: record.PictureID,
          MemberID: record.MemberID,
          SubmissionDate: record.SubmissionDate,
          ApprovalStatus: record.ApprovalStatus,
          ReasonForRejection: record.ReasonForRejection,
          Distance: record.Distance,
          DataURI: dataURICurrent, // Include the Data URI in the response
        };
      });

      res.json(processedRecords);
    } else {
      res.status(404).json({ message: 'No records found for the given MemberID.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};









function convertImageToBase64(imagePath) {
  try {
    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert the buffer to a base64 encoded string
    const base64String = imageBuffer.toString('base64');

    // Determine the mime type of the image
    const mimeType = `data:image/${imagePath.split('.').pop()};base64`;

    // Construct the data URI
    const dataURI = `${mimeType},${base64String}`;

    return dataURI;
  } catch (error) {
    throw new Error('Failed to convert image to base64: ' + error.message);
  }
}




async function getallOdometerByMemberID(req, res) {
  try {
    const odometerPictures = await OdometerPictureModel.findAll({
      where: {
        ApprovalStatus: 'Pending'
      },
      include: [
        {
          model: Member,
          attributes: ['Name', 'MemberID']
        }
      ]
    });

    const formattedData = await Promise.all(odometerPictures.map(async (record) => {
      const currentPendingImage = await OdometerPictureModel.findOne({
        where: {
          MemberID: record.Member.MemberID,
          ApprovalStatus: 'Pending'
        },
        order: [['createdAt', 'DESC']]
      });

      if (!currentPendingImage) {
        return null;
      }

      const lastAcceptedImage = await OdometerPictureModel.findOne({
        where: {
          MemberID: record.Member.MemberID,
          ApprovalStatus: 'Accepted',
          createdAt: {
            [Op.lte]: currentPendingImage.createdAt
          }
        },
        order: [['createdAt', 'DESC']]
      });

      const currentImageBuffer = currentPendingImage.OdometerPicture;
      const base64StringC = currentImageBuffer.toString('base64');
      const mimeTypeC = currentPendingImage.MimeType;

      const dataURICurrent = `data:${mimeTypeC};base64,${base64StringC}`;

      let dataURILastAccepted = null;
      if (lastAcceptedImage) {
        const lastAcceptedImageBuffer = lastAcceptedImage.OdometerPicture;
        const base64StringP = lastAcceptedImageBuffer.toString('base64');
        const mimeTypeP = lastAcceptedImage.MimeType;
        dataURILastAccepted = `data:${mimeTypeP};base64,${base64StringP}`;
      }

      return {
        MemberID: record.Member.MemberID,
        MemberName: record.Member.Name,
        currentImage: dataURICurrent,
        lastAcceptedImage: dataURILastAccepted,
        SubmissionDate: record.SubmissionDate,
        ReasonForRejection: record.ReasonForRejection,
        Distance: record.Distance,
        ApprovalStatus: record.ApprovalStatus
      };
    }));

    // Filter out any null values (where no pending image was found)
    const filteredData = formattedData.filter(item => item !== null);

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}












// async function getOdometerPicturesByMemberID(memberID) {
//   try {
//     const currentPendingImage = await OdometerPictureModel.findOne({
//       where: {
//         MemberID: memberID,
//         ApprovalStatus: 'Pending'
//       },
//       order: [['createdAt', 'DESC']]
//     });

//     if (!currentPendingImage) {
//       throw new Error('No pending images found for the given memberID');
//     }

//     const lastAcceptedImage = await OdometerPictureModel.findOne({
//       where: {
//         MemberID: memberID,
//         ApprovalStatus: 'Accepted',
//         createdAt: {
//           [Op.lt]: currentPendingImage.createdAt
//         }
//       },
//       order: [['createdAt', 'DESC']]
//     });

//     const currentImageBuffer = currentPendingImage.OdometerPicture;

//     let base64StringC = currentImageBuffer.toString('base64');
//     let mimeTypeC = currentPendingImage.MimeType; // Use the stored MimeType

//     const dataURICurrent = `data:${mimeTypeC};base64,${base64StringC}`;

//     let dataURILastAccepted = null;
//     if (lastAcceptedImage) {
//       const lastAcceptedImageBuffer = lastAcceptedImage.OdometerPicture;
//       let base64StringP = lastAcceptedImageBuffer.toString('base64');
//       let mimeTypeP = lastAcceptedImage.MimeType; // Use the stored MimeType
//       dataURILastAccepted = `data:${mimeTypeP};base64,${base64StringP}`;
//     }

//     return {
//       currentImage: dataURICurrent,
//       lastAcceptedImage: dataURILastAccepted
//     };
//   } catch (error) {
//     throw new Error('Failed to retrieve Odometer Pictures: ' + error.message);
//   }
// }




const updateApprovalStatus = async (req, res) => {
  try {
    const { PictureID, ApprovalStatus, MemberID } = req.body;

    // Check if PictureID and ApprovalStatus are provided
    if (!PictureID || !ApprovalStatus) {
      return res.status(400).json({ message: 'PictureID and ApprovalStatus are required.' });
    }

    // Find the OdometerPicture record by PictureID
    const odometerPicture = await OdometerPictureModel.findOne({
      where: { PictureID: PictureID }
    });

    // If the record is not found, return a 404 error
    if (!odometerPicture) {
      return res.status(404).json({ message: 'OdometerPicture not found.' });
    }

    // Update the ApprovalStatus field
    await odometerPicture.update({ ApprovalStatus: ApprovalStatus });

    let Member_pic = await Member.findByPk(MemberID);

    if (ApprovalStatus == "Accepted" && Member_pic.Level == 1) {
      console.log("member Balance:", Member_pic.Balance);
      console.log("distance", odometerPicture.Distance)
      Member_pic.Balance = parseInt(Member_pic.Balance, 10) + odometerPicture.Distance * 0.4;
      await Member_pic.save();
    }
    else if (ApprovalStatus == "Accepted" && Member_pic.Level == 2) {
      console.log("member Balance:", Member_pic.Balance);
      console.log("distance", odometerPicture.Distance)
      Member_pic.Balance = parseInt(Member_pic.Balance, 10) + odometerPicture.Distance * 0.2;
      await Member_pic.save();
    }
    else if (ApprovalStatus == "Accepted" && Member_pic.Level == 3) {
      console.log("member Balance:", Member_pic.Balance);
      console.log("distance", odometerPicture.Distance)
      Member_pic.Balance = parseInt(Member_pic.Balance, 10) + odometerPicture.Distance * 0.1;
      await Member_pic.save();
    }

          // Send a notification to the member about the redemption request
          await Notification.create({
            MemberID: MemberID,
            message: `Redemption request ${ApprovalStatus}` ,
          });
  

    return res.status(200).json({
      message: 'ApprovalStatus updated successfully.',
      ApprovalStatus,
      UpdatedBalance: Member_pic.Balance  // Include the updated balance in the response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const getPendingWithLastAcceptedImage = async (req, res) => {
  try {
    const pendingRecords = await OdometerPictureModel.findAll({
      where: {
        ApprovalStatus: 'Pending',
      },
      order: [['MemberID'], ['SubmissionDate', 'DESC']], // Order by MemberID and SubmissionDate in descending order
    });

    const memberIDsToCheck = new Set(pendingRecords.map(record => record.MemberID));
    const lastAcceptedRecords = [];

    for (const memberID of memberIDsToCheck) {
      const lastAcceptedRecord = await OdometerPictureModel.findOne({
        where: {
          MemberID: memberID,
          ApprovalStatus: 'Accepted'
        },
        order: [['SubmissionDate', 'DESC']]
      });

      if (lastAcceptedRecord) {
        lastAcceptedRecords.push(lastAcceptedRecord);
      }
    }

    const recordsWithImages = pendingRecords.map(record => {
      return {
        PictureID: record.PictureID,
        MemberID: record.MemberID,
        SubmissionDate: record.SubmissionDate,
        ApprovalStatus: record.ApprovalStatus,
        ReasonForRejection: record.ReasonForRejection,
        Distance: record.Distance,
        DataURI: `data:${record.MimeType};base64,${record.OdometerPicture.toString('base64')}`
      };
    });

    for (const lastAcceptedRecord of lastAcceptedRecords) {
      recordsWithImages.push({
        PictureID: lastAcceptedRecord.PictureID,
        MemberID: lastAcceptedRecord.MemberID,
        SubmissionDate: lastAcceptedRecord.SubmissionDate,
        ApprovalStatus: lastAcceptedRecord.ApprovalStatus,
        ReasonForRejection: lastAcceptedRecord.ReasonForRejection,
        Distance: lastAcceptedRecord.Distance,
        DataURI: `data:${lastAcceptedRecord.MimeType};base64,${lastAcceptedRecord.OdometerPicture.toString('base64')}`
      });
    }

    res.json(recordsWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};























module.exports = {
  addOdometer,
  updateApprovalStatus,
  getallOdometerByMemberID,
  getRecordsByMemberID, getPendingWithLastAcceptedImage
};