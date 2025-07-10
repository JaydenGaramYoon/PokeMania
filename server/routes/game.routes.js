import express from 'express';
import gameCtrl from '../controllers/game.controller.js';

const router = express.Router();

// 게임 기록 생성
router.route('/api/game').post(gameCtrl.create);

// 특정 유저의 게임 기록
router.route('/api/game/user/:userId').get(gameCtrl.getScore);

// 게임 기록 업데이트 (게임 ID로)
router.put('/api/game/:gameId', gameCtrl.updateScore);

// 게임 기록 삭제
router.route('/api/game/:gameId').delete(gameCtrl.removeScore);

export default router;