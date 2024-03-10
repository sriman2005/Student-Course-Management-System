const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Configuration (MongoDB)
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Define roles
const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin'
};

// Middleware to check user role
function checkRole(role) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === role) {
      next();
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  };
}


// TESTING
app.get('/klef/test', async function(req, res){
    res.json("Koneru Lakshmaiah Education Foundation");
});

// REGISTRATION MODULE
app.post('/registration/signup', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const users = db.collection('users');
        const data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN MODULE
app.post('/login/signin', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const users = db.collection('users');
        const data = await users.count(req.body);
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// HOME MODULE
app.post('/uname', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const users = db.collection('users');
        const data = await users.find(req.body, { projection: { firstname: true, lastname: true } }).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-email-password' // Your email password
    }
});

function generateTemporaryPassword() {
    return Math.random().toString(36).slice(-8); 
}

// Function to send email with temporary password
async function sendTemporaryPassword(email, temporaryPassword) {
    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Your Application" <your-email@gmail.com>',
            to: email,
            subject: 'Temporary Password for Password Reset',
            text: `Your temporary password is: ${temporaryPassword}`,
            html: `<p>Your temporary password is: <strong>${temporaryPassword}</strong></p>`
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// FORGOT PASSWORD MODULE
app.post('/login/forgotpassword', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const users = db.collection('users');
        const { email } = req.body;
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email address not found" });
        }
        const temporaryPassword = generateTemporaryPassword();
        await users.updateOne({ email }, { $set: { password: temporaryPassword } });
        // Send the temporary password to the user's email
        await sendTemporaryPassword(email, temporaryPassword);
        conn.close();
        res.json({ message: "Temporary password sent to your email address" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// HOME MENU
app.post('/home/menu', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const menu = db.collection('menu');
        const data = await menu.find({}).sort({mid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// HOME MENUS
app.post('/home/menus', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const menus = db.collection('menus');
        const data = await menus.find(req.body).sort({smid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Faculty Menu
app.post('/fmenu', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const fmenu = db.collection('fmenu'); 
        const data = await fmenu.find({}).sort({mid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Faculty Menus
app.post('/fmenus', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const fmenus = db.collection('fmenus'); // Assuming 'fmenus' is the collection name for faculty submenus
        const data = await fmenus.find(req.body).sort({smid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Admin Menu
app.post('/amenu', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const amenu = db.collection('amenu'); // Assuming 'amenu' is the collection name for admin menu items
        const data = await amenu.find({}).sort({mid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Menus
app.post('/amenus', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const amenus = db.collection('amenus'); // Assuming 'amenus' is the collection name for admin submenus
        const data = await amenus.find(req.body).sort({smid: 1}).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// CHANGE PASSWORD
app.post('/cp/updatepwd', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const users = db.collection('users');
        const data = await users.updateOne({ emailid: req.body.emailid }, { $set: { pwd: req.body.pwd }});
        conn.close();
        res.json("Password has been updated");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD COURSE
app.post('/book/addnewcourse', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const courses = db.collection('addnewcourse');
        const data = await courses.insertOne(req.body);
        conn.close();
        res.json("Course added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MY PROFILE
app.post('/myprofile/info', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const users = db.collection('users');
        const userData = await users.findOne({ emailid: req.body.emailid });
        conn.close();
        
        if (userData) {
            res.json([userData]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VIEW COURSES
app.get('/viewcourses', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const courses = db.collection('addnewcourse');
        const courseData = await courses.find().toArray();
        conn.close();

        if (courseData.length > 0) {
            res.json(courseData);
        } else {
            res.status(404).json({ error: 'No courses found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// routes for different roles

// Faculty 
app.post('/faculty', checkRole(ROLES.FACULTY), async function (req, res) {
    try {
        // Logic specific to faculty 
        res.json({ message: 'Welcome to Faculty ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin 
app.post('/admin', checkRole(ROLES.ADMIN), async function (req, res) {
    try {
        // Logic specific to admin page
        res.json({ message: 'Welcome to Admin ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD COURSE(student for fetching)

app.get('/coursenames', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const courses = db.collection('addnewcourse');
        const courseData = await courses.find({}, { projection: { _id: 0, courseName: 1, sectionNumber: 1, facultyName: 1, semester: 1, year: 1,description:1 } }).toArray();
        conn.close();

        if (courseData.length > 0) {
            res.json(courseData);
        } else {
            res.status(404).json({ error: 'No courses found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//posting add course of student to database 

app.post('/addcourse', async function(req, res){
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const courses = db.collection('addcourse');
        const data = await courses.insertOne(req.body);
        conn.close();
        res.json("Course added successfully...");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE COURSE
app.delete('/deletecourse', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const courses = db.collection('addnewcourse');
        const { courseName } = req.body;
        const result = await courses.deleteOne({ courseName: courseName });
        conn.close();

        if (result.deletedCount > 0) {
            res.json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//view student selected courses
app.get('/studentcourse', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const courses = db.collection('addcourse');
        const courseData = await courses.find().toArray();
        conn.close();

        if (courseData.length > 0) {
            res.json(courseData);
        } else {
            res.status(404).json({ error: 'No courses found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VIEW STUDENTS
app.get('/viewstudents', async (req, res) => {
    try {
      const conn = await client.connect();
      const db = conn.db('MSWDPro');
      const users = db.collection('users');
      const studentData = await users.find({ role: 'student' }).toArray();
      conn.close();
      res.json(studentData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.get('/viewfaculty', async (req, res) => {
    try {
      const conn = await client.connect();
      const db = conn.db('MSWDPro');
      const users = db.collection('users');
      const facultyData = await users.find({ role: 'faculty' }).toArray();
      conn.close();
      res.json(facultyData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.delete('/deletefaculty', checkRole(ROLES.FACULTY), async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWDPro');
        const users = db.collection('users');
        const { email } = req.body;
        const result = await users.deleteOne({ email: email, role: ROLES.FACULTY });
        conn.close();

        if (result.deletedCount > 0) {
            res.json({ message: 'Faculty deleted successfully' });
        } else {
            res.status(404).json({ error: 'Faculty not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});