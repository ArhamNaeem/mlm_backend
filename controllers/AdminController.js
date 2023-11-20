const Admin = require('../models/adminsModel');
const bcrypt = require('bcrypt');

const adminRegister = async (req, res) => {
  const { Name, Username, Password, Email, Role } = req.body;

  try {
    // Check if an admin with the same email exists
    const existingAdmin = await Admin.findOne({ where: { Email } });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create the new admin
    const newAdmin = await Admin.create({
      Name,
      Username,
      Password: hashedPassword,
      Email,
      Role,
    });

    return res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

const adminLogin = async (req, res) => {
    const { Email, Password } = req.body;
  
    try {
      // Find the admin by email
      const admin = await Admin.findOne({ where: { Email } });
  
      if (!admin) {
        return res.status(401).json({ error: 'Admin not found' });
      }
  
      // Check if the provided password matches the hashed password
      const passwordMatch = await bcrypt.compare(Password, admin.Password);
  
      if (passwordMatch) {
        return res.status(200).json({ message: 'Admin login successful' });
      }
  
      return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      console.error('Error during admin login:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  };
  

module.exports = {
  adminRegister, adminLogin
};

