/**
 * Node modules
 */
import { Schema, model, Types } from 'mongoose';

interface ILike {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
}

const likeSchema = new Schema<ILike>({
  blogId: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model<ILike>('Like', likeSchema);
