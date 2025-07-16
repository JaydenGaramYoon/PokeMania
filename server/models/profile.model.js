import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  bannerUrl: String,
  iconUrl: String,
  name: String,
  title: String,
  location: String,
  summary: String,
  types: [String],
  details: [String]
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
