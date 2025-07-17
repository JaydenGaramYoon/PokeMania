import React, { useState } from 'react';
import styles from './Profile.module.css';
import { useEffect } from 'react';


// userId
const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user._id : null;

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSave = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);


  /// Fetch profile data from the server
  const fetchProfile = async () => {
  if (!userId) return;
  
  try {
    const res = await fetch(`/api/profiles/${userId}`);
    if (res.ok) {
      const data = await res.json();
      console.log('Profile data fetched:', data);
      setFormData({
        bannerUrl: data.bannerUrl || '',
        iconUrl: data.iconUrl || '',
        name: data.name || '',
        title: data.title || '',
        location: data.location || '',
        summary: data.summary || '',
        types: data.types || [],
        details: data.details || Array(7).fill(''),
      });
    } else {
      console.log('Failed to fetch profile:', res.status, res.statusText);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return (
    <div className={styles.profilePage}>
      {/* Profile Header */}
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

      {/* Profile Body */}
      <div className={styles.profileBody}>
        <div className={styles.profileMain}>
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
        </div>

        {/* Sidebar */}
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

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Profile</h2>
            <div className={styles.modalContent}>
              <label>Profile Image URL:
                <input type="text" value={formData.iconUrl} onChange={(e) => handleInputChange(e, 'iconUrl')} />
              </label>
              <label>Banner Image URL:
                <input type="text" value={formData.bannerUrl} onChange={(e) => handleInputChange(e, 'bannerUrl')} />
              </label>
              <label>Name:
                <input type="text" value={formData.name} onChange={(e) => handleInputChange(e, 'name')} />
              </label>
              <label>Title:
                <input type="text" value={formData.title} onChange={(e) => handleInputChange(e, 'title')} />
              </label>
              <label>Location:
                <input type="text" value={formData.location} onChange={(e) => handleInputChange(e, 'location')} />
              </label>
              <label>Summary:
                <textarea value={formData.summary} onChange={(e) => handleInputChange(e, 'summary')} />
              </label>
              <label>Favorite Types (comma separated):
                <input type="text" value={formData.types.join(', ')} onChange={(e) => handleInputChange(e, 'types')} />
              </label>
              <label>Starter Pokémon:
                <input type="text" value={formData.details[0]} onChange={(e) => handleInputChange(e, 'details', 0)} />
              </label>
              <label>Favorite Pokémon:
                <input type="text" value={formData.details[1]} onChange={(e) => handleInputChange(e, 'details', 1)} />
              </label>
              <label>Badges Earned:
                <input type="text" value={formData.details[2]} onChange={(e) => handleInputChange(e, 'details', 2)} />
              </label>
              <label>Regions Visited:
                <input type="text" value={formData.details[3]} onChange={(e) => handleInputChange(e, 'details', 3)} />
              </label>
              <label>Trainer Since:
                <input type="text" value={formData.details[4]} onChange={(e) => handleInputChange(e, 'details', 4)} />
              </label>
              <label>Languages:
                <input type="text" value={formData.details[5]} onChange={(e) => handleInputChange(e, 'details', 5)} />
              </label>
              <label>Guild:
                <input type="text" value={formData.details[6]} onChange={(e) => handleInputChange(e, 'details', 6)} />
              </label>
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
