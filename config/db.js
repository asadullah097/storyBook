const mongoose=require('mongoose');

const connectDB= async ()=>{
    try {
        const conn=await mongoose.connect(process.env.DB_CONNECT,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:true
            });
            console.log(`MongoDB connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
module.exports=connectDB;