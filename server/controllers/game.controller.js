import Game from '../models/game.model.js';
import errorHandler from './error.controller.js';

// 게임 기록 생성
const create = async (req, res) => {
    try {
        const { user, score } = req.body; // user로 변경!
        const game = new Game({
            user: user, // user로 저장
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

// 특정 유저의 게임 기록 리스트
const getScore = async (req, res) => {
    try {
        const { userId } = req.params;
        const games = await Game.find({ user: userId }).sort({ playedAt: -1 });
        res.json(games); // ✅ 반드시 res.json() 해야 함
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};


const updateScore = async (req, res) => {
    try {
        const { score } = req.body;
        const updatedGame = await Game.findByIdAndUpdate(
            req.params.gameId, // 🔁 userId ❌ → gameId ✅
            { score: score, playedAt: new Date() },
            { new: true }
        );
        if (!updatedGame) {
            return res.status(404).json({ error: 'Game record not found' });
        }
        res.json({ message: 'Game record updated', updatedGame });
    } catch (err) {
        res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

// 게임 기록 삭제 (gameId로)
const removeScore = async (req, res) => {
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

export default { create, getScore, updateScore, removeScore };
