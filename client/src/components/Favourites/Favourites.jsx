import React, { useState, useEffect } from 'react';
import './Favourites.css'; // Import the CSS file

const Favourites = () => {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        // pokemon_으로 시작하는 키만 파싱
        const storedFavourites = Object.keys(localStorage)
            .filter(key => key.startsWith('pokemon_')) // pokemon_으로 시작하는 키만
            .map(key => {
                try {
                    return JSON.parse(localStorage.getItem(key));
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
        setFavourites(storedFavourites);
    }, []);

    const handleRemoveFavourite = (pokemonId) => {
        // Remove from localStorage (prefix 포함)
        localStorage.removeItem(`pokemon_${pokemonId}`);
        // Update state to re-render the component
        setFavourites(prevFavourites => prevFavourites.filter(p => p.id !== pokemonId));
        alert('Removed from Poké Box!');
    };

    return (
        <div className="favourites-page">
            <h1 className="favourites-title">My Favourites</h1>
            {favourites.length > 0 ? (
                <div className="card-container">
                    {favourites.map(pokemon => (
                        <div key={pokemon.id} className="pokemon-card">
                            <h2>{pokemon.name}</h2>
                            <img src={pokemon.image} alt={pokemon.name} />
                            <p>ID: {pokemon.id}</p>
                            <p>Types: {pokemon.types.join(', ')}</p>
                            <button
                                className="remove-button"
                                onClick={() => handleRemoveFavourite(pokemon.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-favourites-message">Your storage is empty. Go catch some Pokémon!</p>
            )}
        </div>
    );
};

export default Favourites;