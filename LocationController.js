const { MongoClient } = require("mongodb")
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri)
const createLocation = async (locationName,rating,miles,cateogories,lng,lat) =>{

        try{
            await client.connect();
            const database = client.db(process.env.DB_NAME);
            const locationCollection = database.collection('locations');

            const newLocation = {
                locationName:locationName
                ,rating:rating
                ,miles:miles
                ,cateogories:cateogories
                ,lng:lng
                ,lat:lat
            }
            const result = await locationCollection.insertOne(newLocation);
            return "Successfully Added Location"
        }
        catch(error){
            console.error(error);
            return "Failed to add location";
        }
}  

module.exports ={
    createLocation,
    getAllLocations
}