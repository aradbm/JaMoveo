import mongoose from "mongoose";

const MONGOURL = process.env.MONGOURL || "mongodb://localhost:27017/testdb";

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGOURL);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
