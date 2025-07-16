import mongoose from 'mongoose';

export const connectDb = async ()=>{
    try{
        const mongo_uri = process.env.MONGO_URI;
        if(!mongo_uri){
            throw new Error("Mongo string not avilable in env file.")
        }
        const con = await mongoose.connect(mongo_uri);
        console.log(`Mongodb connected ${con.connection.host}`)
    }catch(error){
        if(error instanceof Error){    
            console.log(`Error connection to mongodb ${error.message}`);
        }
        else{
            console.log("Some error appear in database connection.")
        }
            process.exit(1);
    }
}