/**
 * Node modules
 */
import { Schema, model, Types } from 'mongoose';

/**
 * Custom modules
 */
import { generateSlug } from '@/utils';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: {
    publicId: string;
    url: string;
    width: number;
    height: number;
  };
  author: Types.ObjectId;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published';
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxLength: [180, 'Title must be less than 180 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: [true, 'Slug must be unique'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    banner: {
      publicId: {
        type: String,
        required: [true, 'Banner public id is required'],
      },
      url: {
        type: String,
        required: [true, 'Banner url is required'],
      },
      height: {
        type: Number,
        required: [true, 'Banner height is required'],
      },
      width: {
        type: Number,
        required: [true, 'Banner width is required'],
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      required: [true, 'Author is required'],
      ref: 'User',
    },
    likesCount: {
      type: Number,
      required: [true, 'Like count is required'],
      default: 0,
    },
    commentsCount: {
      type: Number,
      required: [true, 'Comments count is required'],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not supported',
      },
      default: 'draft',
    },
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
    },
  },
);

blogSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

export default model<IBlog>('Blog', blogSchema);
