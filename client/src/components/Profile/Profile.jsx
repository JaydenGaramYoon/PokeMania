import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  // 👉 在这里替换成你的实际 _id，例如 '664b3d27aaae6a12c97ad459'
  const profileId = '687732d4b8baf73c49d47d9c';

  // 从后端加载 profile 数据
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/profiles/${profileId}`);
        setFormData(res.data);
      } catch (err) {
        console.error('❌ Failed to load profile:', err);
      }
    };
    fetchProfile();
  }, [profileId]);

  // 处理输入
  const handleInputChange = (e, field, index) => {
    if (!formData) return;
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

  // 保存到数据库
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/api/profiles/${profileId}`, formData);
      setIsModalOpen(false);
      alert("✅ Profile saved!");
    } catch (err) {
      console.error('❌ Failed to save profile:', err);
    }
  };

  const handleCancel = () => setIsModalOpen(false);

  // 加载中显示
  if (!formData) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.profilePage}>
      {/* Header */}
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

      {/* Main Body */}
      <div className={styles.profileBody}>
        <div className={styles.profileMain}>
          <div className={styles.card}>
            <h3>Trainer Summary</h3>
            <p>{formData.summary}</p>
          </div>
          <div className={styles.card}>
            <h3>Favorite Pokémon Types</h3>
            {formData.types.map((type, idx) => (
              <span key={type + idx} className={`${styles.tag} ${styles.tagGreen}`}>{type}</span>
            ))}
          </div>
        </div>

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

      {/* Modal 编辑表单 */}
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
              {/* Trainer Details Fields */}
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
