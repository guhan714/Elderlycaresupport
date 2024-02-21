const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'volunteerPortal';
const collectionName = 'users';

async function loginUser(username, password) {
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Check if the user already exists
        const existingUser = await collection.findOne({ email:username});
        if (existingUser) {
            return existingUser;
        }

        // Insert the new user into the database
        else
            return 'sorry';
    }
 catch (err) {
        console.error('Error processing Login:', err);
        return 'Internal Server Error';
    } finally {
        await client.close();
    }
}

module.exports = loginUser;
