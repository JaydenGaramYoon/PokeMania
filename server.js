import config from './server/config/config.js';
import app from './server/express.js';
import mongoose from 'mongoose';
import cors from 'cors'; // ✅ added this line''

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
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://pokemania-wvyd.onrender.com'] 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to User application." });
});

// to ensure the server starts correctly
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server started on port ${PORT}`);
});

