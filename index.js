const sequelize = require('./config/database');
const membersModel = require("./models/membersModel")
const adminsModel = require("./models/adminsModel")
const commissionsModel = require("./models/commissionsModel")
const odometerPicturesModel = require("./models/odometerPicturesModel")
const recruitsModel = require("./models/recruitsModel")
const redemptionRequestModel = require("./models/redemptionRequestsModel")
const rewardPointsModel = require("./models/rewardPointsModel")
const notificationModel = require('./models/notificationModel')
const multer = require('multer');
const cors =  require('cors')

const membersRoutes = require("./routes/memberRoutes");
const redemptionRoutes = require("./routes/redemptionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const odometerroutes = require("./routes/odometerroute");
const notificationroutes = require("./routes/notificationRoutes");



const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const allowedOrigins = ['*'];

app.use(cors({
  origin: allowedOrigins[0], // Accessing the first element of the allowedOrigins array
}));
// app.use(express.static(path.join(__dirname, 'client/build')));

// // Serve React app for all other routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Assets'); // Destination folder
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Define a route to handle multiple file uploads
app.post('/member/:id/upload', upload.array('files', 1), (req, res) => {
  const memberID = req.params.id;
  // Get the file paths of the uploaded images
  // const filePaths = req.files.map(file => file.path);
  const profilePicturePath = req.files[0].path.replace(/\\/g, '/'); // Get the path of the first file
  membersModel.update({ ProfilePicture: profilePicturePath }, { where: { MemberID: memberID } })
          .then(() => res.status(200).json({ message: 'Profile picture updated successfully' }))
          .catch(error => res.status(500).json({ message: 'Database update failed', error }));
  // Send the file paths in the response
  // res.json({ message: 'Files uploaded successfully', paths: filePaths });
});

// Define routes
app.use('/members', membersRoutes);
app.use('/redemption', redemptionRoutes);
app.use('/admin', adminRoutes);
app.use('/odometer', odometerroutes);
app.use('/notification', notificationroutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log(`Connected to the database`);
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});