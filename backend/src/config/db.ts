import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/groweasy';

  await mongoose.connect(mongoURI);

  console.log("MongoDB Connected successfully");
};


export default connectDB;
