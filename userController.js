const { MongoClient, ObjectId} = require("mongodb")
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri)
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
const loginUser = async(email,password) =>{
    try{
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');
        const existingUser = await usersCollection.findOne({email});
        if(existingUser){
            if(existingUser.password == password){
                return existingUser._id;
            }
            else{
                return "Invalid password"
            }
        }
        else{
            return "Email does not belong to a user"
        }
    }
    catch(error){
        console.error(error);
        return "Failed to login";
    }
}
const addLocationToUser = async (location) =>{
    try{
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const usersCollection = database.collection("users");
        const response = await usersCollection.updateOne({_id:new ObjectId(userID)},{$push:{savedLocations:location}});
        return "Successfully Added"
    }
    catch(error){
        console.error(error)
    }
}
const getUsersLocations = async(userID) =>{
    try{
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');
        const response = await usersCollection.findOne({_id:new ObjectId(userID)})
        return response.savedLocations
    }
    catch(error){
        console.error(error);
    }
}
module.exports ={
    createUser,
    loginUser,
    addLocationToUser,
    getUsersLocations
}