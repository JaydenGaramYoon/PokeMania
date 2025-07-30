import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import favouritesRoutes from './routes/favourites.routes.js';
import profileRoutes from './routes/profile.routes.js';
import messageRoutes from './routes/message.routes.js';

const app = express();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRENT_WORKING_DIR = process.cwd();
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/app")));

// ✅ Apply CORS at the top - Simplified for Render deployment
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS origin check:', origin, 'NODE_ENV:', process.env.NODE_ENV);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://pokemania-wvyd.onrender.com',
      'https://pokemania-saau.onrender.com'
    ];
    
    // Allow all onrender.com origins or specific allowed origins
    if (allowedOrigins.includes(origin) || origin.includes('onrender.com') || origin.includes('localhost')) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Add explicit preflight handling for all routes
app.options('*', (req, res) => {
  console.log('Preflight request for:', req.url, 'from origin:', req.headers.origin);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://pokeapi.co",
          "https://pokemania-wvyd.onrender.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://raw.githubusercontent.com",
          "https://pokeapi.co",
          "https://wallpapercave.com",
          "https://images.seeklogo.com"
        ],
        scriptSrc: [
          "'self'",
          "https://pokemania-wvyd.onrender.com",
          "'unsafe-inline'"
        ],
        styleSrc: [
          "'self'",
          "https://pokemania-wvyd.onrender.com",
          "https://fonts.googleapis.com",
          "https://fonts.cdnfonts.com",
          "'unsafe-inline'"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://fonts.cdnfonts.com"
        ],
      },
    },
  })
);

// ✅ Register routes AFTER CORS is enabled
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', gameRoutes);
app.use('/', favouritesRoutes);
app.use('/', profileRoutes);
app.use('/', messageRoutes);
// Serve static files from the React app build directory (dist/app)
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.static(path.join(__dirname, '../client/dist/app')));

// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/game', gameRoutes);
// app.use('/api/favourites', favouritesRoutes);
// app.use('/api/profiles', profileRoutes);
// app.use('/api', messageRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/app', 'index.html'));
});
export default app;
