import config from './server/config/config.js';
import app from './server/express.js';
import mongoose from 'mongoose';
import cors from 'cors'; // ✅ added this line''

// to ensure the server starts correctly
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log("Connected to the database!");
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

// ✅ apply CORS before anything else
app.use(cors({
  origin: 'https://pokemania-wvyd.onrender.com',
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to User application." });
});

import messageRoutes from './server/routes/message.routes.js';
app.use('/api', messageRoutes);
import profileRoutes from './server/routes/profile.routes.js';
app.use('/api/profiles', profileRoutes);

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info('Server started on port %s.', config.port);
});

