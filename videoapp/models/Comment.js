import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);