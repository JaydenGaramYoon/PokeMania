import express from 'express';
import gameCtrl from '../controllers/game.controller.js';

const router = express.Router();

// 게임 기록 생성
router.route('/api/game').post(gameCtrl.create);

// 모든 게임 기록 리스트
router.route('/api/game').get(gameCtrl.list);

// 특정 유저의 게임 기록 리스트
router.route('/api/game/user/:userId').get(gameCtrl.listByUser);

// 게임 기록 조회 (게임 ID로)
router.route('/api/games/user/:userId').get(gameCtrl.listByUser);


// 게임 기록 삭제
router.route('/api/game/:gameId').delete(gameCtrl.removeGame);

export default router;