import React, { useState, useEffect } from 'react';
import './Favourites.css'; // Import the CSS file

const Favourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPokemon, setEditingPokemon] = useState(null);
    const [editForm, setEditForm] = useState({ memo: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user._id : null;
        console.log('Current user ID:', userId);
        if (!userId) {
            setFavourites([]);
            setLoading(false);
            return;
        }

        // CRUD Operation2 : Read user's favourites from the server
        fetch(`/api/favourites/users/${userId}`)
            .then(res => res.json())
            .then(async data => {
                // 각 포켓몬 id로 PokéAPI에서 상세 정보 받아오기
                const pokemonDetails = await Promise.all(
                    data.map(async fav => {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${fav.pokemonId}`);
                        const poke = await res.json();
                        return {
                            id: poke.id,
                            name: poke.name,
                            image: poke.sprites.other['official-artwork'].front_default,
                            types: poke.types.map(t => t.type.name),
                            memo: fav.memo || ''
                        };
                    })
                );
                setFavourites(pokemonDetails);
                setLoading(false);
            })
            .catch(() => {
                setFavourites([]);
                setLoading(false);
            });
    }, []);

    //CRUD Operation3 : Remove a favourite
    const handleRemoveFavourite = async (pokemonId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user._id : null;
        if (!userId) {
            alert('Login required!');
            return;
        }

        try {
            const res = await fetch(`/api/favourites/${userId}/${pokemonId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to remove favourite');
            setFavourites(prevFavourites => prevFavourites.filter(p => p.id !== pokemonId));
            alert('Removed from Poké Box!');
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    // CRUD Operation4 : Update favourite (memo)
    const handleEditStart = (pokemon) => {
        setEditingPokemon(pokemon.id);
        setEditForm({
            memo: pokemon.memo
        });
    };

    const handleEditCancel = () => {
        setEditingPokemon(null);
        setEditForm({ memo: '' });
    };

    const handleEditSave = async (pokemonId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user._id : null;
        if (!userId) {
            alert('Login required!');
            return;
        }

        try {
            const res = await fetch(`/api/favourites/${userId}/${pokemonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm)
            });
            if (!res.ok) throw new Error('Failed to update favourite');
            
            // 로컬 state 업데이트
            setFavourites(prevFavourites => 
                prevFavourites.map(p => 
                    p.id === pokemonId 
                        ? { ...p, memo: editForm.memo }
                        : p
                )
            );
            
            setEditingPokemon(null);
            setEditForm({ memo: '' });
            alert('Updated successfully!');
        } catch (err) {
            alert('Error: ' + err.message);
        }
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
                            
                            {editingPokemon === pokemon.id ? (
                                <div className="edit-form">
                                    <textarea
                                        placeholder="Memo"
                                        value={editForm.memo}
                                        onChange={(e) => setEditForm({...editForm, memo: e.target.value})}
                                        rows="3"
                                    />
                                    <div className="edit-buttons">
                                        <button 
                                            className="save-button"
                                            onClick={() => handleEditSave(pokemon.id)}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            className="cancel-button"
                                            onClick={handleEditCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pokemon-info">
                                    {pokemon.memo && (
                                        <p className="memo">Memo: {pokemon.memo}</p>
                                    )}
                                    <div className="action-buttons">
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEditStart(pokemon)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemoveFavourite(pokemon.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
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