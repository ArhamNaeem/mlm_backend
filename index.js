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

const allowedOrigins = [
  '*'
];

app.use(cors({
  origin: allowedOrigins,
}));

// Set up Multer to store files in the 'Assets' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Assets'); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Define a route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
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