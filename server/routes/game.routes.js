import express from 'express';
import gameCtrl from '../controllers/game.controller.js';

const router = express.Router();

router.route('/api/game').post(gameCtrl.create);

router.route('/api/game/user/:userId').get(gameCtrl.getScore);

router.route('/api/game/:gameId')
  .put(gameCtrl.updateScore)
  .delete(gameCtrl.removeScore);

export default router;