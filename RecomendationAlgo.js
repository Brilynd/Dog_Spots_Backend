
const { MongoClient } = require("mongodb")
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri)

function distance(lat1, lon1, lat2, lon2) {
var radlat1 = Math.PI * lat1/180;
var radlat2 = Math.PI * lat2/180;
var theta = lon1-lon2;
var radtheta = Math.PI * theta/180;
var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
if (dist > 1) {
    dist = 1;
}
dist = Math.acos(dist);
dist = dist * 180/Math.PI;
dist = dist * 60 * 1.1515;
return dist;
}

const createUser = async (email,password) =>{
    try{
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');
        const existingUser = await usersCollection.findOne({email});
        if(existingUser){
            return 'This account already exists';
        }
        const newUser = {
            email:email,
            password:password,
            savedLocations:[],
            popular:{
                total:0,
                saved:0
            },
            small:{
                total:0,
                saved:0
            },
            large:{
                total:0,
                saved:0
            },
            activities:{
                total:0,
                saved:0
            },
            trails:{
                total:0,
                saved:0
            },
        }
        const result = await usersCollection.insertOne(newUser);
        return result.insertedId;
    }
    catch(error){
        console.error(error);
        return "Failed to create user account";
    }
    }

const getNearbyLocations = async(lng,lat) =>{
    try{
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const locationCollection = database.collection('locations');
        const locations = await locationCollection.find({}).toArray();
        locations.forEach((location)=>{
            const distAway = distance(location.lat,location.lng,lng,lat);
            location.distance = distAway;
        });
            locations.sort((a,b)=>a.distance-b.distance);
            return locations
        }
    catch(error){
        console.error(error)
        return[]
    }
}
module.exports={
    getNearbyLocations
}