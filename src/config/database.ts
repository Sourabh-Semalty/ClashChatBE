import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.NODE_ENV === 'development' ? "mongodb://localhost:27017/clashchat" : process.env.MONGODB_URI as string;
    console.log(mongoUri)
    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB connected successfully');
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};
