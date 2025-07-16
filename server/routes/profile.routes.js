import express from 'express';
import {
  getProfileById,
  updateProfile,
  createProfile
} from '../controllers/profile.controller.js';

const router = express.Router();

router.post('/', createProfile);            // 创建新 profile
router.get('/:id', getProfileById);         // 根据 ID 获取 profile
router.put('/:id', updateProfile);          // 更新 profile

export default router;
