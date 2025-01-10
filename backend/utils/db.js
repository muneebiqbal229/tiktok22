// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('mongodb connected successfully.');
//     } catch (error) {
//         console.log(error);
//     }
// }
// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://iamfarhan09:iamfarhan09@tiktokcluster.st4lh.mongodb.net/?retryWrites=true&w=majority&appName=tiktokCluster");
    if(!conn) throw new Error("uri is not define")
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
