const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes=require("../routes/v1/userRoutes");
const artistRoutes=require("../routes/v1/artistRoutes");
const albumRoutes=require('../routes/v1/albumRoutes');
const trackRoutes=require('../routes/v1/trackRoutes');
const favoriteRoutes=require('../routes/v1/favoriteRoutes');
const authRoutes=require('../routes/v1/authenticationRoutes');



// Middleware
app.use(express.json());
app.use(bodyParser.json());

//Use the user routes
app.use("/api/v1",userRoutes);
app.use("/api/v1",artistRoutes);
app.use("/api/v1",albumRoutes);
app.use("/api/v1",trackRoutes);
app.use("/api/v1",favoriteRoutes);


app.use("/",authRoutes);

// Basic route
app.get('/', (req, res) => {
    console.log("Print")
    res.send('Hello, World!');
});

module.exports = app;
