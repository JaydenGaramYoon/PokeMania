import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';

const Profile = () => {
  // State: Favourite Pokémon (latest 3 from localStorage)
  const [favourites, setFavourites] = useState([]);
  // State: Edit modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State: Currently active tab (overview or achievements)
  const [activeTab, setActiveTab] = useState('overview');
  // State: Last game score retrieved from backend
  const [score, setScore] = useState(0);
  // State: Badge image URL (determined by score)
  const [badgeImageUrl, setBadgeImageUrl] = useState('/images/bronze.png');
  // State: Last game played timestamp
  const [lastPlayed, setLastPlayed] = useState('');

  // ⬇️ Fetch favourite Pokémon from localStorage, sorted by recent timestamp
  useEffect(() => {
    const storedFavourites = Object.entries(localStorage)
      .filter(([key]) => key.startsWith('pokemon_'))
      .map(([key, value]) => {
        try {
          const pokemon = JSON.parse(value);
          const timestamp = parseInt(key.replace('pokemon_', ''), 10);
          return { ...pokemon, _ts: timestamp };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b._ts - a._ts) // Sort by newest to oldest
      .slice(0, 3); // Only take latest 3 favourites

    setFavourites(storedFavourites);
  }, [activeTab]); // Re-run when activeTab changes

  // ⬇️ Fetch user's last game score from the backend (initial load)
useEffect(() => {
  const fetchScore = async () => {
    const userId = localStorage.getItem('userId_user');
    if (!userId || userId.length !== 24) return; // 如果没有合法用户 ID，直接退出

    try {
      const response = await fetch(`/api/game/user/${userId}`);
      if (response.ok) {
        const userGames = await response.json();
        if (userGames.length > 0) {
          const latestGame = userGames[0];
          setScore(latestGame.score);
          if (latestGame.updatedAt) {
            const date = new Date(latestGame.updatedAt);
            setLastPlayed(date.toLocaleString());
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch score:', error);
    }
  };

  fetchScore();
}, []);


  // ⬇️ Default profile data for new/anonymous users
  const [formData, setFormData] = useState({
    bannerUrl: 'https://wallpapercave.com/wp/wp12045006.jpg',
    iconUrl: 'https://images.seeklogo.com/logo-png/28/1/bulbasaur-logo-png_seeklogo-286482.png',
    name: 'Unnamed Trainer',
    title: 'Pokémon Trainer · Unknown Region',
    location: 'Unknown Location',
    summary: 'This trainer has not shared their journey yet.',
    types: ['N/A'],
    details: [
      'No favorite Pokémon yet',
      'No buddy selected',
      '0 / 8 badges collected',
      'No regions explored',
      'Unknown join date',
      'No languages specified',
      'No team selected'
    ]
  });

  // ⬇️ Handle user input changes in edit profile modal
  const handleInputChange = (e, field, index) => {
    if (field === 'details') {
      const newDetails = [...formData.details];
      newDetails[index] = e.target.value;
      setFormData({ ...formData, details: newDetails });
    } else if (field === 'types') {
      setFormData({ ...formData, types: e.target.value.split(',').map(t => t.trim()) });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  // ⬇️ Modal action handlers
  const handleSave = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // ⬇️ Dynamically update badge image based on game score
  useEffect(() => {
    if (score >= 70) setBadgeImageUrl('/images/diamond.png');
    else if (score >= 50) setBadgeImageUrl('/images/platinum.png');
    else if (score >= 40) setBadgeImageUrl('/images/gold.png');
    else if (score >= 20) setBadgeImageUrl('/images/silver.png');
    else if (score >= 10) setBadgeImageUrl('/images/bronze.png');
    else setBadgeImageUrl('/images/bronze.png');
  }, [score]);

  return (
    <div className={styles.profilePage}>
      {/* Profile Header Section */}
      <div className={styles.profileHeader}>
        <img src={formData.bannerUrl} alt="banner" className={styles.profileBanner} />
        <div className={styles.profileHeaderContent}>
          <div className={styles.avatarInfoWrapper}>
            <img className={styles.avatar} src={formData.iconUrl} alt="profile" />
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{formData.name}</h2>
              <p className={styles.profileTitle}>{formData.title}</p>
              <span className={styles.profileLocation}>{formData.location}</span>
              <div className={styles.socialIcons}>
                <span>⚡</span><span>🔥</span><span>💧</span><span>🌱</span><span>🔷</span>
              </div>
            </div>
          </div>
          <button className={styles.editButton} onClick={() => setIsModalOpen(true)}>✏️ Edit Profile</button>
        </div>
      </div>

      {/* Profile Body Section */}
      <div className={styles.profileBody}>
        <div className={styles.profileMain}>
          <div className={styles.tabs}>
            <button className={activeTab === 'overview' ? styles.activeTab : ''} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={activeTab === 'achievements' ? styles.activeTab : ''} onClick={() => setActiveTab('achievements')}>Trainer Achievements</button>
          </div>

          {activeTab === 'overview' && (
            <>
              <div className={styles.card}>
                <h3>Trainer Summary</h3>
                <p>{formData.summary}</p>
              </div>
              <div className={styles.card}>
                <h3>Favorite Pokémon Types</h3>
                {formData.types.map(type => (
                  <span key={type} className={`${styles.tag} ${styles.tagGreen}`}>{type}</span>
                ))}
              </div>
            </>
          )}

          {activeTab === 'achievements' && (
            <>
              <div className={styles.card}>
                <h3>❤️ My Favourites</h3>
                {favourites.length > 0 ? (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {favourites.map(pokemon => (
                      <div key={pokemon.id} style={{ padding: '1rem', width: '180px', textAlign: 'center' }}>
                        <img src={pokemon.image} alt={pokemon.name} style={{ width: '100%' }} />
                        <h4>{pokemon.name}</h4>
                        <p><strong>ID:</strong> {pokemon.id}</p>
                        <p><strong>Types:</strong> {pokemon.types.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Your storage is empty. Go catch some Pokémon!</p>
                )}
              </div>

              <div className={styles.card}>
                <h3>🎮 Mini-Game Progress</h3>
                <p>Highest Score: <strong>{score}</strong></p>
                {lastPlayed && <p>Last Played: <strong>{lastPlayed}</strong></p>}
                <p>Badge Earned:</p>
                <img src={badgeImageUrl} alt="Game Badge" className={styles.badgeImage} />
              </div>
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <div className={styles.profileSidebar}>
          <div className={styles.card}>
            <div className={styles.cardHeader}><h3>Trainer Details</h3></div>
            <ul>
              <li><strong>STARTER POKÉMON:</strong> {formData.details[0]}</li>
              <li><strong>FAVORITE POKÉMON:</strong> {formData.details[1]}</li>
              <li><strong>BADGES EARNED:</strong> {formData.details[2]}</li>
              <li><strong>REGIONS VISITED:</strong> {formData.details[3]}</li>
              <li><strong>TRAINER SINCE:</strong> {formData.details[4]}</li>
              <li><strong>LANGUAGES:</strong> {formData.details[5]}</li>
              <li><strong>GUILD:</strong> {formData.details[6]}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Profile</h2>
            <div className={styles.modalContent}>
              <div className={styles.modalContent}>
  <label>
    Profile Image URL:
    <input
      type="text"
      value={formData.iconUrl}
      onChange={(e) => handleInputChange(e, 'iconUrl')}
    />
  </label>

  <label>
    Banner Image URL:
    <input
      type="text"
      value={formData.bannerUrl}
      onChange={(e) => handleInputChange(e, 'bannerUrl')}
    />
  </label>

  <label>
    Name:
    <input
      type="text"
      value={formData.name}
      onChange={(e) => handleInputChange(e, 'name')}
    />
  </label>

  <label>
    Title:
    <input
      type="text"
      value={formData.title}
      onChange={(e) => handleInputChange(e, 'title')}
    />
  </label>

  <label>
    Location:
    <input
      type="text"
      value={formData.location}
      onChange={(e) => handleInputChange(e, 'location')}
    />
  </label>

  <label>
    Summary:
    <textarea
      value={formData.summary}
      onChange={(e) => handleInputChange(e, 'summary')}
    />
  </label>

  <label>
    Favorite Types (comma separated):
    <input
      type="text"
      value={formData.types.join(', ')}
      onChange={(e) => handleInputChange(e, 'types')}
    />
  </label>

  <label>
    Starter Pokémon:
    <input
      type="text"
      value={formData.details[0]}
      onChange={(e) => handleInputChange(e, 'details', 0)}
    />
  </label>

  <label>
    Favorite Pokémon:
    <input
      type="text"
      value={formData.details[1]}
      onChange={(e) => handleInputChange(e, 'details', 1)}
    />
  </label>

  <label>
    Badges Earned:
    <input
      type="text"
      value={formData.details[2]}
      onChange={(e) => handleInputChange(e, 'details', 2)}
    />
  </label>

  <label>
    Regions Visited:
    <input
      type="text"
      value={formData.details[3]}
      onChange={(e) => handleInputChange(e, 'details', 3)}
    />
  </label>

  <label>
    Trainer Since:
    <input
      type="text"
      value={formData.details[4]}
      onChange={(e) => handleInputChange(e, 'details', 4)}
    />
  </label>

  <label>
    Languages:
    <input
      type="text"
      value={formData.details[5]}
      onChange={(e) => handleInputChange(e, 'details', 5)}
    />
  </label>

  <label>
    Guild:
    <input
      type="text"
      value={formData.details[6]}
      onChange={(e) => handleInputChange(e, 'details', 6)}
    />
  </label>
</div>

            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
