import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';


const Profile = () => {
  const [favourites, setFavourites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [score] = useState(880);

useEffect(() => {
  const fetchFavourites = () => {
    const entries = Object.entries(localStorage)
      .filter(([key]) => key.startsWith('fav_'))
      .map(([key, value]) => {
        try {
          return {
            id: key,
            ...JSON.parse(value),
            _ts: parseInt(key.replace('fav_', ''), 10), // 從 key 中取 timestamp
          };
        } catch {
          return null;
        }
      })
      .filter(p => p && p.name && p.image)
      .sort((a, b) => b._ts - a._ts) // ✅ 最新時間排最前
      .slice(0, 3); // ✅ 最前3筆 = 最新的3個

    setFavourites(entries);
  };

  fetchFavourites(); // 初始化載入
}, []);


useEffect(() => {
  if (activeTab === 'achievements') {
    const entries = Object.entries(localStorage)
      .filter(([key]) => !isNaN(key))
      .map(([key, value]) => {
        try {
          return {
            id: key,
            ...JSON.parse(value),
            _ts: parseInt(localStorage.getItem(`_ts_${key}`) || '0', 10),
          };
        } catch {
          return null;
        }
      })
      .filter(p => p && p.name && p.image)
      .sort((a, b) => b._ts - a._ts)
      .slice(0, 3);

    setFavourites(entries);
  }
}, [activeTab]);


  const [formData, setFormData] = useState({
    iconUrl: 'https://images.seeklogo.com/logo-png/28/1/bulbasaur-logo-png_seeklogo-286482.png',
    name: 'Felix the Trainer',
    title: 'Pokémon Trainer · Kanto Region',
    location: 'Pallet Town, Kanto Region',
    summary:
      "I'm a Pokémon Trainer currently traveling through the Kanto Region. I specialize in Electric and Fire-type Pokémon, and I aim to collect all 8 Gym Badges and become a Pokémon Master.",
    types: ['Electric', 'Fire', 'Grass'],
    details: ['Bulbasaur', 'Pikachu', '4 / 8', 'Kanto, Johto', 'Sep 2023', 'English, Cantonese', 'Team Valor'],
  });

  const handleInputChange = (e, field, index) => {
    if (field === 'details') {
      const newDetails = [...formData.details];
      newDetails[index] = e.target.value;
      setFormData({ ...formData, details: newDetails });
    } else if (field === 'types') {
      setFormData({ ...formData, types: e.target.value.split(',').map((t) => t.trim()) });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSave = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  let badgeImageUrl;
  if (score >= 900) badgeImageUrl = '/badges/diamond.png';
  else if (score >= 700) badgeImageUrl = '/badges/platinum.png';
  else if (score >= 500) badgeImageUrl = '/badges/gold.png';
  else if (score >= 300) badgeImageUrl = '/badges/silver.png';
  else if (score >= 100) badgeImageUrl = '/badges/bronze.png';
  else badgeImageUrl = '/badges/no_badge.png';

  return (
    <div className={styles.profilePage}>
      {/* HEADER */}
      <div className={styles.profileHeader}>
        <img src="https://wallpapercave.com/wp/wp12045006.jpg" alt="banner" className={styles.profileBanner} />
        <div className={styles.profileHeaderContent}>
          <div className={styles.avatarInfoWrapper}>
            <div className={styles.avatarContainer}>
              <img className={styles.avatar} src={formData.iconUrl} alt="profile" />
            </div>
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

      {/* BODY */}
      <div className={styles.profileBody}>
        <div className={styles.profileMain}>
          <div className={styles.tabs}>
            <button className={activeTab === 'overview' ? styles.activeTab : ''} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={activeTab === 'achievements' ? styles.activeTab : ''} onClick={() => setActiveTab('achievements')}>Trainer Achievements</button>
          </div>

          {activeTab === 'overview' && (
            <>
              <div className={styles.card}>
                <div className={styles.cardHeader}><h3>Trainer Summary</h3></div>
                <p>{formData.summary}</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}><h3>Favorite Pokémon Types</h3></div>
                <div>
                  {formData.types.map((type) => (
                    <span key={type} className={`${styles.tag} ${styles.tagGreen}`}>{type}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'achievements' && (
            <>
<div className={styles.card}>
  <div className={styles.cardHeader}><h3>❤️ My Favourites</h3></div>
  <div className="card-container">
    {favourites.length > 0 ? (
      favourites.map((pokemon) => (
        <div key={pokemon.id} className="pokemon-card">
          <h2>{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
          <p>ID: {pokemon.id}</p>
          <p>Types: {pokemon.types?.join(', ')}</p>
        </div>
      ))
    ) : (
      <p className="no-favourites-message">No recent favourites found.</p>
    )}
  </div>
</div>


              <div className={styles.card}>
                <div className={styles.cardHeader}><h3>🎮 Mini-Game Progress</h3></div>
                <p>Highest Score: <strong>{score}</strong></p>
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
              {/* 保持你原有的编辑个人信息表单，不变 */}
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
