require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

const seedDefaultUsers = require('./src/db/seed');

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    seedDefaultUsers();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });