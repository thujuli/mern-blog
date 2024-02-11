import mongoose from "mongoose";
import { IPost } from "post.type";

const PostSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://www.surgesonelectric.com/wp-content/themes/azoomtheme/images/demo/demo-image-default.jpg",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
