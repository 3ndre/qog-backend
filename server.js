const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');

const cors=require("cors");


const app = express();

// Connect Database
connectDB();

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

// Init Middleware
app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/doctors', require('./routes/api/doctors'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/authdoctor', require('./routes/api/authdoctor'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/profiledoctor', require('./routes/api/profiledoctor'));

app.use('/api/allergies', require('./routes/api/allergies'));
app.use('/api/meds', require('./routes/api/meds'));
app.use('/api/immunize', require('./routes/api/immunize'));

app.use('/api/queries', require('./routes/api/queries'));

app.use('/api/file', require('./routes/api/file'));
app.use('/api/folder', require('./routes/api/folder'));

app.use('/api/filedoctor', require('./routes/api/filedoctor'));
app.use('/api/folderdoctor', require('./routes/api/folderdoctor'));


// storage engine for multer

app.get('/', (req,res) => {

  let info = {
    title: "Qognition API",
    Abhay_Jajodia: "Jajo",
    Animesh_Shrestha: "Fellune",
    Nischal_Poudel: "3ndless_____",
    Prabal_Bhandari: "Viron",
  };

  res.send(info)
})


// // Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
