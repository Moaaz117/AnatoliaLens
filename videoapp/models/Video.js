import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);