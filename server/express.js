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

// ✅ Simplified CORS - Allow all origins for now
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

// Basic helmet without CSP
app.use(helmet({
  contentSecurityPolicy: false
}));

// Serve static files
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/app")));

// ✅ Register routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', gameRoutes);
app.use('/', favouritesRoutes);
app.use('/', profileRoutes);
app.use('/', messageRoutes);

// Additional static file serving
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.static(path.join(__dirname, '../client/dist/app')));

// ✅ Error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

// NO catch-all route for now - will handle via static files

export default app;
