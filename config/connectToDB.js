require('dotenv').config();
const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        // Set connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            maxPoolSize: 10, // Maximum number of connections in the connection pool
            minPoolSize: 5, // Minimum number of connections in the connection pool
            retryWrites: true,
            retryReads: true
        };

        // Connect to MongoDB with retry logic
        let retries = 5;
        while (retries > 0) {
            try {
                await mongoose.connect(process.env.MONGODB_URI, options);
                console.log('Database Connected Successfully');
                
                // Handle connection events
                mongoose.connection.on('error', (err) => {
                    console.error('MongoDB connection error:', err);
                });

                mongoose.connection.on('disconnected', () => {
                    console.log('MongoDB disconnected');
                    // Attempt to reconnect
                    setTimeout(connectToDB, 5000);
                });

                // Handle process termination
                process.on('SIGINT', async () => {
                    await mongoose.connection.close();
                    console.log('MongoDB connection closed through app termination');
                    process.exit(0);
                });

                return; // Successfully connected, exit the function
            } catch (error) {
                retries--;
                console.error(`Connection attempt failed. ${retries} retries left. Error:`, error.message);
                if (retries === 0) {
                    throw error; // Throw error if all retries are exhausted
                }
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
            }
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = connectToDB;