import express from 'express';
import profileController from '../controllers/profile.controller.js';

const router = express.Router();

router.post('/api/profile', profileController.createProfile); // POST /api/profile
router.get('/api/profile/users/:userId', profileController.getProfileById); // GET /api/profile/users/:userId
router.get('/api/profile', profileController.getProfiles); // GET /api/profile
router.put('/api/profile/users/:userId', profileController.updateProfile); // PUT /api/profile/users/:userId
router.delete('/api/profile/users/:userId', profileController.deleteProfile); // DELETE /api

export default router; 