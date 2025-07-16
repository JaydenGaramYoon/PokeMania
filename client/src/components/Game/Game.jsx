import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './game.css';

const Game = () => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [pokemon, setPokemon] = useState(null);
    const [pokemonName, setPokemonName] = useState('');
    const [guess, setGuess] = useState('');
    const [gameRunning, setGameRunning] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [pokemonList, setPokemonList] = useState([]);
    const [pokemonImage, setPokemonImage] = useState('');
    const [shadowImage, setShadowImage] = useState('');
    const [shadowVisible, setShadowVisible] = useState(true);

    // 저장 관련 state
    const [saveMessage, setSaveMessage] = useState('');
    const [savedDate, setSavedDate] = useState('');
    const [autoEndMessage, setAutoEndMessage] = useState(''); // 게임 자동 종료 메시지

    // 오디오 객체는 useRef로 한 번만 생성
    const clickSound = useRef(null);
    const backgroundMusic = useRef(null);

    const location = useLocation();
    const prevPath = useRef(location.pathname);

    // 오디오 초기화
    useEffect(() => {
        clickSound.current = new window.Audio('/sounds/click.mp3');
        backgroundMusic.current = new window.Audio('/sounds/background.mp3');
    }, []);

    // 페이지 이동 시 게임 종료 및 음악 정지 + 메시지 표시
    useEffect(() => {
        // 처음 마운트 시에는 실행하지 않음
        if (prevPath.current !== location.pathname) {
            if (backgroundMusic.current) {
                backgroundMusic.current.pause();
                backgroundMusic.current.currentTime = 0;
            }
            if (gameRunning) {
                setGameRunning(false);
                setGameOver(false);
                setAutoEndMessage('Game is automatically ended due to page navigation.');
            }
        }
        prevPath.current = location.pathname;

        // 게임 페이지로 돌아왔을 때 항상 첫 시작 화면으로
        setGameOver(false);
        setGameRunning(false);
        setFinalScore(0);
        setGuess('');
        setShadowVisible(true);
        setSaveMessage('');
        setSavedDate('');
        setAutoEndMessage('');

        // Cleanup function to stop music when component unmounts or on page navigation
        return () => {
            if (backgroundMusic.current) {
                backgroundMusic.current.pause();
                backgroundMusic.current.currentTime = 0;
            }
        };

        // eslint-disable-next-line
    }, [location.pathname]);

    // Fetch list of Pokémon to choose from
    useEffect(() => {
        const fetchPokemonList = async () => {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
            const data = await response.json();
            setPokemonList(data.results);
        };

        fetchPokemonList();
    }, []);

    // Select a random Pokémon and get its shadow image
    useEffect(() => {
        if (pokemonList.length > 0 && gameRunning) {
            const randomIndex = Math.floor(Math.random() * pokemonList.length);
            const pokemonUrl = pokemonList[randomIndex].url;

            const fetchPokemonData = async () => {
                const response = await fetch(pokemonUrl);
                const data = await response.json();
                setPokemon(data);
                setPokemonName(data.name);
                setPokemonImage(data.sprites.other['official-artwork'].front_default);
                setShadowImage(data.sprites.other['official-artwork'].front_default);
                setShadowVisible(true);
            };

            fetchPokemonData();
        }
    }, [pokemonList, gameRunning, level]);

    const handleGuessChange = (e) => {
        setGuess(e.target.value);
    };

    const handleSubmitGuess = () => {
        clickSound.current && clickSound.current.play();

        if (guess.toLowerCase() === pokemonName.toLowerCase()) {
            setScore((prevScore) => prevScore + 10);
            setCorrectGuesses((prevCorrectGuesses) => prevCorrectGuesses + 1);
            setShadowVisible(false);
            setTimeout(() => {
                levelUp();
            }, 1000);
        } else {
            if (backgroundMusic.current) {
                backgroundMusic.current.pause();
                backgroundMusic.current.currentTime = 0;
            }
            setFinalScore(score);
            setGameOver(true);
            setGameRunning(false);
        }

        setGuess('');
    };

    const levelUp = () => {
        setLevel((prevLevel) => prevLevel + 1);
    };

    const startGame = () => {
        if (backgroundMusic.current) {
            backgroundMusic.current.pause();
            backgroundMusic.current.currentTime = 0;
            backgroundMusic.current.play();
            backgroundMusic.current.loop = true;
        }

        setScore(0);
        setCorrectGuesses(0);
        setGameOver(false);
        setGameRunning(true);
        setFinalScore(0);
        setGuess('');
        setShadowVisible(true);
        setSaveMessage('');
        setSavedDate('');
        setAutoEndMessage('');
    };

    const restartGame = () => {
        setGameOver(false);
        startGame();
    };

    // 저장 버튼 클릭 시
    const handleSaveScore = async () => {
        console.log('💾 Save button clicked');
        const now = new Date();
        const dateString = now.toLocaleString();
        setSavedDate(dateString);

        const userId = localStorage.getItem('userId_user') || 'anonymous';
        console.log('✅ 시작: userId =', userId);

        try {
            const checkRes = await fetch(`/api/game/user/${userId}`);
            if (!checkRes.ok) throw new Error('GET 요청 실패: ' + checkRes.status);

            const userGames = await checkRes.json();
            console.log('✅ 게임 데이터:', userGames);

            const existingGame = userGames && userGames.length > 0 ? userGames[0] : null;

            if (existingGame) {
                console.log('✏️ 기존 게임 ID:', existingGame._id);
                const updateRes = await fetch(`/api/game/${existingGame._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score: score }),
                });
                const updateData = await updateRes.json();
                console.log('✅ 업데이트 응답:', updateData);
                setSaveMessage('Score updated!');
            } else {
                console.log('🆕 새 게임 생성');
                const createRes = await fetch('/api/game', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: userId,
                        score: score,
                    }),
                });
                const createData = await createRes.json();
                console.log('✅ 생성 응답:', createData);
                setSaveMessage('Score saved!');
            }

            setGameOver(false);
            setGameRunning(false);
        } catch (err) {
            console.log('❌ 에러 발생:', err);
            setSaveMessage('Failed to save score: ' + err.message);
        }
    };

    return (
        <div className="game-container" style={{ border: '2px solid #ccc', borderRadius: '12px' }}>
            {/* 게임 자동 종료 메시지 */}
            {autoEndMessage && (
                <div style={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    right: 0,
                    zIndex: 2000,
                    color: '#fff',
                    background: 'rgba(0,0,0,0.8)',
                    padding: 20,
                    fontSize: 20,
                    borderRadius: 12,
                    margin: '0 auto',
                    width: 400,
                    textAlign: 'center'
                }}>
                    {autoEndMessage}
                    <button
                        style={{
                            marginTop: 16,
                            padding: '8px 24px',
                            fontSize: 16,
                            borderRadius: 8,
                            border: 'none',
                            background: '#1976d2',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                        onClick={() => setAutoEndMessage('')}
                    >
                        확인
                    </button>
                </div>
            )}
            {/* Game Over Screen Inside Container */}
            {gameOver ? (
                <div id="gameOverOverlay" className="show" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
                    <div id="finalScoreboard">
                        Score: <strong>{finalScore}</strong></div>
                    <div id="displayName">{pokemonName}</div>
                    <div>
                        <img
                            src={pokemonImage}
                            alt={pokemonName}
                            className="pokemon-image actual"
                            style={{ width: '500px', height: '500px', objectFit: 'contain' }}
                        />
                    </div>
                    <div id="finalButtons">
                        {/* 저장 인터페이스 */}
                        <button id="saveButton" onClick={handleSaveScore}>
                            Save Game
                        </button>
                        <button id="restartButton" onClick={restartGame}>Restart Game</button>
                        {saveMessage && (
                            <div>
                                {saveMessage} {savedDate && <span>({savedDate})</span>}
                            </div>
                        )}
                    </div>
                </div>
            ) : !gameRunning ? (
                // Start Screen
                <div id="startScreen">
                    <div id="startMessage">Guess The Pokémon!</div>
                    <button id="startButton" onClick={startGame}>Start Game</button>
                </div>
            ) : (
                // Game Screen
                <div id="pokemonShadow">
                    <div id="scoreboard">
                        Score: <strong id="score">{score}</strong>
                    </div>
                    {pokemon ? (
                        <div style={{ position: 'relative', width: 500, height: 500, margin: '0 auto 32px auto' }}>
                            <img
                                src={pokemonImage}
                                alt="Pokemon"
                                className="pokemon-image actual"
                                style={{ opacity: shadowVisible ? 0 : 1, position: 'absolute', top: 0, left: 0 }}
                            />
                            <img
                                src={shadowImage}
                                alt="Pokemon Shadow"
                                className="pokemon-image shadow"
                                style={{ opacity: shadowVisible ? 1 : 0, filter: 'brightness(0)', position: 'absolute', top: 0, left: 0 }}
                            />
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <input
                        type="text"
                        value={guess}
                        onChange={handleGuessChange}
                        placeholder="Enter Pokémon name"
                        className="pokemon-input"
                    />
                    <button id="submitButton"
                        onClick={handleSubmitGuess}
                        className="submit-button"
                    >
                        Submit Guess
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game;