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

const app = express();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRENT_WORKING_DIR = process.cwd();
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/app")));

// ✅ Apply CORS at the top
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

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
          "'unsafe-inline'"
        ],
      },
    },
  })
);

// Serve static files from the React app build directory (dist/app)
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.static(path.join(__dirname, '../client/dist/app')));


// ✅ Register routes AFTER CORS is enabled
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', gameRoutes);
app.use('/', favouritesRoutes);
app.use('/', profileRoutes);

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
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/app', 'index.html'));
});
export default app;
