// import React, { useState } from 'react';
// import styles from './Profile.module.css';
// import { useEffect } from 'react';


// // userId
// const user = JSON.parse(localStorage.getItem('user'));
// const userId = user ? user._id : null;

// const Profile = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     bannerUrl: 'https://wallpapercave.com/wp/wp12045006.jpg',
//     iconUrl: 'https://images.seeklogo.com/logo-png/28/1/bulbasaur-logo-png_seeklogo-286482.png',
//     name: 'Unnamed Trainer',
//     title: 'Pokémon Trainer · Unknown Region',
//     location: 'Unknown Location',
//     summary: 'This trainer has not shared their journey yet.',
//     types: ['N/A'],
//     details: [
//       'No favorite Pokémon yet',
//       'No buddy selected',
//       '0 / 8 badges collected',
//       'No regions explored',
//       'Unknown join date',
//       'No languages specified',
//       'No team selected'
//     ]
//   });

//   const handleInputChange = (e, field, index) => {
//     if (field === 'details') {
//       const newDetails = [...formData.details];
//       newDetails[index] = e.target.value;
//       setFormData({ ...formData, details: newDetails });
//     } else if (field === 'types') {
//       setFormData({ ...formData, types: e.target.value.split(',').map(t => t.trim()) });
//     } else {
//       setFormData({ ...formData, [field]: e.target.value });
//     }
//   };

//   const handleSave = () => setIsModalOpen(false);
//   const handleCancel = () => setIsModalOpen(false);


//   /// Fetch profile data from the server
//   const fetchProfile = async () => {
//   if (!userId) return;

//   try {
//     const res = await fetch(`/api/profiles/${userId}`);
//     if (res.ok) {
//       const data = await res.json();
//       console.log('Profile data fetched:', data);
//       setFormData({
//         bannerUrl: data.bannerUrl || '',
//         iconUrl: data.iconUrl || '',
//         name: data.name || '',
//         title: data.title || '',
//         location: data.location || '',
//         summary: data.summary || '',
//         types: data.types || [],
//         details: data.details || Array(7).fill(''),
//       });
//     } else {
//       console.log('Failed to fetch profile:', res.status, res.statusText);
//     }
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//   }
// };

//   useEffect(() => {
//     fetchProfile();
//   }, [userId]);

//   return (
//     <div className={styles.profilePage}>
//       {/* Profile Header */}
//       <div className={styles.profileHeader}>
//         <img src={formData.bannerUrl} alt="banner" className={styles.profileBanner} />
//         <div className={styles.profileHeaderContent}>
//           <div className={styles.avatarInfoWrapper}>
//             <img className={styles.avatar} src={formData.iconUrl} alt="profile" />
//             <div className={styles.profileInfo}>
//               <h2 className={styles.profileName}>{formData.name}</h2>
//               <p className={styles.profileTitle}>{formData.title}</p>
//               <span className={styles.profileLocation}>{formData.location}</span>
//               <div className={styles.socialIcons}>
//                 <span>⚡</span><span>🔥</span><span>💧</span><span>🌱</span><span>🔷</span>
//               </div>
//             </div>
//           </div>
//           <button className={styles.editButton} onClick={() => setIsModalOpen(true)}>✏️ Edit Profile</button>
//         </div>
//       </div>

//       {/* Profile Body */}
//       <div className={styles.profileBody}>
//         <div className={styles.profileMain}>
//           <div className={styles.card}>
//             <h3>Trainer Summary</h3>
//             <p>{formData.summary}</p>
//           </div>
//           <div className={styles.card}>
//             <h3>Favorite Pokémon Types</h3>
//             {formData.types.map(type => (
//               <span key={type} className={`${styles.tag} ${styles.tagGreen}`}>{type}</span>
//             ))}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className={styles.profileSidebar}>
//           <div className={styles.card}>
//             <div className={styles.cardHeader}><h3>Trainer Details</h3></div>
//             <ul>
//               <li><strong>STARTER POKÉMON:</strong> {formData.details[0]}</li>
//               <li><strong>FAVORITE POKÉMON:</strong> {formData.details[1]}</li>
//               <li><strong>BADGES EARNED:</strong> {formData.details[2]}</li>
//               <li><strong>REGIONS VISITED:</strong> {formData.details[3]}</li>
//               <li><strong>TRAINER SINCE:</strong> {formData.details[4]}</li>
//               <li><strong>LANGUAGES:</strong> {formData.details[5]}</li>
//               <li><strong>GUILD:</strong> {formData.details[6]}</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       {isModalOpen && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modal}>
//             <h2>Edit Profile</h2>
//             <div className={styles.modalContent}>
//               <label>Profile Image URL:
//                 <input type="text" value={formData.iconUrl} onChange={(e) => handleInputChange(e, 'iconUrl')} />
//               </label>
//               <label>Banner Image URL:
//                 <input type="text" value={formData.bannerUrl} onChange={(e) => handleInputChange(e, 'bannerUrl')} />
//               </label>
//               <label>Name:
//                 <input type="text" value={formData.name} onChange={(e) => handleInputChange(e, 'name')} />
//               </label>
//               <label>Title:
//                 <input type="text" value={formData.title} onChange={(e) => handleInputChange(e, 'title')} />
//               </label>
//               <label>Location:
//                 <input type="text" value={formData.location} onChange={(e) => handleInputChange(e, 'location')} />
//               </label>
//               <label>Summary:
//                 <textarea value={formData.summary} onChange={(e) => handleInputChange(e, 'summary')} />
//               </label>
//               <label>Favorite Types (comma separated):
//                 <input type="text" value={formData.types.join(', ')} onChange={(e) => handleInputChange(e, 'types')} />
//               </label>
//               <label>Starter Pokémon:
//                 <input type="text" value={formData.details[0]} onChange={(e) => handleInputChange(e, 'details', 0)} />
//               </label>
//               <label>Favorite Pokémon:
//                 <input type="text" value={formData.details[1]} onChange={(e) => handleInputChange(e, 'details', 1)} />
//               </label>
//               <label>Badges Earned:
//                 <input type="text" value={formData.details[2]} onChange={(e) => handleInputChange(e, 'details', 2)} />
//               </label>
//               <label>Regions Visited:
//                 <input type="text" value={formData.details[3]} onChange={(e) => handleInputChange(e, 'details', 3)} />
//               </label>
//               <label>Trainer Since:
//                 <input type="text" value={formData.details[4]} onChange={(e) => handleInputChange(e, 'details', 4)} />
//               </label>
//               <label>Languages:
//                 <input type="text" value={formData.details[5]} onChange={(e) => handleInputChange(e, 'details', 5)} />
//               </label>
//               <label>Guild:
//                 <input type="text" value={formData.details[6]} onChange={(e) => handleInputChange(e, 'details', 6)} />
//               </label>
//             </div>
//             <div className={styles.modalActions}>
//               <button onClick={handleSave}>Save</button>
//               <button onClick={handleCancel}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';

const Profile = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user._id : null;
  console.log('User ID:', userId); // Debugging: Check if userId is retrieved correctly

  // 🧠 Manage modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📦 Initialize form data as null and wait for fetch
  const [formData, setFormData] = useState(null);
  // 🎯 Separate edit form data for temporary changes
  const [editFormData, setEditFormData] = useState(null);
  const [pokemonTypes, setPokemonTypes] = useState([]);

  // 🧑‍💻 User info state

  const [userInfo, setUserInfo] = useState(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);


  // 📥 Fetch profile data from backend

  // 1. Read profile (GET)
  const fetchProfile = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/profile/users/${userId}`);
      console.log('fetch response:', res); // 응답 객체 확인
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        // console.log('Profile data fetched:', data);
      } else if (res.status === 404) {
        // 프로필 없으면 기본값으로 초기화
        console.log('Profile not found, initializing with default values');
        setFormData({
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
            'No team selected']
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // 📝 Handle input changes (single or array fields) - Now uses editFormData
  const handleInputChange = (e, field, index) => {
    if (!editFormData) return;
    if (field === 'details') {
      const newDetails = [...editFormData.details];
      newDetails[index] = e.target.value;
      setEditFormData({ ...editFormData, details: newDetails });
    } else if (field === 'types') {
      setEditFormData({ ...editFormData, types: e.target.value.split(',').map(t => t.trim()) });
    } else {
      setEditFormData({ ...editFormData, [field]: e.target.value });
    }
  };

  // 💾 Save profile to backend (PUT) - Now commits editFormData to formData
  const handleSave = async () => {
    try {
      // 프로필이 처음 저장되는 경우(즉, formData가 기본값이거나 새로 생성된 경우) POST 요청
      const method = editFormData && editFormData._id ? 'PUT' : 'POST';
      const url = editFormData && editFormData._id
        ? `/api/profile/users/${userId}`
        : `/api/profile`;

      const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        body: JSON.stringify({ ...editFormData, userId })
      });
      console.log('Save profile response:', res); // Debugging: Check response

      if (res.ok) {
        const updated = await res.json();
        console.log('Profile saved:', updated);
        setFormData(updated); // Update main data with saved result
        setEditFormData(null); // Clear temporary edit data
        setIsModalOpen(false);
      } else {
        console.error('Failed to save profile:', res.statusText);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };


  // 포켓몬 이름으로 타입 가져오기 (PokéAPI 사용)
  useEffect(() => {
    const fetchTypes = async () => {
      if (!formData || !formData.details || !formData.details[1]) return;
      const pokemonName = formData.details[1].toLowerCase().replace(/[^a-z0-9]/g, '');
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (res.ok) {
          const data = await res.json();
          const types = data.types.map(t => t.type.name);
          setPokemonTypes(types);
        } else {
          setPokemonTypes(['Unknown']);
        }
      } catch {
        setPokemonTypes(['Unknown']);
      }
    };
    fetchTypes();
  }, [formData?.details]);


  // 유저 정보 가져오기 (users 컬렉션)
  useEffect(() => {
    console.log('Fetching user info for ID:', userId); // Debugging: Check userId
    const fetchUserInfo = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('User info fetch response:', res); // Debugging: Check response
        const data = await res.json();
        console.log('User info fetched:', data); // Debugging: Check fetched user info
        if (res.ok) {
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [userId]);

  // 계정 삭제
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 인증 필요시 추가
        }
      });
      console.log('Delete account response:', res); // Debugging: Check delete response
      if (res.ok) {
        alert('Your account has been deleted successfully.');
        localStorage.removeItem('user');
        window.location.href = '/'; // 홈으로 이동
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      alert('Error occurred while deleting account');
    }
  };
  // 비밀번호 변경
  const handleChangePassword = async (newPassword) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_password: newPassword })
      });

      if (res.ok) {
        alert('Your password has been changed successfully');
      } else {
        alert('Failed to change password');
      }
    } catch (error) {
      alert('Error occurred while changing password');
    }
  };



  // ❌ Cancel edit - restore original data
  const handleCancel = () => {
    setEditFormData(null); // Clear temporary edit data
    setIsModalOpen(false);
  };

  // 🎯 Open edit modal - copy current data to edit state
  const openEditModal = () => {
    setEditFormData(formData ? { ...formData } : null); // Copy current data for editing
    setIsModalOpen(true);
  };

  // ⛔ Prevent rendering if profile not loaded
  if (!formData) return <div>Loading profile...</div>;

  return (
    <div className={styles.profilePage}>
      {/* 🎨 Profile Header Section */}
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
          <button className={styles.myAccountButton} onClick={() => setIsAccountModalOpen(true)}>My Account</button>
          <button className={styles.editButton} onClick={openEditModal}>✏️ Edit Profile</button>
        </div>
      </div>

      {/* 🧾 Profile Main Body */}
      <div className={styles.profileBody}>
        <div className={styles.profileMain}>
          <div className={styles.card}>
            <h3>Trainer Summary</h3>
            <p>{formData.summary}</p>
          </div>
          <div className={styles.card}>
            <h3>Favorite Pokémon Types</h3>
            {/* 포켓몬 API에서 가져온 타입 */}
            {pokemonTypes.length > 0 && (
              <div>
                {pokemonTypes.map(type => (
                  <span key={type} className={`${styles.tag} ${styles.tagGreen}`}>{type}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 📌 Sidebar with Trainer Details */}
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

      {/* My Account Modal */}
      {isAccountModalOpen && userInfo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>My Account</h2>
            <div className={styles.modalContent}>
              <div className={styles.userInfoBox} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f8f8', borderRadius: '8px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li><strong>Name:</strong> {userInfo.name}</li>
                  <li><strong>Email:</strong> {userInfo.email}</li>
                  <li><strong>Created:</strong> {new Date(userInfo.created).toLocaleString()}</li>
                  <li><strong>Updated:</strong> {new Date(userInfo.updated).toLocaleString()}</li>
                </ul>
                <button className={`${styles.button} ${styles.buttonDanger}`} onClick={handleDeleteAccount}>Delete Account</button><ChangePasswordForm onChangePassword={handleChangePassword} />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setIsAccountModalOpen(false)}>Close</button>            </div>
          </div>
        </div>
      )}


      {/* 🛠️ Edit Modal for Profile Editing */}
      {isModalOpen && editFormData && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Profile</h2>
            <div className={styles.modalContent}>
              {/* 기존 프로필 수정 폼 */}
              <label>Profile Image URL:
                <input type="text" value={editFormData.iconUrl} onChange={(e) => handleInputChange(e, 'iconUrl')} />
              </label>
              <label>Banner Image URL:
                <input type="text" value={editFormData.bannerUrl} onChange={(e) => handleInputChange(e, 'bannerUrl')} />
              </label>
              <label>Name:
                <input type="text" value={editFormData.name} onChange={(e) => handleInputChange(e, 'name')} />
              </label>
              <label>Title:
                <input type="text" value={editFormData.title} onChange={(e) => handleInputChange(e, 'title')} />
              </label>
              <label>Location:
                <input type="text" value={editFormData.location} onChange={(e) => handleInputChange(e, 'location')} />
              </label>
              <label>Summary:
                <textarea value={editFormData.summary} onChange={(e) => handleInputChange(e, 'summary')} />
              </label>
              <label>Favorite Types (comma separated):
                <input type="text" value={editFormData.types.join(', ')} onChange={(e) => handleInputChange(e, 'types')} />
              </label>
              <label>Starter Pokémon:
                <input type="text" value={editFormData.details[0]} onChange={(e) => handleInputChange(e, 'details', 0)} />
              </label>
              <label>Favorite Pokémon:
                <input type="text" value={editFormData.details[1]} onChange={(e) => handleInputChange(e, 'details', 1)} />
              </label>
              <label>Badges Earned:
                <input type="text" value={editFormData.details[2]} onChange={(e) => handleInputChange(e, 'details', 2)} />
              </label>
              <label>Regions Visited:
                <input type="text" value={editFormData.details[3]} onChange={(e) => handleInputChange(e, 'details', 3)} />
              </label>
              <label>Trainer Since:
                <input type="text" value={editFormData.details[4]} onChange={(e) => handleInputChange(e, 'details', 4)} />
              </label>
              <label>Languages:
                <input type="text" value={editFormData.details[5]} onChange={(e) => handleInputChange(e, 'details', 5)} />
              </label>
              <label>Guild:
                <input type="text" value={editFormData.details[6]} onChange={(e) => handleInputChange(e, 'details', 6)} />
              </label>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.button} onClick={handleSave}>Save</button>
              <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 비밀번호 변경 폼 컴포넌트
function ChangePasswordForm({ onChangePassword }) {
  const [newPassword, setNewPassword] = useState('');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (newPassword.length < 6) {
          alert('New password must be at least 6 characters long.');
          return;
        }
        onChangePassword(newPassword);
        setNewPassword('');
      }}
      style={{ marginTop: '1rem' }}
    >
      <label>
        Change Password:
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="Endter new password"
        />
      </label>
      <button type="submit" className={styles.button} style={{ marginTop: '0.5rem' }}>
        Change
      </button>
    </form>
  );
}

export default Profile;
