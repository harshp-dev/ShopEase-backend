import http from 'http';
import app from './src/app.js';
import config from './src/constants/config.js';
import connectDB from './src/configs/mongodb.config.js';

// PORT from config constants
const port = config.PORT;

// Server start from here.
var test = 'test';
console.log(test);
const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Listening from port: ${port}`);
    });
  } catch (error) {
    console.error('Server Failed to Start!', error);
    process.exit(1);
  }
};

startServer();
