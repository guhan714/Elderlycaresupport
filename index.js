const http = require('http');
const express = require('express');
const serveFile = require('./serveFile'); // Adjust the path as needed
const registerUser = require('./register'); // Adjust the path as needed
const loginUser = require('./login');
const multer = require('multer');

const app = express();
const port = 3001;


const storage = multer.memoryStorage();
const upload = multer({storage:storage})
app.use(express.urlencoded({ extended: true }));
app.set('view engine' , 'ejs');
app.post('/register',upload.single('profilePicture'),  async (req, res) => {
    try {
        const { firstname, lastname, dob , email , gender } = req.body;

        // Validate form data (you can add more validation as needed)
        if (!firstname || !lastname ||!dob  ||!email ||!gender) {
            return res.status(400).send('Invalid form data');
        }
        const profilePicture = req.file;
        const result = await registerUser(firstname, lastname, dob , email , gender , profilePicture);
        res.redirect('loader.html');
    } catch (err) {
        console.error('Error processing registration:', err);
        res.status(500).send('Internal Server Error');
    }
});

//login end point
app.post('/login' , async(req, res) => {
    try{
    const {username , password} = req.body;
    if (!username || !password) {
        return res.status(400).send('Invalid form data');
    }

    const result = await loginUser(username, password);
    if(result.email == username && result.dob == password){
        const binaryImageData = result.profilePicture.buffer;
        const base64Image = binaryImageData.toString('base64');
        res.render('dashboard' , {result , base64Image});
    //res.status(200).send(result);
    }
	
else{
	res.send('<script>alert("Invalid username or password"); window.location.href="login.html";</script>');
	res.render('login');
	}
   
}
catch (err){
    console.error("error in processsing" + err);
}
});

// Serve HTML pages for any other routes
app.use((req, res) => {
    serveFile(req, res);
});

http.createServer(app).listen(port);

console.log(`Server running on port ${port}`);
