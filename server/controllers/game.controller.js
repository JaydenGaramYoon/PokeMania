import Game from '../models/game.model.js';
import errorHandler from './error.controller.js';

// 게임 기록 생성
const create = async (req, res) => {
    try {
        const { userId, score } = req.body;
        const game = new Game({
            user: userId,
            score: score,
            playedAt: new Date()
        });
        await game.save();
        return res.status(200).json({ message: "Game record saved!", game });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

// 모든 게임 기록 리스트
const list = async (req, res) => {
    try {
        const games = await Game.find().populate('user', 'name email').sort({ playedAt: -1 });
        res.json(games);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

// 특정 유저의 게임 기록 리스트
const listByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const games = await Game.find({ user: userId }).sort({ playedAt: -1 });
        res.json(games);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

// 게임 기록 삭제
const removeGame = async (req, res) => {
    try {
        const { gameId } = req.params;
        const deletedGame = await Game.findByIdAndDelete(gameId);
        if (!deletedGame) {
            return res.status(404).json({ error: 'Game record not found' });
        }
        res.json({ message: 'Game record deleted', deletedGame });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

export default { create, list, listByUser, removeGame };
