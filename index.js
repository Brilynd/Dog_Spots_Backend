require('dotenv').config();
const userController = require('./userController')
const locationController = require('./LocationController')
const recomendationController = require('./RecomendationAlgo');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    const response = await userController.loginUser(email,password);
    res.status(200).json(response);
})

app.post('/signup',async(req,res)=>{
    const {email,password} = req.body;
    const response = await userController.createUser(email,password);
    res.status(200).json(response);
})

app.post('/createLocation',async(req,res)=>{
    const {locationName,rating,miles,cateogories,lng,lat} = req.body;
    console.log(locationName,rating,miles,cateogories,lng,lat)
    const response = await locationController.createLocation(locationName,rating,miles,cateogories,lng,lat);
    res.status(200).json(response);
})

app.post('/suggestedLocation',async(req,res)=>{
    const{lng,lat} = req.body;
    const response = await recomendationController.getNearbyLocations(lng,lat);
    console.log(response);
    res.status(200).json(response);
})

app.post('/addLocationToUser',async(req,res)=>{
    const{location} = req.body;
    const response = await userController.addLocationToUser(location);
    console.log(response);
    res.status(200).json(response)
})

app.post('/getUsersLocations',async(req,res)=>{
    const{userID} = req.body;
    const response = await userController.getUsersLocations(userID);
    console.log(response);
    res.status(200).json(response)
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});