import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/error";
import { PostRequest, PostFields } from "post.type";
import Post from "../models/post.model";

const postCreate = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  const { title, content, categories, postImage }: PostRequest = req.body;
  const postFields: PostFields = {};
  if (!title || !content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const postTitleExists = await Post.findOne({ title });
  if (postTitleExists) {
    return next(errorHandler(400, "Title already exists"));
  }

  const slug = title
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();
  const postSlugExists = await Post.findOne({ slug });
  if (postSlugExists) {
    return next(
      errorHandler(
        400,
        "Duplicate Slug Detected: Please Modify the 'Title' to Generate a Unique Slug"
      )
    );
  }

  postFields.title = title;
  postFields.content = content;

  if (categories) {
    postFields.categories = categories;
  }
  if (postImage) {
    postFields.postImage = postImage;
  }

  const newPost = new Post({
    ...postFields,
    slug,
    userId: res.locals.user.id,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Internal server error"));
  }
};

export { postCreate };
