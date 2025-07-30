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
  ? ['https://pokemania-wvyd.onrender.com', 'https://pokemania-saau.onrender.com'] 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In production, check allowed origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin) || origin.includes('onrender.com')) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

